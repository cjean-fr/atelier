import { CodeExample, type PageMeta } from "@cjean-fr/docs";

export const meta: PageMeta = {
  title: "Streaming",
  sidebar: { group: "jsx-flow", order: 2 },
};

export default function JsxFlowStreamingPage() {
  return (
    <div class="max-w-2xl">
      <h1 class="text-3xl font-bold tracking-tight mb-2">Streaming</h1>
      <p class="text-gray-600 dark:text-gray-400 mb-8">
        Send the HTML shell immediately and stream deferred fragments inline in
        the same HTTP response.
      </p>

      <h2 class="text-xl font-semibold mt-8 mb-3">renderToReadableStream</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-3">
        Returns a{" "}
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">
          ReadableStream&lt;string&gt;
        </code>
        . The shell chunk is emitted first; fragment chunks follow as they
        resolve.
      </p>
      <CodeExample src="jsx-flow/deferred-stream.tsx" />

      <h2 class="text-xl font-semibold mt-10 mb-3">
        &lt;Deferred&gt; — server push
      </h2>
      <p class="text-gray-600 dark:text-gray-400 mb-3">
        Pass a{" "}
        <strong>factory function</strong> as children — JSX evaluates eagerly,
        so the thunk defers rendering to streaming time. The{" "}
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">
          fallback
        </code>{" "}
        prop is rendered in the shell while the fragment resolves.
      </p>

      <h2 class="text-xl font-semibold mt-10 mb-3">
        &lt;Deferred src&gt; — client fetch
      </h2>
      <p class="text-gray-600 dark:text-gray-400 mb-3">
        Provide a{" "}
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">
          src
        </code>{" "}
        URL instead of children. The adapter injects a fetch or{" "}
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">
          hx-get
        </code>{" "}
        — the browser loads the fragment after the shell lands. No server-push
        required.
      </p>
      <CodeExample src="jsx-flow/deferred-src.tsx" />

      <h2 class="text-xl font-semibold mt-10 mb-3">&lt;Patch&gt;</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-3">
        Target an existing DOM element by id — renders nothing in the shell.
        Useful for updating counters, banners, or any element that already
        exists on the page. Supports the same{" "}
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">
          merge
        </code>{" "}
        types as{" "}
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">
          &lt;Deferred&gt;
        </code>
        :{" "}
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">
          "replace"
        </code>{" "}
        (default),{" "}
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">
          "append"
        </code>
        ,{" "}
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">
          "prepend"
        </code>
        ,{" "}
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">
          "before"
        </code>
        ,{" "}
        <code class="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">
          "after"
        </code>
        .
      </p>
      <CodeExample src="jsx-flow/patch.tsx" />

      <div class="mt-10 flex justify-between">
        <a
          href="/jsx-flow/overview"
          class="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
        >
          ← Overview
        </a>
        <a
          href="/jsx-flow/static"
          class="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
        >
          Static generation →
        </a>
      </div>
    </div>
  );
}
