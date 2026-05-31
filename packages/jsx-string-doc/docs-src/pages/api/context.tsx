import { CodeExample, type PageMeta } from '@cjean-fr/docs';

export const meta: PageMeta = {
  title: 'Context API',
  sidebar: { label: 'Context', group: 'API', order: 2 },
};

export default function ContextPage() {
  return (
    <div class="max-w-2xl">
      <h1 class="text-3xl font-bold tracking-tight mb-2">Context API</h1>
      <p class="text-gray-600 dark:text-gray-400 mb-8">
        Pass data through a component tree without prop-drilling. Built on{' '}
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">AsyncLocalStorage</code>{' '}
        — concurrent renders are fully isolated.
      </p>

      <h2 class="text-xl font-semibold mt-8 mb-3">API signatures</h2>
      <CodeExample src="api/context/signatures.ts" />

      <h2 class="text-xl font-semibold mt-10 mb-3">Basic example</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-3">
        Create a context key once at module level, provide a value with{' '}
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">setContext</code>{' '}
        inside a{' '}
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">withScope</code>,
        and read it anywhere in the tree with{' '}
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">useContext</code>.
      </p>
      <CodeExample src="api/context/basic.tsx" />

      <h2 class="text-xl font-semibold mt-10 mb-3">Concurrent renders</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-3">
        Each{' '}
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">withScope</code>{' '}
        call creates an isolated{' '}
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">AsyncLocalStorage</code>{' '}
        store. Concurrent renders never interfere with each other.
      </p>
      <CodeExample src="api/context/concurrent.tsx" />

      <h2 class="text-xl font-semibold mt-10 mb-3">snapshot()</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-3">
        Capture all current context values and pass them as a{' '}
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">seed</code>{' '}
        to a new scope. Useful for spawning child renders that inherit the parent's context.
      </p>
      <CodeExample src="api/context/snapshot.tsx" />

      <h2 class="text-xl font-semibold mt-10 mb-3">Per-request context</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-3">
        A common pattern for HTTP servers: inject request-specific data into the context at the top level.
      </p>
      <CodeExample src="api/context/per-request.tsx" />

      <div class="mt-10 flex justify-start">
        <a
          href="/api/renderToString"
          class="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
        >
          ← renderToString
        </a>
      </div>
    </div>
  );
}
