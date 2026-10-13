<?php

declare(strict_types=1);

namespace BundleDocs\Provider;

use BundleDocs\Content\Catalog;
use CJean\StaticSiteBundle\Provider\RouteProviderInterface;

final readonly class Pages implements RouteProviderInterface
{
    public function __construct(
        private Catalog $catalog,
    ) {}

    public function parameters(string $routeName): iterable
    {
        foreach ($this->catalog->pages() as $page) {
            if ($routeName === 'docs' && $page['url'] === '/') {
                continue;
            }
            yield ['slug' => ltrim($page['url'], '/') ?: 'index'];
        }
    }
}
