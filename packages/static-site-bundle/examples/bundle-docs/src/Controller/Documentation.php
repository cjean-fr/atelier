<?php

declare(strict_types=1);

namespace BundleDocs\Controller;

use BundleDocs\Content\Catalog;
use BundleDocs\Provider\Pages;
use CJean\StaticSiteBundle\Attribute\StaticPage;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Twig\Environment;

final readonly class Documentation
{
    public function __construct(
        private Catalog $catalog,
        private Environment $twig,
    ) {}

    #[Route('/{slug}.md', name: 'markdown', requirements: ['slug' => '.+'], methods: ['GET'], priority: 20)]
    #[StaticPage(provider: Pages::class)]
    public function markdown(string $slug): Response
    {
        return new Response($this->catalog->page($slug === 'index' ? '/' : '/' . $slug)['markdown'], headers: [
            'Content-Type' => 'text/markdown; charset=UTF-8',
        ]);
    }

    #[Route('/llms.txt', name: 'llms', methods: ['GET'], priority: 30)]
    #[StaticPage]
    public function llms(): Response
    {
        $text = "# StaticSiteBundle\n\n";
        foreach ($this->catalog->pages() as $page) {
            $text .=
                '- ['
                . $page['meta']['title']
                . '](https://static-site.example'
                . ($page['url'] === '/' ? '/index' : $page['url'])
                . ".md)\n";
        }
        return new Response($text, headers: ['Content-Type' => 'text/plain; charset=UTF-8']);
    }

    #[Route('/', name: 'home', methods: ['GET'])]
    #[StaticPage]
    public function home(): Response
    {
        return $this->html('/');
    }

    #[Route('/{slug}', name: 'docs', requirements: ['slug' => '.+'], methods: ['GET'], priority: -10)]
    #[StaticPage(provider: Pages::class)]
    public function docs(string $slug): Response
    {
        return $this->html('/' . $slug);
    }

    private function html(string $url): Response
    {
        $page = $this->catalog->page($url);
        $navigation = $this->catalog->navigation($url);
        return new Response(
            $this->twig->render('page.html.twig', [
                'page' => $page,
                'pages' => $navigation['pages'],
                'body' => $this->catalog->render($page['markdown']),
                'previous' => $navigation['previous'],
                'next' => $navigation['next'],
            ]),
            headers: ['Content-Type' => 'text/html; charset=UTF-8'],
        );
    }
}
