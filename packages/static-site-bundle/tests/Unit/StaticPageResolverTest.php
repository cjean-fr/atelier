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
