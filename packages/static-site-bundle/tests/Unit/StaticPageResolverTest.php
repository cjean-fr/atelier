<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Tests\Unit;

use CJean\StaticSiteBundle\Attribute\StaticPage;
use CJean\StaticSiteBundle\Routing\StaticPageResolver;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Routing\Route;

final class StaticPageResolverTest extends TestCase
{
    public function testReadsMetadataWithoutChangingRoutesOrCreatingController(): void
    {
        $route = new Route('/page', ['_controller' => MetadataController::class . '::all']);
        $before = serialize($route);
        self::assertSame('articles', new StaticPageResolver()->resolve('page', $route)?->provider);
        self::assertSame($before, serialize($route));
    }

    public function testUnmarkedActionsAndLegacyOptionsDoNotSelectPages(): void
    {
        $route = new Route(
            '/page',
            ['_controller' => MetadataController::class . '::plain'],
            options: ['ssg' => true, 'ssg_provider' => 'articles'],
        );
        self::assertNull(new StaticPageResolver()->resolve('page', $route));
    }

    public function testCanSelectOneOfSeveralRoutesIncludingLocalizedNames(): void
    {
        $resolver = new StaticPageResolver();
        $route = new Route('/fr/page', [
            '_controller' => MetadataController::class . '::specific',
            '_canonical_route' => 'article',
        ]);
        self::assertSame('articles', $resolver->resolve('article.fr', $route)?->provider);
        $route->setDefault('_canonical_route', 'preview');
        self::assertNull($resolver->resolve('preview.fr', $route));
    }

    public function testSupportsArrayCallable(): void
    {
        $route = new Route('/page', ['_controller' => [MetadataController::class, 'all']]);
        self::assertSame('articles', new StaticPageResolver()->resolve('page', $route)?->provider);
    }

    public function testSupportsInvokableServiceId(): void
    {
        $resolver = new StaticPageResolver(['page.controller' => InvokableMetadataController::class]);
        self::assertInstanceOf(StaticPage::class, $resolver->resolve('page', new Route('/page', [
            '_controller' => 'page.controller',
        ])));
    }

    public function testRepeatedAttributesCanUseDifferentProviders(): void
    {
        $resolver = new StaticPageResolver();
        $route = new Route('/page', ['_controller' => MetadataController::class . '::specific']);
        self::assertSame('articles', $resolver->resolve('article', $route)?->provider);
        self::assertSame('archive', $resolver->resolve('archive', $route)?->provider);
    }

    public function testAmbiguousAttributesFail(): void
    {
        $route = new Route('/page', ['_controller' => MetadataController::class . '::ambiguous']);
        $this->expectException(\LogicException::class);
        new StaticPageResolver()->resolve('article', $route);
    }

    public function testRouteDefaultSelectsExcludesOrConfiguresAnyController(): void
    {
        $resolver = new StaticPageResolver();
        $route = static fn(mixed $value) => new Route('/page', [
            '_controller' => MetadataController::class . '::plain',
            StaticPage::ROUTE_DEFAULT => $value,
        ]);
        self::assertInstanceOf(StaticPage::class, $resolver->resolve('page', $route(true)));
        self::assertNull($resolver->resolve('page', $route(false)));
        $page = $resolver->resolve('page', $route(['parameters' => [['slug' => 'a']], 'sitemap' => false]));
        self::assertSame([['slug' => 'a']], $page?->parameters);
        self::assertFalse($page?->sitemap);
        // The default overrides the attribute of the action.
        self::assertNull($resolver->resolve('page', new Route('/page', [
            '_controller' => MetadataController::class . '::all',
            StaticPage::ROUTE_DEFAULT => false,
        ])));
    }

    public function testInvalidRouteDefaultsFail(): void
    {
        foreach (['yes', ['route' => 'other'], ['provider' => 1], ['provider' => 'a', 'parameters' => []]] as $value) {
            try {
                new StaticPageResolver()->resolve('page', new Route('/page', [StaticPage::ROUTE_DEFAULT => $value]));
                self::fail('Expected an invalid default to fail: ' . json_encode($value));
            } catch (\LogicException) {
                $this->addToAssertionCount(1);
            }
        }
    }

    public function testClassAttributeSelectsGetActionsWithoutTheirOwnAttribute(): void
    {
        $resolver = new StaticPageResolver();
        $route = static fn(string $method, array $methods = []) => new Route(
            '/page',
            [
                '_controller' => ClassMetadataController::class . '::' . $method,
            ],
            methods: $methods,
        );
        self::assertSame('pages', $resolver->resolve('page', $route('inherited'))?->provider);
        self::assertSame('pages', $resolver->resolve('page', $route('inherited', ['GET', 'HEAD']))?->provider);
        self::assertNull($resolver->resolve('page', $route('inherited', ['POST'])));
        self::assertSame('own', $resolver->resolve('page', $route('own'))?->provider);
        // An action with its own attributes ignores the class one, even when none selects this route.
        self::assertNull($resolver->resolve('page', $route('elsewhere')));
    }
}

final class MetadataController
{
    public function __construct()
    {
        throw new \LogicException('Discovery must not construct controllers.');
    }

    #[StaticPage(provider: 'articles')]
    public function all(): void {}

    public function plain(): void {}

    #[StaticPage(provider: 'articles', route: 'article')]
    #[StaticPage(provider: 'archive', route: 'archive')]
    public function specific(): void {}

    #[StaticPage]
    #[StaticPage(route: 'article')]
    public function ambiguous(): void {}
}

final class InvokableMetadataController
{
    #[StaticPage]
    public function __invoke(): void {}
}

#[StaticPage(provider: 'pages')]
final class ClassMetadataController
{
    public function inherited(): void {}

    #[StaticPage(provider: 'own')]
    public function own(): void {}

    #[StaticPage(route: 'other')]
    public function elsewhere(): void {}
}
