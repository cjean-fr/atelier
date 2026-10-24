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
        $target = $this->controller($route);
        if ($target === null || !method_exists($target[0], $target[1])) {
            return null;
        }
        return new \ReflectionMethod($target[0], $target[1]);
    }

    /** @return \ReflectionClass<object>|null The routed class, not the one declaring an inherited action. */
    private function controllerClass(Route $route): ?\ReflectionClass
    {
        $target = $this->controller($route);
        return $target === null ? null : new \ReflectionClass($target[0]);
    }

    /** @return array{class-string, string}|null */
    private function controller(Route $route): ?array
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
        return class_exists($class) ? [$class, $method] : null;
    }

    public function resolve(string $name, Route $route): ?StaticPage
    {
        $defaults = $route->getDefaults();
        if (array_key_exists(StaticPage::ROUTE_DEFAULT, $defaults)) {
            return $this->fromDefault($name, $defaults[StaticPage::ROUTE_DEFAULT]);
        }
        $method = $this->controllerReflection($route);
        if ($method === null)
            return null;
        $attributes = $method->getAttributes(StaticPage::class);
        if ($attributes !== []) {
            return $this->select($name, $route, $attributes);
        }
        // A class-level selection skips actions that cannot be exported, such as form handlers.
        if ($route->getMethods() !== [] && !in_array('GET', $route->getMethods(), true)) {
            return null;
        }
        return $this->select($name, $route, $this->controllerClass($route)?->getAttributes(StaticPage::class) ?? []);
    }

    /** @param list<\ReflectionAttribute<StaticPage>> $attributes */
    private function select(string $name, Route $route, array $attributes): ?StaticPage
    {
        $selection = null;
        foreach ($attributes as $attribute) {
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

    /** true selects the route, false excludes it, an array holds the StaticPage arguments. */
    private function fromDefault(string $name, mixed $value): ?StaticPage
    {
        if (is_bool($value)) {
            return $value ? new StaticPage() : null;
        }
        $allowed = ['provider' => true, 'sitemap' => true, 'parameters' => true];
        if (!is_array($value) || array_diff_key($value, $allowed) !== []) {
            throw new \LogicException(sprintf(
                'Route "%s": the "%s" default must be a boolean or an array with provider, sitemap or parameters.',
                $name,
                StaticPage::ROUTE_DEFAULT,
            ));
        }
        $provider = $value['provider'] ?? null;
        $sitemap = $value['sitemap'] ?? null;
        $parameters = $value['parameters'] ?? null;
        if (
            $provider !== null && !is_string($provider)
            || $sitemap !== null && !is_bool($sitemap)
            || $parameters !== null && !is_array($parameters)
        ) {
            throw new \LogicException(sprintf('Route "%s": invalid "%s" default.', $name, StaticPage::ROUTE_DEFAULT));
        }
        /** @var list<array<string, scalar>>|null $parameters Each set is checked by the planner. */
        return new StaticPage($provider, sitemap: $sitemap, parameters: $parameters);
    }
}
