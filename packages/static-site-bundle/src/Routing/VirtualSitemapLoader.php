<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Routing;

use CJean\StaticSiteBundle\Controller\SitemapController;
use Symfony\Component\Config\Loader\LoaderInterface;
use Symfony\Component\Config\Loader\LoaderResolverInterface;
use Symfony\Component\Routing\Route;
use Symfony\Component\Routing\RouteCollection;

/** @internal Adds the generated sitemap endpoint to the application route collection. */
final readonly class VirtualSitemapLoader implements LoaderInterface
{
    public function __construct(
        private LoaderInterface $inner,
        private bool $debug = false,
    ) {}

    public function load(mixed $resource, ?string $type = null): mixed
    {
        $routes = $this->inner->load($resource, $type);
        if ($routes instanceof RouteCollection) {
            if ($this->debug) {
                $routes->add(
                    '_static_site_profiler_data',
                    new Route(
                        '/_ssb/profiler/{token}/{section}',
                        [
                            '_controller' =>
                                \CJean\StaticSiteBundle\Controller\ProfilerDataController::class . '::__invoke',
                        ],
                        // @mago-expect lint:no-literal-password Profiler route token pattern, not a secret.
                        ['token' => '[a-f0-9]{6}', 'section' => 'parameters|source'],
                        methods: ['GET'],
                    ),
                    100,
                );
            }
            foreach ($routes as $route) {
                if ($route->getPath() === '/sitemap.xml') {
                    return $routes;
                }
            }
            $routes->add(
                '_static_site_sitemap_part',
                new Route(
                    '/sitemap-{part}.xml',
                    ['_controller' => SitemapController::class . '::__invoke'],
                    ['part' => '[1-9][0-9]*'],
                    methods: ['GET', 'HEAD'],
                ),
                100,
            );
            $routes->add(
                '_static_site_sitemap',
                new Route(
                    '/sitemap.xml',
                    ['_controller' => SitemapController::class . '::__invoke'],
                    methods: ['GET', 'HEAD'],
                ),
                100,
            );
        }
        return $routes;
    }

    public function supports(mixed $resource, ?string $type = null): bool
    {
        return $this->inner->supports($resource, $type);
    }

    public function getResolver(): LoaderResolverInterface
    {
        return $this->inner->getResolver();
    }

    public function setResolver(LoaderResolverInterface $resolver): void
    {
        $this->inner->setResolver($resolver);
    }
}
