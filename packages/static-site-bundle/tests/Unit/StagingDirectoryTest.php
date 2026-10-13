<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Tests\Unit;

use CJean\StaticSiteBundle\Generation\StagingDirectory;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Filesystem\Filesystem;

final class StagingDirectoryTest extends TestCase
{
    private string $directory;
    private Filesystem $filesystem;

    public function testCopiesTreesWithoutHiddenEntries(): void
    {
        $this->filesystem->dumpFile($this->directory . '/public/build/app.js', 'js');
        $this->filesystem->dumpFile($this->directory . '/public/build/.vite/manifest.json', '{}');
        $this->staging()->copy($this->directory . '/public/build', 'build');
        self::assertSame('js', file_get_contents($this->directory . '/stage/build/app.js'));
        self::assertFileDoesNotExist($this->directory . '/stage/build/.vite/manifest.json');
    }

    public function testEachFileIsWrittenOnce(): void
    {
        $staging = $this->staging();
        $this->filesystem->dumpFile($this->directory . '/public/sitemap.xml', 'asset');
        $staging->write('sitemap.xml', 'generated');
        $this->expectExceptionMessage('Output collision at "sitemap.xml"');
        $staging->copy($this->directory . '/public/sitemap.xml', 'sitemap.xml');
    }

    public function testRejectsUnsafeFiles(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->staging()->write('../outside.html', 'escape');
    }

    public function testRejectsScripts(): void
    {
        $this->filesystem->dumpFile($this->directory . '/public/build/shell.php', '<?php');
        $this->expectException(\InvalidArgumentException::class);
        $this->staging()->copy($this->directory . '/public/build', 'build');
    }

    public function testRejectsSymbolicLinks(): void
    {
        $this->filesystem->dumpFile($this->directory . '/secret.txt', 'secret');
        $this->filesystem->mkdir($this->directory . '/public/build');
        symlink($this->directory . '/secret.txt', $this->directory . '/public/build/leak.txt');
        $this->expectExceptionMessage('Symbolic links');
        $this->staging()->copy($this->directory . '/public/build', 'build');
    }

    private function staging(): StagingDirectory
    {
        $this->filesystem->mkdir($this->directory . '/stage');
        return new StagingDirectory($this->filesystem, $this->directory . '/stage');
    }

    protected function setUp(): void
    {
        $this->directory = sys_get_temp_dir() . '/ssg-staging-' . bin2hex(random_bytes(6));
        $this->filesystem = new Filesystem();
    }

    protected function tearDown(): void
    {
        $this->filesystem->remove($this->directory);
    }
}
