import { CodeExample, type PageMeta } from '@cjean-fr/docs';

export const meta: PageMeta = {
  title: 'Quick Start',
  sidebar: { group: 'Guide', order: 2 },
};

export default function QuickStartPage() {
  return (
    <div class="max-w-2xl">
      <h1 class="text-3xl font-bold tracking-tight mb-2">Quick Start</h1>
      <p class="text-gray-600 dark:text-gray-400 mb-8">
        Everything you need to start rendering JSX to HTML strings.
      </p>

      <h2 class="text-xl font-semibold mt-8 mb-3">Hello world</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-3">
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">renderToString</code>{' '}
        always returns a <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">Promise&lt;string&gt;</code>, even for synchronous trees.
      </p>
      <CodeExample src="guide/quick-start/hello-world.tsx" />

      <h2 class="text-xl font-semibold mt-10 mb-3">Components</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-3">
        Components are plain functions. Props are typed. Children are passed via the{' '}
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">children</code>{' '}
        prop or as JSX children.
      </p>
      <CodeExample src="guide/quick-start/component.tsx" />

      <h2 class="text-xl font-semibold mt-10 mb-3">Async components</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-3">
        Any component can be an async function. Data fetching happens naturally.
      </p>
      <CodeExample src="guide/quick-start/async-component.tsx" />

      <h2 class="text-xl font-semibold mt-10 mb-3">Security: escaping and raw HTML</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-3">
        All string values embedded in JSX are HTML-escaped. Use{' '}
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">raw()</code>{' '}
        only for trusted HTML.
      </p>
      <CodeExample src="guide/quick-start/escaping.tsx" />

      <h2 class="text-xl font-semibold mt-10 mb-3">Fragments</h2>
      <CodeExample src="guide/quick-start/fragment.tsx" />

      <div class="mt-10 flex justify-between">
        <a
          href="/guide/installation"
          class="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
        >
          ← Installation
        </a>
        <a
          href="/api/renderToString"
          class="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
        >
          renderToString API →
        </a>
      </div>
    </div>
  );
}
