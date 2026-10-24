<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Format;

use CJean\StaticSiteBundle\Routing\OutputPath;
use Symfony\Component\HttpFoundation\Response;

/**
 * Buffered bytes written as <path>.<format>, or <path>/index.html for HTML. Extend it to validate the content.
 * A URL may also end with the media type's structured suffix: /feed.xml for application/rss+xml.
 */
class BufferedTextFormat implements OutputFormatInterface
{
    public function __construct(
        private readonly string $name,
        private readonly bool $html = false,
    ) {}

    public function name(): string
    {
        return $this->name;
    }

    public function outputPath(string $url, string $mediaType): string
    {
        $suffix = strrchr($mediaType, '+');
        return OutputPath::fromUrl($url, $this->name, $this->html, $suffix === false ? [] : [substr($suffix, 1)]);
    }

    public function includeInSitemap(): bool
    {
        return $this->html;
    }

    public function render(Response $response): string
    {
        $content = $response->getContent();
        if ($content === false) {
            throw new \RuntimeException('The response must have buffered content.');
        }
        return $content;
    }
}
