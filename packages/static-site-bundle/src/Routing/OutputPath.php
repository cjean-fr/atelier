<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Routing;

final class OutputPath
{
    /** @param list<string> $aliases Other extensions a URL may already carry. */
    public static function fromUrl(
        string $url,
        string $extension = 'html',
        bool $directoryIndex = true,
        array $aliases = [],
    ): string {
        $decoded = self::decodeUrl($url);
        $path = trim($decoded, '/');
        if (!preg_match('/^[a-z0-9]+$/', $extension)) {
            throw new \InvalidArgumentException('Invalid output extension.');
        }
        $existing = pathinfo($path, PATHINFO_EXTENSION);
        $allowed = [$extension, ...$aliases, ...($extension === 'html' ? ['htm'] : [])];
        if ($existing !== '' && !in_array(strtolower($existing), $allowed, true)) {
            throw new \InvalidArgumentException('URL extension does not match the selected format.');
        }
        $file = $existing !== ''
            ? $path
            : ($path === '' ? 'index.' . $extension : $path . ($directoryIndex ? '/index.' : '.') . $extension);
        self::validateFile($file);
        return $file;
    }

    /** Shared URL safety rules, including for custom formats. */
    public static function decodeUrl(string $url): string
    {
        if (!str_starts_with($url, '/') || str_starts_with($url, '//') || strpbrk($url, '?#') !== false) {
            throw new \InvalidArgumentException(sprintf(
                'Only local paths without query or fragment can be exported: "%s".',
                $url,
            ));
        }
        $decoded = rawurldecode($url);
        if (str_contains($decoded, '\\') || preg_match('/[\x00-\x1f\x7f<>:"|?*%]/', $decoded)) {
            throw new \InvalidArgumentException(sprintf('Unsafe export path: "%s".', $url));
        }
        foreach (explode('/', $decoded) as $part) {
            if ($part === '.' || $part === '..' || str_starts_with($part, '.')) {
                throw new \InvalidArgumentException(sprintf('Unsafe export path: "%s".', $url));
            }
        }
        if (str_contains($decoded, '//')) {
            throw new \InvalidArgumentException('Empty path segments are not supported.');
        }
        return $decoded;
    }

    /** Validate paths returned by custom formats as well as built-in formats. */
    public static function validateFile(string $file): void
    {
        if (
            $file === ''
            || str_starts_with($file, '/')
            || str_ends_with($file, '/')
            || str_contains($file, '\\')
            || preg_match('/[\x00-\x1f\x7f<>:"|?*%]/', $file)
        ) {
            throw new \InvalidArgumentException('Unsafe output file: ' . $file);
        }
        foreach (explode('/', $file) as $segment) {
            if ($segment === '' || str_starts_with($segment, '.')) {
                throw new \InvalidArgumentException('Unsafe output file: ' . $file);
            }
        }
        if (preg_match('/\.(?:php\d*|phtml|phar|cgi|pl|sh)$/i', $file)) {
            throw new \InvalidArgumentException('Executable output files are forbidden.');
        }
    }
}
