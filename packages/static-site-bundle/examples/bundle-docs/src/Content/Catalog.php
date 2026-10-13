<?php

declare(strict_types=1);

namespace BundleDocs\Content;

use League\CommonMark\Environment\Environment;
use League\CommonMark\Extension\CommonMark\CommonMarkCoreExtension;
use League\CommonMark\Extension\GithubFlavoredMarkdownExtension;
use League\CommonMark\Extension\HeadingPermalink\HeadingPermalinkExtension;
use League\CommonMark\MarkdownConverter;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Yaml\Yaml;

/** A small POC catalogue; local Markdown is read by PHP, without a content build. */
final readonly class Catalog
{
    private array $pages;
    private array $byUrl;
    private array $bySection;
    private array $positions;
    private MarkdownConverter $converter;

    public function __construct(
        private string $directory,
    ) {
        $this->pages = $this->loadPages();
        $this->byUrl = array_column($this->pages, null, 'url');
        $sections = [];
        $positions = [];
        foreach ($this->pages as $page) {
            $section = explode('/', ltrim($page['url'], '/'))[0];
            $positions[$page['url']] = count($sections[$section] ?? []);
            $sections[$section][] = $page;
        }
        $this->bySection = $sections;
        $this->positions = $positions;
        $environment = new Environment([
            'html_input' => 'allow',
            'allow_unsafe_links' => false,
            'heading_permalink' => [
                'insert' => 'none',
                'id_prefix' => '',
                'fragment_prefix' => '',
                'apply_id_to_heading' => true,
            ],
        ]);
        $environment->addExtension(new CommonMarkCoreExtension());
        $environment->addExtension(new GithubFlavoredMarkdownExtension());
        $environment->addExtension(new HeadingPermalinkExtension());
        $this->converter = new MarkdownConverter($environment);
    }

    public function pages(): array
    {
        return $this->pages;
    }

    /** Navigation is indexed once, using the same sorted snapshot as the providers. */
    public function navigation(string $url): array
    {
        $this->page($url);
        $section = explode('/', ltrim($url, '/'))[0];
        $siblings = $this->bySection[$section] ?? [];
        $index = $this->positions[$url];
        $active = in_array($section, ['guide', 'integration', 'api'], true) ? $section : 'guide';
        return [
            'pages' => $this->bySection[$active] ?? [],
            'previous' => $siblings[$index - 1] ?? null,
            'next' => $siblings[$index + 1] ?? null,
        ];
    }

    private function loadPages(): array
    {
        $pages = [];
        foreach (new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($this->directory, \FilesystemIterator::SKIP_DOTS),
        ) as $file) {
            if ($file->getExtension() !== 'md') {
                continue;
            }
            $relative = substr($file->getPathname(), strlen($this->directory) + 1, -3);
            $url = $relative === 'index' ? '/' : '/' . $relative;
            $pages[] = $this->read($file->getPathname(), $url);
        }
        $order = json_decode(
            file_get_contents($this->directory . '/navigation.json'),
            true,
            flags: JSON_THROW_ON_ERROR,
        );
        $key = static function (array $page) use ($order): string {
            $parts = explode('/', ltrim($page['url'], '/'));
            $rank = ['guide' => 1, 'integration' => 2, 'api' => 3];
            $key = sprintf('%03d', $rank[$parts[0]] ?? 0);
            $prefix = '';
            foreach ($parts as $part) {
                $prefix = ltrim($prefix . '/' . $part, '/');
                $key .= sprintf('/%08.2f:%s', $order[$prefix]['order'] ?? 999, $part);
            }
            return $key;
        };
        usort($pages, static fn(array $a, array $b): int => strcmp($key($a), $key($b)));
        return $pages;
    }

    public function page(string $url): array
    {
        return $this->byUrl[$url] ?? throw new NotFoundHttpException();
    }

    public function render(string $markdown): string
    {
        return (string) $this->converter->convert($markdown);
    }

    private function read(string $file, string $url): array
    {
        $source = file_get_contents($file);
        if ($source === false || !preg_match('/\A---\R(.*?)\R---\R(.*)\z/s', $source, $matches)) {
            throw new \RuntimeException('Missing Markdown frontmatter: ' . $file);
        }
        $meta = Yaml::parse($matches[1]);
        if (!is_array($meta) || !isset($meta['title'])) {
            throw new \RuntimeException('Missing page title: ' . $file);
        }
        return ['url' => $url, 'meta' => $meta, 'markdown' => $matches[2]];
    }
}
