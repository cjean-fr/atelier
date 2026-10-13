---
title: "Qualité et Symfony 8.2"
---

# Qualité et Symfony 8.2

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

Voir [l’architecture](/api/architecture) pour les modules, interfaces et seams.

### État de l’audit JavaScript

L’audit du 12 octobre 2026 ne signale aucune vulnérabilité dans les dépendances
Node de l’exemple utilisant `@symfony/reprise`. Recontrôler
`npm audit --prefix examples` lors des mises à jour.

Références : [bundles Symfony](https://symfony.com/doc/current/bundles/extension.html),
[Symfony Reprise](https://symfony.com/bundles/reprise/current/index.html),
[Tailwind avec Vite](https://tailwindcss.com/docs/installation/using-vite).

En SSR, le bundle expose automatiquement `/sitemap.xml`, même avant le premier
build, sans écraser une route applicative déjà définie à ce chemin. Le service
commun découvre les URL et inspecte les réponses pour appliquer les règles de
`Content-Type` et de `sitemap`. Cette première demande peut donc exécuter les
providers et les contrôleurs sélectionnés ; elle ne publie aucun fichier statique.
Les pages SSR ordinaires et la toolbar n’exécutent pas les providers.

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
ou vider le pool. Un build réussi remplace le résultat XML avec ses propres URL
validées et réinitialise les caches de découverte précédents. Un build échoué ne
remplace pas ce résultat. Les caches Symfony dev et prod sont séparés.

Au-delà de 50 000 URL ou 50 Mio non compressés, `/sitemap.xml` devient un index et
les routes `/sitemap-1.xml`, `/sitemap-2.xml`, etc. servent ses parties, avec le même
cache. Sans URL indexable, ou pour une partie inexistante, la route répond 404.

Consulter les [bonnes pratiques de données et de performance](/api/performance)
pour charger les données communes une seule fois, gérer les resets et mesurer
les builds à froid et à chaud.

## Toolbar SSB

En dev avec le profiler Symfony, le bouton **SSB** indique si la page est
sélectionnée pour la génération statique. Son panneau affiche les paramètres
de `StaticPage`, les valeurs de la requête, le provider et ses jeux de paramètres.
Cliquer sur le provider ouvre sa méthode `parameters()` via le même mécanisme
d’éditeur que le contrôleur Symfony.

Le profiler n’exécute aucun provider. « Provider output »
lit les 100 premiers jeux capturés à la dernière publication, avec leur nombre
total. Cette lecture, comme celle de « Last published source », attend
l’ouverture de sa section. Les diagnostics restent privés dans `var/ssg/reports/`. La source est le dernier fichier exporté,
avec sa date, affiché comme texte échappé et limité à 256 KiB. Sans build, le
panneau le signale. Les erreurs de build donnent route, provider, valeurs et URL
avec l’exception initiale conservée comme cause.
