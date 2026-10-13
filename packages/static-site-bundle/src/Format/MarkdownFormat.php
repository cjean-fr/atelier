<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Format;

final class MarkdownFormat extends BufferedTextFormat
{
    public function __construct()
    {
        parent::__construct('markdown', 'md', ['text/markdown']);
    }
}
