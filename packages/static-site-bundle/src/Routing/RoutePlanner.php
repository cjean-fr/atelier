<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Routing;

use CJean\StaticSiteBundle\Provider\RouteParameters;
use CJean\StaticSiteBundle\Provider\RouteProviderInterface;
use Psr\Container\ContainerInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Routing\RequestContext;
use Symfony\Component\Routing\RouterInterface;

final readonly class RoutePlanner
{
    public function __construct(
        private RouterInterface $router,
        private ContainerInterface $providers,
        private StaticPageResolver $metadata,
        private string $baseUrl,
    ) {}

    /**
     * Plans the whole export. Providers are fully consumed and the router context is restored before returning,
     * so no rendering ever interleaves with planning.
     *
     * @return list<ExportPage>
     */
    public function pages(?\Symfony\Contracts\Cache\TagAwareCacheInterface $discoveryCache = null): array
    {
        $previous = $this->router->getContext();
        $site = SiteUrl::fromDefaultUri($this->baseUrl);
        $basePath = $site->basePath;
        $origin = ['scheme' => $site->scheme, 'host' => $site->host, 'port' => $site->port];
        try {
            $this->router->setContext(new RequestContext()->fromUri($site->url));
            $pages = [];
            $seen = [];
            foreach ($this->router->getRouteCollection() as $name => $route) {
                $providerId = null;
                $parameters = null;
                $absolute = null;
                try {
                    $page = $this->metadata->resolve($name, $route);
                    if ($page === null) {
                        continue;
                    }
                    $providerId = $page->provider;
                    if ($route->getMethods() !== [] && !in_array('GET', $route->getMethods(), true)) {
                        throw new \LogicException(sprintf('SSG route "%s" must accept GET.', $name));
                    }
                    if ($providerId !== null) {
                        if (!$this->providers->has($providerId)) {
                            throw new \LogicException(sprintf('Unknown SSG provider for "%s".', $name));
                        }
                        $discover = function () use ($providerId, $name): iterable {
                            $provider = $this->providers->get($providerId);
                            if (!$provider instanceof RouteProviderInterface) {
                                throw new \LogicException('Invalid route provider.');
                            }
                            return $provider->parameters($name);
                        };
                        $sets = $discoveryCache === null
                            ? $discover()
                            : $discoveryCache->get(
                                $this->discoveryKey($providerId, $name),
                                function (\Symfony\Contracts\Cache\ItemInterface $item) use (
                                    $discover,
                                    $providerId,
                                    &$parameters,
                                ): array {
                                    $item->tag(self::providerTag($providerId));
                                    $captured = [];
                                    foreach ($discover() as $set) {
                                        $parameters = $set instanceof RouteParameters ? $set->parameters : $set;
                                        $captured[] = $set;
                                    }
                                    return $captured;
                                },
                            );
                    } elseif ($page->parameters !== null) {
                        $sets = $page->parameters;
                    } else {
                        if ($route->compile()->getVariables() !== []) {
                            throw new \LogicException(sprintf(
                                'Dynamic SSG route "%s" needs a provider or inline parameters in #[StaticPage].',
                                $name,
                            ));
                        }
                        $sets = [[]];
                    }
                    $sitemap = $page->sitemap;
                    foreach ($sets as $set) {
                        $absolute = null;
                        [$parameters, $inSitemap] = $set instanceof RouteParameters
                            ? [$set->parameters, $set->sitemap ?? $sitemap]
                            : [$set, $sitemap];
                        /** @var mixed $parameters Provider contracts must also be checked at runtime. */
                        if (!is_array($parameters)) {
                            throw new \LogicException(sprintf(
                                'Parameter sets for "%s" must be arrays or RouteParameters.',
                                $name,
                            ));
                        }
                        // Absolute URLs also expose routes pointing to a different host or scheme.
                        $absolute = $this->router->generate($name, $parameters, UrlGeneratorInterface::ABSOLUTE_URL);
                        $target = parse_url($absolute);
                        if ($target === false || !isset($target['scheme'], $target['host'])) {
                            throw new \LogicException(sprintf('Route "%s" generates an invalid absolute URL.', $name));
                        }
                        $target['port'] ??= $target['scheme'] === 'https' ? 443 : 80;
                        foreach (['scheme', 'host', 'port'] as $key) {
                            if (($origin[$key] ?? null) !== ($target[$key] ?? null)) {
                                throw new \LogicException(sprintf(
                                    'Route "%s" points outside framework.router.default_uri.',
                                    $name,
                                ));
                            }
                        }
                        $url = $target['path'] ?? '/';
                        if (isset($target['query'])) {
                            $url .= '?' . $target['query'];
                        }
                        OutputPath::decodeUrl($url);
                        if ($basePath !== '' && !str_starts_with($url, $basePath . '/')) {
                            throw new \LogicException(sprintf(
                                'Route "%s" points outside framework.router.default_uri.',
                                $name,
                            ));
                        }
                        $matched = $this->router->match(substr($url, strlen($basePath)));
                        if (($matched['_route'] ?? null) !== $name) {
                            throw new \LogicException(sprintf(
                                'Route "%s" is shadowed by another route at "%s".',
                                $name,
                                $url,
                            ));
                        }
                        if (isset($seen[$absolute])) {
                            throw new \LogicException(sprintf(
                                'Duplicate export URL "%s" (%s and %s).',
                                $absolute,
                                $seen[$absolute],
                                $name,
                            ));
                        }
                        $seen[$absolute] = $name;
                        $pages[] = new ExportPage($name, $absolute, $inSitemap, $providerId, $parameters);
                    }
                } catch (\Throwable $error) {
                    $message = sprintf(
                        "%s\nSSG route: %s\nProvider: %s\nParameters (last observed): %s\nURL: %s",
                        $error->getMessage(),
                        $name,
                        $providerId ?? '(none)',
                        json_encode(
                            $parameters,
                            JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PARTIAL_OUTPUT_ON_ERROR,
                        ) ?: 'null',
                        $absolute ?? '(not generated)',
                    );
                    if ($error instanceof \InvalidArgumentException) {
                        throw new \InvalidArgumentException($message, previous: $error);
                    }
                    if ($error instanceof \LogicException) {
                        throw new \LogicException($message, previous: $error);
                    }
                    throw new \RuntimeException($message, previous: $error);
                }
            }
            return $pages;
        } finally {
            $this->router->setContext($previous);
        }
    }

    /**
     * Stores the provider output of a published build under the keys read by pages(), so a later targeted
     * invalidation does not rerun the other providers. Replaying the stored sets yields identical pages.
     *
     * @param list<ExportPage> $pages
     */
    public function rememberDiscovery(\Symfony\Contracts\Cache\TagAwareCacheInterface $cache, array $pages): void
    {
        $sets = [];
        foreach ($pages as $page) {
            if ($page->provider !== null) {
                /** @var array<string, string|int|float|bool> $parameters Yielded by this provider in this build. */
                $parameters = $page->parameters;
                // The effective choice equals the provider override, or the attribute one when it is absent.
                $sets[$page->routeName][] = $page->sitemap === null
                    ? $parameters
                    : new RouteParameters($parameters, $page->sitemap);
            }
        }
        foreach ($this->router->getRouteCollection() as $name => $route) {
            $providerId = $this->metadata->resolve($name, $route)?->provider;
            if ($providerId === null) {
                continue;
            }
            // Providers that yielded nothing are remembered too.
            $captured = $sets[$name] ?? [];
            $cache->get(
                $this->discoveryKey($providerId, $name),
                static function (\Symfony\Contracts\Cache\ItemInterface $item) use ($providerId, $captured): array {
                    $item->tag(self::providerTag($providerId));
                    return $captured;
                },
                INF,
            );
        }
    }

    private function discoveryKey(string $providerId, string $routeName): string
    {
        return 'provider.' . hash('sha256', $providerId . ':' . $routeName . ':' . $this->baseUrl);
    }

    private static function providerTag(string $providerId): string
    {
        return 'provider.' . hash('sha256', $providerId);
    }
}
