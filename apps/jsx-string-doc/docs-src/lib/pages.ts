import type { MarkdownOptions } from "./markdown.js";
import type { ResolvedDocsConfig, Page, HandlerEntry } from "../types.js";
import { existsSync } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

export interface DiscoverOptions {
  loadPage?: (file: string) => Promise<Record<string, unknown>>;
  markdown?: MarkdownOptions;
  handlers?: Record<string, HandlerEntry>;
}

type PageLoader = NonNullable<DiscoverOptions["loadPage"]>;

export async function discoverPages(
  config: ResolvedDocsConfig,
  options: DiscoverOptions = {},
): Promise<Page[]> {
  const pagesDir = path.resolve(config.pages);
  const handlers = options.handlers ?? config.handlers;
  const extensions = Object.keys(handlers);
  const found = await walk(pagesDir, extensions);
  const pages: Page[] = [];
  const load = options.loadPage ?? defaultLoader;
  for (const file of found) {
    pages.push(await loadFile(file, config, load, handlers));
  }
  pages.sort((a, b) => a.url.localeCompare(b.url));
  return pages;
}

async function loadFile(
  file: string,
  config: ResolvedDocsConfig,
  _load: PageLoader,
  handlers: Record<string, HandlerEntry>,
): Promise<Page> {
  const pagesDir = path.resolve(config.pages);
  const ext = extname(file);
  const entry = handlers[ext];
  if (entry) {
    return entry.handler.load(file, pagesDir, config);
  }
  throw new Error(`[jsx-string-doc] No handler configured for "${ext}" files (${file}).`);
}

function extname(file: string): string {
  const dot = file.lastIndexOf(".");
  return dot === -1 ? "" : file.slice(dot);
}

export function findPageFile(
  config: ResolvedDocsConfig,
  url: string,
): string | null {
  const pagesDir = path.resolve(config.pages);
  const extensions = Object.keys(config.handlers);
  let route = url.replace(/^\//, "") || "index";
  if (route.endsWith(".html")) route = route.slice(0, -".html".length);
  if (route.endsWith("/")) route = route + "index";
  for (const base of [route, `${route}/index`]) {
    for (const ext of extensions) {
      const candidate = path.join(pagesDir, base + ext);
      if (existsSync(candidate)) return candidate;
    }
  }
  return null;
}

function defaultLoader(file: string): Promise<Record<string, unknown>> {
  return import(/* @vite-ignore */ pathToFileURL(file).href);
}

async function walk(dir: string, extensions: string[]): Promise<string[]> {
  const out: string[] = [];
  if (!existsSync(dir)) return out;
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walk(fullPath, extensions)));
    } else if (entry.isFile() && extensions.some((ext) => entry.name.endsWith(ext))) {
      out.push(fullPath);
    }
  }
  return out;
}
