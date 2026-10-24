<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Attribute;

/**
 * Selects a controller action for static export, optionally for one named route.
 * On a class, it selects the GET actions that carry no StaticPage attribute of their own.
 * $sitemap: null follows the format (HTML only); a provider can still decide per parameter set with RouteParameters.
 * $parameters: inline parameter sets, for short fixed lists that do not justify a provider.
 */
#[\Attribute(\Attribute::TARGET_METHOD | \Attribute::TARGET_CLASS | \Attribute::IS_REPEATABLE)]
final readonly class StaticPage
{
    /** Route default selecting a route whose controller cannot carry the attribute (TemplateController, ...). */
    public const string ROUTE_DEFAULT = '_static_page';

    /** @param list<array<string, scalar>>|null $parameters */
    public function __construct(
        public ?string $provider = null,
        public ?string $route = null,
        public ?bool $sitemap = null,
        public ?array $parameters = null,
    ) {
        if ($provider !== null && $parameters !== null) {
            throw new \LogicException('StaticPage accepts a provider or inline parameters, not both.');
        }
    }
}
