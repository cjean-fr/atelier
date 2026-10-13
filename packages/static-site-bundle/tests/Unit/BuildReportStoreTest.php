<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Tests\Unit;

use CJean\StaticSiteBundle\Generation\BuildReportStore;
use CJean\StaticSiteBundle\Generation\DirectoryPublisher;
use CJean\StaticSiteBundle\Generation\StagingDirectory;
use CJean\StaticSiteBundle\Routing\ExportPage;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Filesystem\Filesystem;

final class BuildReportStoreTest extends TestCase
{
    private string $root;
    private Filesystem $fs;
    private BuildReportStore $store;

    protected function setUp(): void
    {
        $this->root = sys_get_temp_dir() . '/ssg-report-' . bin2hex(random_bytes(6));
        $this->fs = new Filesystem();
        $this->store = new BuildReportStore($this->fs, $this->root, $this->root . '/var/static');
    }

    protected function tearDown(): void
    {
        $this->fs->remove($this->root);
    }

    public function testCapturesPublishedParametersWithBoundedPreviewOutsideExport(): void
    {
        $pages = [];
        for ($i = 0; $i < 150; ++$i) {
            $pages[] = new ExportPage('article', 'https://example.test/' . $i, provider: 'articles', parameters: [
                'id' => $i,
            ]);
        }
        $publisher = new DirectoryPublisher($this->fs, $this->root, $this->root . '/var/static');
        $publisher->publish(
            static function (StagingDirectory $stage): int {
                $stage->write('index.html', '<script>source()</script>');
                return 1;
            },
            fn(string $id) => $this->store->save($id, $pages),
        );
        $report = $this->store->parameters('article');
        self::assertSame(150, $report['total']);
        self::assertCount(100, $report['sets']);
        self::assertSame(['id' => 99], $report['sets'][99]['parameters']);
        self::assertSame('articles', $report['provider']);
        self::assertSame('<script>source()</script>', $this->store->source('index.html')['source']);
        self::assertSame([], glob($this->root . '/var/static/*.json'));
        self::assertNull($this->store->parameters('unknown'));

        $result = $publisher->publish(static function (StagingDirectory $stage): int {
            $stage->write('index.html', 'new');
            return 1;
        }, static function (string $id): void {
            throw new \RuntimeException('diagnostics failed');
        });
        self::assertSame(1, $result->files);
        self::assertStringContainsString('diagnostics failed', $result->warnings[0]);
        self::assertNull($this->store->parameters('article'));
        self::assertSame('new', $this->store->source('index.html')['source']);
    }

    public function testSourcePreviewIsBoundedAndCannotFollowLinksOutsideOutput(): void
    {
        $this->fs->dumpFile($this->root . '/var/static/large.html', str_repeat('a', 300000));
        $data = $this->store->source('large.html');
        self::assertTrue($data['truncated']);
        self::assertSame(262144, strlen($data['source']));
        $this->fs->dumpFile($this->root . '/private.txt', 'private');
        symlink($this->root . '/private.txt', $this->root . '/var/static/leak.txt');
        self::assertNull($this->store->source('leak.txt'));
        self::assertNull($this->store->source('missing.html'));
    }

    public function testLegacyExportHasNoCapturedParameters(): void
    {
        $this->fs->dumpFile($this->root . '/var/static/.ssg-owned', "static-site-bundle\n");
        self::assertNull($this->store->parameters('article'));
    }
}
