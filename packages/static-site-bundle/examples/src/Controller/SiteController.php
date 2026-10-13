<?php

declare(strict_types=1);

namespace Demo\Controller;

use CJean\StaticSiteBundle\Attribute\StaticPage;
use Demo\Provider\ArticleProvider;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Twig\Environment;

final readonly class SiteController
{
    public function __construct(
        private Environment $twig,
    ) {}

    #[Route('/articles.json', name: 'article_index_json', methods: ['GET'])]
    #[StaticPage]
    public function articleIndex(): Response
    {
        return new Response(json_encode(ArticleProvider::ARTICLES, JSON_THROW_ON_ERROR), 200, [
            'Content-Type' => 'application/json',
        ]);
    }

    #[Route('/about.txt', name: 'about_text', methods: ['GET'])]
    #[StaticPage]
    public function aboutText(): Response
    {
        return new Response("Symfony SSG\n", 200, ['Content-Type' => 'text/plain; charset=UTF-8']);
    }

    #[Route('/guide.md', name: 'guide_markdown', methods: ['GET'])]
    #[StaticPage]
    public function guideMarkdown(): Response
    {
        return new Response("# Symfony SSG\n\nSSR en développement, export statique en production.\n", 200, [
            'Content-Type' => 'text/markdown; charset=UTF-8',
        ]);
    }

    #[Route('/', name: 'home', methods: ['GET'])]
    #[StaticPage]
    public function home(): Response
    {
        return new Response($this->twig->render('home.html.twig'));
    }

    #[Route('/articles/{slug}', name: 'article', requirements: ['slug' => '[a-z0-9-]+'], methods: ['GET'])]
    #[StaticPage(provider: ArticleProvider::class)]
    public function article(string $slug): Response
    {
        $articles = ArticleProvider::ARTICLES;
        if (!isset($articles[$slug])) {
            return new Response('Article introuvable', 404);
        }
        return new Response($this->twig->render('article.html.twig', ['title' => $articles[$slug]]));
    }
}
