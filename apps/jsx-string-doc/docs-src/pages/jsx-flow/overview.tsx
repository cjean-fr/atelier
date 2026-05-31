import { CodeBlock, CodeExample, Tabs, type PageMeta } from "@cjean-fr/docs";

export const meta: PageMeta = {
  title: "Overview",
  sidebar: { group: "jsx-flow", order: 1 },
};

export default function JsxFlowOverviewPage() {
  return (
    <div class="max-w-2xl">
      <h1 class="text-3xl font-bold tracking-tight mb-2">jsx-flow</h1>
      <p class="text-gray-600 dark:text-gray-400 mb-8">
        Deferred rendering and document orchestration for{" "}
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">
          @cjean-fr/jsx-string
        </code>
        .
      </p>

      <h2 class="text-xl font-semibold mt-8 mb-3">What it does</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        jsx-flow adds one primitive:{" "}
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">
          &lt;Deferred&gt;
        </code>
        . It renders a placeholder in the HTML shell; the real content arrives
        later — either streamed inline in the same HTTP response, or emitted as
        standalone fragment files for static generation.
      </p>
      <p class="text-gray-600 dark:text-gray-400 mb-8">
        No client-side hydration. No JavaScript framework. Just HTML arriving
        in chunks.
      </p>

      <h2 class="text-xl font-semibold mt-8 mb-3">Install</h2>
      <Tabs syncKey="pkg-manager" tabs={[
        { label: 'bun', content: <CodeBlock code="bun add @cjean-fr/jsx-flow" language="bash" /> },
        { label: 'npm', content: <CodeBlock code="npm install @cjean-fr/jsx-flow" language="bash" /> },
      ]} />

      <h2 class="text-xl font-semibold mt-10 mb-3">Two rendering modes</h2>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-8">
        <div class="rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <h3 class="text-base font-semibold mb-2">Streaming</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Fragments arrive in the same HTTP response after the shell.{" "}
            <code class="text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded font-mono">
              renderToReadableStream
            </code>
          </p>
        </div>
        <div class="rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <h3 class="text-base font-semibold mb-2">Static generation</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Fragments are written as separate HTML files. The browser fetches
            them on load.{" "}
            <code class="text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded font-mono">
              renderToStatic
            </code>
          </p>
        </div>
      </div>

      <h2 class="text-xl font-semibold mt-10 mb-3">Adapters</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-3">
        An adapter defines how placeholders and patches are encoded as HTML.
        jsx-flow ships five built-in adapters:
      </p>
      <CodeExample src="jsx-flow/adapters.ts" />

      <div class="mt-10 flex justify-end">
        <a
          href="/jsx-flow/streaming"
          class="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
        >
          Streaming →
        </a>
      </div>
    </div>
  );
}
