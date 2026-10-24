---
title: "Sélectionner les routes"
---

# Sélectionner les routes

La génération est explicite. L’attribut PHP dédié `#[StaticPage]` se place sur
l’action du contrôleur, à côté de `#[Route]`. Une action fixe :

```php
use Symfony\Component\Routing\Attribute\Route;
use CJean\StaticSiteBundle\Attribute\StaticPage;

#[Route('/', name: 'home', methods: ['GET'])]
#[StaticPage]
public function home(): Response
{
    return new Response($this->twig->render('home.html.twig'));
}
```

Une action dynamique référence son provider dans le même attribut :

```php
#[Route('/articles/{slug}', name: 'article', methods: ['GET'])]
#[StaticPage(provider: ArticleProvider::class)]
public function article(string $slug): Response
{
    // Le contrôleur habituel : mêmes données et même Twig en SSR et SSG.
}
```

```php
use CJean\StaticSiteBundle\Provider\RouteProviderInterface;

final readonly class ArticleProvider implements RouteProviderInterface
{
    public function __construct(private ArticleRepository $articles) {}

    public function parameters(string $routeName): iterable
    {
        foreach ($this->articles->publishedSlugs() as $slug) {
            yield ['slug' => $slug];
        }
    }
}
```

Le provider est un module de découverte de paramètres. Il peut lire une base,
un CMS ou des fichiers. Il ne rend pas la page. L’interface accepte un générateur
pour éviter de charger toutes les données d’un coup ; les tableaux produits
contiennent les paramètres nécessaires à `UrlGeneratorInterface`. Tous les
providers sont consommés et les URL sont validées avant le premier rendu :
un provider n’est jamais suspendu pendant qu’un contrôleur s’exécute.

Pour une courte liste fixe, les jeux de paramètres peuvent être écrits dans
l’attribut, sans provider. `provider` et `parameters` sont exclusifs :

```php
#[Route('/langues/{code}', name: 'language', methods: ['GET'])]
#[StaticPage(parameters: [['code' => 'fr'], ['code' => 'en']])]
public function language(string $code): Response { /* ... */ }
```

### Sitemap

`sitemap.xml` liste les pages canoniques et indexables proposées aux moteurs de
recherche. C’est une suggestion, pas une interdiction : une page hors sitemap
reste explorée et indexable si un lien y mène. La règle à suivre : une page en
`noindex`, ou dont le `canonical` pointe vers une autre URL, doit être hors
sitemap. Le bundle n’ajoute ni `noindex` ni `canonical` ; ces balises restent
dans les templates.

Par défaut, les sorties HTML figurent dans le sitemap et les autres formats non.
L’attribut change ce choix pour toute l’action, par exemple pour une page dont
le template porte `noindex` :

```php
#[Route('/merci', name: 'thanks', methods: ['GET'])]
#[StaticPage(sitemap: false)]
public function thanks(): Response { /* template avec <meta name="robots" content="noindex"> */ }
```

Quand la décision dépend des données, le provider la prend page par page en
produisant un `RouteParameters` au lieu d’un tableau. Exemple : les pages de tag
avec trop peu d’articles sont en `noindex`. La même règle pilote le template et
le sitemap, pour qu’ils ne se contredisent pas :

```php
use CJean\StaticSiteBundle\Provider\RouteParameters;

public function parameters(string $routeName): iterable
{
    foreach ($this->tags->all() as $tag) {
        yield new RouteParameters(['slug' => $tag->slug], sitemap: $tag->isIndexable());
    }
}
```

```twig
{% if not tag.indexable %}<meta name="robots" content="noindex">{% endif %}
```

Le choix le plus précis l’emporte : `RouteParameters::$sitemap`, puis
`#[StaticPage(sitemap: ...)]`, puis le format. `null` signifie « hériter ».
Un listener de `PageRenderedEvent` peut encore exclure la page d’après son contenu
rendu, par exemple une balise `noindex` (voir [Événements](/api/events)).
Les pages hors sitemap sont exportées normalement ; `--dry-run` les signale avec
`(not in sitemap)` quand leur exclusion est explicite. Le choix par défaut
dépend du Content-Type et sera connu après le rendu.

Pour une pagination, chaque page (`/articles/page/2`…) est sa propre URL
canonique et reste indexable : ni `noindex`, ni `canonical` vers la page 1, sinon
les articles des pages suivantes sont moins bien découverts. Les pages 2 à N
peuvent rester dans le sitemap ou en sortir ; l’essentiel est que les articles,
eux, y figurent et que les pages soient liées entre elles. Voir le guide Google
[Pagination and incremental page loading](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading).

L’attribut s’applique à toutes les routes associées à l’action. Pour cibler une
route précise, utiliser `#[StaticPage(route: 'article', provider: ArticleProvider::class)]`.
L’attribut est répétable pour associer des providers différents à des routes
portées par une même action ; deux attributs sélectionnant la même route sont
refusés. Pour une route localisée, `route` peut désigner son nom canonique (`article`) ou son nom concret
(`article.fr`). Sur une méthode, y compris `__invoke`, l’attribut peut être
porté par une méthode héritée.

Placé sur la classe, l’attribut sélectionne toutes ses actions qui acceptent GET ;
celles réservées à d’autres méthodes HTTP, comme le traitement d’un formulaire,
sont ignorées. Une action qui porte ses propres `#[StaticPage]` ignore celui de
la classe, même si aucun ne sélectionne la route courante :

```php
#[StaticPage]
final class PagesController
{
    #[Route('/a-propos', name: 'about', methods: ['GET'])]
    public function about(): Response { /* exportée */ }

    #[Route('/contact', name: 'contact_send', methods: ['POST'])]
    public function send(): Response { /* ignorée : POST uniquement */ }
}
```

Pour une route dont le contrôleur ne peut pas porter l’attribut, comme
`TemplateController`, utiliser la clé `_static_page` de ses defaults. `true`
sélectionne la route ; un tableau accepte `provider`, `sitemap` et `parameters` ;
`false` exclut une route que sa classe sélectionnerait. La clé l’emporte sur
les attributs de l’action :

```yaml
# config/routes.yaml
legal:
    path: /mentions-legales
    controller: Symfony\Bundle\FrameworkBundle\Controller\TemplateController
    defaults:
        template: legal.html.twig
        _static_page: true
```

Les contrôleurs peuvent être référencés par leur classe, un callable tableau ou
un identifiant/alias du container Symfony. Les classes des contrôleurs déclarées
dans le container sont résolues à la compilation ; la découverte ne construit
pas les contrôleurs. Les closures ne sont pas sélectionnées. L’attribut fonctionne
aussi si la route est déclarée en YAML ou PHP et référence une action décorée.

Les routes localisées sont traitées après expansion par Symfony : le provider
reçoit le nom concret, par exemple `article.fr` ou `article.en`. Il peut adapter
les slugs en conséquence. Les variables optionnelles et les variables d’hôte
nécessitent aussi un provider. Les paramètres supplémentaires qui produisent
une query string sont refusés.

Pour une application sans autoconfiguration, ajouter explicitement le tag
`static_site.provider` au provider. L’identifiant du provider dans l’attribut doit
être son identifiant de module dans le container, généralement son nom de classe.
