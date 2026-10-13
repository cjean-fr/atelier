<?php

declare(strict_types=1);

namespace Demo\Provider;

use CJean\StaticSiteBundle\Provider\RouteProviderInterface;

final class ArticleProvider implements RouteProviderInterface
{
    public const array ARTICLES = ['bonjour-symfony' => 'Bonjour Symfony', 'mon-site-statique' => 'Mon site statique'];

    public function parameters(string $routeName): iterable
    {
        foreach (array_keys(self::ARTICLES) as $slug) {
            yield ['slug' => $slug];
        }
    }
}
