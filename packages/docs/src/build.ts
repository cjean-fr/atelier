/**
 * The build entrypoint. Reads the docs config, discovers pages, renders each
 * one wrapped in the configured Layout, writes HTML files, then asks the
 * search adapter to produce its artifacts.
 *
 * The typical project's `build.ts` is:
 *
 *     import { build } from "@cjean-fr/docs";
 *     import config from "./docs.config.js";
 *     await build(config);
 */

import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { renderToStatic } from "@cjean-fr/jsx-flow";
import { loadViteManifest, setVite } from "@cjean-fr/jsx-vite";
import { setDocs } from "./context.js";
import { discoverPages, type DiscoverOptions } from "./routing.js";
import { resolveSidebar } from "./sidebar.js";
import { injectToc } from "./toc.js";
import { getLastModified, preloadLastModified } from "./git.js";
import { resolveEditUrl } from "./editUrl.js";
import { generateSitemap, generateRss } from "./sitemap.js";
import type { Page, PageMeta, ResolvedDocsConfig } from "./types.js";

export interface BuildResult {
  /** Pages written to disk, indexed by output URL. */
  pages: ReadonlyArray<{ url: string; outPath: string }>;
  /** True iff the search adapter wrote anything. */
  searchBuilt: boolean;
  /** True iff sitemap.xml was emitted. */
  sitemapBuilt: boolean;
  /** True iff feed.xml was emitted. */
  rssBuilt: boolean;
}

export interface BuildOptions extends DiscoverOptions {}

export async function build(
  config: ResolvedDocsConfig,
  options: BuildOptions = {},
): Promise<BuildResult> {
  // 1. Load Vite manifest produced by `vite build`.
  const manifest = await loadViteManifest(path.resolve(config.viteManifest));
  if (!manifest) {
    throw new Error(
      `[@cjean-fr/docs] Vite manifest not found at ${config.viteManifest}. ` +
        `Run \`vite build\` before \`build()\`.`,
    );
  }

  // 2. Discover pages.
  const allPages = await discoverPages(config, options);
  const buildablePages = process.env.NODE_ENV === "production"
    ? allPages.filter((p) => !p.meta.draft)
    : allPages;

  // Batch all per-page `git log` lookups into one process.
  await preloadLastModified(buildablePages.map((p) => p.file));

  // 3. Render every page in a shared renderToStatic scope so search-related
  //    state (and a single Vite manifest setup) is shared.
  const written: Array<{ url: string; outPath: string }> = [];
  const rendered: Array<{ url: string; html: string; meta: PageMeta }> = [];
  const pageMetas: Array<{ url: string; meta: PageMeta; lastUpdated: string | null }> = [];

  await renderToStatic(async (ctx) => {
    setVite(manifest, { base: config.base });

    for (const page of buildablePages) {
      const sidebar = resolveSidebar(buildablePages, config.sidebar, page.url);
      const lastUpdated =
        page.meta.updatedAt ?? (await getLastModified(page.file));
      const editUrl = resolveEditUrl(config.editUrl, page.file);
      setDocs({
        config,
        currentPage: page.url,
        meta: page.meta,
        sidebar,
        lastUpdated,
        editUrl,
      });

      const raw = await ctx.renderPage(() => renderPageWithLayout(page, config));
      const html = injectToc(raw);
      const fullHtml = "<!DOCTYPE html>\n" + html;
      await mkdir(path.dirname(page.outPath), { recursive: true });
      await writeFile(page.outPath, fullHtml, "utf-8");

      written.push({ url: page.url, outPath: page.outPath });
      rendered.push({ url: page.url, html: fullHtml, meta: page.meta });
      pageMetas.push({ url: page.url, meta: page.meta, lastUpdated });
    }
  });

  // 4. Let the search adapter materialize whatever artifacts it needs.
  let searchBuilt = false;
  if (config.search !== false) {
    await config.search.build({ pages: rendered, outDir: config.out });
    searchBuilt = true;
  }

  // 5. Sitemap / RSS.
  let sitemapBuilt = false;
  let rssBuilt = false;
  if (config.site) {
    if (config.sitemap) {
      const xml = generateSitemap({ pages: pageMetas, site: config.site });
      await writeFile(path.join(config.out, "sitemap.xml"), xml, "utf-8");
      sitemapBuilt = true;
    }
    if (config.rss) {
      const xml = generateRss({
        pages: pageMetas,
        site: config.site,
        title: config.rss.title ?? config.title,
        description: config.rss.description ?? config.description,
        language: config.rss.language,
      });
      await writeFile(path.join(config.out, "feed.xml"), xml, "utf-8");
      rssBuilt = true;
    }
  }

  return { pages: written, searchBuilt, sitemapBuilt, rssBuilt };
}

/** Render a page, wrapped in the chosen Layout unless `meta.layout === false`. */
function renderPageWithLayout(page: Page, config: ResolvedDocsConfig) {
  const Component = page.Component;
  const LayoutChoice =
    page.meta.layout === false
      ? null
      : (page.meta.layout ?? config.components.Layout);

  const inner = Component({});
  if (LayoutChoice === null) return inner;
  return LayoutChoice({ children: inner });
}
