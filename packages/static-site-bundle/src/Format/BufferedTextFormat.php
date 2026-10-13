<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Format;

use CJean\StaticSiteBundle\Routing\OutputPath;
use Symfony\Component\HttpFoundation\Response;

/** Common implementation for the bundled text formats. */
abstract class BufferedTextFormat implements OutputFormatInterface
{
    /** @var list<string> */
    private readonly array $mediaTypes;

    /** @param list<string> $mediaTypes */
    public function __construct(
        private readonly string $formatName,
        private readonly string $extension,
        array $mediaTypes,
        private readonly bool $html = false,
    ) {
        $this->mediaTypes = array_map(MediaType::declaration(...), $mediaTypes);
    }

    public function mediaTypes(): array
    {
        return $this->mediaTypes;
    }

    public function outputPath(string $url): string
    {
        return OutputPath::fromUrl($url, $this->extension, $this->html);
    }

    public function includeInSitemap(): bool
    {
        return $this->html;
    }

    public function render(Response $response): string
    {
        $type = MediaType::of($response);
        if (!in_array($type, $this->mediaTypes, true)) {
            throw new \RuntimeException(sprintf(
                'Format "%s" expects Content-Type %s; received "%s".',
                $this->formatName,
                implode(' or ', $this->mediaTypes),
                $type,
            ));
        }
        $content = $response->getContent();
        if ($content === false) {
            throw new \RuntimeException('The response must have buffered content.');
        }
        return $content;
    }
}
