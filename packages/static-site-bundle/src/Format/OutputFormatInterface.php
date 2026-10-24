<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Format;

use Symfony\Component\HttpFoundation\Response;

/**
 * Specific rules for one Symfony request format; a format without one is exported as is.
 * A format validates a response and returns its bytes; it does not write files.
 */
interface OutputFormatInterface
{
    /** Symfony request format, e.g. "json": framework.request.formats maps it to its media types. */
    public function name(): string;

    /** @param string $mediaType The response media type, lowercase and without parameters. */
    public function outputPath(string $url, string $mediaType): string;

    public function render(Response $response): string;

    public function includeInSitemap(): bool;
}
