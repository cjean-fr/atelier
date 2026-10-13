<?php

declare(strict_types=1);

require dirname(__DIR__) . '/bootstrap.php';
use BundleDocs\Content\Catalog;
use BundleDocs\Kernel;
use Symfony\Component\HttpFoundation\Request;

$root = dirname(__DIR__);
$catalog = new Catalog($root . '/content');
$kernel = new Kernel('prod', false);
$export = $root . '/var/static';
$count = 0;
foreach ($catalog->pages() as $page) {
    $url = $page['url'];
    $response = $kernel->handle(Request::create('https://static-site.example' . $url));
    if ($response->getStatusCode() !== 200) {
        throw new RuntimeException('SSR failed at ' . $url);
    }
    $file = $export . ($url === '/' ? '/index.html' : $url . '/index.html');
    if (!is_file($file)) {
        throw new RuntimeException('Missing export ' . $file);
    }
    $html = file_get_contents($file);
    if (!str_contains($html, htmlspecialchars($page['meta']['title'], ENT_QUOTES))) {
        throw new RuntimeException('Missing title at ' . $url);
    }
    $document = Dom\HTMLDocument::createFromString($html, LIBXML_NOERROR);
    foreach (new Dom\XPath($document)->query('//*[@href or @src]') as $element) {
        foreach (['href', 'src'] as $attribute) {
            $link = $element->getAttribute($attribute) ?? '';
            if (!str_starts_with($link, '/') || str_starts_with($link, '//')) {
                continue;
            }
            $path = rawurldecode(parse_url($link, PHP_URL_PATH));
            $target = $export . $path;
            if (!is_file($target) && !is_file(rtrim($target, '/') . '/index.html')) {
                throw new RuntimeException('Broken local link at ' . $url . ': ' . $link);
            }
        }
    }
    $markdown = $export . ($url === '/' ? '/index.md' : $url . '.md');
    if (file_get_contents($markdown) !== $page['markdown']) {
        throw new RuntimeException('Markdown changed at ' . $url);
    }
    ++$count;
}
$sample = $catalog->render("```ts\nconst html = '<script>alert(1)</script>';\n```\n");
if (
    !str_contains($sample, '<pre><code class="language-ts">')
    || !str_contains($sample, '&lt;script&gt;')
    || str_contains($sample, '<script>')
) {
    throw new RuntimeException('Code fence language or escaping failed.');
}
if (!is_file($export . '/llms.txt')) {
    throw new RuntimeException('Missing text index.');
}
$kernel->shutdown();
echo "$count pages verified: SSR, static HTML, Markdown, local links, native code fences.\n";
