<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Tests\Fuzz;

use Random\Engine\Mt19937;
use Random\Randomizer;

/** Reproducible input generation; every failure reports the seed and case. */
final class Corpus
{
    public readonly int $seed;
    public readonly int $cases;
    private readonly Randomizer $random;

    public function __construct()
    {
        $this->seed = self::setting('SSG_FUZZ_SEED', 20_261_012, 0, 2_147_483_647);
        $this->cases = self::setting('SSG_FUZZ_CASES', 200, 1, 100_000);
        $this->random = new Randomizer(new Mt19937($this->seed));
    }

    /** @param non-empty-list<string> $values */
    public function pick(array $values): string
    {
        return $values[$this->random->getInt(0, count($values) - 1)];
    }

    public function token(): string
    {
        return bin2hex($this->random->getBytes($this->random->getInt(1, 16)));
    }

    public function bytes(): string
    {
        return $this->random->getBytes($this->random->getInt(1, 64));
    }

    public function describe(int $case, string $input): string
    {
        return sprintf(
            'SSG_FUZZ_SEED=%d SSG_FUZZ_CASES=%d case=%d input(hex)=%s',
            $this->seed,
            $this->cases,
            $case,
            bin2hex($input),
        );
    }

    private static function setting(string $name, int $default, int $min, int $max): int
    {
        $value = getenv($name);
        if ($value === false) {
            return $default;
        }
        $number = filter_var($value, FILTER_VALIDATE_INT, ['options' => ['min_range' => $min, 'max_range' => $max]]);
        if ($number === false) {
            throw new \InvalidArgumentException(sprintf('%s must be an integer between %d and %d.', $name, $min, $max));
        }
        return $number;
    }
}
