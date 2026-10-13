<?php

declare(strict_types=1);

// Let PHP's development server serve the POC's public assets directly.
if (PHP_SAPI === 'cli-server' && is_file(__DIR__ . (parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? ''))) {
    return false;
}

require dirname(__DIR__) . '/bootstrap.php';
// PHP's development server does not copy the process environment into $_SERVER.
$environment = $_SERVER['APP_ENV'] ?? getenv('APP_ENV') ?: 'dev';
$kernel = new BundleDocs\Kernel($environment, $environment !== 'prod');
$request = Symfony\Component\HttpFoundation\Request::createFromGlobals();
$response = $kernel->handle($request);
$response->send();
$kernel->terminate($request, $response);
