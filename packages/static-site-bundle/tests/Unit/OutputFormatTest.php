<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Tests\Unit;

use CJean\StaticSiteBundle\Format\BufferedTextFormat;
use CJean\StaticSiteBundle\Format\FormatRegistry;
use CJean\StaticSiteBundle\Format\HtmlFormat;
use CJean\StaticSiteBundle\Format\JsonFormat;
use CJean\StaticSiteBundle\Format\MarkdownFormat;
use CJean\StaticSiteBundle\Format\OutputFormatInterface;
use CJean\StaticSiteBundle\Format\TextFormat;
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
        yield [new TextFormat(), '/robots.txt', 'robots.txt', 'text/plain', '', false];
        yield [new MarkdownFormat(), '/guide.md', 'guide.md', 'text/markdown', '# Hello', false];
        yield [new MarkdownFormat(), '/guide', 'guide.md', 'text/markdown; charset=utf-8', '# Hello', false];
        yield [new JsonFormat(), '/', 'index.json', 'application/json', '[]', false];
    }

    #[DataProvider('formats')]
    public function testPathsAndBytes(
        OutputFormatInterface $format,
        string $url,
        string $file,
        string $mime,
        string $bytes,
        bool $sitemap,
    ): void {
        $result = new FormatRegistry([$format])->export(new Response($bytes, 200, ['Content-Type' => $mime]), $url);
        self::assertSame($file, $result->file);
        self::assertSame($bytes, $result->content);
        self::assertSame($sitemap, $result->includeInSitemap);
    }

    public function testInvalidJsonFails(): void
    {
        $this->expectException(\JsonException::class);
        new JsonFormat()->render(new Response('{broken}', 200, ['Content-Type' => 'application/json']));
    }

    public function testWrongMediaTypeFails(): void
    {
        $this->expectException(\RuntimeException::class);
        new TextFormat()->render(new Response('<p>HTML</p>', 200, ['Content-Type' => 'text/html']));
    }

    public function testWrongExtensionFails(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        new JsonFormat()->outputPath('/page.html');
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

    public function testAdapterDeclarationsAndResponsesUseTheSameMimeContract(): void
    {
        $csv = new class extends BufferedTextFormat {
            public function __construct()
            {
                parent::__construct('csv', 'csv', [' Text/CSV ']);
            }
        };
        $response = new Response('id,name', 200, ['Content-Type' => 'TEXT/CSV; charset=UTF-8']);
        self::assertSame(['text/csv'], $csv->mediaTypes());
        self::assertSame('id,name', $csv->render($response));
        self::assertSame('data.csv', new FormatRegistry([$csv])->export($response, '/data')->file);
    }

    public function testDuplicateDeclarationsAfterNormalizationFail(): void
    {
        $csv = new class extends BufferedTextFormat {
            public function __construct()
            {
                parent::__construct('csv', 'csv', ['Text/CSV', ' text/csv ']);
            }
        };
        $this->expectException(\LogicException::class);
        new FormatRegistry([$csv]);
    }

    public function testDuplicateMediaTypesFail(): void
    {
        $this->expectException(\LogicException::class);
        new FormatRegistry([new HtmlFormat(), new HtmlFormat()]);
    }

    public static function mimeControls(): iterable
    {
        yield 'trailing NUL' => ["text/plain\0"];
        yield 'trailing newline' => ["text/plain\n"];
        yield 'leading CRLF' => ["\r\ntext/plain"];
    }

    #[DataProvider('mimeControls')]
    public function testMimeControlBytesAreNotNormalizedAway(string $type): void
    {
        $this->expectException(\InvalidArgumentException::class);
        new class($type) extends BufferedTextFormat {
            public function __construct(string $type)
            {
                parent::__construct('text', 'txt', [$type]);
            }
        };
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
