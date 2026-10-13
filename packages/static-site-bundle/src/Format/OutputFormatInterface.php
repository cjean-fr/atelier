<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Format;

use Symfony\Component\HttpFoundation\Response;

/** A format validates a response and returns its bytes; it does not write files. */
interface OutputFormatInterface
{
    /** @return list<string> Exact media types, without charset parameters. */
    public function mediaTypes(): array;

    public function outputPath(string $url): string;

    public function render(Response $response): string;

    public function includeInSitemap(): bool;
}
