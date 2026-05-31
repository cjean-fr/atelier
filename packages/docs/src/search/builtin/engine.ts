/**
 * Pure search engine logic: ranking, snippets, and HTML helpers.
 *
 * Kept DOM-free so it's trivially testable and easy to lift into a future
 * shared "doc-site-builder" package. The DOM wiring lives in `search.ts`.
 */

export interface SearchEntry {
  url: string;
  title: string;
  text: string;
}

export interface RankedResult {
  entry: SearchEntry;
  score: number;
  snippet: string;
}

/** Maximum number of results returned by `rank()`. */
export const MAX_RESULTS = 10;

/** Half-width (in chars) of the context window built around the first match. */
const SNIPPET_RADIUS = 40;

/** Snippet fallback length when the match is in the title only. */
const TITLE_ONLY_FALLBACK_LEN = 120;

const TITLE_HIT_SCORE = 100;
const TEXT_HIT_SCORE = 10;

/**
 * Filter and rank `entries` against a lowercased query.
 *
 * - Match is case-insensitive substring (caller is expected to pass `q` already
 *   lowercased — the entry title/text are lowercased internally).
 * - Title hits weigh 10× body hits, so a page whose name matches always wins.
 * - Results are trimmed to {@link MAX_RESULTS}.
 *
 * Returns an empty array when `q` is empty or no entry matches.
 */
export function rank(entries: SearchEntry[], q: string): RankedResult[] {
  if (!q) return [];
  const out: RankedResult[] = [];
  for (const entry of entries) {
    const titleLc = entry.title.toLowerCase();
    const textLc = entry.text.toLowerCase();
    const titleHit = titleLc.includes(q);
    const textHit = textLc.indexOf(q);
    if (!titleHit && textHit === -1) continue;
    const score =
      (titleHit ? TITLE_HIT_SCORE : 0) + (textHit !== -1 ? TEXT_HIT_SCORE : 0);
    out.push({
      entry,
      score,
      snippet:
        textHit !== -1
          ? snippetAround(entry.text, textHit, q.length)
          : entry.text.slice(0, TITLE_ONLY_FALLBACK_LEN),
    });
  }
  out.sort((a, b) => b.score - a.score);
  return out.slice(0, MAX_RESULTS);
}

/**
 * Extract a {@link SNIPPET_RADIUS}-wide window of `text` around the match
 * starting at `at` (a byte offset returned by `String.indexOf`). The snippet
 * is prefixed/suffixed with an ellipsis when it is not flush with either end
 * of the source.
 */
export function snippetAround(text: string, at: number, len: number): string {
  const start = Math.max(0, at - SNIPPET_RADIUS);
  const end = Math.min(text.length, at + len + SNIPPET_RADIUS);
  const prefix = start > 0 ? "…" : "";
  const suffix = end < text.length ? "…" : "";
  return prefix + text.slice(start, end) + suffix;
}

/** HTML-escape a string for safe interpolation into element content. */
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** HTML-escape a string for safe interpolation into attribute values. */
export function escapeAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

/**
 * HTML-escape `text`, then wrap every case-insensitive occurrence of `query`
 * in a styled `<mark>`. `query` is also escaped and regex-quoted so the
 * function is XSS-safe for arbitrary user input.
 */
export function highlight(text: string, query: string): string {
  const escapedText = escapeHtml(text);
  if (!query) return escapedText;
  const pattern = escapeHtml(query).replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&",
  );
  if (!pattern) return escapedText;
  const regex = new RegExp(`(${pattern})`, "gi");
  return escapedText.replace(
    regex,
    '<mark class="bg-yellow-200 dark:bg-yellow-700/60 text-gray-900 dark:text-gray-50 rounded px-0.5 font-semibold">$1</mark>',
  );
}
