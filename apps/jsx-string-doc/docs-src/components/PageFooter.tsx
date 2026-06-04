/** @jsxImportSource @cjean-fr/jsx-string */
import { useDocs } from "../context.js";

export function PageFooter() {
  const { editUrl, lastUpdated } = useDocs();
  if (!editUrl && !lastUpdated) return null;

  return (
    <footer class="docs-page-footer mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 pt-6 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
      {editUrl ? (
        <a
          class="docs-page-footer-edit inline-flex items-center gap-1 hover:text-gray-900 dark:hover:text-gray-100"
          href={editUrl}
          target="_blank"
          rel="noopener"
        >
          Edit this page on GitHub →
        </a>
      ) : (
        <span />
      )}
      {lastUpdated && (
        <time class="docs-page-footer-updated" datetime={lastUpdated}>
          Last updated: {formatDate(lastUpdated)}
        </time>
      )}
    </footer>
  );
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}
