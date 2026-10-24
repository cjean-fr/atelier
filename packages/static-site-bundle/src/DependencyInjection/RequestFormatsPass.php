<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\DependencyInjection;

use CJean\StaticSiteBundle\Format\FormatRegistry;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;

/** @internal Hands framework.request.formats to the format registry, which runs before any request. */
final class RequestFormatsPass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container): void
    {
        if (
            !$container->hasDefinition(FormatRegistry::class)
            || !$container->hasDefinition('request.add_request_formats_listener')
        ) {
            return;
        }
        $formats = $container->getDefinition('request.add_request_formats_listener')->getArgument(0);
        if (is_array($formats)) {
            $container->getDefinition(FormatRegistry::class)->setArgument(1, $formats);
        }
    }
}
