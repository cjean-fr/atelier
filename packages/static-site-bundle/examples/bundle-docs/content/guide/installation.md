---
title: "Installer dans une application"
---

# Installer dans une application

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
