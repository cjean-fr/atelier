---
title: "Configurer et exporter"
---

# Configurer et exporter

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
