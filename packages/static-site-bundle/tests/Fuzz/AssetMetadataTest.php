<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Tests\Fuzz;

use CJean\StaticSiteBundle\Generation\AssetExporter;
use CJean\StaticSiteBundle\Generation\StagingDirectory;
use PHPUnit\Framework\Attributes\Group;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Reprise\Asset\EntrypointsLookup;

#[Group('fuzz')]
final class AssetMetadataTest extends TestCase
{
    private string $root;
    private Filesystem $fs;

    protected function setUp(): void
    {
        $this->root = sys_get_temp_dir() . '/ssg-fuzz-assets-' . bin2hex(random_bytes(6));
        $this->fs = new Filesystem();
        $this->fs->mkdir($this->root . '/stage');
        $this->fs->dumpFile($this->root . '/sentinel.js', 'private');
        $this->fs->dumpFile($this->root . '/public/build/app.js', 'app');
        $this->fs->dumpFile(
            $this->root . '/public/build/entrypoints.json',
            '{"isProd":true,"publicPath":"/build/","entryPoints":{"app":{"js":["build/app.js"]}}}',
        );
    }

    protected function tearDown(): void
    {
        $this->fs->remove($this->root);
    }

    public function testUnsafeReferencesFailBeforeAnyCopy(): void
    {
        $corpus = new Corpus();
        for ($case = 0; $case < $corpus->cases; ++$case) {
            $reference =
                '/build/'
                . $corpus->token()
                . '/'
                . $corpus->pick(['../', '%2e%2e/', '%252e%252e/', '%5c', '%00', '.hidden/', '//'])
                . 'sentinel.js';
            $manifest = json_encode(['build/app.js' => $reference], JSON_THROW_ON_ERROR);
            $this->fs->dumpFile($this->root . '/public/build/manifest.json', $manifest);
            $this->assertRejected($corpus->describe($case, $manifest));
        }
    }

    public function testMalformedManifestValuesFailBeforeAnyCopy(): void
    {
        $corpus = new Corpus();
        for ($case = 0; $case < $corpus->cases; ++$case) {
            $manifest = $corpus->pick([
                'null',
                'false',
                '42',
                '"string"',
                '[]',
                '{}',
                '{broken',
                '{"build/app.js":null}',
                '{"build/app.js":[]}',
                '{"build/app.js":42}',
                '{"build/app.js":"javascript:alert(1)"}',
            ]);
            $this->fs->dumpFile($this->root . '/public/build/manifest.json', $manifest);
            $this->assertRejected($corpus->describe($case, $manifest));
        }
    }

    private function assertRejected(string $context): void
    {
        try {
            new AssetExporter(
                $this->root,
                ['build'],
                true,
                'build',
                new EntrypointsLookup($this->root . '/public/build/entrypoints.json'),
            )->exportTo(new StagingDirectory($this->fs, $this->root . '/stage'));
        } catch (\RuntimeException|\InvalidArgumentException|\JsonException) {
            self::assertSame([], iterator_to_array(new \FilesystemIterator($this->root . '/stage')), $context);
            self::assertSame('private', file_get_contents($this->root . '/sentinel.js'), $context);
            return;
        }
        self::fail($context);
    }
}
