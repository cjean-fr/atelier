<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\DataCollector;

use CJean\StaticSiteBundle\Format\FormatRegistry;
use CJean\StaticSiteBundle\Routing\StaticPageResolver;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\DataCollector\DataCollector;
use Symfony\Component\Routing\RouterInterface;

/** @internal Captures metadata only: no provider instantiation, execution or artifact reads. */
final class StaticSiteDataCollector extends DataCollector
{
    /** @param array<string, class-string> $providerClasses */
    public function __construct(
        private readonly RouterInterface $router,
        private readonly StaticPageResolver $metadata,
        private readonly FormatRegistry $formats,
        private readonly array $providerClasses = [],
    ) {}

    public function collect(Request $request, Response $response, ?\Throwable $exception = null): void
    {
        $this->data = [
            'selected' => false,
            'route' => $request->attributes->get('_route'),
            'attribute' => [],
            'provider' => null,
            'providerClass' => null,
            'providerFile' => null,
            'providerLine' => null,
            'file' => null,
            'error' => null,
            'currentParameters' => json_encode(
                $request->attributes->get('_route_params', []),
                JSON_PRETTY_PRINT | JSON_PARTIAL_OUTPUT_ON_ERROR,
            ) ?: 'null',
        ];
        try {
            $name = $this->data['route'];
            if (!is_string($name) || ($route = $this->router->getRouteCollection()->get($name)) === null) {
                return;
            }
            $page = $this->metadata->resolve($name, $route);
            if ($page === null) {
                return;
            }
            $this->data['selected'] = true;
            $this->data['provider'] = $page->provider;
            $this->data['attribute'] = [
                'provider' => $page->provider,
                'route' => $page->route,
                'sitemap' => $page->sitemap,
            ];
            if ($page->provider !== null) {
                $class = $this->providerClasses[$page->provider] ?? $page->provider;
                if (class_exists($class) && method_exists($class, 'parameters')) {
                    $reflection = new \ReflectionMethod($class, 'parameters');
                    $this->data['providerClass'] = $class;
                    $this->data['providerFile'] = $reflection->getFileName() ?: null;
                    $this->data['providerLine'] = $reflection->getStartLine() ?: 1;
                }
            }
            $this->data['file'] = $this->formats->outputPath($response, $request->getPathInfo());
        } catch (\Throwable $error) {
            $this->data['error'] = $error->getMessage();
        }
    }

    public function getName(): string
    {
        return 'static_site';
    }

    public function getDetails(): array
    {
        return is_array($this->data) ? $this->data : [];
    }

    public function reset(): void
    {
        $this->data = [];
    }
}
