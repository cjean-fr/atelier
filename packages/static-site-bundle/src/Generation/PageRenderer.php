<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Generation;

use CJean\StaticSiteBundle\Event\PageRenderedEvent;
use CJean\StaticSiteBundle\Format\FormatRegistry;
use CJean\StaticSiteBundle\Routing\ExportPage;
use CJean\StaticSiteBundle\Routing\SiteUrl;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\HttpKernel\HttpKernelInterface;
use Symfony\Component\Routing\RequestContext;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Contracts\EventDispatcher\EventDispatcherInterface;
use Symfony\Contracts\Service\ResetInterface;

final readonly class PageRenderer
{
    public function __construct(
        private HttpKernelInterface $kernel,
        private RouterInterface $router,
        private FormatRegistry $formats,
        private ?ResetInterface $resetter = null,
        private ?EventDispatcherInterface $events = null,
        private string $defaultUri = '',
    ) {}

    /** Inspect MIME and indexability as a subrequest without exporting dev assets or resetting its parent. */
    public function inspectForSitemap(ExportPage $page): bool
    {
        $context = $this->router->getContext();
        $snapshot = clone $context;
        $request = $this->request($page);
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
            return $this->dispatch(
                $page,
                $this->formats->export($response, $request->getPathInfo(), $page->sitemap),
                preview: true,
            )->includeInSitemap;
        } finally {
            $this->router->setContext(self::restore($context, $snapshot));
        }
    }

    public function render(ExportPage $page): RenderedPage
    {
        $context = $this->router->getContext();
        $snapshot = clone $context;
        $request = $this->request($page);
        $request->attributes->set('_ssg', true);
        $failure = null;
        $rendered = null;
        try {
            // Never terminated: kernel.terminate work (mails, Messenger, ...) must not run once per page.
            $response = $this->kernel->handle($request, HttpKernelInterface::MAIN_REQUEST, false);
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
            $rendered = $this->dispatch(
                $page,
                $this->formats->export($response, $request->getPathInfo(), $page->sitemap),
                preview: false,
            );
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
                $this->router->setContext(self::restore($context, $snapshot));
            } catch (\Throwable $error) {
                $cleanupFailure ??= $error;
            }
        }
        if ($failure !== null || $cleanupFailure !== null) {
            throw $failure ?? $cleanupFailure;
        }
        return $rendered ?? throw new \LogicException('Rendering completed without an output.');
    }

    /**
     * Restores the state in place: RouterListener updates this very object on every request, so swapping in a copy
     * would leave the following pages with a stale host and base path.
     */
    private static function restore(RequestContext $context, RequestContext $snapshot): RequestContext
    {
        return $context
            ->setBaseUrl($snapshot->getBaseUrl())
            ->setPathInfo($snapshot->getPathInfo())
            ->setMethod($snapshot->getMethod())
            ->setHost($snapshot->getHost())
            ->setScheme($snapshot->getScheme())
            ->setHttpPort($snapshot->getHttpPort())
            ->setHttpsPort($snapshot->getHttpsPort())
            ->setQueryString($snapshot->getQueryString())
            ->setParameters($snapshot->getParameters());
    }

    private function dispatch(ExportPage $page, RenderedPage $rendered, bool $preview): RenderedPage
    {
        if ($this->events === null) {
            return $rendered;
        }
        $event = $this->events->dispatch(
            new PageRenderedEvent($page, $rendered->file, $rendered->content, $rendered->includeInSitemap, $preview),
        );
        return new RenderedPage($rendered->file, $event->getContent(), $event->isInSitemap());
    }

    /** Below a base path, the front controller sits there: path() and asset() then keep the prefix. */
    private function request(ExportPage $page): Request
    {
        if ($this->basePath() === '') {
            return Request::create($page->url, 'GET');
        }
        $script = $this->basePath() . '/index.php';
        return Request::create($page->url, 'GET', server: ['SCRIPT_NAME' => $script, 'SCRIPT_FILENAME' => $script]);
    }

    private function basePath(): string
    {
        return SiteUrl::basePathOf($this->defaultUri);
    }
}
