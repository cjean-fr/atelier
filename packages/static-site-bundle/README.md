# StaticSiteBundle

Bundle SSG pour Symfony 8 et PHP ≥ 8.4.1. Les contrôleurs et templates Twig
fonctionnent en SSR pendant le développement. La commande `ssg:build` exécute
les mêmes routes et produit des fichiers HTML, JSON, texte ou Markdown, un sitemap et les assets de production.

Vite 8, Tailwind CSS 4 et l’intégration officielle Symfony Reprise sont inclus dans l’exemple
exécutable. Le bundle dépend de Reprise côté PHP ; le projet consommateur
installe ses dépendances JavaScript. Aucun crawler ni serveur HTTP n’est requis.

## Essayer l’exemple

Depuis la racine du dépôt :

```bash
composer install
npm ci --prefix examples
export APP_SECRET="une-cle-locale-pour-la-demo"
npm run build --prefix examples
APP_ENV=prod APP_DEBUG=0 php examples/bin/console cache:clear
APP_ENV=prod APP_DEBUG=0 php examples/bin/console ssg:build --dry-run
APP_ENV=prod APP_DEBUG=0 php examples/bin/console ssg:build
```

Le résultat se trouve dans `examples/var/static/` : accueil, deux articles, JSON, texte, Markdown,
assets hashés et `sitemap.xml`. Le domaine de l’exemple est `https://example.com` ;
modifier `examples/config/packages/static_site.yaml` avant de déployer.

Pour le développement, ouvrir deux terminaux avec `APP_SECRET` défini :

```bash
APP_ENV=dev APP_DEBUG=1 php -S 127.0.0.1:8000 -t examples/public
```

```bash
npm run dev --prefix examples
```

Ouvrir `http://127.0.0.1:8000`. Les routes sont rendues par Symfony ; Vite fournit
le HMR. Arrêter Vite et relancer `npm run build` avant un export, puis vider le
cache prod si les métadonnées Vite ont changé.

## Installer dans une application

Le package n’est pas publié sur Packagist. Ajouter un dépôt Composer `path`
pointant vers ce checkout, puis installer :

```json
{
  "repositories": [
    {"type": "path", "url": "../static-site-bundle"}
  ]
}
```

```bash
composer require cjean/static-site-bundle:@dev
```

### Avec Symfony Flex

Si Symfony Flex est installé et autorisé dans l’application, l’installation
Composer active automatiquement les bundles dans `config/bundles.php`.
Le package utilise déjà `type: symfony-bundle`, l’autoload PSR-4
`CJean\StaticSiteBundle\` et la classe `StaticSiteBundle`, détectables par Flex.
Une recette dédiée n’est pas nécessaire pour cet enregistrement automatique.

La configuration Reprise, les assets et la configuration `static_site` décrits
ci-dessous restent à ajouter : aucune recette de configuration de ce bundle
n’est publiée actuellement. Une future recette pourra automatiser ce setup.
Ne pas installer ce bundle en `require-dev` si ses services doivent être
présents dans le cache prod utilisé pour le build.

### Sans Symfony Flex

Enregistrer les bundles manuellement dans `config/bundles.php` :

```php
return [
    Symfony\Bundle\FrameworkBundle\FrameworkBundle::class => ['all' => true],
    Symfony\Bundle\TwigBundle\TwigBundle::class => ['all' => true],
    Symfony\Reprise\RepriseBundle::class => ['all' => true],
    CJean\StaticSiteBundle\StaticSiteBundle::class => ['all' => true],
];
```

Conserver les autres bundles déjà présents. Copier ou fusionner les fichiers
`examples/vite.config.js`, `examples/package.json`, `examples/assets/` et
`examples/config/packages/reprise.yaml` dans l’application. Utiliser les
fonctions `reprise_entry_link_tags('app')` et `reprise_entry_script_tags('app')` dans le
layout Twig, comme dans `examples/templates/base.html.twig`. Le plugin Tailwind
utilise `@import "tailwindcss"` et détecte explicitement les templates Twig.
Reprise injecte le client HMR via Twig pendant le développement ; aucune route
de proxy spécifique n’est nécessaire.

Les contrôleurs et providers utilisent l’autowiring et l’autoconfiguration
habituels de Symfony. Aucun listener SSG ne modifie les requêtes SSR.

## Sélectionner les routes

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
rendu, par exemple une balise `noindex` (voir [Événements](#événements)).
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

## Formats de sortie et extension

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

## Configurer et exporter

```yaml
# config/packages/framework.yaml
framework:
    router:
        default_uri: 'https://mon-site.fr'
```

```yaml
# config/packages/static_site.yaml
static_site:
    output_dir: '%kernel.project_dir%/var/static'
    assets: ['build', 'bundles', 'images', 'favicon.ico', 'robots.txt']
    require_vite_build: true
    vite_build_directory: build
    sitemap: true
```

L’URL publique du site est celle que Symfony utilise hors requête HTTP :
`framework.router.default_uri`, qui peut venir d’une variable d’environnement.
Elle est obligatoire pour le build et le sitemap, en HTTP(S), sans query ni
fragment. Un chemin y place le site sous un préfixe : avec
`default_uri: 'https://mon-site.fr/docs'`, les liens de `path()` et `url()`, les
URL de `asset()` et des balises Reprise ainsi que le sitemap portent `/docs` ;
les fichiers restent à la racine de `output_dir`, à publier sous `/docs`.
Garder `publicPath: '/build/'` dans le plugin Reprise : les URL que Vite écrit
lui-même dans les fichiers compilés (`url()` du CSS, imports dynamiques) ne
portent pas le préfixe, à vérifier si l’application en contient. `sitemap: false` désactive le sitemap du build et la route SSR. Les fichiers
publics absents de la liste sont ignorés ; les entrées optionnelles inexistantes
sont ignorées. Le build Vite et ses métadonnées de production sont obligatoires
par défaut. Pour un site sans assets Vite, désactiver `require_vite_build`. Les
fichiers locaux référencés dans le manifest et les entrypoints (JS, CSS, chunks,
assets, imports et préchargements) doivent exister et être inclus dans l’export.
Un fichier manquant bloque la publication et conserve le précédent export.
Les URL HTTP(S) de CDN restent autorisées et externes : le bundle ne les copie
pas et ne vérifie pas leur disponibilité distante.

L’exemple utilise Reprise 1.3 et Vite ≥ 8.2, avec `input` au niveau principal de
la configuration Vite. `manifest.json` est une table de chemins logiques vers
les URL produites par Reprise ; les entrypoints sont validés via son contrat
public de lecture, également utilisé par Twig. Les formats natifs du manifest
Vite et les anciennes métadonnées Pentatrion ne sont plus utilisés.

Si les métadonnées sont séparées des assets avec `metadataPath: 'var/reprise'`,
configurer les deux bundles sur ce répertoire :

```yaml
reprise:
    output_path: '%kernel.project_dir%/var/reprise'
static_site:
    reprise_metadata_directory: '%kernel.project_dir%/var/reprise'
```

Les assets compilés restent dans `public/build` et sont copiés normalement.


```bash
npm run build
APP_ENV=prod APP_DEBUG=0 php bin/console cache:clear
APP_ENV=prod APP_DEBUG=0 php bin/console ssg:build
```

`--dry-run` valide et liste les routes sans rendu ni écriture. Il ne peut donc prédire
les chemins de sortie, le choix par défaut du sitemap ou les collisions entre fichiers ;
il ne valide pas les réponses des contrôleurs, les assets ou la publication. `-vv` expose
l’exception complète pour diagnostiquer un échec.

La sortie doit être un répertoire dédié sous `var/`, hors `cache/`, `log/` et
`ssg/`. Le bundle refuse de remplacer un répertoire qu’il n’a pas créé. Il
utilise un verrou, écrit dans un staging voisin, puis remplace l’ancien export
après succès. Une erreur de rendu conserve l’ancien export. Les fichiers devenus
inutiles disparaissent au build suivant.

Une fois le nouvel export activé, un échec de nettoyage du backup ou du staging
est signalé comme avertissement ; la commande reste réussie. Si l’activation
échoue, le bundle tente de restaurer l’ancien export. Un échec de restauration
est signalé avec l’erreur initiale et le chemin du backup à récupérer. Le verrou
est libéré même lorsque le nettoyage échoue. Une interruption brutale entre les
deux renommages peut laisser un backup : cette publication locale ne remplace
pas le mécanisme de bascule de l’hébergeur.

## Contrat des pages et du déploiement

- Les sorties exportées doivent accepter GET et répondre HTTP 200 avec le type MIME attendu par leur format.
- `/` devient `index.html`, `/article` et `/article/` deviennent `article/index.html`,
  et `/about.html` reste `about.html`. Une collision entre deux sorties, une sortie et
  un asset public, ou avec `sitemap.xml` fait échouer le build.
- Redirections, réponses streamées/binaires, cookies, sessions, queries et routes
  sur une autre origine sont refusés. Les routes non sélectionnées restent SSR.
- Les chemins avec traversée, segments cachés ou encodages ambigus sont refusés.
  Les scripts publics et les liens symboliques ne sont pas copiés.
- La requête principale possède l’attribut `_ssg=true`. Les modules Symfony
  resettable sont réinitialisés après chaque rendu ; les modules applicatifs qui
  gardent un état doivent implémenter `ResetInterface`. Le reset et la
  restauration du contexte sont tentés indépendamment. Si rendu et nettoyage
  échouent, l’erreur de rendu reste prioritaire ; un échec de nettoyage seul
  fait aussi échouer le build.
- Les pages doivent être publiques et indépendantes d’un utilisateur. Le bundle
  ne peut pas détecter une personnalisation applicative qui n’utilise ni cookie
  ni session. `kernel.terminate` n’est pas exécuté : les traitements différés
  (e-mails, messages Messenger…) ne partent pas pendant un build.
- `sitemap.xml` est réservé et généré quand au moins une page y est listée.
  Au-delà de 50 000 URL ou 50 Mio de XML non compressé, il devient un index
  pointant vers `sitemap-1.xml`, `sitemap-2.xml`, etc. Le build incrémental reste hors périmètre.

Déployer uniquement le contenu de `var/static` sur l’hébergement statique.
Configurer celui-ci pour servir les fichiers `index.html` dans les répertoires (et les URL sans slash final). Les
formulaires POST, l’authentification et les
fonctionnalités dynamiques nécessitent un backend accessible séparément.
Les en-têtes HTTP du SSR ne sont pas reproduits dans les fichiers : configurer
cache, CSP et autres en-têtes sur l’hébergeur. Pour les assets hashés, utiliser
un cache long immutable ; pour le HTML, un cache court ou une revalidation.

## Servir le site statique

Chaque page HTML est écrite en `<chemin>/index.html` ; les autres formats et les
URL avec extension restent des fichiers simples. Pour une page d’erreur, exporter
une route `/404.html` qui répond 200 avec le contenu de l’erreur, hors sitemap :

```php
#[Route('/404.html', name: 'not_found', methods: ['GET'])]
#[StaticPage(sitemap: false)]
public function notFound(): Response { /* ... */ }
```

Caddy :

```caddyfile
mon-site.fr {
    root * /var/www/site
    encode zstd gzip
    file_server
    handle_errors {
        rewrite * /404.html
        file_server
    }
}
```

nginx :

```nginx
server {
    server_name mon-site.fr;
    root /var/www/site;
    location / {
        try_files $uri $uri/ =404;
    }
    error_page 404 /404.html;
}
```

Apache (`.htaccess` à la racine) :

```apache
DirectoryIndex index.html
ErrorDocument 404 /404.html
```

GitHub Pages et Cloudflare Pages servent `index.html` dans les répertoires et
`404.html` pour les pages absentes, sans configuration. Avec GitHub Pages,
déployer par un workflow : l’artefact est servi tel quel, sans Jekyll.

```yaml
# .github/workflows/deploy.yml (permissions pages: write et id-token: write)
- run: npm run build
- run: php bin/console ssg:build
  env: { APP_ENV: prod, APP_DEBUG: '0' }
- uses: actions/upload-pages-artifact@v5
  with: { path: var/static }
- uses: actions/deploy-pages@v5
```

Cloudflare Pages déploie le répertoire avec `npx wrangler pages deploy var/static`.
Pour un site publié sous un chemin de base, adapter `root` ou l’emplacement
de publication à ce chemin.

## Événements

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

## Qualité et Symfony 8.2

```bash
composer validate --strict
composer check

# Campagne reproductible plus longue
SSG_FUZZ_SEED=42 SSG_FUZZ_CASES=5000 composer test:fuzz
```

Mago est une dépendance de développement épinglée. `composer check` vérifie le
formatage, la syntaxe PHP, le lint, les types du bundle et les tests PHPUnit.
`composer format` applique le formatage. L’analyse de types porte sur `src/` ;
les fixtures de tests et l’exemple passent par le lint, le formatage et PHPUnit.
Les métriques de complexité sont consultables avec `vendor/bin/mago lint` et
restent des conseils ; les erreurs et avertissements du profil choisi échouent
en CI. Les valeurs JSON et Symfony sont vérifiées à l’usage, sans baseline
d’erreurs d’analyse. Le premier lancement télécharge le binaire officiel Mago.

Les tests du groupe `fuzz` génèrent des chemins, des types MIME et des mutations
de métadonnées Reprise. Ils vérifient le confinement des écritures, la conservation
des contenus, la sélection MIME et le refus des métadonnées invalides avant copie.
Ils rapportent graine, numéro de cas et entrée hexadécimale en cas d’échec.
La suite normale utilise 200 cas par scénario ; un job CI distinct utilise
5 000 cas avec trois graines. Ce fuzzing génératif reproductible ne mesure pas
la couverture et n’effectue pas de réduction automatique des entrées.

PHPUnit nécessite notamment `mbstring`, `dom` et `xmlwriter`. Le bundle utilise
`AbstractBundle`, une configuration validée, des dépendances explicites et des
providers autoconfigurés. L’interface de reset est le contrat stable
`Symfony\Contracts\Service\ResetInterface`, ce qui évite la classe dépréciée
et déplacée dans Symfony 8.1.

La CI teste Symfony 8.0/PHP 8.4, Symfony 8.1/PHP 8.5 et une branche expérimentale
Symfony `8.2.x-dev`. La 8.2 est [encore en développement](https://symfony.com/releases/8.2),
avec une sortie prévue en novembre 2026. Une matrice verte sur sa branche actuelle
ne constitue pas une garantie sur sa version finale. Le bundle évite les API
internes et n’impose pas de fonctionnalités annoncées mais non stabilisées.

Voir [l’architecture](docs/architecture.md) pour les modules, interfaces et seams.

### État de l’audit JavaScript

L’audit du 12 octobre 2026 ne signale aucune vulnérabilité dans les dépendances
Node de l’exemple utilisant `@symfony/reprise`. Recontrôler
`npm audit --prefix examples` lors des mises à jour.

Références : [bundles Symfony](https://symfony.com/doc/current/bundles/extension.html),
[Symfony Reprise](https://symfony.com/bundles/reprise/current/index.html),
[Tailwind avec Vite](https://tailwindcss.com/docs/installation/using-vite).

En SSR, le bundle expose automatiquement `/sitemap.xml`, sans écraser une route
applicative déjà définie à ce chemin. Hors de l’environnement `prod`, il répond
même avant le premier build : le service commun découvre les URL et inspecte les
réponses pour appliquer les règles de `Content-Type` et de `sitemap`. Cette
première demande peut donc exécuter les providers et les contrôleurs sélectionnés ;
elle ne publie aucun fichier statique. Les pages SSR ordinaires et la toolbar
n’exécutent pas les providers.

En `prod`, cette découverte à froid, qui rendrait chaque page sélectionnée dans
une seule requête HTTP, est désactivée : `/sitemap.xml` répond 404 tant qu’aucun
build n’a alimenté le cache du kernel prod, par exemple après `cache:clear`.

Le pool `cache.static_site.sitemap` conserve les paramètres par provider et route,
puis les URL indexables par contrôleur, route et jeux de paramètres. Le XML final
est également caché. Une invalidation de contrôleur conserve les données du
provider ; une invalidation de provider invalide les résultats dépendants.
Le service interne `SitemapService` expose `invalidateProvider($id)` et
`invalidateController($classOrClassAndMethod)` pour les mises à jour applicatives.
Pour vider tout le cache :

```bash
php bin/console cache:pool:clear cache.static_site.sitemap
```

Il n’y a pas d’expiration automatique : invalider après modification des données,
ou vider le pool. Un build réussi remplace tout le pool par son propre résultat :
le XML, les paramètres de chaque provider et les URL retenues par route. Après un
build, une invalidation ciblée ne recalcule donc que le provider ou le contrôleur
concerné, y compris en `prod`. Un build échoué ne remplace pas ce résultat. Les
caches Symfony dev et prod sont séparés.

Au-delà de 50 000 URL ou 50 Mio non compressés, `/sitemap.xml` devient un index et
les routes `/sitemap-1.xml`, `/sitemap-2.xml`, etc. servent ses parties, avec le même
cache. Sans URL indexable, ou pour une partie inexistante, la route répond 404.

Consulter les [bonnes pratiques de données et de performance](docs/performance.md)
pour charger les données communes une seule fois, gérer les resets et mesurer
les builds à froid et à chaud.

La [documentation du bundle en site Symfony](examples/bundle-docs/README.md)
propose 12 pages en français et une navigation
précédente/suivante.

## Toolbar et diagnostic SSB

Quand le profiler Symfony est actif en debug, le bouton SSB indique si l’action
est sélectionnée pour l’export. Le panneau montre les arguments de `StaticPage`,
les paramètres de la requête et un aperçu des jeux produits par le provider.
Le profiler n’exécute aucun provider. Le panneau lit les
100 premiers jeux capturés lors de la dernière publication, avec leur nombre total.
Les sections « Provider output » et « Last published source » chargent leurs
données uniquement à leur ouverture ; aucune lecture de fichier au chargement
de la toolbar ou du panneau. Les diagnostics sont privés dans `var/ssg/reports/`.

Le nom du provider utilise le même lien d’éditeur que les contrôleurs Symfony
(`file_link`, selon la configuration IDE). La source affichée, échappée, est
celle du dernier fichier publié, avec sa date ; elle ne représente pas le
rendu SSR actuel. Son aperçu est limité à 256 KiB. Le collector est absent hors
debug et ne nécessite pas le profiler comme dépendance de production.

Les erreurs de planification ou de rendu indiquent le nom de route, le provider,
les paramètres et l’URL lorsqu’elle a été générée. Si l’itérateur du provider
échoue entre deux jeux, le message indique la dernière valeur observée.
L’exception initiale reste disponible dans la chaîne des causes (`-vv`).
