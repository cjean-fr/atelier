<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Format;

use CJean\StaticSiteBundle\Generation\RenderedPage;
use CJean\StaticSiteBundle\Routing\OutputPath;
use Symfony\Component\HttpFoundation\Response;

/** @internal Selects exactly one format from the response Content-Type. */
final class FormatRegistry
{
    /** @var array<string, OutputFormatInterface> */
    private array $formats = [];

    /** @param iterable<OutputFormatInterface> $formats */
    public function __construct(iterable $formats)
    {
        foreach ($formats as $format) {
            if ($format->mediaTypes() === []) {
                throw new \LogicException('An output format must declare at least one media type.');
            }
            foreach ($format->mediaTypes() as $type) {
                $type = MediaType::declaration($type);
                if (isset($this->formats[$type])) {
                    throw new \LogicException('Invalid or duplicate output media type: ' . $type);
                }
                $this->formats[$type] = $format;
            }
        }
    }

    /** @param string $path Local request path, without query or fragment. */
    public function export(Response $response, string $path, ?bool $sitemap = null): RenderedPage
    {
        OutputPath::decodeUrl($path);
        $format = $this->forResponse($response);
        $file = $this->outputPath($response, $path);
        return new RenderedPage($file, $format->render($response), $this->includesInSitemap($response, $sitemap));
    }

    /** Resolve a safe filename without rendering or validating response bytes (profiler inspection). */
    public function outputPath(Response $response, string $path): string
    {
        OutputPath::decodeUrl($path);
        $file = $this->forResponse($response)->outputPath($path);
        OutputPath::validateFile($file);
        return $file;
    }

    public function includesInSitemap(Response $response, ?bool $override = null): bool
    {
        $format = $this->forResponse($response);
        return $override ?? $format->includeInSitemap();
    }

    private function forResponse(Response $response): OutputFormatInterface
    {
        $type = MediaType::of($response);
        return (
            $this->formats[$type] ?? throw new \RuntimeException(sprintf(
                'Unsupported or missing response Content-Type "%s". Registered types: %s.',
                $type,
                implode(', ', array_keys($this->formats)),
            ))
        );
    }
}
