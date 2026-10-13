---
title: "StaticSiteBundle"
---

# StaticSiteBundle

Un site statique, avec le confort de Symfony.

Développez vos contrôleurs et vos templates Twig normalement. Exportez vos pages HTML, JSON, Markdown et texte avec leurs assets de production.

## Commencer

- [Présentation](/guide/introduction)
- [Installation](/guide/installation)
- [Routes dynamiques et providers](/guide/routes)
- [Configuration et export](/integration/configuration)

```php
#[Route('/articles/{slug}', name: 'article', methods: ['GET'])]
#[StaticPage(provider: ArticleProvider::class)]
public function article(string $slug): Response
{
    return $this->render('article.html.twig', ['article' => $this->articles->findBySlug($slug)]);
}
```

## Aller plus loin

- [Formats pilotés par le Content-Type](/api/formats)
- [Déploiement et limites](/integration/deployment)
- [Données et performances](/api/performance)
- [Architecture](/api/architecture)

Ce site est lui-même un exemple du bundle : Twig pour le design, CommonMark PHP pour le contenu et Reprise pour les assets.
