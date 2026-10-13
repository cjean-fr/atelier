<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Generation;

use CJean\StaticSiteBundle\Routing\ExportPage;
use CJean\StaticSiteBundle\Routing\OutputPath;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Filesystem\Path;

/** @internal Private diagnostics of the published build; reads happen only on demand. */
final readonly class BuildReportStore
{
    public function __construct(
        private Filesystem $filesystem,
        private string $projectDir,
        private string $outputDir,
    ) {}

    /**
     * @param list<ExportPage> $pages
     */
    public function save(string $id, array $pages): void
    {
        $this->validateId($id);
        $directory = $this->directory() . '/' . $id;
        $this->rejectLinks($directory);
        $reports = [];
        foreach ($pages as $page) {
            $reports[$page->routeName] ??= [
                'route' => $page->routeName,
                'provider' => $page->provider,
                'generatedAt' => time(),
                'total' => 0,
                'sets' => [],
            ];
            ++$reports[$page->routeName]['total'];
            if (count($reports[$page->routeName]['sets']) < 100) {
                $reports[$page->routeName]['sets'][] = [
                    'parameters' => $page->parameters,
                    'url' => $page->url,
                    'sitemapDirective' => $page->sitemap,
                ];
            }
        }
        foreach ($reports as $route => $report) {
            $this->filesystem->dumpFile(
                $directory . '/' . hash('sha256', $route) . '.json',
                json_encode($report, JSON_THROW_ON_ERROR | JSON_INVALID_UTF8_SUBSTITUTE),
            );
        }
        // Keep only diagnostics of the active export. This runs under the publication lock.
        foreach (glob($this->directory() . '/*') ?: [] as $old) {
            if ($old !== $directory && preg_match('/\A[a-f0-9]{32}\z/', basename($old)) && !is_link($old)) {
                $this->filesystem->remove($old);
            }
        }
    }

    public function parameters(string $route): ?array
    {
        return $this->readPublished(hash('sha256', $route) . '.json');
    }

    private function readPublished(string $name): ?array
    {
        $root = $this->outputRoot();
        if ($root === null || !is_file($root . '/.ssg-owned') || is_link($root . '/.ssg-owned')) {
            return null;
        }
        $marker = file_get_contents($root . '/.ssg-owned');
        if ($marker === false || !preg_match('/\Astatic-site-bundle\n([a-f0-9]{32})\n\z/', $marker, $match)) {
            return null;
        }
        $file = $this->directory() . '/' . $match[1] . '/' . $name;
        $this->rejectLinks($file);
        if (!is_file($file)) {
            return null;
        }
        $content = file_get_contents($file);
        if ($content === false) {
            throw new \RuntimeException('Cannot read build diagnostics.');
        }
        $report = json_decode($content, true, flags: JSON_THROW_ON_ERROR);
        if (!is_array($report)) {
            throw new \RuntimeException('Invalid build diagnostics.');
        }
        return $report;
    }

    public function source(string $file): ?array
    {
        OutputPath::validateFile($file);
        $root = $this->outputRoot();
        if ($root === null) {
            return null;
        }
        $path = realpath($root . '/' . $file);
        if ($path === false || !str_starts_with($path, $root . '/') || !is_file($path)) {
            return null;
        }
        $content = file_get_contents($path, length: 262145);
        if ($content === false) {
            throw new \RuntimeException('Cannot read published source.');
        }
        return [
            'file' => $file,
            'source' => substr($content, 0, 262144),
            'truncated' => strlen($content) > 262144,
            'modified' => filemtime($path),
        ];
    }

    private function directory(): string
    {
        return $this->projectDir . '/var/ssg/reports/' . hash('sha256', Path::canonicalize($this->outputDir));
    }

    private function outputRoot(): ?string
    {
        $root = realpath($this->outputDir);
        $var = realpath($this->projectDir . '/var');
        return $root !== false && $var !== false && str_starts_with($root, $var . '/') ? $root : null;
    }

    private function validateId(string $id): void
    {
        if (!preg_match('/\A[a-f0-9]{32}\z/', $id)) {
            throw new \InvalidArgumentException('Invalid build identifier.');
        }
    }

    private function rejectLinks(string $path): void
    {
        do {
            if (is_link($path)) {
                throw new \RuntimeException('Symbolic links are not allowed in build diagnostics.');
            }
            $parent = dirname($path);
            if ($parent === $path) {
                break;
            }
            $path = $parent;
        } while (true);
    }
}
