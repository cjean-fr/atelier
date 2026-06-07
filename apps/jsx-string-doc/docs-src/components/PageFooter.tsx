/** @jsxImportSource @cjean-fr/jsx-string */
import { useDocs } from "../context.js";

export function PageFooter() {
  const { editUrl, lastUpdated, prev, next } = useDocs();
  const hasNav = prev !== null || next !== null;
  const hasFooter = editUrl !== null || lastUpdated !== null;

  if (!hasNav && !hasFooter) return null;

  return (
    <div class="docs-page-footer-wrapper">
      {hasNav && (
        <nav class="docs-page-nav mt-10 flex justify-between">
          {prev ? (
            <a
              href={prev.href}
              class="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
            >
              ← {prev.label}
            </a>
          ) : (
            <span />
          )}
          {next ? (
            <a
              href={next.href}
              class="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
            >
              {next.label} →
            </a>
          ) : (
            <span />
          )}
        </nav>
      )}
      {hasFooter && (
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
      )}
    </div>
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
