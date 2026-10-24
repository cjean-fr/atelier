<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\EventListener;

use CJean\StaticSiteBundle\Event\ExportedPage;
use CJean\StaticSiteBundle\Event\SitePublishedEvent;
use CJean\StaticSiteBundle\Event\SiteRenderedEvent;
use CJean\StaticSiteBundle\Generation\SitemapGenerator;
use CJean\StaticSiteBundle\Generation\SitemapService;

/** @internal Writes the build sitemap, then seeds the SSR sitemap cache with the published result. */
final readonly class SitemapListener
{
    public function __construct(
        private SitemapGenerator $generator,
        private ?SitemapService $cache = null,
    ) {}

    public function onSiteRendered(SiteRenderedEvent $event): void
    {
        foreach ($this->generator->documents(self::locations($event->pages)) as $file => $xml) {
            $event->write($file, $xml);
        }
    }

    public function onSitePublished(SitePublishedEvent $event): void
    {
        $locations = self::locations($event->pages);
        $this->cache?->remember(
            $this->generator->documents($locations),
            array_map(static fn(ExportedPage $exported) => $exported->page, $event->pages),
            $locations,
        );
    }

    /**
     * @param list<ExportedPage> $pages
     * @return list<string>
     */
    private static function locations(array $pages): array
    {
        $locations = [];
        foreach ($pages as $exported) {
            if ($exported->inSitemap) {
                $locations[] = $exported->page->url;
            }
        }
        return $locations;
    }
}
