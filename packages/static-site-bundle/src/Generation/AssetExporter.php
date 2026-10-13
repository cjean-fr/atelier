<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Generation;

use CJean\StaticSiteBundle\Routing\OutputPath;
use Symfony\Reprise\Asset\EntrypointsLookupInterface;

/** @internal */
final readonly class AssetExporter
{
    /** @param list<string> $assets */
    public function __construct(
        private string $projectDir,
        private array $assets,
        private bool $requireViteBuild,
        private string $viteBuildDirectory,
        private ?EntrypointsLookupInterface $entrypointsLookup = null,
        private ?string $metadataDirectory = null,
    ) {}

    public function exportTo(StagingDirectory $staging): void
    {
        $this->validateVite();
        foreach ($this->assets as $asset) {
            OutputPath::validateFile($asset);
            $source = $this->projectDir . '/public/' . $asset;
            if (file_exists($source) || is_link($source)) {
                $staging->copy($source, $asset);
            }
        }
    }

    private function validateVite(): void
    {
        if (!$this->requireViteBuild) {
            return;
        }
        OutputPath::validateFile($this->viteBuildDirectory);
        if (!in_array($this->viteBuildDirectory, $this->assets, true)) {
            throw new \RuntimeException('The Vite build directory must be included in assets.');
        }
        $build = $this->projectDir . '/public/' . $this->viteBuildDirectory;
        $metadata = $this->metadataDirectory ?? $build;
        $manifest = $metadata . '/manifest.json';
        if ($this->entrypointsLookup === null) {
            throw new \RuntimeException(
                'Register RepriseBundle to validate production assets, or disable require_vite_build.',
            );
        }
        if (!is_file($metadata . '/entrypoints.json') || !is_file($manifest)) {
            throw new \RuntimeException('Reprise build missing. Run npm run build before ssg:build.');
        }
        $entries = $this->readMetadata($metadata . '/entrypoints.json');
        $assets = $this->readMetadata($manifest);
        if ($assets === []) {
            throw new \RuntimeException('Reprise manifest must be a non-empty logical-path to URL map.');
        }
        // Reprise owns parsing and validation. Consume only its public lookup contract.
        $lookup = $this->entrypointsLookup;
        $lookup->reset();
        try {
            if (
                ($entries['isProd'] ?? null) !== true
                || ($entries['devServer'] ?? null) !== null
                || !$lookup->isProd()
                || $lookup->getDevServer() !== null
            ) {
                throw new \RuntimeException('Reprise metadata must describe a production build.');
            }
            $entryPoints = $entries['entryPoints'] ?? null;
            if (!is_array($entryPoints) || $entryPoints === []) {
                throw new \RuntimeException('Reprise production build must contain at least one entrypoint.');
            }
            foreach ($assets as $reference) {
                $this->assertReference($reference);
            }
            foreach (array_keys($entryPoints) as $name) {
                foreach ([
                    $lookup->getJavaScriptFiles((string) $name),
                    $lookup->getCssFiles((string) $name),
                    $lookup->getPreloadFiles((string) $name),
                    $lookup->getDynamicFiles((string) $name),
                ] as $files) {
                    foreach ($files as $reference) {
                        $this->assertReference($reference);
                    }
                }
            }
            foreach (array_keys($lookup->getIntegrityData()) as $reference) {
                $this->assertReference($reference);
            }
        } finally {
            $lookup->reset();
        }
    }

    /** @return array<array-key, mixed> */
    private function readMetadata(string $file): array
    {
        $content = file_get_contents($file);
        if ($content === false) {
            throw new \RuntimeException('Cannot read Reprise metadata: ' . $file);
        }
        $data = json_decode($content, true, 512, JSON_THROW_ON_ERROR);
        if (!is_array($data)) {
            throw new \RuntimeException('Reprise metadata must be a JSON object: ' . $file);
        }
        return $data;
    }

    private function assertReference(mixed $reference): void
    {
        if (!is_string($reference) || $reference === '') {
            throw new \RuntimeException('Invalid Vite asset reference.');
        }
        if (preg_match('~^https?://~i', $reference) || str_starts_with($reference, '//')) {
            $url = str_starts_with($reference, '//') ? 'https:' . $reference : $reference;
            if (filter_var($url, FILTER_VALIDATE_URL) === false || parse_url($url, PHP_URL_HOST) === null) {
                throw new \RuntimeException('Invalid remote Vite asset URL: ' . $reference);
            }
            // CDN URLs stay external. Do not fetch them or pretend to verify availability.
            return;
        }
        if (parse_url($reference, PHP_URL_SCHEME) !== null) {
            throw new \RuntimeException('Unsupported Vite asset URL: ' . $reference);
        }
        $path = parse_url($reference, PHP_URL_PATH);
        if (!is_string($path) || $path === '') {
            throw new \RuntimeException('Invalid Vite asset path: ' . $reference);
        }
        // Reprise emits public asset paths, with or without the leading slash.
        $file = rawurldecode(ltrim($path, '/'));
        OutputPath::validateFile($file);
        $included = false;
        foreach ($this->assets as $asset) {
            if (!($file === $asset || str_starts_with($file, $asset . '/'))) {
                continue;
            }

            $included = true;
            break;
        }
        $source = $this->projectDir . '/public/' . $file;
        if (!$included || !is_file($source)) {
            throw new \RuntimeException('Missing or excluded local Vite asset: ' . $file);
        }
        // The copy module also refuses links; detect them before any export starts.
        do {
            if (is_link($source)) {
                throw new \RuntimeException('Symbolic links are not allowed in Vite asset paths: ' . $source);
            }
            $parent = dirname($source);
            if ($parent === $source) {
                break;
            }
            $source = $parent;
        } while (true);
    }
}
