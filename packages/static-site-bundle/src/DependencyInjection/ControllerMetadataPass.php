<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\DependencyInjection;

use CJean\StaticSiteBundle\Routing\StaticPageResolver;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;

/** @internal Makes service-based controller names reflectable without instantiating them. */
final class ControllerMetadataPass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container): void
    {
        if (!$container->hasDefinition(StaticPageResolver::class)) {
            return;
        }
        $classes = [];
        $providerClasses = [];
        foreach ($container->getDefinitions() as $id => $definition) {
            if ($definition->isAbstract() || $definition->getClass() === null) {
                continue;
            }
            $class = $container->getParameterBag()->resolveValue($definition->getClass());
            if (is_string($class) && class_exists($class)) {
                if (is_subclass_of($class, \CJean\StaticSiteBundle\Provider\RouteProviderInterface::class)) {
                    $providerClasses[$id] = $class;
                }
                // Map only controller-like classes; avoid exposing unrelated container metadata.
                foreach (new \ReflectionClass($class)->getMethods() as $method) {
                    if ($method->getAttributes(\CJean\StaticSiteBundle\Attribute\StaticPage::class) === []) {
                        continue;
                    }

                    $classes[$id] = $class;
                    break;
                }
            }
        }
        $aliases = $container->getAliases();
        do {
            $changed = false;
            foreach ($aliases as $id => $alias) {
                $target = (string) $alias;
                if (!isset($classes[$target]) && !isset($providerClasses[$target])) {
                    continue;
                }
                if (isset($classes[$target])) {
                    $classes[$id] = $classes[$target];
                }
                if (isset($providerClasses[$target])) {
                    $providerClasses[$id] = $providerClasses[$target];
                }
                unset($aliases[$id]);
                $changed = true;
            }
        } while ($changed);
        $container->getDefinition(StaticPageResolver::class)->setArgument(0, $classes);
        if ($container->hasDefinition(\CJean\StaticSiteBundle\DataCollector\StaticSiteDataCollector::class)) {
            $container->getDefinition(
                \CJean\StaticSiteBundle\DataCollector\StaticSiteDataCollector::class,
            )->setArgument(3, $providerClasses);
        }
    }
}
