<?php

declare(strict_types=1);

namespace BundleDocs;

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
        if ($this->getEnvironment() === 'dev') {
            yield new \Symfony\Bundle\WebProfilerBundle\WebProfilerBundle();
        }
    }

    protected function configureContainer(ContainerConfigurator $container): void
    {
        $container->import('../config/packages/*.yaml');
        if ($this->getEnvironment() === 'dev') {
            $container->extension('framework', ['profiler' => ['collect' => true]]);
            $container->extension('web_profiler', ['toolbar' => true]);
        }
        $container
            ->services()
            ->defaults()
            ->autowire()
            ->autoconfigure()
            ->load('BundleDocs\\Content\\', __DIR__ . '/Content/')
            ->arg('$directory', '%kernel.project_dir%/content');
        $container
            ->services()
            ->defaults()
            ->autowire()
            ->autoconfigure()
            ->load('BundleDocs\\Controller\\', __DIR__ . '/Controller/')
            ->tag('controller.service_arguments');
        $container
            ->services()
            ->defaults()
            ->autowire()
            ->autoconfigure()
            ->load('BundleDocs\\Provider\\', __DIR__ . '/Provider/');
    }

    protected function configureRoutes(RoutingConfigurator $routes): void
    {
        $routes->import(__DIR__ . '/Controller/', 'attribute');
        if ($this->getEnvironment() === 'dev') {
            $routes->import('@WebProfilerBundle/Resources/config/routing/wdt.php')->prefix('/_wdt');
            $routes->import('@WebProfilerBundle/Resources/config/routing/profiler.php')->prefix('/_profiler');
        }
    }
}
