const PLACEHOLDER_RE = /<aside\s+data-toc-placeholder\s*><\/aside>/i;

export interface TocEntry {
  id: string;
  text: string;
  level: number;
}

export function injectToc(html: string, renderToc: (entries: TocEntry[]) => string): string {
  const entries = extractTocEntries(html);
  if (entries.length === 0) {
    return html.replace(PLACEHOLDER_RE, "");
  }
  const tocHtml = renderToc(entries);
  return html.replace(PLACEHOLDER_RE, tocHtml);
}

function extractTocEntries(html: string): TocEntry[] {
  const entries: TocEntry[] = [];
  const h2Re = /<h2\s+id="([^"]+)"[^>]*>(.*?)<\/h2>/gi;
  const h3Re = /<h3\s+id="([^"]+)"[^>]*>(.*?)<\/h3>/gi;

  let match: RegExpExecArray | null;
  while ((match = h2Re.exec(html)) !== null) {
    entries.push({ id: match[1], text: stripHtml(match[2]), level: 2 });
  }
  while ((match = h3Re.exec(html)) !== null) {
    entries.push({ id: match[1], text: stripHtml(match[2]), level: 3 });
  }
  return entries;
}

function stripHtml(s: string): string {
  return s.replace(/<[^>]*>/g, "");
}

export const TOC_PLACEHOLDER = '<aside data-toc-placeholder></aside>';

export function renderTocHtml(entries: TocEntry[]): string {
  const items = entries
    .map(
      (e) =>
        `<li class="docs-toc-entry docs-toc-level-${e.level} m-0">` +
        `<a href="#${e.id}" class="docs-toc-link block py-1 ${e.level === 3 ? "pl-6 text-xs" : "pl-3"} text-sm text-gray-500 dark:text-gray-400 border-l-2 border-transparent hover:text-gray-900 dark:hover:text-gray-100 -ml-px transition-colors">${escapeHtml(e.text)}</a>` +
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
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
