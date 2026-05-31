/**
 * Filesystem-based page discovery.
 *
 * Walks `config.pages`, imports every `.tsx` and processes every `.md`,
 * producing a normalized `Page[]` ready to be rendered.
 *
 * - `.tsx` files: the default export is the component, `meta` export is
 *   the page metadata.
 * - `.md` files: YAML frontmatter is the meta, the body is rendered to HTML
 *   via the configured unified pipeline and wrapped in a tiny component
 *   that emits `raw(html)`.
 */
import { processMarkdown, type MarkdownOptions } from "./markdown.js";
import type { CoreConfig, Page, PageMeta } from "./types.js";
import { raw } from "@cjean-fr/jsx-string";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

export interface DiscoverOptions {
  /**
   * Module loader for a `.tsx` page file. Defaults to Node's native dynamic
   * `import()` — fine when the runtime understands TS (Bun, ts-node, …).
   * The CLI overrides this with `viteDevServer.ssrLoadModule` so plain
   * `node`/`npx` can load `.tsx` files without an extra runtime.
   */
  loadPage?: (file: string) => Promise<Record<string, unknown>>;

  /** Pipeline options forwarded to `processMarkdown`. */
  markdown?: MarkdownOptions;
}

type PageLoader = NonNullable<DiscoverOptions["loadPage"]>;

const defaultLoad: PageLoader = (file) =>
  import(/* @vite-ignore */ pathToFileURL(file).href);

/**
 * Recursively discover all `.tsx` and `.md` pages under `config.pages` and
 * return a normalized list. Drafts are kept by default — the caller (build)
 * decides whether to skip them.
 */
export async function discoverPages(
  config: CoreConfig,
  options: DiscoverOptions = {},
): Promise<Page[]> {
  const load = options.loadPage ?? defaultLoad;
  const pagesDir = path.resolve(config.pages);
  const found = await walk(pagesDir);
  const pages: Page[] = [];

  for (const file of found) {
    const rel = path.relative(pagesDir, file).replace(/\\/g, "/");
    const page = file.endsWith(".md")
      ? await loadMarkdownPage(file, rel, pagesDir, config, options.markdown)
      : await loadTsxPage(file, rel, pagesDir, config, load);
    pages.push(page);
  }

  // Stable ordering: by URL, so the order of build output is deterministic.
  pages.sort((a, b) => a.url.localeCompare(b.url));
  return pages;
}

async function loadTsxPage(
  file: string,
  rel: string,
  _pagesDir: string,
  config: CoreConfig,
  load: PageLoader,
): Promise<Page> {
  const route = rel.replace(/\.tsx$/, "");
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
    meta,
    Component: Component as Page["Component"],
  };
}

async function loadMarkdownPage(
  file: string,
  rel: string,
  _pagesDir: string,
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
    meta,
    Component: () => rendered,
  };
}

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walk(fullPath)));
    } else if (
      entry.isFile() &&
      (entry.name.endsWith(".tsx") || entry.name.endsWith(".md"))
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
function routeToUrl(route: string): string {
  if (route === "index") return "/";
  if (route.endsWith("/index")) return "/" + route.slice(0, -"/index".length);
  return "/" + route;
}

/** Map a URL back to an output file path under `config.out`. */
function urlToOutPath(url: string): string {
  if (url === "/") return "index.html";
  return url.replace(/^\//, "") + ".html";
}
