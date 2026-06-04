import { raw } from "@cjean-fr/jsx-string";
import { processMarkdown, type MarkdownOptions } from "./markdown.js";
import type { ResolvedDocsConfig, Page, PageMeta } from "../types.js";
import { existsSync } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const PAGE_EXTENSIONS = [".tsx", ".mdx", ".md"] as const;

export interface DiscoverOptions {
  loadPage?: (file: string) => Promise<Record<string, unknown>>;
  markdown?: MarkdownOptions;
}

type PageLoader = NonNullable<DiscoverOptions["loadPage"]>;

export async function loadPageModule(
  file: string,
  config: ResolvedDocsConfig,
  load: PageLoader,
): Promise<Page> {
  const pagesDir = path.resolve(config.pages);
  const rel = path.relative(pagesDir, file).replace(/\\/g, "/");

  if (file.endsWith(".md")) {
    return loadMarkdownPage(file, rel, config);
  }

  const route = rel.replace(/\.(tsx|mdx)$/, "");
  const mod = await load(file);
  const Component = mod["default"];
  if (typeof Component !== "function") {
    throw new Error(
      `[jsx-string-doc] ${rel} has no default export, or the default export is not a function.`,
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
  config: ResolvedDocsConfig,
): Promise<Page> {
  const route = rel.replace(/\.md$/, "");
  const { html, meta: rawMeta } = await processMarkdown(file);
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

export async function discoverPages(
  config: ResolvedDocsConfig,
  options: DiscoverOptions = {},
): Promise<Page[]> {
  const pagesDir = path.resolve(config.pages);
  const found = await walk(pagesDir);
  const pages: Page[] = [];
  const load = options.loadPage ?? defaultLoader;
  for (const file of found) {
    pages.push(await loadPageModule(file, config, load));
  }
  pages.sort((a, b) => a.url.localeCompare(b.url));
  return pages;
}

export function findPageFile(
  config: ResolvedDocsConfig,
  url: string,
): string | null {
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

function defaultLoader(file: string): Promise<Record<string, unknown>> {
  return import(/* @vite-ignore */ pathToFileURL(file).href);
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
      `[jsx-string-doc] ${file} is missing \`meta\` export or frontmatter. Add at least \`title: "…"\`.`,
    );
  }
  if (typeof raw !== "object") {
    throw new Error(`[jsx-string-doc] ${file}: \`meta\` must be an object.`);
  }
  const meta = raw as PageMeta;
  if (typeof meta.title !== "string" || meta.title.length === 0) {
    throw new Error(
      `[jsx-string-doc] ${file}: \`title\` is required and must be a non-empty string.`,
    );
  }
  return meta;
}

function routeToUrl(route: string): string {
  if (route === "index") return "/";
  if (route.endsWith("/index")) return "/" + route.slice(0, -"/index".length);
  return "/" + route;
}

function urlToOutPath(url: string): string {
  if (url === "/") return "index.html";
  return url.replace(/^\//, "") + ".html";
}
