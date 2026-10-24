<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Tests\Fuzz;

use CJean\StaticSiteBundle\Format\BufferedTextFormat;
use CJean\StaticSiteBundle\Format\FormatRegistry;
use CJean\StaticSiteBundle\Format\HtmlFormat;
use CJean\StaticSiteBundle\Generation\StagingDirectory;
use CJean\StaticSiteBundle\Routing\OutputPath;
use PHPUnit\Framework\Attributes\Group;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\Response;

#[Group('fuzz')]
final class OutputSafetyTest extends TestCase
{
    public function testGeneratedSafePathsPreserveMappingAndContent(): void
    {
        $corpus = new Corpus();
        $registry = new FormatRegistry([new HtmlFormat()]);
        for ($case = 0; $case < $corpus->cases; ++$case) {
            $segment = $corpus->token() . $corpus->pick(['', '-café', '-漢字', '-é', '-#chapter']);
            $url = '/' . $corpus->token() . '/' . rawurlencode($segment);
            $bytes = $corpus->bytes();
            $result = $registry->export(new Response($bytes, headers: ['Content-Type' => 'text/html']), $url);
            self::assertSame(
                rawurldecode(substr($url, 1)) . '/index.html',
                $result->file,
                $corpus->describe($case, $url),
            );
            self::assertSame($bytes, $result->content, $corpus->describe($case, $url));
        }
    }

    public function testUnsafeUrlMutationsAreRejectedThroughTheFormatRegistry(): void
    {
        $corpus = new Corpus();
        $registry = new FormatRegistry([new HtmlFormat()]);
        for ($case = 0; $case < $corpus->cases; ++$case) {
            $url =
                '/'
                . $corpus->token()
                . '/'
                . $corpus->pick([
                    '..',
                    '%2e%2e',
                    '%252e%252e',
                    '.env',
                    '%2Ehidden',
                    '%00',
                    '%1f',
                    '%7F',
                    '%5c',
                    '%25',
                    '%2f',
                    '%3f',
                ])
                . '/page';
            try {
                $registry->export(new Response('html', headers: ['Content-Type' => 'text/html']), $url);
            } catch (\InvalidArgumentException) {
                self::assertTrue(true);
                continue;
            }
            self::fail($corpus->describe($case, $url));
        }
    }

    public function testArbitraryBytesEitherFailOrProduceAConfinedOutputPath(): void
    {
        $corpus = new Corpus();
        for ($case = 0; $case < $corpus->cases; ++$case) {
            $url = '/' . $corpus->bytes();
            try {
                $file = OutputPath::fromUrl($url);
            } catch (\InvalidArgumentException) {
                self::assertTrue(true);
                continue;
            }
            $context = $corpus->describe($case, $url);
            self::assertNotSame('', $file, $context);
            foreach (explode('/', $file) as $segment) {
                self::assertNotSame('', $segment, $context);
                self::assertNotSame('.', substr($segment, 0, 1), $context);
                foreach (str_split($segment) as $byte) {
                    self::assertGreaterThanOrEqual(32, ord($byte), $context);
                    self::assertNotSame(127, ord($byte), $context);
                    self::assertStringNotContainsString($byte, '\\<>:"|?*%', $context);
                }
            }
        }
    }

    public function testCustomFormatCannotWriteOutsideStaging(): void
    {
        $corpus = new Corpus();
        $fs = new Filesystem();
        $root = sys_get_temp_dir() . '/ssg-fuzz-' . bin2hex(random_bytes(6));
        $fs->mkdir($root . '/stage');
        $fs->dumpFile($root . '/sentinel.txt', 'untouched');
        try {
            for ($case = 0; $case < $corpus->cases; ++$case) {
                $file = $corpus->pick([
                    '../sentinel.txt',
                    'nested/../../sentinel.txt',
                    '/sentinel.txt',
                    'nested\\sentinel.txt',
                    '.hidden/a.txt',
                    'nested//a.txt',
                    'nested/%2e%2e/a.txt',
                    'index.PHP',
                    "a\0.txt",
                ]);
                $format = new class($file) extends BufferedTextFormat {
                    public function __construct(
                        private readonly string $file,
                    ) {
                        parent::__construct('txt');
                    }

                    public function outputPath(string $url, string $mediaType): string
                    {
                        return $this->file;
                    }
                };
                try {
                    $result = new FormatRegistry([$format])->export(new Response('overwrite', headers: [
                        'Content-Type' => 'text/plain',
                    ]), '/' . $corpus->token());
                    new StagingDirectory($fs, $root . '/stage')->write($result->file, $result->content);
                } catch (\InvalidArgumentException) {
                    self::assertSame(
                        'untouched',
                        file_get_contents($root . '/sentinel.txt'),
                        $corpus->describe($case, $file),
                    );
                    continue;
                }
                self::fail($corpus->describe($case, $file));
            }
            self::assertSame([], iterator_to_array(new \FilesystemIterator($root . '/stage')));
        } finally {
            $fs->remove($root);
        }
    }
}
