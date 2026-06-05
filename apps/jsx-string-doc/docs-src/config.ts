import type { ResolvedDocsConfig, DocsConfig, HandlerEntry } from "./types.js";
import { JsxStringHandler } from "./handlers/jsx-string.js";
import { MarkdownHandler } from "./handlers/markdown.js";
import { Layout } from "./components/Layout.js";

const DEFAULTS = {
  pages: "./docs-src/pages",
  examples: "./docs-src/examples",
  clientEntry: "docs-src/client.ts",
  out: "./dist",
  base: "/",
  viteManifest: "dist/assets/.vite/manifest.json",
} as const;

const DEFAULT_HANDLERS: Record<string, HandlerEntry> = {
  ".tsx": { handler: JsxStringHandler },
  ".jsx": { handler: JsxStringHandler },
  ".md":  { handler: MarkdownHandler, prose: true },
};

export function defineConfig(config: DocsConfig): ResolvedDocsConfig {
  if (!config.title) {
    throw new Error("[jsx-string-doc] defineConfig(): `title` is required.");
  }

  const handlers = { ...DEFAULT_HANDLERS, ...config.handlers };

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
    handlers,
    layout: config.layout ?? Layout,
  };
}

function normalizeBase(base: string): string {
  if (!base.startsWith("/")) base = "/" + base;
  if (!base.endsWith("/")) base = base + "/";
  return base;
}
