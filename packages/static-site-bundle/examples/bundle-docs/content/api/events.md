---
title: "Événements"
---

# Événements

Trois événements Symfony jalonnent un build. Ils se consomment avec un listener
ou un subscriber habituel, par exemple `#[AsEventListener]` :

| Événement | Moment | Usage typique |
| --- | --- | --- |
| `Event\PageRenderedEvent` | page validée par son format, avant écriture | réécrire le contenu, exclure du sitemap |
| `Event\SiteRenderedEvent` | toutes les pages écrites, avant publication | ajouter un flux, un index de recherche |
| `Event\SitePublishedEvent` | nouvel export actif | notifier, purger un cache, déclencher un déploiement |

```php
use CJean\StaticSiteBundle\Event\PageRenderedEvent;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;

#[AsEventListener]
final class NoindexOutOfSitemap
{
    public function __invoke(PageRenderedEvent $event): void
    {
        if (str_contains($event->getContent(), 'content="noindex"')) {
            $event->excludeFromSitemap();
        }
    }
}
```

`PageRenderedEvent` expose la requête (`$event->page` : route, URL, paramètres),
le fichier de sortie et le contenu. `setContent()` remplace le contenu sans
relancer la validation du format. `excludeFromSitemap()` ne fait qu’exclure :
une page exclue par l’attribut ou son provider n’est pas inspectée par le
sitemap SSR. Ce sitemap applique les mêmes listeners lorsqu’il découvre les
pages lui-même ; `$event->preview` vaut alors `true` et le contenu est ignoré.
Un listener de cet événement doit donc rester sans effet de bord.

```php
use CJean\StaticSiteBundle\Event\SiteRenderedEvent;

#[AsEventListener]
final class PagesIndex
{
    public function __invoke(SiteRenderedEvent $event): void
    {
        $urls = array_map(static fn($exported) => $exported->page->url, $event->pages);
        $event->write('pages.json', json_encode($urls, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES));
    }
}
```

`SiteRenderedEvent::write()` applique les règles des pages : chemin relatif sûr,
aucune collision avec une page, un asset ou un autre fichier ajouté. Une
exception dans `PageRenderedEvent` ou `SiteRenderedEvent` fait échouer le build
et conserve le précédent export. Après publication, une exception dans
`SitePublishedEvent` devient un avertissement : l’export reste actif.

Le sitemap du bundle est lui-même un listener de `SiteRenderedEvent` et de
`SitePublishedEvent`. Il s’appuie sur le choix final de chaque page, après les
listeners de `PageRenderedEvent`.
