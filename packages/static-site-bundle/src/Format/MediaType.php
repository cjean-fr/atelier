<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Format;

use Symfony\Component\HttpFoundation\Response;

/** @internal The same MIME contract applies to declarations and response selection. */
final class MediaType
{
    public static function declaration(string $type): string
    {
        $type = strtolower(trim($type, " \t"));
        if (!preg_match('~\A[a-z0-9!#$&^_.+-]+/[a-z0-9!#$&^_.+-]+\z~', $type)) {
            throw new \InvalidArgumentException('Invalid output media type: ' . $type);
        }
        return $type;
    }

    public static function of(Response $response): string
    {
        $type = explode(';', $response->headers->get('Content-Type') ?? '')[0];
        try {
            return self::declaration($type);
        } catch (\InvalidArgumentException $error) {
            throw new \RuntimeException(
                sprintf('Unsupported or missing response Content-Type "%s".', $type),
                previous: $error,
            );
        }
    }
}
