/**
 * Docs TOC markup renderer.
 *
 * Supplied to build-core via the `renderToc` hook: build-core does the
 * heading-id assignment + entry extraction (presentation-free); this owns the
 * markup and Tailwind classes. Pairs with `<TableOfContents />`, which emits
 * the `data-toc-placeholder` that build-core replaces with this output.
 */
import type { TocEntry } from "@cjean-fr/build-core";

export function renderToc(entries: readonly TocEntry[]): string {
  const items = entries
    .map(
      (e) =>
        `<li class="docs-toc-entry docs-toc-level-${e.level} m-0">` +
        `<a href="#${e.id}" class="docs-toc-link block py-1 ${e.level === 3 ? "pl-6 text-xs" : "pl-3"} text-sm text-gray-500 dark:text-gray-400 border-l-2 border-transparent hover:text-gray-900 dark:hover:text-gray-100 -ml-px transition-colors aria-[current=true]:text-blue-600 dark:aria-[current=true]:text-blue-400 aria-[current=true]:border-blue-500">${escapeHtml(e.text)}</a>` +
        `</li>`,
    )
    .join("");
  return (
    `<aside class="docs-toc sticky top-8 text-sm" aria-label="Table of contents">` +
    `<p class="docs-toc-title m-0 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">On this page</p>` +
    `<ul class="docs-toc-list list-none p-0 m-0 border-l border-gray-200 dark:border-gray-800">${items}</ul>` +
    `</aside>`
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
