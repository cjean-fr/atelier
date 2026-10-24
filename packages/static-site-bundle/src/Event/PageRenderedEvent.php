<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Event;

use CJean\StaticSiteBundle\Routing\ExportPage;
use Symfony\Contracts\EventDispatcher\Event;

/**
 * Dispatched once a response passed its format checks, before it is written.
 * Listeners may replace the content (the format checks are not run again) or exclude the page from the sitemap.
 * $preview is true when the SSR sitemap only inspects the page: nothing is written, the content is discarded.
 */
final class PageRenderedEvent extends Event
{
    public function __construct(
        public readonly ExportPage $page,
        public readonly string $file,
        private string $content,
        private bool $inSitemap,
        public readonly bool $preview = false,
    ) {}

    public function getContent(): string
    {
        return $this->content;
    }

    public function setContent(string $content): void
    {
        $this->content = $content;
    }

    public function isInSitemap(): bool
    {
        return $this->inSitemap;
    }

    /** Exclusion only: the SSR sitemap never inspects pages already excluded by #[StaticPage] or their provider. */
    public function excludeFromSitemap(): void
    {
        $this->inSitemap = false;
    }
}
