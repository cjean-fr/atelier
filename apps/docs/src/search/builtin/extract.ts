/**
 * Build-time extraction of search index entries from rendered HTML.
 * Shared between the static build and the dev plugin so dev and prod search
 * behave identically.
 */
import type { SearchEntry } from "./engine.js";

/**
 * Extract a search index entry from a fully rendered HTML document.
 */
export function indexEntry(url: string, html: string): SearchEntry {
  return {
    url,
    title: extractTitle(html),
    text: stripText(html),
  };
}

function extractTitle(html: string): string {
  // Prefer the <title> tag; fall back to first <h1>.
  const t = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (t) return decodeEntities(t[1]!.trim()).split(" — ")[0]!.trim();

  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1) return decodeEntities(stripTags(h1[1]!)).trim();

  return "";
}

function stripText(html: string): string {
  // Prefer the page's <main> element when present — every other region
  // (sidebar, header, footer, TOC <aside>) is shared chrome that pollutes
  // the index with false positives. Fall back to the whole document for
  // layouts that don't use <main>.
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  const body = main ? main[1]! : html;
  const noHead = body.replace(/<head\b[^>]*>[\s\S]*?<\/head>/gi, " ");
  const noScripts = noHead.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ");
  const noStyles = noScripts.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ");
  const noNav = noStyles.replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi, " ");
  const noAside = noNav.replace(/<aside\b[^>]*>[\s\S]*?<\/aside>/gi, " ");
  const stripped = stripTags(noAside);
  return decodeEntities(stripped).replace(/\s+/g, " ").trim();
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, " ");
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}
