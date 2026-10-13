<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Generation;

use CJean\StaticSiteBundle\Routing\OutputPath;
use Symfony\Component\Filesystem\Filesystem;

/** @internal Write-once view of a staging directory: each output file is validated and written at most once. */
final readonly class StagingDirectory
{
    public function __construct(
        private Filesystem $filesystem,
        private string $root,
    ) {}

    public function write(string $file, string $content): void
    {
        $this->filesystem->dumpFile($this->claim($file), $content);
    }

    /** Copies a file or directory tree. Hidden entries are skipped; links and special files are refused. */
    public function copy(string $source, string $file): void
    {
        $this->rejectSymlinkAncestors($source);
        if (is_dir($source)) {
            foreach (new \FilesystemIterator(
                $source,
                \FilesystemIterator::SKIP_DOTS
                | \FilesystemIterator::CURRENT_AS_FILEINFO
                | \FilesystemIterator::KEY_AS_PATHNAME,
            ) as $entry) {
                /** @var \SplFileInfo $entry CURRENT_AS_FILEINFO guarantees objects. */
                if (str_starts_with($entry->getFilename(), '.')) {
                    continue;
                }

                $this->copy($entry->getPathname(), $file . '/' . $entry->getFilename());
            }
            return;
        }
        if (!is_file($source)) {
            throw new \RuntimeException('Refusing to export a special file: ' . $source);
        }
        $this->filesystem->copy($source, $this->claim($file));
    }

    private function claim(string $file): string
    {
        OutputPath::validateFile($file);
        $target = $this->root . '/' . $file;
        if (file_exists($target)) {
            throw new \RuntimeException(sprintf('Output collision at "%s".', $file));
        }
        return $target;
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
