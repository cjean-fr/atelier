/** @jsxImportSource @cjean-fr/jsx-string */
import { CodeExample } from "../components/CodeExample.js";
import type { PageMeta } from "../types.js";

export const meta: PageMeta = {
  title: "Home",
};

export default function HomePage() {
  return (
    <div class="max-w-2xl">
      <div class="mb-8">
        <h1 class="mb-3 text-4xl font-bold tracking-tight">jsx-string</h1>
        <p class="text-xl text-gray-600 dark:text-gray-400">
          The small, safe way to render JSX into HTML strings.
        </p>
      </div>

      <div class="mb-10 flex flex-wrap gap-3">
        <span class="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700 ring-1 ring-green-600/20 dark:bg-green-950 dark:text-green-300">
          Zero dependencies
        </span>
        <span class="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-blue-600/20 dark:bg-blue-950 dark:text-blue-300">
          Fully typed
        </span>
        <span class="inline-flex items-center rounded-full bg-purple-50 px-3 py-1 text-sm font-medium text-purple-700 ring-1 ring-purple-600/20 dark:bg-purple-950 dark:text-purple-300">
          XSS-safe by default
        </span>
        <span class="inline-flex items-center rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700 ring-1 ring-orange-600/20 dark:bg-orange-950 dark:text-orange-300">
          Async-first
        </span>
      </div>

      <div class="mb-10 flex flex-wrap gap-3">
        <a href="https://github.com/cjean-fr/atelier/actions/workflows/ci.yml">
          <img
            src="https://github.com/cjean-fr/atelier/actions/workflows/ci.yml/badge.svg"
            alt="CI"
            height="20"
          />
        </a>
        <a href="https://www.npmjs.com/package/@cjean-fr/jsx-string">
          <img
            src="https://img.shields.io/npm/v/@cjean-fr/jsx-string"
            alt="npm version"
            height="20"
          />
        </a>
        <a href="https://unpkg.com/@cjean-fr/jsx-string/dist/index.js">
          <img
            src="https://img.badgesize.io/https://unpkg.com/@cjean-fr/jsx-string/dist/index.js?compression=gzip&label=gzip"
            alt="gzip size"
            height="20"
          />
        </a>
      </div>

      <CodeExample src="home/hello.tsx" />

      <div class="mt-10 flex gap-4">
        <a
          href="/guide/installation"
          class="inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-500 hover:shadow-md active:scale-[0.97]"
        >
          Get started
        </a>
        <a
          href="/api/renderToString"
          class="inline-flex items-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 transition-all ring-inset hover:bg-gray-50 active:scale-[0.97] dark:bg-gray-800 dark:text-gray-100 dark:ring-gray-700 dark:hover:bg-gray-700"
        >
          API reference
        </a>
      </div>

      <div class="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div class="docs-feature-card rounded-xl border border-gray-200 p-5 hover:border-gray-300 hover:shadow-sm dark:border-gray-800 dark:hover:border-gray-700 dark:hover:shadow-gray-900/50">
          <h2 class="mb-2 text-base font-semibold">Server-side rendering</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Generate HTML on the server — no browser required. Perfect for
            static site generators, email templates, and API responses.
          </p>
        </div>
        <div class="docs-feature-card rounded-xl border border-gray-200 p-5 hover:border-gray-300 hover:shadow-sm dark:border-gray-800 dark:hover:border-gray-700 dark:hover:shadow-gray-900/50">
          <h2 class="mb-2 text-base font-semibold">Security model</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            All content is HTML-escaped by default. Dangerous URLs are blocked.
            Event handler functions are silently dropped.
          </p>
        </div>
        <div class="docs-feature-card rounded-xl border border-gray-200 p-5 hover:border-gray-300 hover:shadow-sm dark:border-gray-800 dark:hover:border-gray-700 dark:hover:shadow-gray-900/50">
          <h2 class="mb-2 text-base font-semibold">Async components</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Components can be async functions. Fetch data, query databases, and
            await Promises — renderToString handles all of it.
          </p>
        </div>
        <div class="docs-feature-card rounded-xl border border-gray-200 p-5 hover:border-gray-300 hover:shadow-sm dark:border-gray-800 dark:hover:border-gray-700 dark:hover:shadow-gray-900/50">
          <h2 class="mb-2 text-base font-semibold">Scoped context</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Pass data through the tree without prop-drilling using the context
            API. Concurrent renders are fully isolated.
          </p>
        </div>
      </div>
    </div>
  );
}
