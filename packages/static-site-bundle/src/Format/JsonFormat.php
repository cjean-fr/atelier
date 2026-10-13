<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Format;

use Symfony\Component\HttpFoundation\Response;

final class JsonFormat extends BufferedTextFormat
{
    public function __construct()
    {
        parent::__construct('json', 'json', ['application/json']);
    }

    public function render(Response $response): string
    {
        $content = parent::render($response);
        // Validate without transforming bytes, numeric precision or formatting.
        json_decode($content, flags: JSON_THROW_ON_ERROR);
        return $content;
    }
}
