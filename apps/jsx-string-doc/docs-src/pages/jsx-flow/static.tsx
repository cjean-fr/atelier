import { CodeExample, type PageMeta } from "@cjean-fr/docs";

export const meta: PageMeta = {
  title: "Static generation",
  sidebar: { group: "jsx-flow", order: 3 },
};

export default function JsxFlowStaticPage() {
  return (
    <div class="max-w-2xl">
      <h1 class="text-3xl font-bold tracking-tight mb-2">Static generation</h1>
      <p class="text-gray-600 dark:text-gray-400 mb-8">
        Build HTML files at compile time.{" "}
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">
          renderToStatic
        </code>{" "}
        gives you a context to render all your pages, then emit fragment files
        if any page uses{" "}
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">
          &lt;Deferred&gt;
        </code>
        .
      </p>

      <h2 class="text-xl font-semibold mt-8 mb-3">Pure static</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-3">
        No{" "}
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">
          &lt;Deferred&gt;
        </code>{" "}
        in your pages? Call{" "}
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">
          renderToStatic
        </code>{" "}
        without options.{" "}
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">
          ctx.renderPage
        </code>{" "}
        applies any adapter shell transforms and returns the HTML string.
      </p>
      <CodeExample src="jsx-flow/pure-static.tsx" />

      <h2 class="text-xl font-semibold mt-10 mb-3">With deferred fragments</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-3">
        Pass an adapter and call{" "}
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">
          ctx.emitFragments
        </code>{" "}
        after rendering all pages. Each deferred fragment is rendered and
        passed to your callback with its id, its URL (from{" "}
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">
          generatePath
        </code>
        , default:{" "}
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">
          /fragments/{"{id}"}.html
        </code>
        ), and its HTML.
      </p>
      <CodeExample src="jsx-flow/deferred-static.tsx" />

      <div class="mt-10 flex justify-start">
        <a
          href="/jsx-flow/streaming"
          class="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
        >
          ← Streaming
        </a>
      </div>
    </div>
  );
}
