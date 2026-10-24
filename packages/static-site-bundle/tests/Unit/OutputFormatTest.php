<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Tests\Unit;

use CJean\StaticSiteBundle\Format\BufferedTextFormat;
use CJean\StaticSiteBundle\Format\FormatRegistry;
use CJean\StaticSiteBundle\Format\HtmlFormat;
use CJean\StaticSiteBundle\Format\JsonFormat;
use CJean\StaticSiteBundle\Format\OutputFormatInterface;
use CJean\StaticSiteBundle\Routing\OutputPath;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\Response;

/** @mago-expect lint:too-many-methods Tests exercise one output-format contract. */
final class OutputFormatTest extends TestCase
{
    public static function formats(): iterable
    {
        yield [new HtmlFormat(), '/hello/', 'hello/index.html', 'text/html; charset=UTF-8', '<p>Hello</p>', true];
        yield [new JsonFormat(), '/data.json', 'data.json', 'application/json', '{"n":12345678901234567890}', false];
        yield [new JsonFormat(), '/data', 'data.json', 'application/json', 'null', false];
        yield [null, '/robots.txt', 'robots.txt', 'text/plain', '', false];
        yield [null, '/data.csv', 'data.csv', 'text/csv', "id\n1\n", false];
        yield [null, '/feed.xml', 'feed.xml', 'application/rss+xml', '<rss/>', false];
        yield [null, '/feed', 'feed.rss', 'application/rss+xml', '<rss/>', false];
        yield [null, '/person.json', 'person.json', 'application/ld+json', '{}', false];
        yield [null, '/guide.md', 'guide.md', 'text/markdown', '# Hello', false];
        yield [null, '/guide', 'guide.md', 'text/markdown; charset=utf-8', '# Hello', false];
        yield [null, '/page', 'page/index.html', 'application/xhtml+xml', '<html/>', true];
        yield [new JsonFormat(), '/', 'index.json', 'application/json', '[]', false];
    }

    #[DataProvider('formats')]
    public function testPathsAndBytes(
        ?OutputFormatInterface $format,
        string $url,
        string $file,
        string $mime,
        string $bytes,
        bool $sitemap,
    ): void {
        // Any Symfony request format exports without a class; Markdown comes from framework.request.formats.
        $formats = $format === null ? [] : [$format];
        $result = new FormatRegistry($formats, ['md' => 'text/markdown'])->export(new Response($bytes, 200, [
            'Content-Type' => $mime,
        ]), $url);
        self::assertSame($file, $result->file);
        self::assertSame($bytes, $result->content);
        self::assertSame($sitemap, $result->includeInSitemap);
    }

    public function testInvalidJsonFails(): void
    {
        $this->expectException(\JsonException::class);
        new JsonFormat()->render(new Response('{broken}', 200, ['Content-Type' => 'application/json']));
    }

    public function testWrongExtensionFails(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        new JsonFormat()->outputPath('/page.html', 'application/json');
    }

    public function testUnknownFormatFails(): void
    {
        $this->expectException(\RuntimeException::class);
        new FormatRegistry([new HtmlFormat()])->export(new Response('unknown', 200, [
            'Content-Type' => 'application/x-unknown',
        ]), '/data');
    }

    public function testMissingContentTypeDoesNotSilentlyDefaultToHtml(): void
    {
        $this->expectException(\RuntimeException::class);
        new FormatRegistry([new HtmlFormat()])->export(new Response('untyped'), '/data');
    }

    public function testMimeParametersAndCaseDoNotAffectResolution(): void
    {
        $json = new JsonFormat();
        $registry = new FormatRegistry([$json]);
        $result = $registry->export(new Response('{}', 200, [
            'Content-Type' => 'Application/JSON; charset=UTF-8',
        ]), '/data');
        self::assertSame('data.json', $result->file);
        self::assertSame('{}', $result->content);
    }

    public function testApplicationFormatsNeedNoClass(): void
    {
        $registry = new FormatRegistry([], ['ndjson' => 'application/x-ndjson']);
        $response = new Response("{}\n", 200, ['Content-Type' => 'Application/X-NDJSON; charset=UTF-8']);
        self::assertSame('events.ndjson', $registry->export($response, '/events')->file);
    }

    public function testAClassAddsRulesToASymfonyFormat(): void
    {
        $csv = new class extends BufferedTextFormat {
            public function __construct()
            {
                parent::__construct('csv');
            }

            public function render(Response $response): string
            {
                return strtoupper(parent::render($response));
            }
        };
        $response = new Response('id,name', 200, ['Content-Type' => 'TEXT/CSV; charset=UTF-8']);
        $result = new FormatRegistry([$csv])->export($response, '/data');
        self::assertSame('data.csv', $result->file);
        self::assertSame('ID,NAME', $result->content);
    }

    public function testDuplicateFormatsFail(): void
    {
        $this->expectException(\LogicException::class);
        new FormatRegistry([new HtmlFormat(), new HtmlFormat()]);
    }

    public static function unsafeFiles(): iterable
    {
        foreach ([
            '../outside.csv',
            '/outside.csv',
            'folder/../outside.csv',
            'a\\b.csv',
            'a%2fb.csv',
            'index.php',
            'folder//a.csv',
            '.env',
            "a\0.csv",
        ] as $file) {
            yield [$file];
        }
    }

    #[DataProvider('unsafeFiles')]
    public function testCustomOutputPathsAreValidated(string $file): void
    {
        $this->expectException(\InvalidArgumentException::class);
        OutputPath::validateFile($file);
    }
}
