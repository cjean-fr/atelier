<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Tests\Fuzz;

use CJean\StaticSiteBundle\Format\FormatRegistry;
use PHPUnit\Framework\Attributes\Group;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\Response;

#[Group('fuzz')]
final class MediaTypeTest extends TestCase
{
    public function testCaseAndParametersPreserveSelection(): void
    {
        $corpus = new Corpus();
        for ($case = 0; $case < $corpus->cases; ++$case) {
            $name = 'fuzz' . $case;
            $type = 'application/x-' . $corpus->token() . $corpus->pick(['+json', '.data', '-text', '_document']);
            $registry = new FormatRegistry([], [$name => $type]);
            $response = new Response($corpus->bytes(), headers: [
                'Content-Type' =>
                    $corpus->pick([$type, strtoupper($type)])
                        . $corpus->pick(['', '; charset=UTF-8', '; charset=utf-8; version=1']),
            ]);
            $result = $registry->export($response, '/data');
            self::assertSame('data.' . $name, $result->file, $corpus->describe($case, $type));
            self::assertSame($response->getContent(), $result->content, $corpus->describe($case, $type));
        }
    }

    public function testMalformedContentTypesAreRejected(): void
    {
        $corpus = new Corpus();
        $registry = new FormatRegistry([]);
        for ($case = 0; $case < $corpus->cases; ++$case) {
            $type = 'text/plain' . $corpus->pick(['/', ' space', "\0", "\r\nInjected: yes", '"', '\\', '%00']);
            try {
                $registry->export(new Response('x', headers: ['Content-Type' => $type]), '/data');
            } catch (\RuntimeException|\InvalidArgumentException) {
                self::assertTrue(true);
                continue;
            }
            self::fail($corpus->describe($case, $type));
        }
    }
}
