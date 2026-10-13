<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Format;

use Symfony\Component\HttpFoundation\Response;

final class HtmlFormat extends BufferedTextFormat
{
    public function __construct()
    {
        parent::__construct('html', 'html', ['text/html'], true);
    }

    public function render(Response $response): string
    {
        $content = parent::render($response);
        if (str_contains($content, '/@vite/client')) {
            throw new \RuntimeException('Development Vite response. Build assets before exporting.');
        }
        return $content;
    }
}
