<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Tests\Unit;

use CJean\StaticSiteBundle\Attribute\StaticPage;
use CJean\StaticSiteBundle\Provider\RouteParameters;
use CJean\StaticSiteBundle\Provider\RouteProviderInterface;
use CJean\StaticSiteBundle\Routing\RoutePlanner;
use CJean\StaticSiteBundle\Routing\StaticPageResolver;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Config\Loader\Loader;
use Symfony\Component\DependencyInjection\ServiceLocator;
use Symfony\Component\Routing\Route;
use Symfony\Component\Routing\RouteCollection;
use Symfony\Component\Routing\Router;

final class RoutePlannerTest extends TestCase
{
    public function testLocalizedRoutes(): void
    {
        $routes = new RouteCollection();
        $routes->add('article.fr', new Route('/fr/{slug}', [
            '_locale' => 'fr',
            '_controller' => PlannerController::class . '::dynamic',
        ]));
        $routes->add('article.en', new Route('/en/{slug}', [
            '_locale' => 'en',
            '_controller' => PlannerController::class . '::dynamic',
        ]));
        $provider = new class implements RouteProviderInterface {
            public function parameters(string $routeName): iterable
            {
                yield ['slug' => $routeName === 'article.fr' ? 'bonjour' : 'hello'];
            }
        };
        $pages = $this->planner($routes, $provider)->pages();
        self::assertSame(
            ['https://example.test/fr/bonjour', 'https://example.test/en/hello'],
            array_column($pages, 'url'),
        );
    }

    private function planner(
        RouteCollection $routes,
        ?RouteProviderInterface $provider = null,
        ?Router $router = null,
    ): RoutePlanner {
        $locator = new ServiceLocator($provider === null ? [] : ['provider' => static fn() => $provider]);
        return new RoutePlanner(
            $router ?? $this->router($routes),
            $locator,
            new StaticPageResolver(),
            'https://example.test:443',
        );
    }

    private function router(RouteCollection $routes): Router
    {
        $loader = new class($routes) extends Loader {
            public function __construct(
                private readonly RouteCollection $routes,
            ) {}

            public function load(mixed $resource, ?string $type = null): RouteCollection
            {
                return $this->routes;
            }

            public function supports(mixed $resource, ?string $type = null): bool
            {
                return true;
            }
        };
        return new Router($loader, 'test');
    }

    public function testPlanningRestoresTheRouterContextBeforeReturning(): void
    {
        $routes = new RouteCollection();
        $routes->add('page', new Route('/page', ['_controller' => PlannerController::class . '::fixed']));
        $planner = $this->planner($routes, router: $router = $this->router($routes));
        $context = $router->getContext();
        self::assertCount(1, $planner->pages());
        self::assertSame($context, $router->getContext());
    }

    public function testSitemapFollowsParameterSetThenAttributeThenFormat(): void
    {
        $routes = new RouteCollection();
        $routes->add('list', new Route('/list/{page}', ['_controller' => PlannerController::class . '::dynamic']));
        $routes->add('legal', new Route('/legal', ['_controller' => PlannerController::class . '::hidden']));
        $routes->add('feed', new Route('/feed.json', ['_controller' => PlannerController::class . '::listedJson']));
        $routes->add('data', new Route('/data.json', ['_controller' => PlannerController::class . '::json']));
        // Typical SEO pagination: only the first page and every tenth page are listed.
        $provider = new class implements RouteProviderInterface {
            public function parameters(string $routeName): iterable
            {
                yield ['page' => 1];
                foreach ([2, 10, 11] as $page) {
                    yield new RouteParameters(['page' => $page], sitemap: ($page % 10) === 0);
                }
                yield new RouteParameters(['page' => 12]);
            }
        };
        $sitemap = array_column($this->planner($routes, $provider)->pages(), 'sitemap', 'url');
        self::assertSame(
            [
                'https://example.test/list/1' => null,
                'https://example.test/list/2' => false,
                'https://example.test/list/10' => true,
                'https://example.test/list/11' => false,
                'https://example.test/list/12' => null,
                'https://example.test/legal' => false,
                'https://example.test/feed.json' => true,
                'https://example.test/data.json' => null,
            ],
            $sitemap,
        );
    }

    public function testUnknownProvider(): void
    {
        $routes = new RouteCollection();
        $routes->add('page', new Route('/page', ['_controller' => PlannerController::class . '::unknown']));
        $this->expectException(\LogicException::class);
        $this->planner($routes)->pages();
    }

    public function testQueryParametersCannotBeExported(): void
    {
        $routes = new RouteCollection();
        $routes->add('page', new Route('/page', ['_controller' => PlannerController::class . '::dynamic']));
        $provider = new class implements RouteProviderInterface {
            public function parameters(string $routeName): iterable
            {
                yield ['filter' => 'all'];
            }
        };
        $this->expectException(\InvalidArgumentException::class);
        $this->planner($routes, $provider)->pages();
    }

    public function testPostRoutesCannotBeExported(): void
    {
        $routes = new RouteCollection();
        $routes->add(
            'page',
            new Route('/page', ['_controller' => PlannerController::class . '::fixed'], methods: ['POST']),
        );
        $this->expectException(\LogicException::class);
        $this->planner($routes)->pages();
    }

    public function testDifferentHostIsRejected(): void
    {
        $routes = new RouteCollection();
        $routes->add(
            'page',
            new Route('/page', ['_controller' => PlannerController::class . '::fixed'], host: 'elsewhere.test'),
        );
        $this->expectException(\LogicException::class);
        $this->planner($routes)->pages();
    }

    public function testShadowedRouteIsRejected(): void
    {
        $routes = new RouteCollection();
        $routes->add('catch_all', new Route('/{slug}'));
        $routes->add('page', new Route('/page', ['_controller' => PlannerController::class . '::fixed']));
        $this->expectException(\LogicException::class);
        $this->planner($routes)->pages();
    }
}

final class PlannerController
{
    #[StaticPage]
    public function fixed(): void {}

    #[StaticPage(provider: 'provider')]
    public function dynamic(): void {}

    #[StaticPage(sitemap: false)]
    public function hidden(): void {}

    #[StaticPage(sitemap: true)]
    public function listedJson(): void {}

    #[StaticPage]
    public function json(): void {}

    #[StaticPage(provider: 'missing')]
    public function unknown(): void {}
}
