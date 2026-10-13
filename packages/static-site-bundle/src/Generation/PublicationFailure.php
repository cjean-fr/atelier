<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Generation;

/** @internal Keeps the original failure and reports additional recovery failures. */
final class PublicationFailure extends \RuntimeException
{
    /** @param list<string> $recoveryErrors */
    public function __construct(
        \Throwable $original,
        public readonly array $recoveryErrors,
    ) {
        parent::__construct(
            $original->getMessage() . "\nRecovery incomplete: " . implode('; ', $recoveryErrors),
            previous: $original,
        );
    }
}
