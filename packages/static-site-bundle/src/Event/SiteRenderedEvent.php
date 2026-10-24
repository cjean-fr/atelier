<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Event;

use CJean\StaticSiteBundle\Generation\StagingDirectory;
use Symfony\Contracts\EventDispatcher\Event;

/**
 * Dispatched when every page is written, before the export replaces the previous one.
 * Listeners add whole-site files (sitemap, feeds, search index...); a failure keeps the previous export.
 */
final class SiteRenderedEvent extends Event
{
    /** @param list<ExportedPage> $pages */
    public function __construct(
        public readonly array $pages,
        private readonly StagingDirectory $staging,
    ) {}

    /** Same rules as pages: safe relative path, no collision with a page, an asset or another added file. */
    public function write(string $file, string $content): void
    {
        $this->staging->write($file, $content);
    }
}
