<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Tests\Unit;

use CJean\StaticSiteBundle\Generation\DirectoryPublisher;
use CJean\StaticSiteBundle\Generation\PublicationFailure;
use CJean\StaticSiteBundle\Generation\StagingDirectory;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Filesystem\Filesystem;

/** @mago-expect lint:too-many-methods Scenarios cover one publication lifecycle. */
final class DirectoryPublisherTest extends TestCase
{
    private string $root;
    private Filesystem $fs;

    protected function setUp(): void
    {
        $this->root = sys_get_temp_dir() . '/ssg-publication-' . bin2hex(random_bytes(6));
        $this->fs = new Filesystem();
        $this->fs->dumpFile($this->root . '/var/static/.ssg-owned', "static-site-bundle\n");
        $this->fs->dumpFile($this->root . '/var/static/index.html', 'old');
    }

    protected function tearDown(): void
    {
        $this->fs->remove($this->root);
    }

    private function publisher(array $faults = []): DirectoryPublisher
    {
        return new DirectoryPublisher(new FaultingFilesystem($faults), $this->root, $this->root . '/var/static');
    }

    private static function write(StagingDirectory $staging): int
    {
        $staging->write('index.html', 'new');
        return 1;
    }

    private function assertUnlocked(): void
    {
        $path = $this->root . '/var/ssg/' . hash('sha256', $this->root . '/var/static') . '.lock';
        $handle = fopen($path, 'c');
        try {
            self::assertTrue(flock($handle, LOCK_EX | LOCK_NB));
        } finally {
            fclose($handle);
        }
    }

    public function testSuccessfulActivationReturnsResultAndRemovesTemporaryDirectories(): void
    {
        $result = $this->publisher()->publish(self::write(...));
        self::assertSame(1, $result->files);
        self::assertSame([], $result->warnings);
        self::assertSame('new', file_get_contents($this->root . '/var/static/index.html'));
        self::assertSame([], glob($this->root . '/var/static.*-*'));
        $this->assertUnlocked();
    }

    public function testFailedActivationRestoresThePreviousExportAndPreservesItsError(): void
    {
        $error = new \RuntimeException('activation failure');
        try {
            $this->publisher(['activate' => $error])->publish(self::write(...));
            self::fail('Activation must fail.');
        } catch (\RuntimeException $failure) {
            self::assertSame($error, $failure);
        }
        self::assertSame('old', file_get_contents($this->root . '/var/static/index.html'));
        self::assertSame([], glob($this->root . '/var/static.*-*'));
        $this->assertUnlocked();
    }

    public function testRollbackFailureKeepsTheActivationErrorAndTheRecoveryLocation(): void
    {
        $error = new \RuntimeException('activation failure');
        try {
            $this->publisher(['activate' => $error, 'rollback' => new \RuntimeException('rollback failure')])->publish(
                self::write(...),
            );
            self::fail('Activation must fail.');
        } catch (PublicationFailure $failure) {
            self::assertSame($error, $failure->getPrevious());
            self::assertStringStartsWith('activation failure', $failure->getMessage());
            $backup = glob($this->root . '/var/static.backup-*')[0];
            self::assertStringContainsString($backup, $failure->getMessage());
            self::assertSame('old', file_get_contents($backup . '/index.html'));
        }
        self::assertDirectoryDoesNotExist($this->root . '/var/static');
        $this->assertUnlocked();
    }

    public function testStagingCleanupDoesNotMaskTheRenderErrorOrPreventLockRelease(): void
    {
        $error = new \RuntimeException('render failure');
        try {
            $this->publisher(['staging' => new \RuntimeException('staging failure')])->publish(static function () use (
                $error,
            ): int {
                throw $error;
            });
            self::fail('Rendering must fail.');
        } catch (PublicationFailure $failure) {
            self::assertSame($error, $failure->getPrevious());
            self::assertStringStartsWith('render failure', $failure->getMessage());
            self::assertStringContainsString('staging failure', $failure->getMessage());
        }
        self::assertSame('old', file_get_contents($this->root . '/var/static/index.html'));
        $this->assertUnlocked();
    }

    public function testPostActivationCleanupFailureIsASuccessWithWarnings(): void
    {
        $result = $this->publisher([
            'backup' => new \RuntimeException('backup failure'),
            'staging' => new \RuntimeException('staging failure'),
        ])->publish(self::write(...));
        self::assertSame(1, $result->files);
        self::assertCount(2, $result->warnings);
        self::assertStringContainsString('backup failure', $result->warnings[0]);
        self::assertStringContainsString('staging failure', $result->warnings[1]);
        self::assertSame('new', file_get_contents($this->root . '/var/static/index.html'));
        self::assertSame('old', file_get_contents(glob($this->root . '/var/static.backup-*')[0] . '/index.html'));
        $this->assertUnlocked();
    }

    public function testExistingLockPreventsWriting(): void
    {
        $directory = $this->root . '/var/ssg';
        $this->fs->mkdir($directory);
        $lock = fopen($directory . '/' . hash('sha256', $this->root . '/var/static') . '.lock', 'c');
        flock($lock, LOCK_EX);
        try {
            $this->publisher()->publish(static function (): int {
                self::fail('Locked build must not render.');
            });
            self::fail('Expected a locked build to fail.');
        } catch (\RuntimeException $failure) {
            self::assertStringContainsString('Another build', $failure->getMessage());
        } finally {
            fclose($lock);
        }
        self::assertSame('old', file_get_contents($this->root . '/var/static/index.html'));
    }
}

/** A real local adapter with failures injected at publication transitions. */
final class FaultingFilesystem extends Filesystem
{
    /** @param array<string, \Throwable> $faults */
    public function __construct(
        private readonly array $faults,
    ) {}

    public function rename(string $origin, string $target, bool $overwrite = false): void
    {
        $phase = is_dir($origin)
            ? (
                str_contains($origin, '.staging-')
                    ? 'activate'
                    : (str_contains($origin, '.backup-') ? 'rollback' : 'move-old')
            )
            : 'write-file';
        if (isset($this->faults[$phase])) {
            throw $this->faults[$phase];
        }
        parent::rename($origin, $target, $overwrite);
    }

    public function remove(string|iterable $files): void
    {
        if (is_string($files)) {
            $phase = str_contains($files, '.staging-')
                ? 'staging'
                : (str_contains($files, '.backup-') ? 'backup' : 'other');
            if (isset($this->faults[$phase])) {
                throw $this->faults[$phase];
            }
        }
        parent::remove($files);
    }
}
