<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Generation;

/** @internal Shared XML generation and splitting for static export and SSR. */
final readonly class SitemapGenerator
{
    private const MAX_URLS = 50_000;
    private const MAX_BYTES = 52_428_800;

    public function __construct(
        private string $baseUrl = 'https://localhost',
    ) {}

    /** @param list<string> $locations */
    public function generate(array $locations): ?string
    {
        return $this->documents($locations)['sitemap.xml'] ?? null;
    }

    /**
     * @param list<string> $locations
     * @return array<string, string>
     */
    public function documents(array $locations): array
    {
        if ($locations === [])
            return [];
        $header = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
        $chunks = [];
        $body = '';
        $count = 0;
        foreach ($locations as $url) {
            $entry = '<url><loc>' . htmlspecialchars($url, ENT_XML1 | ENT_QUOTES, 'UTF-8') . '</loc></url>';
            if ((strlen($header) + strlen($entry) + strlen('</urlset>')) > self::MAX_BYTES) {
                throw new \RuntimeException('A sitemap URL exceeds the XML size limit.');
            }
            if (
                $count === self::MAX_URLS
                || (strlen($header) + strlen($body) + strlen($entry) + strlen('</urlset>')) > self::MAX_BYTES
            ) {
                $chunks[] = $header . $body . '</urlset>';
                $body = '';
                $count = 0;
            }
            $body .= $entry;
            ++$count;
        }
        $chunks[] = $header . $body . '</urlset>';
        if (count($chunks) === 1)
            return ['sitemap.xml' => $chunks[0]];
        if (count($chunks) > self::MAX_URLS)
            throw new \RuntimeException('Too many sitemap index entries.');
        $documents = [];
        $index = '<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
        foreach ($chunks as $i => $chunk) {
            $file = 'sitemap-' . ($i + 1) . '.xml';
            $documents[$file] = $chunk;
            $index .=
                '<sitemap><loc>'
                . htmlspecialchars(rtrim($this->baseUrl, '/') . '/' . $file, ENT_XML1 | ENT_QUOTES, 'UTF-8')
                . '</loc></sitemap>';
        }
        $index .= '</sitemapindex>';
        if (strlen($index) > self::MAX_BYTES)
            throw new \RuntimeException('Sitemap index exceeds the XML size limit.');
        $documents['sitemap.xml'] = $index;
        return $documents;
    }
}
