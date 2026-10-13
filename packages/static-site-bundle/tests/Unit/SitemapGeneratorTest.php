<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Tests\Unit;

use CJean\StaticSiteBundle\Generation\SitemapGenerator;
use PHPUnit\Framework\TestCase;

final class SitemapGeneratorTest extends TestCase
{
    public function testSerializesXmlAndDoesNotCreateAnEmptySitemap(): void
    {
        $generator = new SitemapGenerator();
        self::assertNull($generator->generate([]));
        self::assertStringContainsString(
            '<loc>https://example.test/page?a=1&amp;b=2</loc>',
            $generator->generate(['https://example.test/page?a=1&b=2']),
        );
    }

    public function testSplitsByXmlSizeEvenWithFewerThan50000Urls(): void
    {
        $url = 'https://example.test/' . str_repeat('&', 2000);
        $documents = new SitemapGenerator('https://example.test')->documents(array_fill(0, 6000, $url));
        self::assertCount(3, $documents);
        foreach ($documents as $xml) {
            self::assertLessThanOrEqual(52_428_800, strlen($xml));
        }
        self::assertSame(6000, substr_count($documents['sitemap-1.xml'] . $documents['sitemap-2.xml'], '<url>'));
    }

    public function testSplitsAbove50000UrlsAndBuildsAnIndex(): void
    {
        $generator = new SitemapGenerator('https://example.test');
        $documents = $generator->documents(array_fill(0, 50_001, 'https://example.test/page'));
        self::assertCount(3, $documents);
        self::assertSame(50_000, substr_count($documents['sitemap-1.xml'], '<url>'));
        self::assertSame(1, substr_count($documents['sitemap-2.xml'], '<url>'));
        self::assertStringContainsString('<sitemapindex ', $documents['sitemap.xml']);
        self::assertStringContainsString('https://example.test/sitemap-2.xml', $documents['sitemap.xml']);
    }
}
