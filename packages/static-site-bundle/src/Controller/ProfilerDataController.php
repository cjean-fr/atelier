<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Controller;

use CJean\StaticSiteBundle\DataCollector\StaticSiteDataCollector;
use CJean\StaticSiteBundle\Generation\BuildReportStore;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Profiler\Profiler;

/** @internal Debug-only endpoint bound to an existing profiler token, never to a user-supplied file path. */
final readonly class ProfilerDataController
{
    public function __construct(
        private ?Profiler $profiler,
        private BuildReportStore $reports,
    ) {}

    public function __invoke(#[\SensitiveParameter] string $token, string $section): JsonResponse
    {
        if ($this->profiler === null || !in_array($section, ['parameters', 'source'], true)) {
            throw new NotFoundHttpException();
        }
        $this->profiler->disable();
        $profile = $this->profiler->loadProfile($token);
        if ($profile === null || !$profile->hasCollector('static_site')) {
            throw new NotFoundHttpException();
        }
        $collector = $profile->getCollector('static_site');
        if (!$collector instanceof StaticSiteDataCollector) {
            throw new NotFoundHttpException();
        }
        $details = $collector->getDetails();
        if (!($details['selected'] ?? false)) {
            throw new NotFoundHttpException();
        }
        try {
            $key = $section === 'parameters' ? $details['route'] ?? null : $details['file'] ?? null;
            $data = is_string($key)
                ? ($section === 'parameters' ? $this->reports->parameters($key) : $this->reports->source($key))
                : null;
            $response = new JsonResponse([
                'available' => $data !== null,
                'data' => $data,
                'message' => $data === null
                    ? 'No data from a published build. Run ssg:build in production first.'
                    : null,
            ]);
        } catch (\Throwable $error) {
            $response = new JsonResponse(['available' => false, 'message' => $error->getMessage()], 500);
        }
        $response->headers->set('Cache-Control', 'private, no-store');
        return $response;
    }
}
