<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Provider;

/** One parameter set yielded by a provider, when it must override the sitemap choice of #[StaticPage]. */
final readonly class RouteParameters
{
    /**
     * @param array<string, string|int|float|bool> $parameters
     * @param bool|null $sitemap Null keeps the choice of #[StaticPage], then of the format.
     */
    public function __construct(
        public array $parameters,
        public ?bool $sitemap = null,
    ) {}
}
