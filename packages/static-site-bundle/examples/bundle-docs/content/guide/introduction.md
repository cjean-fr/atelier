---
title: "Introduction"
---

# Introduction

Développez avec Symfony et Twig en SSR, puis publiez les mêmes pages sous forme de fichiers statiques.

StaticSiteBundle sélectionne explicitement les actions avec `#[StaticPage]`. Les providers énumèrent les paramètres des routes dynamiques ; les réponses HTTP décident du format de sortie.

## Du développement au site statique

1. Rendez vos pages normalement dans Symfony.
2. Marquez les actions à exporter et associez leurs providers.
3. Compilez les assets Vite avec Symfony Reprise.
4. Exécutez `ssg:generate` en production.
5. Déployez le contenu de `var/static`.

## Prérequis

PHP ≥ 8.4.1 et Symfony 8. Le package est expérimental et n’est pas publié sur Packagist.

[Installer le bundle](/guide/installation) · [Choisir les routes](/guide/routes) · [Configurer un build](/integration/configuration)
