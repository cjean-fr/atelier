import { CodeBlock, CodeExample, Tabs, type PageMeta } from '@cjean-fr/docs';

export const meta: PageMeta = {
  title: 'Installation',
  sidebar: { group: 'Guide', order: 1 },
};

export default function InstallationPage() {
  return (
    <div class="max-w-2xl">
      <h1 class="text-3xl font-bold tracking-tight mb-2">Installation</h1>
      <p class="text-gray-600 dark:text-gray-400 mb-8">
        jsx-string has zero runtime dependencies. Install it and configure TypeScript — that's all.
      </p>

      <h2 class="text-xl font-semibold mt-8 mb-3">Package manager</h2>

      <Tabs syncKey="pkg-manager" tabs={[
        { label: 'npm', content: <CodeBlock code="npm install @cjean-fr/jsx-string" language="bash" /> },
        { label: 'bun', content: <CodeBlock code="bun add @cjean-fr/jsx-string" language="bash" /> },
      ]} />

      <h2 class="text-xl font-semibold mt-10 mb-3">TypeScript configuration</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-3">
        Set <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">jsxImportSource</code> in your{' '}
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">tsconfig.json</code> so that JSX files don't need any explicit import:
      </p>
      <CodeExample src="guide/installation/tsconfig.json" />

      <h2 class="text-xl font-semibold mt-10 mb-3">Optional: @types/react</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-3">
        Installing{' '}
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">@types/react</code>{' '}
        gives you per-element attribute autocomplete (e.g.{' '}
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">src</code> on{' '}
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">&lt;img&gt;</code>,{' '}
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">href</code> on{' '}
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">&lt;a&gt;</code>).
        It is not required — jsx-string works without it.
      </p>
      <CodeExample src="guide/installation/tsconfig-with-react.json" />

      <h2 class="text-xl font-semibold mt-10 mb-3">Deno</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-3">
        Configure <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">deno.json</code>:
      </p>
      <CodeExample src="guide/installation/deno.json" />

      <h2 class="text-xl font-semibold mt-10 mb-3">ESLint plugin</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-3">
        The ESLint plugin catches common mistakes — unsafe{" "}
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">raw()</code>{" "}
        calls, event handlers that will be silently dropped, and attributes
        incompatible with static rendering.
      </p>
      <Tabs syncKey="pkg-manager" tabs={[
        { label: 'npm', content: <CodeBlock code="npm install -D @cjean-fr/eslint-plugin-jsx-string" language="bash" /> },
        { label: 'bun', content: <CodeBlock code="bun add -D @cjean-fr/eslint-plugin-jsx-string" language="bash" /> },
      ]} />

      <div class="mt-10 flex justify-end">
        <a
          href="/guide/quick-start"
          class="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
        >
          Quick Start →
        </a>
      </div>
    </div>
  );
}
