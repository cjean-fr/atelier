<?php

declare(strict_types=1);

require dirname(__DIR__, 2) . '/vendor/autoload.php';
spl_autoload_register(static function (string $class): void {
    if (str_starts_with($class, 'BundleDocs\\')) {
        require __DIR__ . '/src/' . str_replace('\\', '/', substr($class, 11)) . '.php';
    }
});
