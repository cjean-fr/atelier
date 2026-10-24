<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Format;

use CJean\StaticSiteBundle\Generation\RenderedPage;
use CJean\StaticSiteBundle\Routing\OutputPath;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/** @internal Symfony selects the format from the response Content-Type; registered formats add their rules. */
final class FormatRegistry
{
    /** @var array<string, OutputFormatInterface> */
    private array $formats = [];

    private readonly Request $request;

    /**
     * @param iterable<OutputFormatInterface> $formats
     * @param array<string, string|list<string>> $requestFormats framework.request.formats, applied before any request
     *     the same way Symfony's AddRequestFormatsListener applies them on each one.
     */
    public function __construct(iterable $formats, array $requestFormats = [])
    {
        $this->request = new Request();
        foreach ($requestFormats as $name => $types) {
            $this->request->setFormat($name, $types);
        }
        foreach ($formats as $format) {
            if (isset($this->formats[$format->name()])) {
                throw new \LogicException('Duplicate output format: ' . $format->name());
            }
            $this->formats[$format->name()] = $format;
        }
    }

    /** @param string $path Local request path, without query or fragment. */
    public function export(Response $response, string $path, ?bool $sitemap = null): RenderedPage
    {
        $format = $this->forResponse($response);
        return new RenderedPage(
            $this->outputPath($response, $path),
            $format->render($response),
            $sitemap ?? $format->includeInSitemap(),
        );
    }

    /** Resolve a safe filename without rendering or validating response bytes (profiler inspection). */
    public function outputPath(Response $response, string $path): string
    {
        OutputPath::decodeUrl($path);
        $file = $this->forResponse($response)->outputPath($path, MediaType::of($response));
        OutputPath::validateFile($file);
        return $file;
    }

    public function includesInSitemap(Response $response, ?bool $override = null): bool
    {
        return $override ?? $this->forResponse($response)->includeInSitemap();
    }

    private function forResponse(Response $response): OutputFormatInterface
    {
        $type = MediaType::of($response);
        $name = $this->request->getFormat($type) ?? throw new \RuntimeException(sprintf(
            'Symfony knows no request format for Content-Type "%s". Declare it in framework.request.formats.',
            $type,
        ));
        return $this->formats[$name] ?? new BufferedTextFormat($name, $name === 'html');
    }
}
