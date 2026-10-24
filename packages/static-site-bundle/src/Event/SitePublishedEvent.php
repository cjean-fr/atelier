<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Event;

use Symfony\Contracts\EventDispatcher\Event;

/**
 * Dispatched once the new export is active. A listener failure is reported as a warning: the export stays published.
 */
final class SitePublishedEvent extends Event
{
    /** @param list<ExportedPage> $pages */
    public function __construct(
        public readonly string $buildId,
        public readonly array $pages,
    ) {}
}
