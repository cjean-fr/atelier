<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Attribute;

/**
 * Selects a controller action for static export, optionally for one named route.
 * $sitemap: null follows the format (HTML only); a provider can still decide per parameter set with RouteParameters.
 */
#[\Attribute(\Attribute::TARGET_METHOD | \Attribute::IS_REPEATABLE)]
final readonly class StaticPage
{
    public function __construct(
        public ?string $provider = null,
        public ?string $route = null,
        public ?bool $sitemap = null,
    ) {}
}
