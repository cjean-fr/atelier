/**
 * Vite plugin entry — wires the dev server to render pages on demand and
 * delegates `/search/*` to the configured search adapter.
 *
 * Usage:
 *
 *     // vite.config.ts
 *     import { defineConfig } from "vite";
 *     import { docs } from "@cjean-fr/docs/vite";
 *     export default defineConfig({ plugins: [docs()] });
 *
 * Module-instance safety: this plugin imports `setDocs` / `resolveSidebar` /
 * `injectToc` / `setVite` / `renderToStatic` statically. The shared state
 * behind those (jsx-string `AsyncLocalStorage` + named contexts) lives on
 * `globalThis` via `Symbol.for(...)` keys, so even though the plugin is
 * loaded by Node (via vite.config.ts) and the user pages are loaded by Vite
 * SSR — possibly resolving jsx-string twice — every call sees the same
 * storage and the same `DocsContext`. No `noExternal` or `ssrLoadModule`
 * routing trick required.
 */
import { setDocs } from "./context.js";
import { resolveSidebar } from "./sidebar.js";
import { injectToc } from "./toc.js";
import type { Page, PageMeta, ResolvedDocsConfig } from "./types.js";
import { renderToStatic } from "@cjean-fr/jsx-flow";
import type { JSXNode } from "@cjean-fr/jsx-string";
import { setVite } from "@cjean-fr/jsx-vite";
import { existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import type { Plugin, ViteDevServer } from "vite";

export interface DocsPluginOptions {
  /** Path to the docs config file (relative to project root). Default: `"./docs.config.ts"`. */
  configFile?: string;
}

export function docs(options: DocsPluginOptions = {}): Plugin {
  const configFile = options.configFile ?? "./docs.config.ts";
  let server: ViteDevServer | null = null;
  let configPromise: Promise<ResolvedDocsConfig> | null = null;

  const loadConfig = (): Promise<ResolvedDocsConfig> => {
    if (!server)
      throw new Error("[@cjean-fr/docs] Vite server not yet configured.");
    if (!configPromise) {
      const absPath = path.resolve(server.config.root, configFile);
      configPromise = server.ssrLoadModule(absPath).then((mod) => {
        if (!mod["default"]) {
          throw new Error(
            `[@cjean-fr/docs] ${configFile} must \`export default defineDocs({ ... })\`.`,
          );
        }
        return mod["default"] as ResolvedDocsConfig;
      });
    }
    return configPromise;
  };

  return {
    name: "@cjean-fr/docs",

    async configureServer(devServer) {
      server = devServer;

      devServer.middlewares.use((req, res, next) => {
        const url = (req.url ?? "/").split("?")[0]!;

        Promise.resolve()
          .then(() => loadConfig())
          .then(async (config) => {
            // 1. Delegate /search/* to the search adapter, if any.
            if (config.search !== false && config.search.serve) {
              const result = await config.search.serve({
                url: new URL(url, "http://localhost"),
                pages: () => collectPages(devServer, config),
              });
              if (result) {
                respondWith(res, result);
                return;
              }
            }

            // 2. Try to render a page for this URL.
            if (url.includes(".") && !url.endsWith(".html")) {
              next();
              return;
            }
            const compFile = await findComponentFile(config, url);
            if (!compFile) {
              next();
              return;
            }

            const html = await renderPageInDev(
              devServer,
              config,
              compFile,
              url,
            );
            const transformed = await devServer.transformIndexHtml(
              url,
              "<!DOCTYPE html>\n" + html,
            );
            res.setHeader("Content-Type", "text/html; charset=utf-8");
            res.end(transformed);
          })
          .catch((err) => {
            devServer.config.logger.error(String(err));
            next(err);
          });
      });
    },

    handleHotUpdate({ file, server: devServer }) {
      const root = devServer.config.root;
      if (file === path.resolve(root, configFile)) {
        configPromise = null;
        devServer.ws.send({ type: "full-reload" });
        return [];
      }
      if (
        file.startsWith(root) &&
        !file.includes(`${path.sep}dist${path.sep}`)
      ) {
        devServer.ws.send({ type: "full-reload" });
      }
      return [];
    },
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function findComponentFile(
  config: ResolvedDocsConfig,
  url: string,
): Promise<string | null> {
  const pagesDir = path.resolve(config.pages);
  let page = url.replace(/^\//, "") || "index";
  if (page.endsWith(".html")) page = page.slice(0, -5);
  if (page.endsWith("/")) page = page + "index";
  const candidates = [
    path.join(pagesDir, page + ".tsx"),
    path.join(pagesDir, page, "index.tsx"),
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

async function renderPageInDev(
  devServer: ViteDevServer,
  config: ResolvedDocsConfig,
  compFile: string,
  url: string,
): Promise<string> {
  const compMod = await devServer.ssrLoadModule(compFile);
  const Component = compMod["default"] as (props: object) => JSXNode;
  const meta = compMod["meta"] as PageMeta;

  const currentPage = url === "/" ? "/" : url.replace(/\.html$/, "");
  const pages = await collectPagesAsPagesList(devServer, config);
  const sidebar = resolveSidebar(pages, config.sidebar, currentPage);

  const lastUpdated = meta.updatedAt ?? null;
  const editUrl = config.editUrl
    ? config.editUrl.replace(
        /\{slug\}/g,
        path.relative(devServer.config.root, compFile).replace(/\\/g, "/"),
      )
    : null;

  const raw = await renderToStatic(async (ctx) => {
    setVite(null);
    setDocs({ config, currentPage, meta, sidebar, lastUpdated, editUrl });

    const LayoutChoice =
      meta.layout === false ? null : (meta.layout ?? config.components.Layout);
    const inner = Component({});
    return ctx.renderPage(() =>
      LayoutChoice === null ? inner : LayoutChoice({ children: inner }),
    );
  });
  return injectToc(raw);
}

async function collectPages(
  devServer: ViteDevServer,
  config: ResolvedDocsConfig,
): Promise<ReadonlyArray<{ url: string; html: string; meta: PageMeta }>> {
  const pages = await collectPagesAsPagesList(devServer, config);
  const out: Array<{ url: string; html: string; meta: PageMeta }> = [];
  for (const page of pages) {
    const html = await renderPageInDev(devServer, config, page.file, page.url);
    out.push({
      url: page.url,
      html: "<!DOCTYPE html>\n" + html,
      meta: page.meta,
    });
  }
  return out;
}

async function collectPagesAsPagesList(
  devServer: ViteDevServer,
  config: ResolvedDocsConfig,
): Promise<Page[]> {
  const pagesDir = path.resolve(config.pages);
  const files = walkSync(pagesDir);
  const pages: Page[] = [];
  for (const file of files) {
    const rel = path.relative(pagesDir, file).replace(/\\/g, "/");
    const route = rel.replace(/\.tsx$/, "");
    const mod = await devServer.ssrLoadModule(file);
    pages.push({
      url: routeToUrl(route),
      file,
      outPath: "",
      meta: mod["meta"] as PageMeta,
      Component: mod["default"] as Page["Component"],
    });
  }
  pages.sort((a, b) => a.url.localeCompare(b.url));
  return pages;
}

function respondWith(
  res: import("node:http").ServerResponse,
  response: Response,
): void {
  res.statusCode = response.status;
  response.headers.forEach((value, key) => res.setHeader(key, value));
  response.text().then((body) => res.end(body));
}

function walkSync(dir: string): string[] {
  const out: string[] = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walkSync(full));
    else if (st.isFile() && entry.endsWith(".tsx")) out.push(full);
  }
  return out;
}

function routeToUrl(route: string): string {
  if (route === "index") return "/";
  if (route.endsWith("/index")) return "/" + route.slice(0, -"/index".length);
  return "/" + route;
}
