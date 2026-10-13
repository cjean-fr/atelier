<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Tests\Unit;

use CJean\StaticSiteBundle\Routing\OutputPath;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

final class OutputPathTest extends TestCase
{
    public static function validPaths(): iterable
    {
        yield ['/', 'index.html'];
        yield ['/blog/article', 'blog/article/index.html'];
        yield ['/blog/article/', 'blog/article/index.html'];
        yield ['/about.html', 'about.html'];
        yield ['/caf%C3%A9', 'café/index.html'];
    }

    public static function unsafePaths(): iterable
    {
        foreach ([
            'https://elsewhere.test/',
            '//elsewhere.test',
            '/../secret',
            '/%2e%2e/secret',
            '/%252e%252e/secret',
            '/a%5cb',
            '/a%00b',
            '/.env',
            '/a//b',
            '/page?x=1',
            '/page#fragment',
            '/index.php',
        ] as $url) {
            yield [$url];
        }
    }

    #[DataProvider('validPaths')]
    public function testMapping(string $url, string $file): void
    {
        self::assertSame($file, OutputPath::fromUrl($url));
    }

    #[DataProvider('unsafePaths')]
    public function testRejectsUnsafePaths(string $url): void
    {
        $this->expectException(\InvalidArgumentException::class);
        OutputPath::fromUrl($url);
    }
}
