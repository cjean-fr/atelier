import { CodeExample, type PageMeta } from '@cjean-fr/docs';

export const meta: PageMeta = {
  title: 'renderToString',
  sidebar: { group: 'API', order: 1 },
};

export default function RenderToStringPage() {
  return (
    <div class="max-w-2xl">
      <h1 class="text-3xl font-bold tracking-tight mb-2">renderToString</h1>
      <p class="text-gray-600 dark:text-gray-400 mb-8">
        Renders a JSX tree into an HTML string. Always returns a{' '}
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">Promise&lt;string&gt;</code>.
      </p>

      <h2 class="text-xl font-semibold mt-8 mb-3">Signature</h2>
      <CodeExample src="api/renderToString/signature.ts" />

      <h2 class="text-xl font-semibold mt-10 mb-3">Basic usage</h2>
      <CodeExample src="api/renderToString/basic.tsx" />

      <h2 class="text-xl font-semibold mt-10 mb-3">With a page component</h2>
      <CodeExample src="api/renderToString/with-component.tsx" />

      <h2 class="text-xl font-semibold mt-10 mb-3">Async components</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-3">
        Any component in the tree can be async.{' '}
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">renderToString</code>{' '}
        awaits the entire resolved tree before returning.
      </p>
      <CodeExample src="api/renderToString/async-tree.tsx" />

      <h2 class="text-xl font-semibold mt-10 mb-3">Concurrent renders</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-3">
        Multiple concurrent calls to{' '}
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">renderToString</code>{' '}
        are safe even when components use{' '}
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">context()</code> and{' '}
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">setContext()</code>{' '}
        inside a{' '}
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">withScope()</code>.
      </p>
      <CodeExample src="api/renderToString/concurrent.tsx" />

      <h2 class="text-xl font-semibold mt-10 mb-3">JSXNode type</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-3">
        The argument is typed as{' '}
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">JSXNode</code>,
        which covers all values a JSX expression can produce:
      </p>
      <CodeExample src="api/renderToString/jsx-node.ts" />

      <div class="mt-10 flex justify-between">
        <a
          href="/guide/quick-start"
          class="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
        >
          ← Quick Start
        </a>
        <a
          href="/api/context"
          class="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
        >
          Context API →
        </a>
      </div>
    </div>
  );
}
