/**
 * Generic build orchestrator — discovers pages, renders each one via a
 * distro-provided `renderPage` hook, writes HTML, then runs the search
 * adapter, sitemap and RSS.
 *
 * Distros (docs, blog) build on top by supplying:
 *   - a config object (any shape extending BuildConfig)
 *   - a `renderPage(page, ctx)` hook that wraps the page in a Layout,
 *     populates distro context, returns the inner HTML string.
 */
import { resolveEditUrl } from "./editUrl.js";
import { getLastModified, preloadLastModified } from "./git.js";
import type { MarkdownOptions } from "./markdown.js";
import { discoverPages, type DiscoverOptions } from "./routing.js";
import { generateRss, generateSitemap } from "./sitemap.js";
import { injectToc, type RenderTocHook } from "./toc.js";
import type { CoreConfig, Page, PageMeta, SearchAdapter } from "./types.js";
import { renderToStatic } from "@cjean-fr/jsx-flow";
import type { StaticContext } from "@cjean-fr/jsx-flow";
import { loadViteManifest, setVite } from "@cjean-fr/jsx-vite";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

/** Build-time config — extends CoreConfig with the shared site fields. */
export interface BuildConfig extends CoreConfig {
  /** Site title (used as RSS feed title fallback). */
  title?: string;
  /** Site description (used as RSS feed description fallback). */
  description?: string;
  /** Public path prefix for assets (passed to Vite manifest). Default: `"/"`. */
  base?: string;
  /** Path to the Vite manifest, relative to project root. */
  viteManifest?: string;
  /** Edit-on-Git URL template with `{slug}` placeholder. */
  editUrl?: string | null;
  /** Public origin URL (e.g. `"https://docs.example.com"`). Enables sitemap+RSS. */
  site?: string | null;
  /** Generate sitemap.xml. Default: `true` when `site` is set. */
  sitemap?: boolean;
  /** Generate feed.xml. Default: `false`. */
  rss?: false | { title?: string; description?: string; language?: string };
  /** Search adapter — pass an adapter, or `false` to disable. */
  search?: SearchAdapter | false;
  /** Markdown pipeline plugins forwarded to `processMarkdown`. */
  markdown?: MarkdownOptions;
}

export interface BuildResult {
  pages: ReadonlyArray<{ url: string; outPath: string }>;
  searchBuilt: boolean;
  sitemapBuilt: boolean;
  rssBuilt: boolean;
}

/** Context passed to the distro's `renderPage` hook. */
export interface RenderPageContext<C = unknown> {
  /** The `renderToStatic` context, exposing `ctx.renderPage(() => node)`. */
  ctx: StaticContext;
  /** All discovered pages (post-routing). Useful for sidebar / navigation. */
  allPages: readonly Page[];
  /** ISO 8601 last-modified for the page (from meta.updatedAt or git). */
  lastUpdated: string | null;
  /** Resolved edit URL for this page, or null when not configured. */
  editUrl: string | null;
  /** The original config object the distro passed in. */
  config: C;
}

/**
 * Hook signature distros implement.
 *
 * Returns the inner HTML string for the page — without `<!DOCTYPE>` (the
 * orchestrator prepends it) and without TOC injection (the orchestrator
 * calls `injectToc` after).
 */
export type RenderPageHook<C = unknown> = (
  page: Page,
  context: RenderPageContext<C>,
) => Promise<string>;

export interface BuildOptions<C = unknown> extends DiscoverOptions {
  /** The distro's renderPage implementation. */
  renderPage: RenderPageHook<C>;
  /** The distro's TOC markup renderer (build-core stays presentation-free). */
  renderToc: RenderTocHook;
}

/**
 * Run a full production build.
 *
 * Requires `vite build` to have already run (manifest must exist on disk).
 */
export async function buildSite<C extends BuildConfig>(
  config: C,
  options: BuildOptions<C>,
): Promise<BuildResult> {
  // 1. Load Vite manifest (must exist — vite build runs first).
  const manifestPath = path.resolve(
    config.viteManifest ?? "dist/assets/.vite/manifest.json",
  );
  const manifest = await loadViteManifest(manifestPath);
  if (!manifest) {
    throw new Error(
      `[@cjean-fr/build-core] Vite manifest not found at ${manifestPath}. ` +
        `Run \`vite build\` before \`buildSite()\`.`,
    );
  }

  // 2. Discover pages (.tsx + .md).
  const allPages = await discoverPages(config, {
    loadPage: options.loadPage,
    markdown: config.markdown ?? options.markdown,
  });
  const buildable =
    process.env.NODE_ENV === "production"
      ? allPages.filter((p) => !p.meta.draft)
      : allPages;

  // 3. Batch git lookups in one process.
  await preloadLastModified(buildable.map((p) => p.file));

  // 4. Render every page in a shared renderToStatic scope.
  const written: Array<{ url: string; outPath: string }> = [];
  const rendered: Array<{ url: string; html: string; meta: PageMeta }> = [];
  const pageMetas: Array<{
    url: string;
    meta: PageMeta;
    lastUpdated: string | null;
  }> = [];

  await renderToStatic(async (ctx) => {
    setVite(manifest, { base: config.base ?? "/" });

    for (const page of buildable) {
      const lastUpdated =
        page.meta.updatedAt ?? (await getLastModified(page.file));
      const editUrl = resolveEditUrl(config.editUrl ?? null, page.file);

      const inner = await options.renderPage(page, {
        ctx,
        allPages: buildable,
        lastUpdated,
        editUrl,
        config,
      });
      const html = injectToc(inner, options.renderToc);
      const fullHtml = "<!DOCTYPE html>\n" + html;
      await mkdir(path.dirname(page.outPath), { recursive: true });
      await writeFile(page.outPath, fullHtml, "utf-8");

      written.push({ url: page.url, outPath: page.outPath });
      rendered.push({ url: page.url, html: fullHtml, meta: page.meta });
      pageMetas.push({ url: page.url, meta: page.meta, lastUpdated });
    }
  });

  // 5. Search adapter.
  let searchBuilt = false;
  if (config.search) {
    await config.search.build({ pages: rendered, outDir: config.out });
    searchBuilt = true;
  }

  // 6. Sitemap + RSS (require `site`).
  let sitemapBuilt = false;
  let rssBuilt = false;
  if (config.site) {
    if (config.sitemap !== false) {
      const xml = generateSitemap({ pages: pageMetas, site: config.site });
      await writeFile(path.join(config.out, "sitemap.xml"), xml, "utf-8");
      sitemapBuilt = true;
    }
    if (config.rss) {
      const rss = typeof config.rss === "object" ? config.rss : {};
      const xml = generateRss({
        pages: pageMetas,
        site: config.site,
        title: rss.title ?? config.title ?? "",
        description: rss.description ?? config.description,
        language: rss.language,
      });
      await writeFile(path.join(config.out, "feed.xml"), xml, "utf-8");
      rssBuilt = true;
    }
  }

  return { pages: written, searchBuilt, sitemapBuilt, rssBuilt };
}
