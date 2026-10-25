<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle;

use CJean\StaticSiteBundle\Command\GenerateCommand;
use CJean\StaticSiteBundle\DependencyInjection\ControllerMetadataPass;
use CJean\StaticSiteBundle\Format\FormatRegistry;
use CJean\StaticSiteBundle\Format\HtmlFormat;
use CJean\StaticSiteBundle\Format\JsonFormat;
use CJean\StaticSiteBundle\Format\OutputFormatInterface;
use CJean\StaticSiteBundle\Generation\AssetExporter;
use CJean\StaticSiteBundle\Generation\DirectoryPublisher;
use CJean\StaticSiteBundle\Generation\PageRenderer;
use CJean\StaticSiteBundle\Generation\SiteBuilder;
use CJean\StaticSiteBundle\Provider\RouteProviderInterface;
use CJean\StaticSiteBundle\Routing\RoutePlanner;
use CJean\StaticSiteBundle\Routing\StaticPageResolver;
use Symfony\Component\Config\Definition\Configurator\DefinitionConfigurator;
use Symfony\Component\DependencyInjection\Compiler\PassConfig;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Loader\Configurator\ContainerConfigurator;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpKernel\Bundle\AbstractBundle;
use Symfony\Reprise\Asset\EntrypointsLookupInterface;

use function Symfony\Component\DependencyInjection\Loader\Configurator\service;
use function Symfony\Component\DependencyInjection\Loader\Configurator\tagged_iterator;
use function Symfony\Component\DependencyInjection\Loader\Configurator\tagged_locator;

final class StaticSiteBundle extends AbstractBundle
{
    public function getPath(): string
    {
        return dirname(__DIR__);
    }

    public function build(ContainerBuilder $container): void
    {
        parent::build($container);
        $container->addCompilerPass(new ControllerMetadataPass(), PassConfig::TYPE_BEFORE_REMOVING);
        $container->addCompilerPass(new \CJean\StaticSiteBundle\DependencyInjection\RequestFormatsPass());
        $container->registerForAutoconfiguration(OutputFormatInterface::class)->addTag('static_site.format');
        $container->registerForAutoconfiguration(RouteProviderInterface::class)->addTag('static_site.provider');
    }

    public function configure(DefinitionConfigurator $definition): void
    {
        $definition
            ->rootNode()
            ->children()
            ->scalarNode('output_dir')
            ->defaultValue('%kernel.project_dir%/var/static')
            ->end()
            ->arrayNode('assets')
            ->scalarPrototype()
            ->end()
            ->defaultValue(['build', 'bundles', 'favicon.ico', 'robots.txt'])
            ->end()
            ->booleanNode('require_vite_build')
            ->defaultTrue()
            ->end()
            ->scalarNode('vite_build_directory')
            ->defaultValue('build')
            ->end()
            ->scalarNode('reprise_metadata_directory')
            ->defaultNull()
            ->end()
            ->booleanNode('sitemap')
            ->info('Generate sitemap.xml at build time and serve it in SSR.')
            ->defaultTrue()
            ->end()
            ->end();
    }

    public function loadExtension(array $config, ContainerConfigurator $configurator, ContainerBuilder $container): void
    {
        /** @var array{ output_dir: string, assets: list<string>, require_vite_build: bool, vite_build_directory: string, reprise_metadata_directory: ?string, sitemap: bool} $config Validated by configure(). */
        $services = $configurator->services();
        // The public URL is Symfony's: framework.router.default_uri.
        $defaultUri = '%router.request_context.base_url%';
        foreach ([HtmlFormat::class, JsonFormat::class] as $format) {
            $services->set($format)->tag('static_site.format');
        }
        $services
            ->set(\CJean\StaticSiteBundle\Routing\VirtualSitemapLoader::class)
            ->decorate('routing.loader')
            ->args([
                service(\CJean\StaticSiteBundle\Routing\VirtualSitemapLoader::class . '.inner'),
                '%kernel.debug%',
                $config['sitemap'],
            ]);
        $services
            ->set(\CJean\StaticSiteBundle\Controller\SitemapController::class)
            ->args([service(\CJean\StaticSiteBundle\Generation\SitemapService::class)])
            ->public()
            ->tag('controller.service_arguments');
        $services->set(FormatRegistry::class)->args([tagged_iterator('static_site.format')]);
        $services->set(StaticPageResolver::class)->args([[]]);
        if ($container->getParameter('kernel.debug')) {
            $services->set(\CJean\StaticSiteBundle\DataCollector\StaticSiteDataCollector::class)->args([
                service('router'),
                service(StaticPageResolver::class),
                service(FormatRegistry::class),
                [],
            ])->tag('data_collector', [
                'id' => 'static_site',
                'template' => '@StaticSite/Collector/static_site.html.twig',
            ]);
        }
        $services->set(RoutePlanner::class)->args([
            service('router'),
            tagged_locator('static_site.provider'),
            service(StaticPageResolver::class),
            $defaultUri,
        ]);
        $services->set(PageRenderer::class)->args([
            service('kernel'),
            service('router'),
            service(FormatRegistry::class),
            service('services_resetter')->nullOnInvalid(),
            service('event_dispatcher'),
            $defaultUri,
        ]);
        $services->set(Filesystem::class);
        $services->set(\CJean\StaticSiteBundle\Generation\SitemapGenerator::class)->args([$defaultUri]);
        $services
            ->set('cache.static_site.sitemap.storage', \Symfony\Component\Cache\Adapter\FilesystemAdapter::class)
            ->args(['static_site_sitemap', 0, '%kernel.cache_dir%/static_site_sitemap'])
            ->tag('cache.pool');
        $services
            ->set('cache.static_site.sitemap', \Symfony\Component\Cache\Adapter\TagAwareAdapter::class)
            ->args([service('cache.static_site.sitemap.storage')])
            ->tag('cache.pool');
        $services->set(\CJean\StaticSiteBundle\Generation\SitemapService::class)->args([
            service(RoutePlanner::class),
            service(PageRenderer::class),
            service(\CJean\StaticSiteBundle\Generation\SitemapGenerator::class),
            service('cache.static_site.sitemap'),
            service('router'),
            service(StaticPageResolver::class),
            // Discovering every page within one HTTP request is reserved to development environments.
            $container->getParameter('kernel.environment') !== 'prod',
        ]);
        $services->set(\CJean\StaticSiteBundle\Generation\BuildReportStore::class)->args([
            service(Filesystem::class),
            '%kernel.project_dir%',
            $config['output_dir'],
        ]);
        if ($container->getParameter('kernel.debug')) {
            $services
                ->set(\CJean\StaticSiteBundle\Controller\ProfilerDataController::class)
                ->args([
                    service('profiler')->nullOnInvalid(),
                    service(\CJean\StaticSiteBundle\Generation\BuildReportStore::class),
                ])
                ->public()
                ->tag('controller.service_arguments');
        }
        $services->set(DirectoryPublisher::class)->args([
            service(Filesystem::class),
            '%kernel.project_dir%',
            $config['output_dir'],
        ]);
        $services->set(AssetExporter::class)->args([
            '%kernel.project_dir%',
            $config['assets'],
            $config['require_vite_build'],
            $config['vite_build_directory'],
            service(EntrypointsLookupInterface::class)->nullOnInvalid(),
            $config['reprise_metadata_directory'],
            $defaultUri,
        ]);
        $services->set(SiteBuilder::class)->args([
            service(RoutePlanner::class),
            service(PageRenderer::class),
            service(DirectoryPublisher::class),
            service(AssetExporter::class),
            service(\CJean\StaticSiteBundle\Generation\BuildReportStore::class),
            service('event_dispatcher'),
        ]);
        if ($config['sitemap']) {
            $services->set(\CJean\StaticSiteBundle\EventListener\SitemapListener::class)->args([
                service(\CJean\StaticSiteBundle\Generation\SitemapGenerator::class),
                service(\CJean\StaticSiteBundle\Generation\SitemapService::class),
            ])->tag('kernel.event_listener', [
                'event' => \CJean\StaticSiteBundle\Event\SiteRenderedEvent::class,
                'method' => 'onSiteRendered',
            ])->tag('kernel.event_listener', [
                'event' => \CJean\StaticSiteBundle\Event\SitePublishedEvent::class,
                'method' => 'onSitePublished',
            ]);
        }
        $services
            ->set(GenerateCommand::class)
            ->args([
                service(SiteBuilder::class),
                service(RoutePlanner::class),
                '%kernel.environment%',
                '%kernel.debug%',
            ])
            ->tag('console.command');
    }
}
