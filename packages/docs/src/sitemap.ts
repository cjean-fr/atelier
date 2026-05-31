/**
 * Sitemap + RSS generation. Both opt-in via `config.site` (the public origin
 * URL) — without it, neither file is produced (URLs need an origin).
 */

import type { PageMeta } from "./types.js";

export interface SitemapInput {
  pages: ReadonlyArray<{ url: string; meta: PageMeta; lastUpdated: string | null }>;
  /** Public origin (e.g. `"https://docs.example.com"`). Required. */
  site: string;
}

/** Generate a minimal sitemap.xml string. */
export function generateSitemap(input: SitemapInput): string {
  const { site, pages } = input;
  const origin = site.replace(/\/+$/, "");
  const entries = pages
    .filter((p) => !p.meta.draft)
    .map((p) => {
      const loc = origin + p.url;
      const lastmod = p.lastUpdated ? `<lastmod>${escapeXml(p.lastUpdated)}</lastmod>` : "";
      return `  <url><loc>${escapeXml(loc)}</loc>${lastmod}</url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
}

export interface RssInput {
  pages: ReadonlyArray<{ url: string; meta: PageMeta; lastUpdated: string | null }>;
  /** Public origin (e.g. `"https://docs.example.com"`). Required. */
  site: string;
  /** Channel title. Defaults to `"Documentation"`. */
  title?: string;
  /** Channel description. */
  description?: string;
  /** Optional language code (e.g. `"en-US"`). */
  language?: string;
}

/** Generate a minimal RSS 2.0 feed string. */
export function generateRss(input: RssInput): string {
  const { site, pages, title = "Documentation", description = "", language } = input;
  const origin = site.replace(/\/+$/, "");
  const sorted = [...pages]
    .filter((p) => !p.meta.draft)
    .sort((a, b) => {
      const da = a.meta.publishedAt ?? a.lastUpdated ?? "";
      const db = b.meta.publishedAt ?? b.lastUpdated ?? "";
      return db.localeCompare(da);
    });

  const items = sorted
    .map((p) => {
      const link = origin + p.url;
      const pubDate = p.meta.publishedAt ?? p.lastUpdated;
      const dateLine = pubDate
        ? `      <pubDate>${escapeXml(new Date(pubDate).toUTCString())}</pubDate>`
        : "";
      const descLine = p.meta.description
        ? `      <description>${escapeXml(p.meta.description)}</description>`
        : "";
      return `    <item>
      <title>${escapeXml(p.meta.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
${dateLine}
${descLine}
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${escapeXml(origin)}</link>
    <description>${escapeXml(description)}</description>${language ? `\n    <language>${escapeXml(language)}</language>` : ""}
    <atom:link href="${escapeXml(origin + "/feed.xml")}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
