# Vocabulaire

## Type MIME

Type de contenu annoncé par une réponse HTTP. Il détermine la nature de la
sortie statique indépendamment du nom de la route ou du fichier. La casse et
les espaces périphériques ne changent pas son identité ; les paramètres comme
le charset précisent le contenu sans changer son type.

## Format de sortie

Règles qui associent un type MIME pris en charge à un fichier statique :
contenu valide, extension, chemin et inclusion par défaut dans le sitemap.
Un même type MIME ne désigne qu’un seul format de sortie.

## Artefact Vite

Ensemble des métadonnées d’un build Vite et des fichiers qu’elles référencent.
Un artefact complet contient tous ses fichiers locaux nécessaires à la sortie
statique. Ses références à un CDN restent externes ; elles ne sont pas intégrées
à l’export local.

## Publication

Activation d’un export validé à son emplacement de sortie. Les anciens fichiers
cessent alors de représenter le site. Le nettoyage des fichiers temporaires est
une opération ultérieure ; son échec ne change pas quel export est actif.

## Chemin de base

Préfixe d’URL sous lequel le site est servi (`/docs`), lu dans le chemin de
`framework.router.default_uri`. Il appartient aux URL — liens, assets, sitemap —
et jamais aux fichiers : l’export garde sa propre racine.
