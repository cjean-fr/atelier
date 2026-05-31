/**
 * Auto Table of Contents from `<h2>` / `<h3>` headings.
 *
 * Post-render pipeline: parse the rendered HTML, auto-assign slugified IDs
 * to headings that don't have one, then replace the `<TableOfContents />`
 * placeholder with the rendered TOC. Headings keep their original IDs when
 * present.
 *
 * The placeholder uses `<aside data-docs-toc-placeholder></aside>` — stable
 * selector emitted by `<TableOfContents />`. Build and dev both call
 * `injectToc()`.
 */

export interface TocEntry {
  /** Heading level: 2 or 3. */
  level: 2 | 3;
  /** Slug (used as `id` attribute and href anchor). */
  id: string;
  /** Plain-text heading content (HTML tags stripped). */
  text: string;
}

const PLACEHOLDER = /<aside data-docs-toc-placeholder><\/aside>/;

/** Slugify a heading text into an HTML id (lowercase, alphanumeric + dashes). */
export function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/<[^>]+>/g, "") // strip any inline tags
      .replace(/&[a-z]+;/g, " ") // decode entities loosely
      .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "section"
  );
}

/**
 * Post-process rendered HTML:
 * 1. Find every `<h2>` / `<h3>` and assign a slugified `id` if missing.
 * 2. Collect a TOC.
 * 3. Replace the `<TableOfContents />` placeholder with rendered TOC markup.
 *    Returns HTML unchanged when no placeholder is found.
 */
export function injectToc(html: string): string {
  // Track ids already used so we don't emit duplicates.
  const used = new Set<string>();
  // Pre-scan existing ids so user-set IDs aren't accidentally reused.
  for (const match of html.matchAll(/<h[23][^>]*\bid="([^"]+)"/g)) {
    used.add(match[1]!);
  }

  const entries: TocEntry[] = [];

  const withIds = html.replace(
    /<h([23])(\b[^>]*)>([\s\S]*?)<\/h\1>/g,
    (_match, levelStr: string, attrs: string, inner: string) => {
      const level = (levelStr === "2" ? 2 : 3) as 2 | 3;
      const text = stripTags(inner).trim();
      if (!text) return _match;

      const existingId = attrs.match(/\bid="([^"]+)"/)?.[1];
      let id: string;
      let nextAttrs = attrs;
      if (existingId) {
        id = existingId;
      } else {
        id = unique(slugify(text), used);
        used.add(id);
        nextAttrs = `${attrs} id="${id}"`;
      }
      entries.push({ level, id, text });
      return `<h${levelStr}${nextAttrs}>${inner}</h${levelStr}>`;
    },
  );

  if (!PLACEHOLDER.test(withIds)) return withIds;

  const tocHtml = entries.length === 0 ? "" : renderToc(entries);
  return withIds.replace(PLACEHOLDER, tocHtml);
}

function renderToc(entries: TocEntry[]): string {
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

function unique(base: string, used: Set<string>): string {
  if (!used.has(base)) return base;
  let i = 2;
  while (used.has(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, "");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
