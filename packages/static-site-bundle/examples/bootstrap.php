<?php

declare(strict_types=1);

require dirname(__DIR__) . '/vendor/autoload.php';
spl_autoload_register(static function (string $class): void {
    if (str_starts_with($class, 'Demo\\')) {
        require __DIR__ . '/src/' . str_replace('\\', '/', substr($class, 5)) . '.php';
    }
});
