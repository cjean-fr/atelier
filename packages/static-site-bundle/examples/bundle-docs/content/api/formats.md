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

#[Route('/guides/{slug}.md', name: 'guide', methods: ['GET'])]
#[StaticPage(provider: GuideProvider::class)]
public function guide(string $slug): Response
{
    return new Response($this->guides->markdown($slug), 200, [
        'Content-Type' => 'text/markdown; charset=UTF-8',
    ]);
}
```

| Format | Content-Type accepté | Sans extension dans l’URL | Avec extension | Sitemap |
| --- | --- | --- | --- | --- |
| `html` | `text/html` | `/page` → `page/index.html` | `.html`, `.htm` conservées | Oui |
| `json` | `application/json` | `/data` → `data.json` | `.json` conservée | Non |
| `txt` | `text/plain` | `/about` → `about.txt` | `.txt` conservée | Non |
| `markdown` | `text/markdown` | `/guide` → `guide.md` | `.md` conservée | Non |

À la racine, chaque format produit `index` avec son extension. Utiliser des
routes avec extension pour les sorties non HTML afin que l’URL SSR corresponde
au fichier déployé. Les extensions incompatibles avec le format sont refusées.
Les bytes sont conservés : pas de conversion automatique de HTML vers Markdown,
ni de réencodage du JSON. Le JSON est validé avant publication. Le bundle n’altère pas le `_format` Symfony ou la logique du contrôleur.
La casse du type MIME et les paramètres comme `charset=UTF-8` sont normalisés
pour la sélection. `text/plain` produit du texte, même si le contenu ressemble
à du Markdown ; utiliser `text/markdown` pour une sortie `.md`. Un type absent ou
non pris en charge échoue explicitement, sans déduction d’après le nom de fichier.

Le chemin final et le choix par défaut du sitemap sont déterminés après le rendu.
Les collisions entre fichiers sont donc vérifiées pendant le build, dans le
staging, avant remplacement du précédent export.

Pour ajouter CSV, XML ou un autre format, implémenter
`CJean\StaticSiteBundle\Format\OutputFormatInterface`. Les quatre méthodes
forment le contrat : types MIME pris en charge, chemin de fichier relatif, validation
et contenu de la réponse, inclusion par défaut dans le sitemap (voir [Sitemap](#sitemap)). L’implémentation
est autoconfigurée avec le tag `static_site.format` :

```php
use CJean\StaticSiteBundle\Format\BufferedTextFormat;

final class CsvFormat extends BufferedTextFormat
{
    public function __construct()
    {
        parent::__construct('csv', 'csv', ['text/csv']);
    }
}
```

Puis retourner une réponse `Content-Type: text/csv` depuis une action `#[StaticPage]`. `BufferedTextFormat` est une
implémentation réutilisable pour les formats textuels ; implémenter directement
`OutputFormatInterface` pour des règles différentes. Sans autoconfiguration,
ajouter explicitement `static_site.format` dans la déclaration du module.
Deux formats déclarant le même type MIME sont refusés pour éviter toute
ambiguïté. Aucun ordre ou priorité implicite ne décide du format.

Le moteur valide aussi les chemins renvoyés par les formats personnalisés,
refuse les réponses avec cookies/session, les streams et les redirections,
et conserve le précédent export sur toute erreur. Les formats ne manipulent
ni le kernel ni le filesystem. Les headers HTTP ne sont pas stockés : configurer
les types MIME, notamment `.md`, sur l’hébergement statique.
