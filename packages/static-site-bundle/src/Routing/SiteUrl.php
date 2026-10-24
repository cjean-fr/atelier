<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Routing;

/**
 * @internal The public URL of the static site: framework.router.default_uri, which may hold an environment variable,
 * so it is validated when a build or the SSR sitemap needs it rather than at compile time.
 */
final readonly class SiteUrl
{
    /** Scheme, host, port and base path, without trailing slash. */
    public string $url;

    private function __construct(
        public string $scheme,
        public string $host,
        public int $port,
        /** "/docs", or "" at the domain root. */
        public string $basePath,
        bool $explicitPort,
    ) {
        $this->url = $scheme . '://' . $host . ($explicitPort ? ':' . $port : '') . $basePath;
    }

    public static function fromDefaultUri(string $uri): self
    {
        if ($uri === '') {
            throw new \LogicException(
                'Set framework.router.default_uri to the public URL of the static site, e.g. https://example.com/docs.',
            );
        }
        $parts = parse_url($uri);
        $scheme = strtolower((string) ($parts['scheme'] ?? ''));
        $path = $parts['path'] ?? '';
        if (
            $parts === false
            || !in_array($scheme, ['http', 'https'], true)
            || !isset($parts['host'])
            || isset($parts['query'])
            || isset($parts['fragment'])
            || isset($parts['user'])
            || !preg_match('#\A(?:/[A-Za-z0-9_~-][A-Za-z0-9._~-]*)*/?\z#', $path)
        ) {
            throw new \LogicException(sprintf(
                'framework.router.default_uri must be an HTTP(S) URL, optionally with a base path, without query, fragment or credentials; got "%s".',
                $uri,
            ));
        }
        return new self(
            $scheme,
            strtolower($parts['host']),
            $parts['port'] ?? ($scheme === 'https' ? 443 : 80),
            rtrim($path, '/'),
            isset($parts['port']),
        );
    }

    /** The base path, or "" when no default URI is set (rendering does not need the public URL). */
    public static function basePathOf(string $uri): string
    {
        return $uri === '' ? '' : self::fromDefaultUri($uri)->basePath;
    }
}
