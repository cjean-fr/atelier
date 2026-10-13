<?php

declare(strict_types=1);

namespace Demo;

use CJean\StaticSiteBundle\StaticSiteBundle;
use Symfony\Bundle\FrameworkBundle\FrameworkBundle;
use Symfony\Bundle\FrameworkBundle\Kernel\MicroKernelTrait;
use Symfony\Bundle\TwigBundle\TwigBundle;
use Symfony\Component\DependencyInjection\Loader\Configurator\ContainerConfigurator;
use Symfony\Component\HttpKernel\Kernel as BaseKernel;
use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;
use Symfony\Reprise\RepriseBundle;

final class Kernel extends BaseKernel
{
    use MicroKernelTrait;

    public function getProjectDir(): string
    {
        return dirname(__DIR__);
    }

    public function registerBundles(): iterable
    {
        yield new FrameworkBundle();
        yield new TwigBundle();
        yield new RepriseBundle();
        yield new StaticSiteBundle();
    }

    protected function configureContainer(ContainerConfigurator $container): void
    {
        $container->import('../config/packages/*.yaml');
        $container
            ->services()
            ->defaults()
            ->autowire()
            ->autoconfigure()
            ->load('Demo\\Controller\\', __DIR__ . '/Controller/')
            ->tag('controller.service_arguments');
        $container
            ->services()
            ->defaults()
            ->autowire()
            ->autoconfigure()
            ->load('Demo\\Provider\\', __DIR__ . '/Provider/');
    }

    protected function configureRoutes(RoutingConfigurator $routes): void
    {
        $routes->import(__DIR__ . '/Controller/', 'attribute');
    }
}
