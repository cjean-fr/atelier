# Architecture

L’interface publique du module est volontairement petite : l’attribut PHP dédié
`#[StaticPage(provider: ..., route: ..., sitemap: ...)]`, `RouteProviderInterface::parameters()` (tableaux ou `RouteParameters`), la configuration
`static_site` et la commande `ssg:build`. Les classes de génération et de routing
sont internes, hors le contrat `OutputFormatInterface` et les formats réutilisables ; leur disposition peut changer sans changer l’intégration d’une application.

La seam externe pour les données est le provider. Un adapter Doctrine, un adapter
CMS ou un adapter en mémoire produit les mêmes tableaux de paramètres. Il ne
connaît ni le kernel, ni les chemins de fichiers, ni Vite. Aucun contrat de stockage
ou de rendu supplémentaire n’est imposé à l’application.

| Module interne       | Interface              | Comportement encapsulé                                                                                    |
|----------------------|------------------------|-----------------------------------------------------------------------------------------------------------|
| `StaticPageResolver` | `resolve(name, route)` | Lecture des attributs des actions sans instanciation ni mutation des routes                               |
| `RoutePlanner`       | `pages()`              | Requêtes : sélection, providers, URL Symfony, origine, matching, URL dupliquées ; contexte restauré       |
| `PageRenderer`       | `render(page)`         | Requête principale, terminate, validation de réponse, reset des modules Symfony, restauration du contexte |
| `AssetExporter`      | `exportTo(staging)`    | Métadonnées Vite et allowlist public                                                                      |
| `StagingDirectory`   | `write()`, `copy()`    | Chemins sûrs, écriture unique (toutes les collisions), rejet des liens, fichiers cachés et scripts        |
| `DirectoryPublisher` | `publish(write)`       | Répertoire détenu par le bundle, verrou, staging, remplacement et rollback                                |
| `SiteBuilder`        | `build()`              | URL validées, assets et réponses rendues, chemins vérifiés puis sitemap dans une publication unique                   |

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

Le `Content-Type` de la réponse est la source de vérité du format. Le registre
associe chaque type MIME exact à un seul adapter ; les déclarations ambiguës
échouent. `ExportPage` décrit une requête à exécuter et ses éventuelles directives
sitemap. `PageRenderer` retourne un `RenderedPage` avec chemin, bytes et choix
sitemap final. La décision spécifique au format ne fuit pas dans le plan ou
l’attribut. Les overrides sitemap de l’attribut et du provider restent prioritaires.

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
Une erreur de rendu (kernel, terminate ou conversion) reste prioritaire si le
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
dans ce résultat ; `ssg:build` les affiche et conserve le code de succès.

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

## Diagnostic du dernier build

Le collector de développement ne capture que les métadonnées : attribut,
paramètres SSR, chemin de sortie et emplacement du provider. Il ne crée aucun
provider et ne lit aucun fichier publié. Les sections du profiler chargent au
clic les diagnostics via une route disponible uniquement en debug.

`BuildReportStore` conserve les paramètres déjà planifiés dans `var/ssg/reports/`,
avec une limite de 100 jeux par route et le nombre total. La publication inscrit
un identifiant dans `.ssg-owned` ; seuls les diagnostics de cet identifiant sont
lus. Ils sont écrits après activation, sous le verrou de publication. Une erreur
de diagnostic devient un avertissement ; elle ne fait pas échouer l’export actif
et ne permet pas d’afficher les paramètres d’un ancien build à sa place.

## Sitemap partagé et cache granulaire

`SitemapGenerator` produit les documents XML, avec découpage à 50 000 URL ou
50 Mio non compressés et création de l’index. Le build utilise les URL retenues
après rendu, sans consulter les caches de découverte pour planifier ses pages.
Une publication réussie remplace ensuite le cache XML utilisé en SSR.

`SitemapService` sert le même contrat dès avant le premier build, hors `prod`. La première
requête explicite de sitemap planifie les routes et inspecte leurs réponses en
sous-requêtes ; la sélection par MIME utilise `FormatRegistry`, sans exporter
les assets dev ou exécuter `kernel.terminate`. Les providers sont consommés avant
les inspections. Les services du parent ne sont pas reset pendant ces
sous-requêtes. Les contrôleurs doivent respecter les règles habituelles des
sous-requêtes Symfony et ne pas dépendre d’un état utilisateur.

Le cache tagué est persistant dans le cache Symfony du kernel. Ses clés distinguent
provider et route, puis contrôleur/action, route et paramètres effectifs. Les
identités des contrôleurs sont résolues par réflexion, y compris pour les alias,
sans les instancier. L’assemblage XML dépend des tags provider et contrôleur ;
les invalidations ciblées conservent les entrées indépendantes. Le pool peut être
vidé avec `cache:pool:clear cache.static_site.sitemap`. Aucun TTL n’est implicite :
la mise à jour de données demande une invalidation applicative explicite.

Après activation, la publication remplit le pool avec les mêmes clés que la
découverte : `RoutePlanner::rememberDiscovery()` stocke les jeux de chaque provider,
y compris vides, et `SitemapService` les URL retenues par route. Rejouer ces jeux
reproduit exactement les `ExportPage` du build : un override sitemap effectif est
stocké dans un `RouteParameters`, sinon le tableau seul. Les entrées des autres
routes restent donc valides après une invalidation ciblée.

En `prod`, `SitemapService` refuse la découverte à froid : sans le marqueur non
tagué écrit par un build, il ne planifie rien et le contrôleur répond 404. Ce
marqueur survit aux invalidations par tags, pas à un vidage du pool. Le coût
d’une requête de sitemap en `prod` est ainsi borné par la partie invalidée,
jamais par le site entier.
