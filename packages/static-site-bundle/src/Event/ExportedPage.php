<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Event;

use CJean\StaticSiteBundle\Routing\ExportPage;

/** A page written to the export: its request, its file relative to the output root and the final sitemap choice. */
final readonly class ExportedPage
{
    public function __construct(
        public ExportPage $page,
        public string $file,
        public bool $inSitemap,
    ) {}
}
