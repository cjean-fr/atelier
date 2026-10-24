<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Tests\Unit;

use CJean\StaticSiteBundle\Event\PageRenderedEvent;
use CJean\StaticSiteBundle\Format\FormatRegistry;
use CJean\StaticSiteBundle\Format\HtmlFormat;
use CJean\StaticSiteBundle\Format\JsonFormat;
use CJean\StaticSiteBundle\Generation\PageRenderer;
use CJean\StaticSiteBundle\Routing\ExportPage;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use Symfony\Component\EventDispatcher\EventDispatcher;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\HttpKernel\HttpKernelInterface;
use Symfony\Component\HttpKernel\TerminableInterface;
use Symfony\Component\Routing\RequestContext;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Contracts\Service\ResetInterface;

final class PageRendererTest extends TestCase
{
    public static function invalidResponses(): iterable
    {
        yield [new Response('Redirect', 302, ['Location' => '/target'])];
        yield [new Response('{}', 200, ['Content-Type' => 'application/x-unknown'])];
        yield [new StreamedResponse(static function (): void {}, 200, ['Content-Type' => 'text/html'])];
        yield [new Response('<script src="/@vite/client"></script>', 200, ['Content-Type' => 'text/html'])];
        $cookies = new Response('Personalized', 200, ['Content-Type' => 'text/html']);
        $cookies->headers->setCookie(Cookie::create('session', 'private'));
        yield [$cookies];
    }

    #[DataProvider('invalidResponses')]
    public function testRejectsNonStaticResponsesAndResetsServices(Response $response): void
    {
        $kernel = $this->createMock(HttpKernelInterface::class);
        $kernel->expects(self::once())->method('handle')->willReturn($response);
        $router = $this->createMock(RouterInterface::class);
        $router->method('getContext')->willReturn(new RequestContext());
        $router->expects(self::once())->method('setContext');
        $resetter = $this->createMock(ResetInterface::class);
        $resetter->expects(self::once())->method('reset');
        $renderer = new PageRenderer($kernel, $router, new FormatRegistry([new HtmlFormat()]), $resetter);
        $this->expectException(\RuntimeException::class);
        $renderer->render(new ExportPage('test', 'https://example.test/'));
    }

    public static function responseFormats(): iterable
    {
        yield ['Application/JSON; charset=UTF-8', '{"ok":true}', 'data.json', false, null];
        yield ['text/plain; charset=utf-8', '# Plain text', 'data.txt', false, null];
        yield ['text/markdown', '# Markdown', 'data.md', false, null];
        yield ['text/html', '<p>HTML</p>', 'data/index.html', true, null];
        yield ['application/json', 'null', 'data.json', true, true];
        yield ['text/html', '<p>Excluded</p>', 'data/index.html', false, false];
    }

    #[DataProvider('responseFormats')]
    public function testTheResponseDeterminesOutputWhileSitemapOverridesArePreserved(
        string $type,
        string $bytes,
        string $file,
        bool $included,
        ?bool $sitemap,
    ): void {
        $kernel = $this->createMock(HttpKernelInterface::class);
        $kernel
            ->expects(self::once())
            ->method('handle')
            ->willReturn(new Response($bytes, 200, ['Content-Type' => $type]));
        $router = $this->createMock(RouterInterface::class);
        $router->method('getContext')->willReturn(new RequestContext());
        $router->expects(self::once())->method('setContext');
        $registry = new FormatRegistry([new HtmlFormat(), new JsonFormat()], ['md' => 'text/markdown']);
        $result = new PageRenderer($kernel, $router, $registry)->render(new ExportPage(
            'data',
            'https://example.test/data',
            $sitemap,
        ));
        self::assertSame($file, $result->file);
        self::assertSame($bytes, $result->content);
        self::assertSame($included, $result->includeInSitemap);
    }

    public static function failureScenarios(): iterable
    {
        yield ['handle', true, false];
        yield ['listener', true, true];
        yield ['format', true, false];
        yield [null, true, false];
        yield [null, false, true];
        yield [null, true, true];
        yield ['handle', false, true];
    }

    #[DataProvider('failureScenarios')]
    public function testCleanupsAreIndependentAndRenderingFailuresRemainPrimary(
        ?string $phase,
        bool $resetFails,
        bool $restoreFails,
    ): void {
        $original = new \RuntimeException('original ' . $phase);
        $resetError = new \RuntimeException('reset error');
        $restoreError = new \RuntimeException('restore error');
        $context = new RequestContext();
        $context->setHost('original.example');
        $router = $this->createMock(RouterInterface::class);
        $router->method('getContext')->willReturn($context);
        $router
            ->expects(self::once())
            ->method('setContext')
            ->willReturnCallback(static function (RequestContext $restored) use ($restoreFails, $restoreError): void {
                self::assertSame('original.example', $restored->getHost());
                if ($restoreFails) {
                    throw $restoreError;
                }
            });
        $kernel = $this->createMockForIntersectionOfInterfaces([
            HttpKernelInterface::class,
            TerminableInterface::class,
        ]);
        $kernel
            ->expects(self::once())
            ->method('handle')
            ->willReturnCallback(static function () use ($phase, $original, $context): Response {
                $context->setHost('during-render.example');
                if ($phase === 'handle') {
                    throw $original;
                }
                return new Response('page', 200, [
                    'Content-Type' => $phase === 'format' ? 'application/x-unknown' : 'text/html',
                ]);
            });
        // kernel.terminate work (mails, Messenger, ...) must not run once per exported page.
        $kernel->expects(self::never())->method('terminate');
        $events = new EventDispatcher();
        $events->addListener(PageRenderedEvent::class, static function () use ($phase, $original): void {
            if ($phase === 'listener') {
                throw $original;
            }
        });
        $resetter = $this->createMock(ResetInterface::class);
        $resetter
            ->expects(self::once())
            ->method('reset')
            ->willReturnCallback(static function () use ($resetFails, $resetError): void {
                if ($resetFails) {
                    throw $resetError;
                }
            });
        try {
            new PageRenderer(
                $kernel,
                $router,
                new FormatRegistry([new HtmlFormat()]),
                $resetter,
                $events,
            )->render(new ExportPage('test', 'https://example.test/'));
            self::fail('Expected a render or cleanup failure.');
        } catch (\RuntimeException $failure) {
            if ($phase === 'format') {
                self::assertStringContainsString('Declare it in framework.request.formats', $failure->getMessage());
            } else {
                self::assertSame($phase !== null ? $original : ($resetFails ? $resetError : $restoreError), $failure);
            }
        }
    }

    public function testMarksTheMainRequestAsSsg(): void
    {
        $kernel = $this->createMock(HttpKernelInterface::class);
        $kernel
            ->expects(self::once())
            ->method('handle')
            ->with(
                self::callback(
                    static fn(Request $request) => (
                        $request->attributes->get('_ssg') === true
                        && $request->getHost() === 'example.test'
                    ),
                ),
                HttpKernelInterface::MAIN_REQUEST,
                false,
            )
            ->willReturn(new Response('Page', 200, ['Content-Type' => 'text/html']));
        $router = $this->createMock(RouterInterface::class);
        $router->method('getContext')->willReturn(new RequestContext());
        $router->expects(self::once())->method('setContext');
        self::assertSame(
            'Page',
            new PageRenderer($kernel, $router, new FormatRegistry([new HtmlFormat()]))->render(new ExportPage(
                'test',
                'https://example.test/',
            ))->content,
        );
    }
}
