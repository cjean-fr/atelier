<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Generation;

use CJean\StaticSiteBundle\Routing\RoutePlanner;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Contracts\Cache\ItemInterface;
use Symfony\Contracts\Cache\TagAwareCacheInterface;

/**
 * @internal Computes on explicit sitemap requests only; XML documents are cached across requests.
 * Without cold discovery (prod), nothing is computed until a build has seeded the cache; targeted invalidations then
 * recompute only their part.
 */
final class SitemapService
{
    private const string PUBLISHED = 'published';

    private bool $computing = false;

    public function __construct(
        private readonly RoutePlanner $planner,
        private readonly PageRenderer $renderer,
        private readonly SitemapGenerator $generator,
        private readonly TagAwareCacheInterface $cache,
        private readonly RouterInterface $router,
        private readonly \CJean\StaticSiteBundle\Routing\StaticPageResolver $metadata,
        private readonly bool $coldDiscovery = true,
    ) {}

    /** @return array<string, string> */
    public function documents(): array
    {
        if ($this->computing) {
            throw new \LogicException('Recursive sitemap discovery is not allowed.');
        }
        return $this->cache->get('documents', function (ItemInterface $item, bool &$save): array {
            if (!$this->coldDiscovery && !$this->published()) {
                $save = false;
                return [];
            }
            $this->computing = true;
            try {
                $groups = [];
                foreach ($this->planner->pages($this->cache) as $page) {
                    $groups[$page->routeName][] = $page;
                }
                $locations = [];
                $tags = [];
                foreach ($groups as $route => $pages) {
                    [$key, $groupTags] = $this->routeEntry($route, $pages);
                    $tags = array_merge($tags, $groupTags);
                    $urls = $this->cache->get($key, function (ItemInterface $entry) use ($pages, $groupTags): array {
                        $entry->tag($groupTags);
                        $urls = [];
                        foreach ($pages as $page) {
                            if ($page->sitemap === false)
                                continue;
                            try {
                                if ($this->renderer->inspectForSitemap($page))
                                    $urls[] = $page->url;
                            } catch (\Throwable $error) {
                                throw new \RuntimeException(
                                    sprintf(
                                        '%s; sitemap route: %s; provider: %s; parameters: %s; URL: %s',
                                        $error->getMessage(),
                                        $page->routeName,
                                        $page->provider ?? '(none)',
                                        json_encode($page->parameters, JSON_PARTIAL_OUTPUT_ON_ERROR),
                                        $page->url,
                                    ),
                                    previous: $error,
                                );
                            }
                        }
                        return $urls;
                    });
                    foreach ($urls as $url)
                        $locations[] = $url;
                }
                $item->tag(array_unique($tags));
                return $this->generator->documents($locations);
            } finally {
                $this->computing = false;
            }
        });
    }

    public function invalidateProvider(string $provider): void
    {
        $this->cache->invalidateTags(['provider.' . hash('sha256', $provider)]);
    }

    public function invalidateController(string $controller): void
    {
        $this->cache->invalidateTags(['controller.' . hash('sha256', $controller)]);
    }

    /**
     * Replaces the cache with a published build: its documents, provider output and URLs kept per route.
     *
     * @param array<string, string> $documents
     * @param list<\CJean\StaticSiteBundle\Routing\ExportPage> $pages
     * @param list<string> $locations URLs listed in the build sitemap.
     */
    public function remember(array $documents, array $pages = [], array $locations = []): void
    {
        if ($this->cache instanceof \Psr\Cache\CacheItemPoolInterface) {
            $this->cache->clear();
        } else {
            $this->cache->delete('documents');
        }
        $this->planner->rememberDiscovery($this->cache, $pages);
        $listed = array_fill_keys($locations, true);
        $groups = [];
        foreach ($pages as $page) {
            $groups[$page->routeName][] = $page;
        }
        $tags = [];
        foreach ($groups as $route => $group) {
            [$key, $groupTags] = $this->routeEntry($route, $group);
            $tags = array_merge($tags, $groupTags);
            $urls = [];
            foreach ($group as $page) {
                if (isset($listed[$page->url])) {
                    $urls[] = $page->url;
                }
            }
            $this->cache->get(
                $key,
                static function (ItemInterface $entry) use ($groupTags, $urls): array {
                    $entry->tag($groupTags);
                    return $urls;
                },
                INF,
            );
        }
        $this->cache->get(
            'documents',
            static function (ItemInterface $item) use ($tags, $documents): array {
                $item->tag(array_unique($tags));
                return $documents;
            },
            INF,
        );
        // Untagged: targeted invalidations keep it, a pool clear removes it.
        $this->cache->get(self::PUBLISHED, static fn(): bool => true, INF);
    }

    private function published(): bool
    {
        return $this->cache->get(self::PUBLISHED, static function (ItemInterface $item, bool &$save): bool {
            $save = false;
            return false;
        });
    }

    /**
     * Cache key and tags of the sitemap URLs of one route, shared by discovery and build seeding.
     *
     * @param non-empty-list<\CJean\StaticSiteBundle\Routing\ExportPage> $pages
     * @return array{string, list<string>}
     */
    private function routeEntry(string $route, array $pages): array
    {
        $definition = $this->router->getRouteCollection()->get($route);
        $identity = $definition === null ? $route : $this->metadata->controllerIdentity($definition) ?? $route;
        $tags = [
            'controller.' . hash('sha256', $identity),
            'controller.' . hash('sha256', explode('::', $identity, 2)[0]),
        ];
        if ($pages[0]->provider !== null) {
            $tags[] = 'provider.' . hash('sha256', $pages[0]->provider);
        }
        return ['controller.' . hash('sha256', $identity . ':' . $route . ':' . serialize($pages)), $tags];
    }
}
