<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Controller;

use CJean\StaticSiteBundle\Generation\SitemapService;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/** @internal Serves the cached shared sitemap; outside prod it is computed on demand even before any static build. */
final readonly class SitemapController
{
    public function __construct(
        private SitemapService $sitemap,
    ) {}

    public function __invoke(?string $part = null): Response
    {
        $file = $part === null ? 'sitemap.xml' : 'sitemap-' . $part . '.xml';
        $documents = $this->sitemap->documents();
        if (!isset($documents[$file])) {
            throw new NotFoundHttpException('No sitemap available for this site or part.');
        }
        return new Response($documents[$file], headers: [
            'Content-Type' => 'application/xml; charset=UTF-8',
            'Cache-Control' => 'no-cache',
        ]);
    }
}
