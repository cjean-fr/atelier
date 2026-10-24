---
title: "Formats de sortie et extension"
---

# Formats de sortie et extension

Le format est sélectionné automatiquement d’après le `Content-Type` de la
réponse. `#[StaticPage]` sélectionne uniquement l’action à exporter et son provider
éventuel. Il n’existe pas de paramètre `format` à synchroniser avec le contrôleur :

```php
#[Route('/articles.json', name: 'articles_json', methods: ['GET'])]
#[StaticPage]
public function articles(): Response
{
    return new JsonResponse($this->articles->publishedData());
}

// format: 'md' sets _format: Symfony derives Content-Type: text/markdown from it.
#[Route('/guides/{slug}.md', name: 'guide', methods: ['GET'], format: 'md')]
#[StaticPage(provider: GuideProvider::class)]
public function guide(string $slug): Response
{
    return new Response($this->guides->markdown($slug));
}
```

Le format est celui de Symfony : `Request::getFormat()` appliqué au
`Content-Type` de la réponse, ou `_format` de la route quand le contrôleur ne
fixe pas de type. Le fichier prend le nom du format comme extension. Tout format
connu de Symfony s’exporte donc sans code : `txt`, `css`, `js`, `json`, `xml`,
`rss`, `atom`, `csv`, `yaml`, `pdf`, etc. Ajouter un format se fait là où Symfony
l’attend, dans `framework.request.formats` ; il sert alors au SSR comme à
l’export. Symfony ne connaît pas Markdown :

```yaml
# config/packages/framework.yaml
framework:
    request:
        formats:
            md: 'text/markdown'
```

| Réponse | Sans extension dans l’URL | Avec extension | Sitemap |
| --- | --- | --- | --- |
| `text/html` | `/page` → `page/index.html` | `.html`, `.htm` conservées | Oui |
| `application/json` | `/data` → `data.json` | `.json` conservée, contenu validé | Non |
| `text/plain` | `/about` → `about.txt` | `.txt` conservée | Non |
| `text/markdown` (format `md`) | `/guide` → `guide.md` | `.md` conservée | Non |
| `application/rss+xml` | `/feed` → `feed.rss` | `.rss` ou `.xml` (suffixe `+xml`) | Non |

À la racine, chaque format produit `index` avec son extension. Utiliser des
routes avec extension pour les sorties non HTML afin que l’URL SSR corresponde
au fichier déployé. Une extension qui n’est ni le nom du format ni le suffixe
structuré du type (`+xml`, `+json`) est refusée. Les bytes sont conservés : pas
de conversion de HTML vers Markdown, ni de réencodage du JSON. La casse du type
MIME et les paramètres comme `charset=UTF-8` sont ignorés pour la sélection. Un
type absent ou inconnu de Symfony échoue explicitement et désigne
`framework.request.formats`, sans déduction d’après le nom de fichier.

Le chemin final et le choix par défaut du sitemap sont déterminés après le rendu.
Les collisions entre fichiers sont donc vérifiées pendant le build, dans le
staging, avant remplacement du précédent export.

Une classe de format n’est utile que pour ajouter des règles à un format
Symfony : valider le contenu, changer le chemin ou l’inclusion dans le sitemap.
Le bundle en fournit deux, `HtmlFormat` (refus des réponses Vite de
développement) et `JsonFormat` (JSON valide). Étendre `BufferedTextFormat` avec
le nom du format ; la classe est autoconfigurée avec le tag `static_site.format` :

```php
use CJean\StaticSiteBundle\Format\BufferedTextFormat;
use Symfony\Component\HttpFoundation\Response;

final class CsvFormat extends BufferedTextFormat
{
    public function __construct()
    {
        parent::__construct('csv');
    }

    public function render(Response $response): string
    {
        $content = parent::render($response);
        if (!str_starts_with($content, 'id,')) {
            throw new \RuntimeException('CSV exports start with an id column.');
        }
        return $content;
    }
}
```

Implémenter directement `OutputFormatInterface` pour d’autres règles : nom du
format Symfony, chemin de fichier relatif, validation et contenu de la réponse,
inclusion par défaut dans le sitemap (voir [Sitemap](#sitemap)). Sans
autoconfiguration, ajouter explicitement `static_site.format`. Deux classes pour
le même format sont refusées.

Le moteur valide aussi les chemins renvoyés par les formats personnalisés,
refuse les réponses avec cookies/session, les streams et les redirections,
et conserve le précédent export sur toute erreur. Les formats ne manipulent
ni le kernel ni le filesystem. Les headers HTTP ne sont pas stockés : configurer
les types MIME, notamment `.md`, sur l’hébergement statique.
