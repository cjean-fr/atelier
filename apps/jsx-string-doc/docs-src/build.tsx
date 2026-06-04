import { compile } from "@mdx-js/mdx";
import { loadViteManifest, setVite } from "@cjean-fr/jsx-vite";
import { renderToStatic } from "@cjean-fr/jsx-flow";
import { writeFile, mkdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import config from "../docs.config.js";
import { injectToc, renderTocHtml } from "./lib/toc.js";
import { processMarkdown } from "./lib/markdown.js";
import { setDocs } from "./context.js";
import { resolveSidebar } from "./lib/sidebar.js";
import { Layout } from "./components/Layout.js";
import { buildMinimatchIndex } from "./search/minimatch-build.js";
import type { Page, PageMeta, PageFormat, ResolvedDocsConfig } from "./types.js";

const manifestPath = path.resolve(config.viteManifest);
const manifest = await loadViteManifest(manifestPath);
if (!manifest) {
  throw new Error(`[jsx-string-doc] Vite manifest not found at ${manifestPath}. Run \`vite build\` first.`);
}

const PAGE_EXTENSIONS = [".tsx", ".mdx", ".md"] as const;

async function compileMdx(file: string): Promise<{ code: string; meta: Record<string, unknown> }> {
  const raw = await readFile(file, "utf-8");
  const { data: frontmatter, content } = await import("gray-matter").then((m) => m.default(raw));
  const compiled = String(await compile(content, {
    jsxImportSource: "@cjean-fr/jsx-string",
    // MDX provider import so <CodeBlock>, etc. are available in MDX without explicit imports
    // Use absolute path so it resolves regardless of where compiled temp file is
    providerImportSource: pathToFileURL(path.resolve("docs-src/mdx-components.jsx")).href,
  }));
  return { code: compiled, meta: frontmatter as Record<string, unknown> };
}

async function loadCompiledMdx(
  file: string,
  pagesDir: string,
  config: ResolvedDocsConfig,
): Promise<Page> {
  const rel = path.relative(pagesDir, file).replace(/\\/g, "/");
  const route = rel.replace(/\.mdx$/, "");
  const { code, meta: rawMeta } = await compileMdx(file);

  const tmpFile = path.join(pagesDir, ".compiled", rel.replace(/\.mdx$/, ".tsx"));
  const tmpDir = path.dirname(tmpFile);
  if (!existsSync(tmpDir)) {
    await mkdir(tmpDir, { recursive: true });
  }
  await writeFile(tmpFile, code, "utf-8");

  const mod = await import(pathToFileURL(tmpFile).href);
  const Component = mod["default"];
  if (typeof Component !== "function") {
    throw new Error(`[jsx-string-doc] Compiled MDX ${rel} has no default export.`);
  }
  const meta = normalizeMeta(rawMeta, rel);
  const url = meta.slug ?? routeToUrl(route);
  return { url, file, outPath: path.join(config.out, urlToOutPath(url)), format: "mdx", meta, Component };
}

async function loadTsxPage(
  file: string,
  pagesDir: string,
  config: ResolvedDocsConfig,
): Promise<Page> {
  const rel = path.relative(pagesDir, file).replace(/\\/g, "/");
  const route = rel.replace(/\.tsx$/, "");
  const mod = await import(pathToFileURL(file).href);
  const Component = mod["default"];
  if (typeof Component !== "function") {
    throw new Error(`[jsx-string-doc] ${rel} has no default export, or it is not a function.`);
  }
  const meta = normalizeMeta(mod["meta"], rel);
  const url = meta.slug ?? routeToUrl(route);
  return { url, file, outPath: path.join(config.out, urlToOutPath(url)), format: "tsx", meta, Component };
}

async function loadMdPage(
  file: string,
  pagesDir: string,
  config: ResolvedDocsConfig,
): Promise<Page> {
  const rel = path.relative(pagesDir, file).replace(/\\/g, "/");
  const route = rel.replace(/\.md$/, "");
  const { html, meta: rawMeta } = await processMarkdown(file);
  const meta = normalizeMeta(rawMeta, rel);
  const url = meta.slug ?? routeToUrl(route);
  const rendered = (await import("@cjean-fr/jsx-string")).raw(html);
  return { url, file, outPath: path.join(config.out, urlToOutPath(url)), format: "md", meta, Component: () => rendered };
}

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  if (!existsSync(dir)) return out;
  const entries = await import("node:fs/promises").then((m) => m.readdir(dir, { withFileTypes: true }));
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === ".compiled") continue;
      out.push(...(await walk(fullPath)));
    } else if (entry.isFile() && PAGE_EXTENSIONS.some((ext) => entry.name.endsWith(ext))) {
      out.push(fullPath);
    }
  }
  return out;
}

async function loadAllPages(config: ResolvedDocsConfig): Promise<Page[]> {
  const pagesDir = path.resolve(config.pages);
  const found = await walk(pagesDir);
  const pages: Page[] = [];
  for (const file of found) {
    if (file.endsWith(".mdx")) {
      pages.push(await loadCompiledMdx(file, pagesDir, config));
    } else if (file.endsWith(".tsx")) {
      pages.push(await loadTsxPage(file, pagesDir, config));
    } else if (file.endsWith(".md")) {
      pages.push(await loadMdPage(file, pagesDir, config));
    }
  }
  pages.sort((a, b) => a.url.localeCompare(b.url));
  return pages;
}

const allPages = await loadAllPages(config);
const pageData: { url: string; title: string; html: string }[] = [];

await renderToStatic(async (ctx) => {
  setVite(manifest, { base: config.base });

  for (const page of allPages) {
    const meta = page.meta;
    const sidebar = resolveSidebar(
      allPages as typeof allPages & { meta: typeof meta }[],
      config.sidebar,
      page.url,
    );

    setDocs({ config, currentPage: page.url, meta, sidebar, lastUpdated: null, editUrl: null });

    const rawInner = page.Component({});
    const inner = page.format === "tsx" ? rawInner : <div class="docs-prose">{rawInner}</div>;
    const rendered = await ctx.renderPage(() => Layout({ children: inner }));
    const html = injectToc(rendered, renderTocHtml);
    const fullHtml = "<!DOCTYPE html>\n" + html;

    await mkdir(path.dirname(page.outPath), { recursive: true });
    await writeFile(page.outPath, fullHtml, "utf-8");
    pageData.push({ url: page.url, title: meta.title ?? page.url, html });
  }
});

console.log(`Built ${allPages.length} pages.`);

// Generate minimatch search index
await buildMinimatchIndex(pageData, path.join(config.out, "search-index.json"));

// Clean up compiled MDX temp files
const compiledDir = path.resolve(config.pages, ".compiled");
if (existsSync(compiledDir)) {
  await import("node:fs/promises").then((m) => m.rm(compiledDir, { recursive: true, force: true }));
}

function normalizeMeta(raw: unknown, file: string): PageMeta {
  if (raw == null) throw new Error(`[jsx-string-doc] ${file} is missing meta/frontmatter.`);
  if (typeof raw !== "object") throw new Error(`[jsx-string-doc] ${file}: meta must be an object.`);
  const meta = raw as PageMeta;
  if (typeof meta.title !== "string" || meta.title.length === 0) {
    throw new Error(`[jsx-string-doc] ${file}: title is required.`);
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
