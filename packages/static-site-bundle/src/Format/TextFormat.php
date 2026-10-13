<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Format;

final class TextFormat extends BufferedTextFormat
{
    public function __construct()
    {
        parent::__construct('txt', 'txt', ['text/plain']);
    }
}
