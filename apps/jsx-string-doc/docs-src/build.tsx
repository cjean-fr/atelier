import config from "../docs.config.js";
import { setDocs } from "./context.js";
import { resolveSidebar } from "./lib/sidebar.js";
import { injectToc, renderTocHtml } from "./lib/toc.js";
import { buildMinimatchIndex } from "./search/minimatch-build.js";
import type { Page, ResolvedDocsConfig } from "./types.js";
import { renderToStatic } from "@cjean-fr/jsx-flow";
import { loadViteManifest, setVite } from "@cjean-fr/jsx-vite";
import { existsSync } from "node:fs";
import { writeFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";

const manifestPath = path.resolve(config.viteManifest);
const manifest = await loadViteManifest(manifestPath);
if (!manifest) {
  throw new Error(
    `[jsx-string-doc] Vite manifest not found at ${manifestPath}. Run \`vite build\` first.`,
  );
}

function extname(file: string): string {
  const dot = file.lastIndexOf(".");
  return dot === -1 ? "" : file.slice(dot);
}

async function walk(dir: string, extensions: string[]): Promise<string[]> {
  const out: string[] = [];
  if (!existsSync(dir)) return out;
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === ".compiled") continue;
      out.push(...(await walk(fullPath, extensions)));
    } else if (
      entry.isFile() &&
      extensions.some((ext) => entry.name.endsWith(ext))
    ) {
      out.push(fullPath);
    }
  }
  return out;
}

async function loadAllPages(config: ResolvedDocsConfig): Promise<Page[]> {
  const pagesDir = path.resolve(config.pages);
  const extensions = Object.keys(config.handlers);
  const found = await walk(pagesDir, extensions);
  const pages: Page[] = [];
  for (const file of found) {
    const ext = extname(file);
    const entry = config.handlers[ext];
    if (!entry) {
      throw new Error(
        `[jsx-string-doc] No handler configured for "${ext}" files (${file}).`,
      );
    }
    pages.push(await entry.handler.load(file, pagesDir, config));
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

    setDocs({
      config,
      currentPage: page.url,
      meta,
      sidebar,
      lastUpdated: null,
      editUrl: null,
    });

    const ext = extname(page.file);
    const prose = config.handlers[ext]?.prose ?? false;
    const rawInner = page.Component({});
    const inner = prose ? <div class="docs-prose">{rawInner}</div> : rawInner;
    const rendered = await ctx.renderPage(() => config.layout({ children: inner }));
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
  await import("node:fs/promises").then((m) =>
    m.rm(compiledDir, { recursive: true, force: true }),
  );
}
