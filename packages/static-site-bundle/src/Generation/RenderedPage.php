<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Generation;

/** @internal Fully validated output, ready to be written. */
final readonly class RenderedPage
{
    public function __construct(
        public string $file,
        public string $content,
        public bool $includeInSitemap,
    ) {}
}
