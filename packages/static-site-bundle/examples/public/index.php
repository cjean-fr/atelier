<?php

declare(strict_types=1);

require dirname(__DIR__) . '/bootstrap.php';

use Demo\Kernel;
use Symfony\Component\HttpFoundation\Request;

// PHP's development server does not copy the process environment into $_SERVER.
$environment = $_SERVER['APP_ENV'] ?? getenv('APP_ENV') ?: 'dev';
$debug = $_SERVER['APP_DEBUG'] ?? getenv('APP_DEBUG');
$debug = $debug === false ? $environment !== 'prod' : filter_var($debug, FILTER_VALIDATE_BOOL);
$kernel = new Kernel($environment, $debug);
$request = Request::createFromGlobals();
$response = $kernel->handle($request);
$response->send();
$kernel->terminate($request, $response);
