---
title: "Architecture"
---

# Architecture

L’interface publique du module est volontairement petite : l’attribut PHP dédié
`#[StaticPage(provider: ..., route: ..., sitemap: ..., parameters: ...)]` et son équivalent `_static_page`
dans les defaults d’une route, `RouteProviderInterface::parameters()` (tableaux ou `RouteParameters`), les trois
événements de build, la configuration `static_site` et la commande `ssg:generate`. Les classes de génération et de routing
sont internes, hors le contrat `OutputFormatInterface` et les formats réutilisables ; leur disposition peut changer sans changer l’intégration d’une application.

La seam externe pour les données est le provider. Un adapter Doctrine, un adapter
CMS ou un adapter en mémoire produit les mêmes tableaux de paramètres. Il ne
connaît ni le kernel, ni les chemins de fichiers, ni Vite. Aucun contrat de stockage
ou de rendu supplémentaire n’est imposé à l’application.

| Module interne       | Interface              | Comportement encapsulé                                                                                    |
|----------------------|------------------------|-----------------------------------------------------------------------------------------------------------|
| `StaticPageResolver` | `resolve(name, route)` | Lecture des attributs des actions sans instanciation ni mutation des routes                               |
| `RoutePlanner`       | `pages()`              | Requêtes : sélection, providers, URL Symfony, origine, matching, URL dupliquées ; contexte restauré       |
| `PageRenderer`       | `render(page)`         | Requête principale sans terminate, validation de réponse, `PageRenderedEvent`, reset des modules Symfony, restauration du contexte |
| `AssetExporter`      | `exportTo(staging)`    | Métadonnées Vite et allowlist public                                                                      |
| `StagingDirectory`   | `write()`, `copy()`    | Chemins sûrs, écriture unique (toutes les collisions), rejet des liens, fichiers cachés et scripts        |
| `DirectoryPublisher` | `publish(write)`       | Répertoire détenu par le bundle, verrou, staging, remplacement et rollback                                |
| `SiteBuilder`        | `build()`              | URL validées, assets et réponses rendues, chemins vérifiés puis `SiteRenderedEvent` dans une publication unique       |
| `SitemapListener`    | listeners de build     | Sitemap écrit depuis les choix finaux des pages, puis cache SSR alimenté après publication                    |

`DirectoryPublisher` est un module profond : l’appelant fournit uniquement une
fonction qui reçoit un `StagingDirectory`. Il n’a pas à connaître le verrou,
les chemins de backup ou les conditions de remplacement. `StagingDirectory` est le
seul point d’écriture : ce qui peut atterrir dans l’export y est vérifié une fois,
qu’il s’agisse d’une page, d’un asset ou du sitemap. `AssetExporter` concentre
les différences entre les formats Vite dans un seul endroit.

La planification et le rendu ne s’entrelacent pas. `RoutePlanner::pages()` consomme
tous les providers, restaure le contexte du router et retourne une liste. Les
erreurs de plan échouent donc avant le premier rendu, et les resets des modules
Symfony après chaque page ne touchent jamais un provider en cours d’itération.
Le format et le chemin ne sont connus qu’après la réponse. Les collisions entre
fichiers sont vérifiées dans le staging pendant le build ; `--dry-run` ne rend
aucune réponse et ne prédit donc pas ces collisions.

Ces seams internes sont concrètes. Le provider varie réellement selon la source
de données ; les formats varient réellement avec le type de sortie ; les autres modules ont une seule implémentation, donc aucune
interface PHP spéculative n’est ajoutée. Les dépendances sont injectées par le
bundle, y compris le système de fichiers. Le constructeur de la commande ne
porte aucune règle de copie ou de rollback.

Les tests traversent les mêmes interfaces : commande + kernel réel pour le cycle
complet, `pages()` pour les cas de routing, `render()` pour les types de réponses,
`StagingDirectory` pour les collisions et les fichiers refusés, et la conversion
des chemins pour les cas de traversée. Le SSR est exercé avec
le même kernel sans passer par la commande SSG.

La publication est validée avant remplacement, mais les deux renommages ne
constituent pas une transaction du système de fichiers : une interruption du
processus entre eux peut laisser un backup adjacent. Le bundle ne sert pas ce
répertoire en direct. Le déploiement doit publier `var/static` séparément et
utiliser le mécanisme de bascule de l’hébergeur pour garantir la disponibilité.

La seam de format est indépendante de celle des données : un même provider peut
alimenter des actions HTML et JSON. Les adapters de format reçoivent une réponse
Symfony déjà rendue, et retournent ses bytes après validation. Le kernel, les
contrôles de sécurité communs et la publication restent centralisés. Aucun switch
sur les noms des formats ne se trouve dans le moteur. Un adapter additionnel
est découvert par autoconfiguration ; il ne nécessite pas de modifier le bundle.

Le `Content-Type` de la réponse est la source de vérité du format, interprété
par la table de formats de Symfony (`Request::getFormat()`, complétée par
`framework.request.formats`) : le bundle ne tient aucune liste de types MIME.
Le nom du format donne l’extension. Un adapter est facultatif et ajoute ses
règles à un format nommé ; sans adapter, les bytes sont exportés tels quels. `ExportPage` décrit une requête à exécuter et ses éventuelles directives
sitemap. `PageRenderer` retourne un `RenderedPage` avec chemin, bytes et choix
sitemap final. La décision spécifique au format ne fuit pas dans le plan ou
l’attribut. Les overrides sitemap de l’attribut et du provider restent prioritaires.

## Événements de build

Les événements forment une seam externe pour les sorties qui dépendent de tout
le site ou d’une transformation de page. `SiteBuilder` ne connaît plus le
sitemap : il rend les pages, puis émet `SiteRenderedEvent` avec la liste des
pages écrites et un accès en écriture au staging. Le sitemap est un listener
interne de cet événement et de `SitePublishedEvent` ; un flux RSS ou un index de
recherche applicatif utilise exactement la même interface. Les fichiers ajoutés
passent par `StagingDirectory`, donc par les mêmes contrôles de chemin et de
collision, et profitent de la publication atomique.

`PageRenderedEvent` est émis après la validation du format, dans le cycle de
rendu : une exception de listener est une erreur de rendu, et le reset comme la
restauration du contexte restent garantis. Le choix sitemap n’accepte qu’une
exclusion. Le sitemap SSR émet le même événement, en mode `preview`, lors de sa
découverte à froid ; build et SSR produisent ainsi le même XML sans que le
listener sache d’où vient la page. Les pages déjà exclues par l’attribut ou le
provider ne sont pas inspectées, ce qui rend une inclusion par listener impossible
à garantir : elle n’est donc pas proposée.

`SitePublishedEvent` est émis sous le verrou, après activation. Son échec ne peut
plus changer l’export actif ; il devient un avertissement. Les listeners de
cet événement sont dispatchés avant l’écriture des diagnostics du profiler.

Les événements ne remplacent pas les seams existantes : le provider reste la
source des paramètres et `OutputFormatInterface` le contrat d’un type MIME. Aucun
service interne n’est remplaçable par redéfinition de son identifiant ; un
événement couvre les variations observées sans figer la disposition interne.

## Revue de profondeur du 12 octobre 2026

`FormatRegistry::export(response, path, sitemap)` est l’interface interne de
conversion. Elle retourne un `RenderedPage` validé et encapsule la sélection
MIME, le chemin, les contrôles de sécurité, le contenu et le choix du sitemap.
`PageRenderer` ne connaît plus l’ordre des opérations sur les formats : il
possède uniquement le cycle de requête Symfony, ses contrôles et son reset.
Les tests de conversion traversent cette même interface, sans accéder au lookup
privé du registre.

Le contrat public des formats reste composé de quatre décisions réellement
variables : types MIME, chemin, contenu validé et politique sitemap. Les adapters
HTML, JSON, texte, Markdown et CSV exercent cette seam ; une abstraction
supplémentaire de kernel ou de stockage n’apporterait actuellement aucune
variation réelle. `StagingDirectory` et `DirectoryPublisher` conservent leur
profondeur : le premier protège toute écriture, le second possède entièrement
le remplacement et le rollback. `RenderedPage` et `ExportPage` sont des résultats
immuables, pas des couches de délégation.

### Contrat MIME partagé

La déclaration des adapters, la sélection de la réponse et la validation du
contenu utilisent désormais le même contrat MIME interne. Le registre conserve
le refus des doublons après normalisation. Les tests traversent l’interface de
conversion et celle de l’adapter textuel, notamment pour une déclaration
`Text/CSV` et une réponse `text/csv`. Le contrat public des formats reste inchangé.

### Complétude de l’artefact Vite

`AssetExporter` possède la validation des références du manifest et des
entrypoints : chunks, CSS, assets, imports, imports dynamiques et entrypoints
legacy. Tout fichier local doit exister et appartenir aux chemins copiés.
La seam d’export reste inchangée. Les URL HTTP(S), y compris celles sans schéma
explicite, restent externes et ne sont ni téléchargées ni sondées.
Les tests traversent l’interface d’export, puis vérifient la conservation du
précédent export via la commande quand un fichier référencé manque.

### Erreurs du cycle de rendu

Le module de rendu tente le reset et la restauration du contexte indépendamment.
Une erreur de rendu (kernel, conversion ou listener) reste prioritaire si le
nettoyage échoue aussi. Sans erreur de rendu, la première erreur de nettoyage
fait échouer le build ; elle ne devient pas un succès silencieux. La restauration
est tentée même quand le reset échoue ; son propre échec ne peut évidemment pas
garantir un contexte restauré. Les tests couvrent ces combinaisons à la seam de
rendu, sans introduire un nouvel adapter de kernel.

### Intégration officielle Reprise

L’intégration PHP et le plugin Vite utilisent désormais Symfony Reprise. La
validation SSG consomme `EntrypointsLookupInterface`, son contrat public, sans
appeler son parseur interne. Elle lui délègue le schéma et la compatibilité des
entrypoints, puis vérifie que les URL locales correspondent à des fichiers
copiés. Le manifest Reprise est une table de chemins logiques vers des URL.
La lecture est réinitialisée avant et après la validation pour que celle-ci ne
consomme pas les assets à rendre dans Twig sur les pages suivantes.

Les tests d’intégration utilisent les véritables helpers Twig Reprise sur deux
pages successives, et la CI compile l’exemple avec le plugin officiel. Les
métadonnées peuvent être séparées du build dans un répertoire configuré. Les
CDN restent externes ; la politique de copie et de publication ne change pas.

### Résultat de publication et récupération

`DirectoryPublisher::publish()` retourne un `PublicationResult` interne après
l’activation du nouvel export. Les erreurs ultérieures de suppression du backup,
de staging ou de libération explicite du verrou deviennent des avertissements
dans ce résultat ; `ssg:generate` les affiche et conserve le code de succès.

Avant activation, l’erreur initiale reste prioritaire. Si le rollback ou le
nettoyage échoue également, `PublicationFailure` conserve l’exception initiale
comme cause et ajoute les diagnostics de récupération, dont le chemin du backup.
Les nettoyages sont tentés indépendamment et la fermeture du verrou est toujours
tentée. Les tests injectent des échecs dans les transitions du système de fichiers
réel et vérifient le contenu actif, le backup conservé et la disponibilité du verrou.

### Stockage distant différé

Une intégration Flysystem reste envisagée pour déployer un export local déjà
validé. Elle n’est pas implémentée et aucune dépendance Flysystem n’est ajoutée.
Un stockage objet possède des garanties différentes du verrou et des renommages
locaux ; sa publication devra définir sa propre activation et récupération.

### Analyse statique et fuzzing

Mago vérifie le code PHP à partir d’un profil versionné, sans baseline d’erreurs.
Les règles de types s’appliquent au bundle ; les fixtures volontairement invalides
restent vérifiées par les tests, le lint et le formatter. Les métriques statistiques
de complexité restent consultables comme conseils. Les exceptions de lint propres
aux fixtures sont locales et expliquées.

Le fuzzing traverse les interfaces existantes : conversion par le registre,
chemins, staging et export d’assets. Les entrées aléatoires et mutations sont
reproductibles via une graine ; les invariants portent sur les fichiers résultants
et les refus avant écriture. Ce sont des tests génératifs bornés, sans moteur
de fuzzing guidé par la couverture. Le cas MIME avec NUL final découvert par cette
campagne est conservé comme régression explicite.
