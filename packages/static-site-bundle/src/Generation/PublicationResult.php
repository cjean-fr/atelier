<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Generation;

/** @internal A completed activation, optionally followed by incomplete cleanup. */
final readonly class PublicationResult
{
    /** @param list<string> $warnings */
    public function __construct(
        public int $files,
        public array $warnings = [],
    ) {}
}
