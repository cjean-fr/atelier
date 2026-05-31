/**
 * `defineDocs(config)` — input validation + default filling.
 *
 * Returns a `ResolvedDocsConfig` consumed by the build pipeline and the Vite
 * plugin. Calling it explicitly in `docs.config.ts` gives the user TS
 * autocomplete and catches typos at compile time.
 */

import type { DocsConfig, ResolvedDocsConfig } from "./types.js";
import { Layout } from "./components/Layout.js";
import { builtin } from "./search/builtin/adapter.js";

const DEFAULTS = {
  pages: "./pages",
  examples: "./examples",
  clientEntry: "src/client.ts",
  out: "./dist",
  base: "/",
  viteManifest: "dist/assets/.vite/manifest.json",
} as const;

export function defineDocs(config: DocsConfig): ResolvedDocsConfig {
  if (!config.title) {
    throw new Error("[@cjean-fr/docs] defineDocs(): `title` is required.");
  }

  return {
    title: config.title,
    tagline: config.tagline ?? null,
    description: config.description ?? config.title,
    pages: config.pages ?? DEFAULTS.pages,
    examples: config.examples ?? DEFAULTS.examples,
    clientEntry: config.clientEntry ?? DEFAULTS.clientEntry,
    out: config.out ?? DEFAULTS.out,
    base: normalizeBase(config.base ?? DEFAULTS.base),
    viteManifest: config.viteManifest ?? DEFAULTS.viteManifest,
    sidebar: config.sidebar ?? "auto",
    editUrl: config.editUrl ?? null,
    site: config.site ?? null,
    sitemap: config.sitemap !== false && Boolean(config.site),
    rss:
      config.rss === undefined || config.rss === false
        ? false
        : config.rss === true
          ? {}
          : config.rss,
    search: config.search === undefined ? builtin() : config.search,
    components: {
      Layout: config.components?.Layout ?? Layout,
    },
  };
}

function normalizeBase(base: string): string {
  if (!base.startsWith("/")) base = "/" + base;
  if (!base.endsWith("/")) base = base + "/";
  return base;
}
