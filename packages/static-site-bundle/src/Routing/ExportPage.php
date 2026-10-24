<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Routing;

/** A discovered request, read-only. The output path is determined only after rendering. */
final readonly class ExportPage
{
    public function __construct(
        public string $routeName,
        public string $url,
        public ?bool $sitemap = null,
        public ?string $provider = null,
        public array $parameters = [],
    ) {}
}
