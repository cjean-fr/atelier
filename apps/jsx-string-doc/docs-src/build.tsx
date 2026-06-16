import config from "../docs.config.js";
import { setDocs } from "./context.js";
import { discoverPages } from "./lib/pages.js";
import { renderDocument } from "./lib/render-document.js";
import { resolveSidebar, resolveNavigation } from "./lib/sidebar.js";
import { injectToc, renderTocHtml } from "./lib/toc.js";
import { buildMinimatchIndex } from "./search/minimatch-build.js";
import { loadViteManifest, setVite } from "@cjean-fr/jsx-vite";
import { existsSync } from "node:fs";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const manifestPath = path.resolve(config.viteManifest);
const manifest = await loadViteManifest(manifestPath);
if (!manifest) {
  throw new Error(
    `[jsx-string-doc] Vite manifest not found at ${manifestPath}. Run \`vite build\` first.`,
  );
}

const allPages = await discoverPages(config);
const pageData: { url: string; title: string; html: string }[] = [];

for (const page of allPages) {
  const meta = page.meta;
  const sidebar = resolveSidebar(
    allPages as typeof allPages & { meta: typeof meta }[],
    config.sidebar,
    page.url,
  );

  const { prev, next } = resolveNavigation(sidebar, page.url);

  const ext = path.extname(page.file);
  const prose = config.handlers[ext]?.prose ?? false;

  // Each page is an isolated document: open a render scope, set per-page
  // context, render, then run post-render transforms (TOC needs rendered ids).
  const html = await renderDocument(
    () => {
      setVite(manifest, { base: config.base });
      setDocs({
        config,
        currentPage: page.url,
        meta,
        sidebar,
        lastUpdated: null,
        editUrl: null,
        prev,
        next,
      });
      const rawInner = page.Component({});
      const inner = prose ? <div class="docs-prose">{rawInner}</div> : rawInner;
      return config.layout({ children: inner });
    },
    { transforms: [(h) => injectToc(h, renderTocHtml)] },
  );

  const fullHtml = "<!DOCTYPE html>\n" + html;

  await mkdir(path.dirname(page.outPath), { recursive: true });
  await writeFile(page.outPath, fullHtml, "utf-8");
  pageData.push({ url: page.url, title: meta.title ?? page.url, html });
}

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
