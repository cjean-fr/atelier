<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Generation;

use CJean\StaticSiteBundle\Event\ExportedPage;
use CJean\StaticSiteBundle\Event\SitePublishedEvent;
use CJean\StaticSiteBundle\Event\SiteRenderedEvent;
use CJean\StaticSiteBundle\Routing\RoutePlanner;
use Symfony\Contracts\EventDispatcher\EventDispatcherInterface;

/**
 * @internal Coordinates one complete static build: request discovery completes before rendering; output paths follow
 * the responses. Whole-site files such as the sitemap are added by SiteRenderedEvent listeners.
 */
final readonly class SiteBuilder
{
    public function __construct(
        private RoutePlanner $planner,
        private PageRenderer $renderer,
        private DirectoryPublisher $publisher,
        private AssetExporter $assets,
        private ?BuildReportStore $reports = null,
        private ?EventDispatcherInterface $events = null,
    ) {}

    public function build(): PublicationResult
    {
        $pages = $this->planner->pages();
        if ($pages === []) {
            throw new \RuntimeException('No SSG routes selected. The previous build has been preserved.');
        }
        $exported = [];
        return $this->publisher->publish(function (StagingDirectory $staging) use ($pages, &$exported): int {
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
                $exported[] = new ExportedPage($page, $rendered->file, $rendered->includeInSitemap);
            }
            $this->events?->dispatch(new SiteRenderedEvent($exported, $staging));
            return count($pages);
        }, function (string $id) use ($pages, &$exported): void {
            $this->events?->dispatch(new SitePublishedEvent($id, $exported));
            $this->reports?->save($id, $pages);
        });
    }
}
