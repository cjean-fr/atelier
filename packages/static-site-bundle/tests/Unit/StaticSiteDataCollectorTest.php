<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Tests\Unit;

use CJean\StaticSiteBundle\Attribute\StaticPage;
use CJean\StaticSiteBundle\DataCollector\StaticSiteDataCollector;
use CJean\StaticSiteBundle\Format\FormatRegistry;
use CJean\StaticSiteBundle\Format\HtmlFormat;
use CJean\StaticSiteBundle\Provider\RouteProviderInterface;
use CJean\StaticSiteBundle\Routing\StaticPageResolver;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Route;
use Symfony\Component\Routing\RouteCollection;
use Symfony\Component\Routing\RouterInterface;

final class StaticSiteDataCollectorTest extends TestCase
{
    private string $root;

    protected function setUp(): void
    {
        $this->root = sys_get_temp_dir() . '/ssg-profiler-' . bin2hex(random_bytes(6));
    }

    protected function tearDown(): void
    {
        new Filesystem()->remove($this->root);
    }

    private function collector(RouteProviderInterface $provider): StaticSiteDataCollector
    {
        $routes = new RouteCollection();
        $routes->add('article', new Route('/blog/{slug}', ['_controller' => ProfiledController::class . '::__invoke']));
        $router = $this->createStub(RouterInterface::class);
        $router->method('getRouteCollection')->willReturn($routes);
        return new StaticSiteDataCollector($router, new StaticPageResolver(), new FormatRegistry([new HtmlFormat()]), [
            'provider' => $provider::class,
        ]);
    }

    private function request(): Request
    {
        $request = Request::create('https://example.test/blog/one');
        $request->attributes->set('_route', 'article');
        $request->attributes->set('_route_params', ['slug' => 'one']);
        return $request;
    }

    public function testCollectsMetadataWithoutExecutingProviderOrReadingPublishedSource(): void
    {
        new Filesystem()->dumpFile($this->root . '/var/static/blog/one/index.html', '<script>published()</script>');
        $collector = $this->collector(new class implements RouteProviderInterface {
            public function parameters(string $routeName): iterable
            {
                throw new \RuntimeException('SSR must never call this provider');
            }
        });
        $collector->collect($this->request(), new Response('<script src="http://localhost:5173/@vite/client"></script>', headers: [
            'Content-Type' => 'text/html',
        ]));
        $details = $collector->getDetails();
        self::assertTrue($details['selected']);
        self::assertSame('provider', $details['provider']);
        self::assertFalse($details['attribute']['sitemap']);
        self::assertSame(__FILE__, $details['providerFile']);
        self::assertGreaterThan(0, $details['providerLine']);
        self::assertSame('blog/one/index.html', $details['file']);
        self::assertStringContainsString('one', $details['currentParameters']);
        self::assertArrayNotHasKey('parameters', $details);
        self::assertArrayNotHasKey('source', $details);
        self::assertNull($details['error']);
        $collector->reset();
        self::assertSame([], $collector->getDetails());
    }

    public function testUnselectedRouteDoesNotCallProvider(): void
    {
        $collector = $this->collector(new class implements RouteProviderInterface {
            public function parameters(string $routeName): iterable
            {
                throw new \RuntimeException('Must not be called');
            }
        });
        $collector->collect(Request::create('/plain'), new Response('SSR'));
        self::assertFalse($collector->getDetails()['selected']);
        self::assertNull($collector->getDetails()['error']);
    }
}

final class ProfiledController
{
    #[StaticPage(provider: 'provider', sitemap: false)]
    public function __invoke(): void {}
}
