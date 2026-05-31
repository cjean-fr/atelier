import { CodeExample, type PageMeta } from '@cjean-fr/docs';

export const meta: PageMeta = {
  title: 'Security',
  sidebar: { group: 'Guide', order: 3 },
};

export default function SecurityPage() {
  return (
    <div class="max-w-2xl">
      <h1 class="text-3xl font-bold tracking-tight mb-2">Security</h1>
      <p class="text-gray-600 dark:text-gray-400 mb-8">
        Safe by default. One rule to remember.
      </p>

      <h2 class="text-xl font-semibold mt-8 mb-3">✅ Everything is escaped</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        Text content, attributes, URLs — all HTML-escaped automatically. No configuration needed.
      </p>

      <h2 class="text-xl font-semibold mt-8 mb-3">⚠️ One rule</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-2">
        <strong>Never use <code>raw()</code> with untrusted input.</strong>
      </p>
      <CodeExample src="guide/security/one-rule.tsx" />

      <h2 class="text-xl font-semibold mt-8 mb-3">When is <code>raw()</code> safe?</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-2">
        Markdown renderers (<code>marked</code>, <code>remark</code>). Template engines (<code>EJS</code>, <code>Handlebars</code>). Your own hardcoded HTML.
      </p>

      <div class="mt-10 flex justify-between">
        <a
          href="/guide/quick-start"
          class="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
        >
          ← Quick Start
        </a>
        <a
          href="/api/renderToString"
          class="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
        >
          API →
        </a>
      </div>
    </div>
  );
}
