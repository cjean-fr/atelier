<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Routing;

use CJean\StaticSiteBundle\Attribute\StaticPage;
use Symfony\Component\Routing\Route;

/** @internal Reads controller metadata without constructing controllers or changing routes. */
final readonly class StaticPageResolver
{
    /** @param array<string, class-string> $controllerClasses Service IDs and aliases mapped to classes. */
    public function __construct(
        private array $controllerClasses = [],
    ) {}

    public function controllerIdentity(Route $route): ?string
    {
        $method = $this->controllerReflection($route);
        return $method === null ? null : $method->getDeclaringClass()->getName() . '::' . $method->getName();
    }

    private function controllerReflection(Route $route): ?\ReflectionMethod
    {
        $controller = $route->getDefault('_controller');
        if (is_string($controller)) {
            [$class, $method] = str_contains($controller, '::')
                ? explode('::', $controller, 2)
                : [$controller, '__invoke'];
        } elseif (is_array($controller) && count($controller) === 2) {
            [$class, $method] = $controller;
        } elseif (is_object($controller) && !$controller instanceof \Closure) {
            $class = $controller;
            $method = '__invoke';
        } else {
            return null;
        }
        if (is_object($class)) {
            $class = $class::class;
        }
        if (!is_string($class) || !is_string($method)) {
            return null;
        }
        $class = $this->controllerClasses[$class] ?? $class;
        if (!class_exists($class) || !method_exists($class, $method)) {
            return null;
        }
        return new \ReflectionMethod($class, $method);
    }

    public function resolve(string $name, Route $route): ?StaticPage
    {
        $method = $this->controllerReflection($route);
        if ($method === null)
            return null;
        $selection = null;
        foreach ($method->getAttributes(StaticPage::class) as $attribute) {
            $page = $attribute->newInstance();
            if (
                $page->route !== null
                && $page->route !== $name
                && $page->route !== $route->getDefault('_canonical_route')
            ) {
                continue;
            }
            if ($selection !== null) {
                throw new \LogicException(sprintf(
                    'Multiple StaticPage attributes select route "%s". Use distinct route names.',
                    $name,
                ));
            }
            $selection = $page;
        }
        return $selection;
    }
}
