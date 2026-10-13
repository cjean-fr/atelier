<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Provider;

interface RouteProviderInterface
{
    /** @return iterable<array<string, string|int|float|bool>|RouteParameters> */
    public function parameters(string $routeName): iterable;
}
