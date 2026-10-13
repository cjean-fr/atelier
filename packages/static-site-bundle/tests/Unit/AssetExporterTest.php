<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Tests\Unit;

use CJean\StaticSiteBundle\Generation\AssetExporter;
use CJean\StaticSiteBundle\Generation\StagingDirectory;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Reprise\Asset\EntrypointsLookup;

/** @mago-expect lint:too-many-methods Scenarios cover one asset-export contract. */
final class AssetExporterTest extends TestCase
{
    private string $root;
    private Filesystem $fs;

    protected function setUp(): void
    {
        $this->root = sys_get_temp_dir() . '/ssg-assets-' . bin2hex(random_bytes(6));
        $this->fs = new Filesystem();
        $this->fs->mkdir($this->root . '/stage');
    }

    protected function tearDown(): void
    {
        $this->fs->remove($this->root);
    }

    private function export(array $manifest, array $entries, array $metadata = []): void
    {
        $this->fs->dumpFile($this->root . '/public/build/manifest.json', json_encode($manifest, JSON_THROW_ON_ERROR));
        $this->fs->dumpFile(
            $this->root . '/public/build/entrypoints.json',
            json_encode(array_replace([
                'isProd' => true,
                'devServer' => null,
                'publicPath' => '/build/',
                'entryPoints' => $entries,
            ], $metadata), JSON_THROW_ON_ERROR),
        );
        new AssetExporter(
            $this->root,
            ['build'],
            true,
            'build',
            new EntrypointsLookup($this->root . '/public/build/entrypoints.json'),
        )->exportTo(new StagingDirectory($this->fs, $this->root . '/stage'));
    }

    public function testVerifiesChunksCssAssetsAndImportsThenCopiesTheBuild(): void
    {
        foreach (['app.js', 'chunk.js', 'lazy.js', 'app.css', 'logo.svg'] as $file) {
            $this->fs->dumpFile($this->root . '/public/build/assets/' . $file, $file);
        }
        $this->export([
            'build/app.js' => '/build/assets/app.js',
            'build/app.css' => '/build/assets/app.css',
            'build/logo.svg' => '/build/assets/logo.svg',
        ], [
            'app' => [
                'js' => ['build/assets/app.js'],
                'css' => ['build/assets/app.css'],
                'preload' => ['build/assets/chunk.js'],
                'dynamic' => ['build/assets/lazy.js'],
            ],
        ]);
        self::assertFileExists($this->root . '/stage/build/assets/logo.svg');
        self::assertFileExists($this->root . '/stage/build/manifest.json');
    }

    public static function incompleteBuilds(): iterable
    {
        yield 'missing main chunk' => [
            ['build/app.js' => '/build/missing.js'],
            ['app' => ['js' => []]],
            'Missing or excluded local Vite asset',
        ];
        yield 'missing CSS' => [
            ['build/app.js' => '/build/app.js', 'build/app.css' => '/build/missing.css'],
            ['app' => []],
            'Missing or excluded local Vite asset',
        ];
        yield 'missing preload chunk' => [
            ['build/app.js' => '/build/app.js'],
            ['app' => ['preload' => ['build/missing.js']]],
            'Missing or excluded local Vite asset',
        ];
        yield 'missing dynamic chunk' => [
            ['build/app.js' => '/build/app.js'],
            ['app' => ['dynamic' => ['build/missing.js']]],
            'Missing or excluded local Vite asset',
        ];
        yield 'not in copied directories' => [
            ['build/app.js' => '/build/app.js'],
            ['app' => ['css' => ['/other/file.css']]],
            'Missing or excluded local Vite asset',
        ];
        yield 'invalid list' => [
            ['build/app.js' => '/build/app.js'],
            ['app' => ['css' => 'app.css']],
            'list of strings',
        ];
    }

    #[DataProvider('incompleteBuilds')]
    public function testRejectsIncompleteBuildsBeforeCopy(array $manifest, array $entries, string $error): void
    {
        $this->fs->dumpFile($this->root . '/public/build/app.js', 'js');
        $this->fs->dumpFile($this->root . '/public/other/file.css', 'css');
        try {
            $this->export($manifest, $entries);
            self::fail('Expected an incomplete build to fail.');
        } catch (\RuntimeException $failure) {
            self::assertStringContainsString($error, $failure->getMessage());
            self::assertSame([], iterator_to_array(new \FilesystemIterator($this->root . '/stage')));
        }
    }

    public function testAllowsCdnUrlsWithoutFetchingOrCopyingThem(): void
    {
        $this->fs->dumpFile($this->root . '/public/build/app.js', 'local');
        $this->export(['build/app.js' => '/build/app.js', 'build/app.css' => 'https://cdn.example.test/app.css'], [
            'app' => ['js' => ['https://cdn.example.test/app.js'], 'preload' => ['//cdn.example.test/chunk.js']],
        ]);
        self::assertSame('local', file_get_contents($this->root . '/stage/build/app.js'));
    }

    public function testTheRepriseReaderRejectsIncompatibleMetadata(): void
    {
        $this->fs->dumpFile($this->root . '/public/build/app.js', 'js');
        $this->expectExceptionMessage('publicPath');
        $this->export(['build/app.js' => '/build/app.js'], ['app' => []], ['publicPath' => null]);
    }

    public function testReadsSeparatedMetadataWhileCopyingOnlyPublicAssets(): void
    {
        $this->fs->dumpFile($this->root . '/public/build/app.js', 'js');
        $directory = $this->root . '/var/reprise';
        $this->fs->dumpFile(
            $directory . '/entrypoints.json',
            '{"isProd":true,"publicPath":"/build/","entryPoints":{"app":{"js":["build/app.js"]}}}',
        );
        $this->fs->dumpFile($directory . '/manifest.json', '{"build/app.js":"/build/app.js"}');
        new AssetExporter(
            $this->root,
            ['build'],
            true,
            'build',
            new EntrypointsLookup($directory . '/entrypoints.json'),
            $directory,
        )->exportTo(new StagingDirectory($this->fs, $this->root . '/stage'));
        self::assertFileExists($this->root . '/stage/build/app.js');
        self::assertFileDoesNotExist($this->root . '/stage/var/reprise/entrypoints.json');
    }

    public function testRejectsTraversalReferences(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->export(['build/app.js' => '/build/../secret.js'], ['app' => ['js' => []]]);
    }

    public function testRejectsSymbolicLinksInReferencedFiles(): void
    {
        $this->fs->dumpFile($this->root . '/secret.js', 'secret');
        $this->fs->mkdir($this->root . '/public/build');
        symlink($this->root . '/secret.js', $this->root . '/public/build/app.js');
        $this->expectExceptionMessage('Symbolic links');
        $this->export(['build/app.js' => '/build/app.js'], ['app' => ['js' => []]]);
    }
}
