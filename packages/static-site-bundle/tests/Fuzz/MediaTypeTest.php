<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Tests\Fuzz;

use CJean\StaticSiteBundle\Format\BufferedTextFormat;
use CJean\StaticSiteBundle\Format\FormatRegistry;
use PHPUnit\Framework\Attributes\Group;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\Response;

#[Group('fuzz')]
final class MediaTypeTest extends TestCase
{
    public function testCaseWhitespaceAndParametersPreserveSelection(): void
    {
        $corpus = new Corpus();
        for ($case = 0; $case < $corpus->cases; ++$case) {
            $type = 'application/x-' . $corpus->token() . $corpus->pick(['+json', '.data', '-text', '_document']);
            $declared = $corpus->pick([' ', "\t", '']) . strtoupper($type) . $corpus->pick([' ', "\t", '']);
            $format = self::format($declared);
            $response = new Response($corpus->bytes(), headers: [
                'Content-Type' =>
                    $corpus->pick([$type, strtoupper($type)])
                        . $corpus->pick(['', '; charset=UTF-8', '; charset=utf-8; version=1']),
            ]);
            $result = new FormatRegistry([$format])->export($response, '/data');
            self::assertSame([$type], $format->mediaTypes(), $corpus->describe($case, $declared));
            self::assertSame($response->getContent(), $result->content, $corpus->describe($case, $declared));
            try {
                new FormatRegistry([$format, self::format($type)]);
            } catch (\LogicException) {
                self::assertTrue(true);
                continue;
            }
            self::fail('Normalized duplicates accepted: ' . $corpus->describe($case, $declared));
        }
    }

    public function testMalformedDeclarationsAreRejected(): void
    {
        $corpus = new Corpus();
        for ($case = 0; $case < $corpus->cases; ++$case) {
            $type =
                'text/x-'
                . $corpus->token()
                . $corpus->pick(['; charset=UTF-8', '/', ' space', "\0", "\r\nInjected: yes", '"', '\\', '%00']);
            try {
                new FormatRegistry([self::format($type)]);
            } catch (\InvalidArgumentException) {
                self::assertTrue(true);
                continue;
            }
            self::fail($corpus->describe($case, $type));
        }
    }

    private static function format(string $type): BufferedTextFormat
    {
        return new class($type) extends BufferedTextFormat {
            public function __construct(string $type)
            {
                parent::__construct('custom', 'txt', [$type]);
            }
        };
    }
}
