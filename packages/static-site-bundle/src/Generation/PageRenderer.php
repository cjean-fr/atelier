<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Generation;

use CJean\StaticSiteBundle\Format\FormatRegistry;
use CJean\StaticSiteBundle\Routing\ExportPage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\HttpKernel\HttpKernelInterface;
use Symfony\Component\HttpKernel\TerminableInterface;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Contracts\Service\ResetInterface;

final readonly class PageRenderer
{
    public function __construct(
        private HttpKernelInterface $kernel,
        private RouterInterface $router,
        private FormatRegistry $formats,
        private ?ResetInterface $resetter = null,
    ) {}

    /** Inspect MIME and indexability as a subrequest without exporting dev assets or resetting its parent. */
    public function inspectForSitemap(ExportPage $page): bool
    {
        $context = clone $this->router->getContext();
        $request = Request::create($page->url, 'GET');
        $request->attributes->set('_ssg_sitemap', true);
        try {
            $response = $this->kernel->handle($request, HttpKernelInterface::SUB_REQUEST, false);
            if (
                $response->getStatusCode() !== 200
                || $response instanceof StreamedResponse
                || $response instanceof BinaryFileResponse
            ) {
                throw new \RuntimeException('Sitemap discovery requires a buffered HTTP 200 response.');
            }
            if ($response->headers->getCookies() !== [] || $request->hasPreviousSession()) {
                throw new \RuntimeException('Sitemap discovery refuses cookie/session-dependent pages.');
            }
            // ResponseListener prepares main requests only; the build sees the default Content-Type it sets.
            $response->prepare($request);
            return $this->formats->includesInSitemap($response, $page->sitemap);
        } finally {
            $this->router->setContext($context);
        }
    }

    public function render(ExportPage $page): RenderedPage
    {
        $context = clone $this->router->getContext();
        $request = Request::create($page->url, 'GET');
        $request->attributes->set('_ssg', true);
        $failure = null;
        $rendered = null;
        try {
            $response = $this->kernel->handle($request, HttpKernelInterface::MAIN_REQUEST, false);
            if ($this->kernel instanceof TerminableInterface) {
                $this->kernel->terminate($request, $response);
            }
            if (
                $response->getStatusCode() !== 200
                || $response instanceof StreamedResponse
                || $response instanceof BinaryFileResponse
            ) {
                throw new \RuntimeException(sprintf(
                    'Route "%s" must return a buffered HTTP 200 response; received %d.',
                    $page->routeName,
                    $response->getStatusCode(),
                ));
            }
            if ($response->headers->getCookies() !== [] || $request->hasPreviousSession()) {
                throw new \RuntimeException(sprintf(
                    'Route "%s" uses cookies/session and cannot be published.',
                    $page->routeName,
                ));
            }
            $rendered = $this->formats->export($response, $request->getPathInfo(), $page->sitemap);
        } catch (\Throwable $error) {
            $failure = $error;
        } finally {
            // Attempt both cleanups independently; keep the original render failure.
            $cleanupFailure = null;
            try {
                $this->resetter?->reset();
            } catch (\Throwable $error) {
                $cleanupFailure = $error;
            }
            try {
                $this->router->setContext($context);
            } catch (\Throwable $error) {
                $cleanupFailure ??= $error;
            }
        }
        if ($failure !== null || $cleanupFailure !== null) {
            throw $failure ?? $cleanupFailure;
        }
        return $rendered ?? throw new \LogicException('Rendering completed without an output.');
    }
}
