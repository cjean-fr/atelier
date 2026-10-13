<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Tests\Integration;

use PHPUnit\Framework\TestCase;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Component\Console\Tester\CommandTester;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\Request;

/** @mago-expect lint:too-many-methods End-to-end scenarios share a kernel fixture. */
final class BuildTest extends TestCase
{
    private string $directory;
    private ?TestKernel $kernel = null;

    public function testExportsProvidersAssetsAndSitemapAndReplacesOldBuild(): void
    {
        $tester = $this->command();
        self::assertSame(0, $tester->execute([]), $tester->getDisplay());
        self::assertSame('<html>Home</html>', file_get_contents($this->directory . '/var/static/index.html'));
        self::assertSame(
            '<html>second</html>',
            file_get_contents($this->directory . '/var/static/blog/second/index.html'),
        );
        self::assertFileExists($this->directory . '/var/static/build/app.js');
        self::assertFileDoesNotExist($this->directory . '/var/static/index.php');
        self::assertFileDoesNotExist($this->directory . '/var/static/private/index.html');
        self::assertStringContainsString(
            'https://example.test/blog/first',
            file_get_contents($this->directory . '/var/static/sitemap.xml'),
        );
        new Filesystem()->dumpFile($this->directory . '/var/static/stale.html', 'old');
        self::assertSame(0, $tester->execute([]), $tester->getDisplay());
        self::assertFileDoesNotExist($this->directory . '/var/static/stale.html');
    }

    private function command(string $scenario = 'ok', string $environment = 'prod'): CommandTester
    {
        $this->kernel = new TestKernel($this->directory, $scenario, $environment);
        $application = new Application($this->kernel);
        return new CommandTester($application->find('ssg:build'));
    }

    public function testVirtualSitemapServesThePublishedXmlInDev(): void
    {
        $tester = $this->command();
        self::assertSame(0, $tester->execute([]));
        $xml = file_get_contents($this->directory . '/var/static/sitemap.xml');
        new Filesystem()->remove($this->directory . '/var/static/sitemap.xml');
        $this->kernel->shutdown();
        $this->kernel = new TestKernel($this->directory, 'ok', 'dev');
        $response = $this->kernel->handle(Request::create('https://example.test/sitemap.xml'));
        self::assertSame(200, $response->getStatusCode());
        self::assertSame('application/xml; charset=UTF-8', $response->headers->get('Content-Type'));
        self::assertSame($xml, $response->getContent());
    }

    public function testVirtualSitemapWorksBeforeBuildAndCachesProvidersAcrossKernels(): void
    {
        TestProvider::$calls = 0;
        $this->kernel = new TestKernel($this->directory, 'ok', 'dev');
        $response = $this->kernel->handle(Request::create('https://example.test/sitemap.xml'));
        self::assertSame(200, $response->getStatusCode());
        self::assertSame(3, substr_count($response->getContent(), '<loc>'));
        self::assertSame(1, TestProvider::$calls);
        self::assertDirectoryDoesNotExist($this->directory . '/var/static');
        $this->kernel->shutdown();
        $this->kernel = new TestKernel($this->directory, 'ok', 'dev');
        $again = $this->kernel->handle(Request::create('https://example.test/sitemap.xml'));
        self::assertSame($response->getContent(), $again->getContent());
        self::assertSame(1, TestProvider::$calls);
    }

    public function testSitemapInvalidatesControllerWithoutRerunningItsProvider(): void
    {
        TestProvider::$calls = 0;
        TestController::$articleCalls = 0;
        TestController::$homeCalls = 0;
        $this->kernel = new TestKernel($this->directory, 'ok', 'dev');
        $this->kernel->handle(Request::create('https://example.test/sitemap.xml'));
        self::assertSame(1, TestProvider::$calls);
        self::assertSame(2, TestController::$articleCalls);
        $service = $this->kernel->getContainer()->get('test.sitemap');
        $service->invalidateController(TestController::class . '::article');
        $this->kernel->handle(Request::create('https://example.test/sitemap.xml'));
        self::assertSame(1, TestProvider::$calls);
        self::assertSame(4, TestController::$articleCalls);
        self::assertSame(1, TestController::$homeCalls);
        $service->invalidateProvider(TestProvider::class);
        $this->kernel->handle(Request::create('https://example.test/sitemap.xml'));
        self::assertSame(2, TestProvider::$calls);
        self::assertSame(6, TestController::$articleCalls);
        self::assertSame(1, TestController::$homeCalls);
    }

    public function testProdSitemapIsNotDiscoveredBeforeABuild(): void
    {
        TestProvider::$calls = 0;
        TestController::$articleCalls = 0;
        TestController::$homeCalls = 0;
        $this->kernel = new TestKernel($this->directory, 'ok', 'prod');
        try {
            $this->kernel->handle(Request::create('https://example.test/sitemap.xml'), catch: false);
            self::fail('The sitemap must not be discovered in prod before a build.');
        } catch (\Symfony\Component\HttpKernel\Exception\NotFoundHttpException $error) {
            self::assertSame(404, $error->getStatusCode());
        }
        self::assertSame(0, TestProvider::$calls);
        self::assertSame(0, TestController::$articleCalls + TestController::$homeCalls);
        $this->kernel->shutdown();
        $tester = $this->command();
        self::assertSame(0, $tester->execute([]), $tester->getDisplay());
        $this->kernel->shutdown();
        $this->kernel = new TestKernel($this->directory, 'ok', 'prod');
        $published = $this->kernel->handle(Request::create('https://example.test/sitemap.xml'));
        self::assertSame(200, $published->getStatusCode());
        self::assertSame(file_get_contents($this->directory . '/var/static/sitemap.xml'), $published->getContent());
    }

    public function testBuildSeedsGranularSitemapCacheForTargetedInvalidations(): void
    {
        $tester = $this->command();
        self::assertSame(0, $tester->execute([]), $tester->getDisplay());
        $xml = file_get_contents($this->directory . '/var/static/sitemap.xml');
        $this->kernel->shutdown();
        TestProvider::$calls = 0;
        TestController::$articleCalls = 0;
        TestController::$homeCalls = 0;
        $this->kernel = new TestKernel($this->directory, 'ok', 'prod');
        $this->kernel->boot();
        $service = $this->kernel->getContainer()->get('test.sitemap');
        // Replayed provider output must reproduce the build pages, so the article entry is still a hit.
        $service->invalidateController(TestController::class . '::home');
        self::assertSame(
            $xml,
            $this->kernel->handle(Request::create('https://example.test/sitemap.xml'))->getContent(),
        );
        self::assertSame([0, 0, 1], [TestProvider::$calls, TestController::$articleCalls, TestController::$homeCalls]);
        $service->invalidateProvider(TestProvider::class);
        self::assertSame(
            $xml,
            $this->kernel->handle(Request::create('https://example.test/sitemap.xml'))->getContent(),
        );
        self::assertSame([1, 2, 1], [TestProvider::$calls, TestController::$articleCalls, TestController::$homeCalls]);
    }

    public function testBuildSeedsProviderSitemapOverrides(): void
    {
        $tester = $this->command('sitemap');
        self::assertSame(0, $tester->execute([]), $tester->getDisplay());
        $xml = file_get_contents($this->directory . '/var/static/sitemap.xml');
        $this->kernel->shutdown();
        TestController::$paginatedCalls = 0;
        $this->kernel = new TestKernel($this->directory, 'sitemap', 'prod');
        $this->kernel->boot();
        $this->kernel
            ->getContainer()
            ->get('test.sitemap')
            ->invalidateController(TestController::class . '::home');
        self::assertSame(
            $xml,
            $this->kernel->handle(Request::create('https://example.test/sitemap.xml'))->getContent(),
        );
        self::assertSame(0, TestController::$paginatedCalls);
    }

    public function testVirtualSitemapIndexAndPartsShareTheCachedDocuments(): void
    {
        TestProvider::$calls = 0;
        $this->kernel = new TestKernel($this->directory, 'ok', 'dev');
        $this->kernel->boot();
        $documents = new \CJean\StaticSiteBundle\Generation\SitemapGenerator(
            'https://example.test',
        )->documents(array_fill(0, 50_001, 'https://example.test/page'));
        $this->kernel->getContainer()->get('test.sitemap')->remember($documents);
        $index = $this->kernel->handle(Request::create('https://example.test/sitemap.xml'));
        $part = $this->kernel->handle(Request::create('https://example.test/sitemap-2.xml'));
        self::assertSame(200, $index->getStatusCode());
        self::assertSame($documents['sitemap.xml'], $index->getContent());
        self::assertSame(200, $part->getStatusCode());
        self::assertSame($documents['sitemap-2.xml'], $part->getContent());
        self::assertSame(0, TestProvider::$calls);
    }

    public function testSitemapBeforeBuildRespectsPerPageExclusion(): void
    {
        $this->kernel = new TestKernel($this->directory, 'sitemap', 'dev');
        $response = $this->kernel->handle(Request::create('https://example.test/sitemap.xml'));
        self::assertSame(200, $response->getStatusCode());
        self::assertStringContainsString('/list/1<', $response->getContent());
        self::assertStringNotContainsString('/list/2<', $response->getContent());
        self::assertStringNotContainsString('/legal', $response->getContent());
        $unknown = $this->kernel->handle(Request::create('https://example.test/sitemap-9.xml'));
        self::assertSame(404, $unknown->getStatusCode());
    }

    public function testSitemapDiscoveryUsesResponseMimeAndPerPageOverrides(): void
    {
        $this->kernel = new TestKernel($this->directory, 'formats', 'dev');
        $response = $this->kernel->handle(Request::create('https://example.test/sitemap.xml'));
        self::assertSame(200, $response->getStatusCode());
        self::assertSame(3, substr_count($response->getContent(), '<loc>'));
        self::assertStringNotContainsString('.json', $response->getContent());
        self::assertStringNotContainsString('.md', $response->getContent());
    }

    public function testSsrStillWorksInDev(): void
    {
        $this->kernel = new TestKernel($this->directory, 'ok', 'dev');
        $response = $this->kernel->handle(Request::create('https://example.test/blog/first'));
        self::assertSame(200, $response->getStatusCode());
        self::assertSame('<html>first</html>', $response->getContent());
    }

    public function testBuildErrorIdentifiesRouteProviderValuesAndUrl(): void
    {
        $tester = $this->command('broken_provider_route');
        self::assertSame(1, $tester->execute([]));
        $output = $tester->getDisplay();
        self::assertStringContainsString('SSG route: broken_article', $output);
        self::assertStringContainsString('TestProvider', $output);
        self::assertStringContainsString('first', $output);
        self::assertStringContainsString('https://example.test/broken/first', $output);
    }

    public function testFailedRenderingPreservesPreviousOutput(): void
    {
        $fs = new Filesystem();
        $fs->dumpFile($this->directory . '/var/static/.ssg-owned', "static-site-bundle\n");
        $fs->dumpFile($this->directory . '/var/static/index.html', 'previous');
        $tester = $this->command('broken');
        self::assertSame(1, $tester->execute([]));
        self::assertStringContainsString('received 500', $tester->getDisplay());
        self::assertSame('previous', file_get_contents($this->directory . '/var/static/index.html'));
        self::assertSame([], glob($this->directory . '/var/static.staging-*'));
    }

    public function testDryRunDoesNotWrite(): void
    {
        $tester = $this->command();
        self::assertSame(0, $tester->execute(['--dry-run' => true]), $tester->getDisplay());
        self::assertStringContainsString('3 routes planned', $tester->getDisplay());
        self::assertDirectoryDoesNotExist($this->directory . '/var/static');
    }

    public function testMissingProviderFails(): void
    {
        $tester = $this->command('missing_provider');
        self::assertSame(1, $tester->execute([]));
        self::assertStringContainsString('needs a provider in #[StaticPage]', $tester->getDisplay());
        self::assertDirectoryDoesNotExist($this->directory . '/var/static');
    }

    public function testCollisionFails(): void
    {
        $tester = $this->command('collision');
        self::assertSame(0, $tester->execute(['--dry-run' => true]));
        self::assertSame(1, $tester->execute([]));
        self::assertStringContainsString('Output collision', $tester->getDisplay());
    }

    public function testDoesNotOverwriteUnownedDirectory(): void
    {
        new Filesystem()->dumpFile($this->directory . '/var/static/important.txt', 'keep');
        $tester = $this->command();
        self::assertSame(1, $tester->execute([]));
        self::assertSame('keep', file_get_contents($this->directory . '/var/static/important.txt'));
    }

    public function testRejectsDevAssets(): void
    {
        new Filesystem()->dumpFile(
            $this->directory . '/public/build/entrypoints.json',
            '{"isProd":false,"publicPath":"/build/","devServer":{"origin":"http://localhost:5173","client":"/@vite/client"},"entryPoints":{"app":{}}}',
        );
        $tester = $this->command();
        self::assertSame(1, $tester->execute([]));
        self::assertStringContainsString('production build', $tester->getDisplay());
    }

    public function testRejectsSymlinkedAssets(): void
    {
        symlink($this->directory . '/public/index.php', $this->directory . '/public/build/leak.txt');
        $tester = $this->command();
        self::assertSame(1, $tester->execute([]));
        self::assertStringContainsString('Symbolic links', $tester->getDisplay());
    }

    public function testRejectsBuildInDev(): void
    {
        $tester = $this->command('ok', 'dev');
        self::assertSame(1, $tester->execute([]));
        self::assertStringContainsString('APP_ENV=prod', $tester->getDisplay());
    }

    public function testBuiltInAndAutoconfiguredFormatsUseTheSamePipeline(): void
    {
        $tester = $this->command('formats');
        self::assertSame(0, $tester->execute([]), $tester->getDisplay());
        $output = $this->directory . '/var/static';
        self::assertSame('{"hello":"world"}', file_get_contents($output . '/data.json'));
        self::assertSame("User-agent: *\n", file_get_contents($output . '/robots.txt'));
        self::assertSame('# Guide', file_get_contents($output . '/guide.md'));
        self::assertSame("id,name\n1,Hello\n", file_get_contents($output . '/data.csv'));
        self::assertSame('{"slug":"first"}', file_get_contents($output . '/data/first.json'));
        $sitemap = file_get_contents($output . '/sitemap.xml');
        self::assertSame(3, substr_count($sitemap, '<loc>'));
        self::assertStringNotContainsString('.json', $sitemap);
        self::assertStringNotContainsString('.md', $sitemap);
    }

    public function testInvalidJsonPreservesPreviousExport(): void
    {
        $fs = new Filesystem();
        $fs->dumpFile($this->directory . '/var/static/.ssg-owned', "static-site-bundle\n");
        $fs->dumpFile($this->directory . '/var/static/data.json', 'previous');
        $tester = $this->command('invalid_json');
        self::assertSame(1, $tester->execute([]));
        self::assertSame('previous', file_get_contents($this->directory . '/var/static/data.json'));
    }

    public function testUnsupportedContentTypeFailsDuringRendering(): void
    {
        $tester = $this->command('unknown_format');
        self::assertSame(0, $tester->execute(['--dry-run' => true]));
        self::assertSame(1, $tester->execute([]));
        self::assertStringContainsString('Unsupported or missing response Content-Type', $tester->getDisplay());
    }

    public function testNonHtmlSiteDoesNotGenerateEmptySitemap(): void
    {
        $tester = $this->command('data_only');
        self::assertSame(0, $tester->execute([]), $tester->getDisplay());
        self::assertFileExists($this->directory . '/var/static/data.json');
        self::assertFileDoesNotExist($this->directory . '/var/static/sitemap.xml');
    }

    public function testExcludedPagesAreExportedButNotListedInSitemap(): void
    {
        $tester = $this->command('sitemap');
        self::assertSame(0, $tester->execute(['--dry-run' => true]), $tester->getDisplay());
        self::assertStringContainsString('list/2 (not in sitemap)', $tester->getDisplay());
        self::assertSame(0, $tester->execute([]), $tester->getDisplay());
        $output = $this->directory . '/var/static';
        self::assertSame('<html>2</html>', file_get_contents($output . '/list/2/index.html'));
        self::assertFileExists($output . '/legal/index.html');
        $sitemap = file_get_contents($output . '/sitemap.xml');
        self::assertStringContainsString('https://example.test/list/1<', $sitemap);
        self::assertStringContainsString('https://example.test/list/10<', $sitemap);
        self::assertStringNotContainsString('https://example.test/list/2<', $sitemap);
        self::assertStringNotContainsString('/legal', $sitemap);
    }

    public function testPageCollidingWithPublicAssetFails(): void
    {
        new Filesystem()->dumpFile($this->directory . '/public/robots.txt', 'asset');
        $tester = $this->command('formats');
        self::assertSame(1, $tester->execute([]));
        self::assertStringContainsString('Output collision at "robots.txt"', $tester->getDisplay());
        self::assertDirectoryDoesNotExist($this->directory . '/var/static');
    }

    public function testUnsafeCustomFormatCannotEscapePublicationDirectory(): void
    {
        $tester = $this->command('unsafe_format');
        self::assertSame(1, $tester->execute([]));
        self::assertStringContainsString('Unsafe output file', $tester->getDisplay());
        self::assertFileDoesNotExist($this->directory . '/var/outside.txt');
        self::assertDirectoryDoesNotExist($this->directory . '/var/static');
    }

    public function testMissingViteAssetPreservesThePreviousExport(): void
    {
        $fs = new Filesystem();
        $fs->dumpFile($this->directory . '/var/static/.ssg-owned', "static-site-bundle\n");
        $fs->dumpFile($this->directory . '/var/static/index.html', 'previous');
        $fs->remove($this->directory . '/public/build/app.js');
        $tester = $this->command();
        self::assertSame(1, $tester->execute([]));
        self::assertStringContainsString('Missing or excluded local Vite asset', $tester->getDisplay());
        self::assertSame('previous', file_get_contents($this->directory . '/var/static/index.html'));
    }

    public function testRepriseTwigHelpersRenderAssetsOnEveryExportedPage(): void
    {
        $fs = new Filesystem();
        $fs->dumpFile($this->directory . '/public/build/app.css', 'body { color: black; }');
        $fs->dumpFile(
            $this->directory . '/public/build/entrypoints.json',
            '{"isProd":true,"devServer":null,"publicPath":"/build/","entryPoints":{"app":{"js":["build/app.js"],"css":["build/app.css"]}}}',
        );
        $tester = $this->command('reprise');
        self::assertSame(0, $tester->execute([]), $tester->getDisplay());
        foreach (['twig', 'twig-again'] as $path) {
            $html = file_get_contents($this->directory . '/var/static/' . $path . '/index.html');
            self::assertStringContainsString('src="/build/app.js"', $html);
            self::assertStringContainsString('href="/build/app.css"', $html);
            self::assertStringNotContainsString('/@vite/client', $html);
        }
        self::assertFileExists($this->directory . '/var/static/build/app.css');
    }

    public function testActivatedExportReportsCleanupWarningsWithoutFailingTheCommand(): void
    {
        $fs = new Filesystem();
        $fs->dumpFile($this->directory . '/var/static/.ssg-owned', "static-site-bundle\n");
        $fs->dumpFile($this->directory . '/var/static/index.html', 'previous');
        $tester = $this->command('cleanup_warning');
        self::assertSame(0, $tester->execute([]), $tester->getDisplay());
        self::assertStringContainsString('3 files published', $tester->getDisplay());
        self::assertStringContainsString('Backup cleanup failed', $tester->getDisplay());
        self::assertSame('<html>Home</html>', file_get_contents($this->directory . '/var/static/index.html'));
        self::assertSame(
            'previous',
            file_get_contents(glob($this->directory . '/var/static.backup-*')[0] . '/index.html'),
        );
    }

    protected function setUp(): void
    {
        $this->directory = sys_get_temp_dir() . '/ssg-test-' . bin2hex(random_bytes(6));
        $fs = new Filesystem();
        $fs->dumpFile(
            $this->directory . '/public/build/entrypoints.json',
            '{"isProd":true,"devServer":null,"publicPath":"/build/","entryPoints":{"app":{"js":["/build/app.js"]}}}',
        );
        $fs->dumpFile($this->directory . '/public/build/manifest.json', '{"build/app.js":"/build/app.js"}');
        $fs->dumpFile($this->directory . '/public/build/app.js', 'console.log("prod");');
        $fs->dumpFile($this->directory . '/public/index.php', '<?php // must never be exported');
    }

    protected function tearDown(): void
    {
        $this->kernel?->shutdown();
        new Filesystem()->remove($this->directory);
    }
}
