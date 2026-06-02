/**
 * Auto Table of Contents from `<h2>` / `<h3>` headings.
 *
 * Post-render mechanics only — no presentation. This module finds headings,
 * assigns slugified IDs to those missing one, collects the entries, and
 * replaces the `<TableOfContents />` placeholder with markup the distro
 * supplies via the `renderToc` hook. Headings keep their original IDs when
 * present.
 *
 * The placeholder uses `<aside data-toc-placeholder></aside>` — the stable
 * selector emitted by the distro's `<TableOfContents />`. Build and dev both
 * call `injectToc()`.
 */

export interface TocEntry {
  /** Heading level: 2 or 3. */
  level: 2 | 3;
  /** Slug (used as `id` attribute and href anchor). */
  id: string;
  /** Plain-text heading content (HTML tags stripped). */
  text: string;
}

/**
 * Distro-supplied renderer turning the collected entries into TOC markup.
 * build-core stays presentation-free; the distro owns the classes/HTML.
 */
export type RenderTocHook = (entries: readonly TocEntry[]) => string;

const PLACEHOLDER = /<aside data-toc-placeholder><\/aside>/;

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
 * 3. Replace the `<TableOfContents />` placeholder with the markup returned by
 *    `renderToc(entries)`. Returns HTML unchanged when no placeholder is found
 *    or there are no headings.
 */
export function injectToc(html: string, renderToc: RenderTocHook): string {
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

function unique(base: string, used: Set<string>): string {
  if (!used.has(base)) return base;
  let i = 2;
  while (used.has(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, "");
}
