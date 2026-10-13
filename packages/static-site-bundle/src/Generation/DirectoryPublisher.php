<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Generation;

use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Filesystem\Path;

/** @internal Owns replacement, locking and rollback of the export directory. */
final readonly class DirectoryPublisher
{
    public function __construct(
        private Filesystem $filesystem,
        private string $projectDir,
        private string $outputDir,
    ) {}

    /**
     * @param callable(StagingDirectory): int $write Receives an empty, write-once staging directory.
     * @param (callable(string): void)|null $afterActivation Private diagnostics written under the lock; failure is a warning.
     */
    public function publish(callable $write, ?callable $afterActivation = null): PublicationResult
    {
        $fs = $this->filesystem;
        $output = Path::canonicalize($this->outputDir);
        $var = Path::canonicalize($this->projectDir . '/var');
        if (!Path::isAbsolute($output) || !str_starts_with($output, $var . '/')) {
            throw new \RuntimeException('output_dir must be a dedicated directory inside the project var/ directory.');
        }
        $relative = substr($output, strlen($var) + 1);
        if (in_array(explode('/', $relative)[0], ['cache', 'log', 'ssg'], true)) {
            throw new \RuntimeException('output_dir must not overwrite cache/, log/ or ssg/.');
        }
        $this->rejectSymlinkAncestors($output);
        $this->rejectSymlinkAncestors($var . '/ssg');
        $fs->mkdir([$var . '/ssg', dirname($output)]);
        $lock = fopen($var . '/ssg/' . hash('sha256', $output) . '.lock', 'c');
        if ($lock === false) {
            throw new \RuntimeException('Cannot open build lock.');
        }
        if (!flock($lock, LOCK_EX | LOCK_NB)) {
            fclose($lock);
            throw new \RuntimeException('Another build is publishing this output directory.');
        }
        $stage = null;
        $backup = null;
        $activated = false;
        $failure = null;
        $cleanupErrors = [];
        $count = 0;
        try {
            $stage = $output . '.staging-' . bin2hex(random_bytes(8));
            $backup = $output . '.backup-' . bin2hex(random_bytes(8));
            if (
                file_exists($output)
                && (
                    !is_dir($output)
                    || !is_file($output . '/.ssg-owned')
                    || is_link($output . '/.ssg-owned')
                    || !preg_match(
                        '/\Astatic-site-bundle\n(?:[a-f0-9]{32}\n)?\z/',
                        file_get_contents($output . '/.ssg-owned') ?: '',
                    )
                )
            ) {
                throw new \RuntimeException('Refusing to replace an output directory not created by this bundle.');
            }
            $fs->mkdir($stage);
            $count = $write(new StagingDirectory($fs, $stage));
            $buildId = bin2hex(random_bytes(16));
            $fs->dumpFile($stage . '/.ssg-owned', "static-site-bundle\n" . $buildId . "\n");
            if (is_dir($output)) {
                $fs->rename($output, $backup);
            }
            $fs->rename($stage, $output);
            $activated = true;
            try {
                if ($afterActivation !== null) {
                    $afterActivation($buildId);
                }
            } catch (\Throwable $error) {
                $cleanupErrors[] = 'Build diagnostics unavailable: ' . $error->getMessage();
            }
        } catch (\Throwable $error) {
            $failure = $error;
            if ($backup !== null && is_dir($backup)) {
                try {
                    $fs->rename($backup, $output);
                } catch (\Throwable $rollbackError) {
                    $cleanupErrors[] =
                        'Rollback failed; previous export retained at ' . $backup . ': ' . $rollbackError->getMessage();
                }
            }
        } finally {
            // Cleanup must not decide whether the already-activated export succeeded.
            if ($activated && $backup !== null) {
                try {
                    $fs->remove($backup);
                } catch (\Throwable $error) {
                    $cleanupErrors[] = 'Backup cleanup failed at ' . $backup . ': ' . $error->getMessage();
                }
            }
            if ($stage !== null) {
                try {
                    $fs->remove($stage);
                } catch (\Throwable $error) {
                    $cleanupErrors[] = 'Staging cleanup failed at ' . $stage . ': ' . $error->getMessage();
                }
            }
            try {
                if (!flock($lock, LOCK_UN)) {
                    $cleanupErrors[] = 'Build lock could not be explicitly released.';
                }
            } catch (\Throwable $error) {
                $cleanupErrors[] = 'Build lock release failed: ' . $error->getMessage();
            } finally {
                try {
                    if (!fclose($lock)) {
                        $cleanupErrors[] = 'Build lock could not be closed.';
                    }
                } catch (\Throwable $error) {
                    $cleanupErrors[] = 'Build lock close failed: ' . $error->getMessage();
                }
            }
        }
        if ($failure !== null) {
            throw $cleanupErrors === [] ? $failure : new PublicationFailure($failure, $cleanupErrors);
        }
        return new PublicationResult($count, $cleanupErrors);
    }

    private function rejectSymlinkAncestors(string $path): void
    {
        do {
            if (is_link($path)) {
                throw new \RuntimeException('Symbolic links are not allowed in export paths: ' . $path);
            }
            $parent = dirname($path);
            if ($parent === $path) {
                break;
            }
            $path = $parent;
        } while (true);
    }
}
