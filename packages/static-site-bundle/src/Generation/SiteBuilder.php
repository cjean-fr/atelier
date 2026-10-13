<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Generation;

use CJean\StaticSiteBundle\Routing\RoutePlanner;

/** @internal Coordinates one complete static build: request discovery completes before rendering; output paths follow the responses. */
final readonly class SiteBuilder
{
    public function __construct(
        private RoutePlanner $planner,
        private PageRenderer $renderer,
        private DirectoryPublisher $publisher,
        private AssetExporter $assets,
        private ?BuildReportStore $reports = null,
        private SitemapGenerator $sitemap = new SitemapGenerator(),
        private ?SitemapService $sitemapCache = null,
    ) {}

    public function build(): PublicationResult
    {
        $pages = $this->planner->pages();
        if ($pages === []) {
            throw new \RuntimeException('No SSG routes selected. The previous build has been preserved.');
        }
        $documents = [];
        $locations = [];
        return $this->publisher->publish(function (StagingDirectory $staging) use (
            $pages,
            &$documents,
            &$locations,
        ): int {
            $this->assets->exportTo($staging);
            foreach ($pages as $page) {
                try {
                    $rendered = $this->renderer->render($page);
                    $staging->write($rendered->file, $rendered->content);
                } catch (\Throwable $error) {
                    throw new \RuntimeException(
                        sprintf(
                            "%s\nSSG route: %s\nProvider: %s\nParameters: %s\nURL: %s",
                            $error->getMessage(),
                            $page->routeName,
                            $page->provider ?? '(none)',
                            json_encode(
                                $page->parameters,
                                JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PARTIAL_OUTPUT_ON_ERROR,
                            ) ?: 'null',
                            $page->url,
                        ),
                        previous: $error,
                    );
                }
                if ($rendered->includeInSitemap) {
                    $locations[] = $page->url;
                }
            }
            $documents = $this->sitemap->documents($locations);
            foreach ($documents as $file => $xml) {
                $staging->write($file, $xml);
            }
            return count($pages);
        }, function (string $id) use ($pages, &$documents, &$locations): void {
            $this->sitemapCache?->remember($documents, $pages, $locations);
            $this->reports?->save($id, $pages);
        });
    }
}
