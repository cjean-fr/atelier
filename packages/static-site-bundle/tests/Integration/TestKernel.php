<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Tests\Integration;

use CJean\StaticSiteBundle\Attribute\StaticPage;
use CJean\StaticSiteBundle\Event\PageRenderedEvent;
use CJean\StaticSiteBundle\Event\SitePublishedEvent;
use CJean\StaticSiteBundle\Event\SiteRenderedEvent;
use CJean\StaticSiteBundle\Format\BufferedTextFormat;
use CJean\StaticSiteBundle\Provider\RouteParameters;
use CJean\StaticSiteBundle\Provider\RouteProviderInterface;
use CJean\StaticSiteBundle\StaticSiteBundle;
use Symfony\Bundle\FrameworkBundle\Controller\TemplateController;
use Symfony\Bundle\FrameworkBundle\FrameworkBundle;
use Symfony\Bundle\FrameworkBundle\Kernel\MicroKernelTrait;
use Symfony\Bundle\TwigBundle\TwigBundle;
use Symfony\Component\DependencyInjection\Loader\Configurator\ContainerConfigurator;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Kernel;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;
use Symfony\Reprise\RepriseBundle;
use Twig\Environment;

final class TestKernel extends Kernel
{
    use MicroKernelTrait;

    public function __construct(
        private readonly string $directory,
        private readonly string $scenario = 'ok',
        string $environment = 'prod',
    ) {
        parent::__construct($environment, false);
    }

    public function getProjectDir(): string
    {
        return $this->directory;
    }

    public function registerBundles(): iterable
    {
        yield new FrameworkBundle();
        yield new TwigBundle();
        yield new RepriseBundle();
        yield new StaticSiteBundle();
    }

    protected function configureContainer(ContainerConfigurator $container): void
    {
        $formats = ['md' => 'text/markdown'];
        if ($this->scenario === 'request_formats') {
            $formats['ndjson'] = 'application/x-ndjson';
        }
        if ($this->scenario === 'unsafe_format') {
            $formats['unsafe'] = 'application/x-unsafe';
        }
        $container->extension('framework', [
            // @mago-expect lint:no-literal-password
            'secret' => 'test',
            'router' => [
                'utf8' => true,
                'default_uri' => match ($this->scenario) {
                    'base_path' => 'https://example.test/docs/',
                    'no_default_uri' => null,
                    'invalid_default_uri' => 'https://example.test/docs?x=1',
                    default => 'https://example.test',
                },
            ],
            'http_method_override' => false,
            'assets' => [],
            'request' => ['formats' => $formats],
        ]);
        if ($this->scenario === 'cleanup_warning') {
            $container->services()->set(Filesystem::class, TestCleanupFilesystem::class);
        }
        $container->extension('static_site', [
            'sitemap' => $this->scenario !== 'no_sitemap',
        ]);
        if ($this->scenario === 'events') {
            $container->services()->set(TestEventsListener::class)->public()->autoconfigure();
        }
        $container
            ->services()
            ->set(TestLinkController::class)
            ->autowire()
            ->autoconfigure()
            ->tag('controller.service_arguments');
        $container
            ->services()
            ->alias('test.sitemap', \CJean\StaticSiteBundle\Generation\SitemapService::class)
            ->public();
        $container->services()->set(TestProvider::class)->autoconfigure();
        $container
            ->services()
            ->set(TestRepriseController::class)
            ->autowire()
            ->autoconfigure()
            ->tag('controller.service_arguments');
        $container->services()->set(TestPaginationProvider::class)->autoconfigure();
        $container->services()->set(TestUnsafeFormat::class)->autoconfigure();
        $container->services()->set('test.controller', TestController::class)->public();
        $container->services()->alias('test.controller.alias', 'test.controller')->public();
    }

    protected function configureRoutes(RoutingConfigurator $routes): void
    {
        if ($this->scenario === 'reprise') {
            $routes->add('twig_first', '/twig')->controller([TestRepriseController::class, 'page']);
            $routes->add('twig_second', '/twig-again')->controller([TestRepriseController::class, 'page']);
            return;
        }
        if ($this->scenario === 'selection') {
            $routes
                ->add('template', '/notice')
                ->controller(TemplateController::class)
                ->defaults(['template' => 'notice.html.twig', StaticPage::ROUTE_DEFAULT => true]);
            $routes
                ->add('template_tag', '/tags/{tag}')
                ->controller(TemplateController::class)
                ->defaults([
                    'template' => 'notice.html.twig',
                    StaticPage::ROUTE_DEFAULT => ['parameters' => [['tag' => 'php']], 'sitemap' => false],
                ]);
            $routes->add('class_page', '/class')->controller([TestClassController::class, 'page']);
            $routes
                ->add('class_form', '/class/form')
                ->controller([TestClassController::class, 'form'])
                ->methods([
                    'POST',
                ]);
            $routes
                ->add('class_excluded', '/class/excluded')
                ->controller([TestClassController::class, 'page'])
                ->defaults([
                    StaticPage::ROUTE_DEFAULT => false,
                ]);
            $routes->add('inline', '/inline/{slug}')->controller([TestClassController::class, 'inline']);
            return;
        }
        if ($this->scenario === 'base_path') {
            // Rendered after other pages: each request must still update the router context.
            $routes->add('article', '/blog/{slug}')->controller([TestController::class, 'article']);
            $routes->add('link', '/')->controller([TestLinkController::class, 'home']);
            return;
        }
        if ($this->scenario === 'request_formats') {
            $routes->add('events_stream', '/events.ndjson')->controller([TestController::class, 'ndjson']);
            return;
        }
        if ($this->scenario === 'data_only') {
            $routes->add('json', '/data.json')->controller([TestController::class, 'json']);
            return;
        }
        if ($this->scenario === 'unsafe_format') {
            $routes->add('unsafe', '/unsafe')->controller([TestController::class, 'unsafe']);
            return;
        }
        $routes->add('home', '/')->controller('test.controller.alias::home')->methods(['GET']);
        $routes->add('article', '/blog/{slug}')->controller([TestController::class, 'article'])->methods(['GET']);
        $routes->add('private', '/private')->controller([TestController::class, 'privatePage']);
        if ($this->scenario === 'formats') {
            foreach ([
                'data.json' => 'json',
                'robots.txt' => 'txt',
                'guide.md' => 'markdown',
                'data.csv' => 'csv',
            ] as $path => $method) {
                $routes->add($method, '/' . $path)->controller([TestController::class, $method]);
            }
            $routes->add('json_article', '/data/{slug}.json')->controller([TestController::class, 'jsonArticle']);
            // No Content-Type in the controller: Symfony derives it from _format.
            $routes
                ->add('notes', '/notes.md')
                ->controller([TestController::class, 'notes'])
                ->defaults([
                    '_format' => 'md',
                ]);
        }
        if ($this->scenario === 'invalid_json') {
            $routes->add('invalid_json', '/invalid.json')->controller([TestController::class, 'invalidJson']);
        }
        if ($this->scenario === 'unknown_format') {
            $routes->add('unknown_format', '/unknown')->controller([TestController::class, 'unknownFormat']);
        }
        if ($this->scenario === 'sitemap') {
            $routes->add('list', '/list/{page}')->controller([TestController::class, 'paginated']);
            $routes->add('legal', '/legal')->controller([TestController::class, 'legal']);
        }
        if ($this->scenario === 'broken_provider_route') {
            $routes->add('broken_article', '/broken/{slug}')->controller([TestController::class, 'brokenArticle']);
        }
        if ($this->scenario === 'broken') {
            $routes->add('broken', '/broken')->controller([TestController::class, 'broken']);
        }
        if ($this->scenario === 'missing_provider') {
            $routes->add('missing', '/missing/{id}')->controller([TestController::class, 'missing']);
        }
        if ($this->scenario === 'collision') {
            $routes->add('collision', '/index.html')->controller([TestController::class, 'home']);
        }
    }
}

final class TestProvider implements RouteProviderInterface
{
    public static int $calls = 0;

    public function parameters(string $routeName): iterable
    {
        ++self::$calls;
        yield ['slug' => 'first'];
        yield ['slug' => 'second'];
    }
}

final class TestPaginationProvider implements RouteProviderInterface
{
    public function parameters(string $routeName): iterable
    {
        foreach ([1, 2, 10] as $page) {
            yield new RouteParameters(['page' => $page], sitemap: $page === 1 || ($page % 10) === 0);
        }
    }
}

/** @mago-expect lint:too-many-methods Multiple routes are test fixtures. */
final class TestController
{
    public static int $articleCalls = 0;
    public static int $homeCalls = 0;
    public static int $paginatedCalls = 0;

    #[StaticPage(provider: TestProvider::class)]
    public function brokenArticle(string $slug): Response
    {
        return new Response('broken ' . $slug, 500, ['Content-Type' => 'text/html']);
    }

    #[StaticPage(provider: TestPaginationProvider::class)]
    public function paginated(int $page): Response
    {
        ++self::$paginatedCalls;
        return new Response('<html>' . $page . '</html>', 200, ['Content-Type' => 'text/html']);
    }

    #[StaticPage(sitemap: false)]
    public function legal(): Response
    {
        return new Response('<html>Legal</html>', 200, ['Content-Type' => 'text/html']);
    }

    #[StaticPage]
    public function unsafe(): Response
    {
        return new Response('unsafe', 200, ['Content-Type' => 'application/x-unsafe']);
    }

    #[StaticPage]
    public function notes(): Response
    {
        return new Response('# Notes');
    }

    #[StaticPage]
    public function ndjson(): Response
    {
        return new Response("{\"a\":1}\n", 200, ['Content-Type' => 'application/x-ndjson']);
    }

    #[StaticPage]
    public function json(): Response
    {
        return new Response('{"hello":"world"}', 200, ['Content-Type' => 'application/json']);
    }

    #[StaticPage]
    public function txt(): Response
    {
        return new Response("User-agent: *\n", 200, ['Content-Type' => 'text/plain']);
    }

    #[StaticPage]
    public function markdown(): Response
    {
        return new Response('# Guide', 200, ['Content-Type' => 'text/markdown']);
    }

    #[StaticPage]
    public function csv(): Response
    {
        return new Response("id,name\n1,Hello\n", 200, ['Content-Type' => 'text/csv']);
    }

    #[StaticPage(provider: TestProvider::class)]
    public function jsonArticle(string $slug): Response
    {
        return new Response(json_encode(['slug' => $slug], JSON_THROW_ON_ERROR), 200, [
            'Content-Type' => 'application/json',
        ]);
    }

    #[StaticPage]
    public function invalidJson(): Response
    {
        return new Response('{broken}', 200, ['Content-Type' => 'application/json']);
    }

    #[StaticPage]
    public function unknownFormat(): Response
    {
        return new Response('unknown', 200, ['Content-Type' => 'application/x-unknown']);
    }

    #[StaticPage(provider: TestProvider::class)]
    public function article(string $slug): Response
    {
        ++self::$articleCalls;
        return new Response('<html>' . $slug . '</html>', 200, ['Content-Type' => 'text/html']);
    }

    public function privatePage(): Response
    {
        return $this->home();
    }

    #[StaticPage]
    public function home(): Response
    {
        ++self::$homeCalls;
        // Like a typical Twig action: Symfony prepares the default Content-Type of main requests.
        return new Response('<html>Home</html>');
    }

    #[StaticPage]
    public function missing(): Response
    {
        return $this->home();
    }

    #[StaticPage]
    public function broken(): Response
    {
        return new Response('Error', 500);
    }
}

final class TestUnsafeFormat extends BufferedTextFormat
{
    public function __construct()
    {
        parent::__construct('unsafe');
    }

    public function outputPath(string $url, string $mediaType): string
    {
        return '../outside.txt';
    }
}

final readonly class TestRepriseController
{
    public function __construct(
        private Environment $twig,
    ) {}

    #[StaticPage]
    public function page(): Response
    {
        $template = $this->twig->createTemplate(
            '<html><head>{{ reprise_entry_link_tags("app") }}{{ reprise_entry_script_tags("app") }}</head><body>Reprise</body></html>',
        );
        return new Response($template->render());
    }
}

final class TestCleanupFilesystem extends Filesystem
{
    public function remove(string|iterable $files): void
    {
        if (is_string($files) && str_contains($files, '.backup-') && is_dir($files)) {
            throw new \RuntimeException('simulated backup cleanup error');
        }
        parent::remove($files);
    }
}

#[StaticPage]
final class TestClassController
{
    public function page(): Response
    {
        return new Response('<html>Class</html>');
    }

    public function form(): Response
    {
        throw new \LogicException('A POST action must not be exported.');
    }

    #[StaticPage(parameters: [['slug' => 'one'], ['slug' => 'two']], sitemap: false)]
    public function inline(string $slug): Response
    {
        return new Response('<html>' . $slug . '</html>');
    }
}

final readonly class TestLinkController
{
    public function __construct(
        private UrlGeneratorInterface $urls,
    ) {}

    #[StaticPage]
    public function home(): Response
    {
        return new Response(
            '<a href="'
            . $this->urls->generate('article', ['slug' => 'first'])
            . '">first</a><link rel="canonical" href="'
            . $this->urls->generate('link', referenceType: UrlGeneratorInterface::ABSOLUTE_URL)
            . '">',
        );
    }
}

final class TestEventsListener
{
    /** @var list<string> */
    public static array $published = [];

    #[AsEventListener]
    public function onPage(PageRenderedEvent $event): void
    {
        if ($event->page->routeName === 'home') {
            $event->setContent(str_replace('Home', 'Rewritten', $event->getContent()));
        }
        if (($event->page->parameters['slug'] ?? null) === 'second') {
            $event->excludeFromSitemap();
        }
    }

    #[AsEventListener]
    public function onSite(SiteRenderedEvent $event): void
    {
        $event->write('pages.txt', implode("\n", array_map(static fn($exported) => $exported->file, $event->pages)));
    }

    #[AsEventListener]
    public function onPublished(SitePublishedEvent $event): void
    {
        self::$published[] = $event->buildId;
    }
}
