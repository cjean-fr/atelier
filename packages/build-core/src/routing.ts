/**
 * Filesystem-based page discovery.
 *
 * Walks `config.pages`, imports every `.tsx` / `.mdx` and processes every
 * `.md`, producing a normalized `Page[]` ready to be rendered.
 *
 * - `.tsx` / `.mdx` files: the default export is the component, `meta` export
 *   is the page metadata. (`.mdx` is compiled to a jsx-string component by the
 *   loader — e.g. the `@mdx-js/rollup` plugin in the user's Vite config —
 *   with frontmatter surfaced as the `meta` export.)
 * - `.md` files: YAML frontmatter is the meta, the body is rendered to HTML
 *   via the configured unified pipeline and wrapped in a tiny component
 *   that emits `raw(html)`.
 *
 * Build and dev share one code path: the build walks every file through
 * `loadPageFile`; the dev server resolves a single URL with `findPageFile`
 * and loads it through the same `loadPageFile`. No duplicated discovery.
 */
import { processMarkdown, type MarkdownOptions } from "./markdown.js";
import type { CoreConfig, Page, PageMeta } from "./types.js";
import { raw } from "@cjean-fr/jsx-string";
import { existsSync } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

/** Recognized page file extensions, in resolution-priority order. */
export const PAGE_EXTENSIONS = [".tsx", ".mdx", ".md"] as const;

export interface DiscoverOptions {
  /**
   * Module loader for a `.tsx` / `.mdx` page file. Defaults to Node's native
   * dynamic `import()` — fine when the runtime understands TS (Bun, ts-node,
   * …). The CLI overrides this with `viteDevServer.ssrLoadModule` so plain
   * `node`/`npx` can load `.tsx` / `.mdx` files without an extra runtime.
   */
  loadPage?: (file: string) => Promise<Record<string, unknown>>;

  /** Pipeline options forwarded to `processMarkdown`. */
  markdown?: MarkdownOptions;
}

type PageLoader = NonNullable<DiscoverOptions["loadPage"]>;

const defaultLoad: PageLoader = (file) =>
  import(/* @vite-ignore */ pathToFileURL(file).href);

/**
 * Recursively discover all pages under `config.pages` and return a normalized
 * list. Drafts are kept by default — the caller (build) decides whether to
 * skip them.
 */
export async function discoverPages(
  config: CoreConfig,
  options: DiscoverOptions = {},
): Promise<Page[]> {
  const pagesDir = path.resolve(config.pages);
  const found = await walk(pagesDir);
  const pages: Page[] = [];
  for (const file of found) {
    pages.push(await loadPageFile(file, config, options));
  }
  // Stable ordering: by URL, so the order of build output is deterministic.
  pages.sort((a, b) => a.url.localeCompare(b.url));
  return pages;
}

/**
 * Load a single page file into a normalized `Page`. Dispatches on extension:
 * `.md` runs the markdown pipeline; `.tsx` / `.mdx` are imported as modules.
 * Shared by `discoverPages` (build, every file) and the dev server (one file
 * per request) so the two never drift.
 */
export async function loadPageFile(
  file: string,
  config: CoreConfig,
  options: DiscoverOptions = {},
): Promise<Page> {
  const pagesDir = path.resolve(config.pages);
  const rel = path.relative(pagesDir, file).replace(/\\/g, "/");
  return file.endsWith(".md")
    ? loadMarkdownPage(file, rel, config, options.markdown)
    : loadModulePage(file, rel, config, options.loadPage ?? defaultLoad);
}

/**
 * Resolve the page file backing a URL (dev server on-demand lookup). Tries
 * `<route><ext>` then `<route>/index<ext>` for each known extension; returns
 * the first that exists, or `null`.
 */
export function findPageFile(config: CoreConfig, url: string): string | null {
  const pagesDir = path.resolve(config.pages);
  let route = url.replace(/^\//, "") || "index";
  if (route.endsWith(".html")) route = route.slice(0, -".html".length);
  if (route.endsWith("/")) route = route + "index";
  for (const base of [route, `${route}/index`]) {
    for (const ext of PAGE_EXTENSIONS) {
      const candidate = path.join(pagesDir, base + ext);
      if (existsSync(candidate)) return candidate;
    }
  }
  return null;
}

async function loadModulePage(
  file: string,
  rel: string,
  config: CoreConfig,
  load: PageLoader,
): Promise<Page> {
  const route = rel.replace(/\.(tsx|mdx)$/, "");
  const mod = await load(file);
  const Component = mod["default"];
  if (typeof Component !== "function") {
    throw new Error(
      `[@cjean-fr/build-core] ${rel} has no default export, or the default export is not a function.`,
    );
  }
  const meta = normalizeMeta(mod["meta"], rel);
  const url = meta.slug ?? routeToUrl(route);
  return {
    url,
    file,
    outPath: path.join(config.out, urlToOutPath(url)),
    format: file.endsWith(".mdx") ? "mdx" : "tsx",
    meta,
    Component: Component as Page["Component"],
  };
}

async function loadMarkdownPage(
  file: string,
  rel: string,
  config: CoreConfig,
  mdOptions: MarkdownOptions | undefined,
): Promise<Page> {
  const route = rel.replace(/\.md$/, "");
  const { html, meta: rawMeta } = await processMarkdown(file, mdOptions);
  const meta = normalizeMeta(rawMeta, rel);
  const url = meta.slug ?? routeToUrl(route);
  const rendered = raw(html);
  return {
    url,
    file,
    outPath: path.join(config.out, urlToOutPath(url)),
    format: "md",
    meta,
    Component: () => rendered,
  };
}

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  if (!existsSync(dir)) return out;
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walk(fullPath)));
    } else if (
      entry.isFile() &&
      PAGE_EXTENSIONS.some((ext) => entry.name.endsWith(ext))
    ) {
      out.push(fullPath);
    }
  }
  return out;
}

function normalizeMeta(raw: unknown, file: string): PageMeta {
  if (raw == null) {
    throw new Error(
      `[@cjean-fr/build-core] ${file} is missing the required \`meta\` (TSX) or frontmatter (Markdown). ` +
        `Add at least \`title: "…"\`.`,
    );
  }
  if (typeof raw !== "object") {
    throw new Error(
      `[@cjean-fr/build-core] ${file}: \`meta\` must be an object.`,
    );
  }
  const meta = raw as PageMeta;
  if (typeof meta.title !== "string" || meta.title.length === 0) {
    throw new Error(
      `[@cjean-fr/build-core] ${file}: \`title\` is required and must be a non-empty string.`,
    );
  }
  return meta;
}

/**
 * Convert a filesystem route to a URL.
 * - `index` → `/`
 * - `guide/installation` → `/guide/installation`
 * - `guide/index` → `/guide` (directory index)
 */
export function routeToUrl(route: string): string {
  if (route === "index") return "/";
  if (route.endsWith("/index")) return "/" + route.slice(0, -"/index".length);
  return "/" + route;
}

/** Map a URL back to an output file path under `config.out`. */
function urlToOutPath(url: string): string {
  if (url === "/") return "index.html";
  return url.replace(/^\//, "") + ".html";
}
