/**
 * Generic Vite dev plugin — intercepts HTTP requests, finds the matching
 * page file (`.tsx` or `.md`), loads it via `ssrLoadModule`, and renders
 * it through the distro-provided `renderPage` hook.
 *
 * Distros (docs, blog) wrap this with their own factory that supplies the
 * hook (setting up Layout, context, sidebar, etc.).
 */
import type { BuildConfig, RenderPageHook } from "./build.js";
import { resolveEditUrl } from "./editUrl.js";
import { processMarkdown } from "./markdown.js";
import { injectToc } from "./toc.js";
import type { Page, PageMeta } from "./types.js";
import { renderToStatic } from "@cjean-fr/jsx-flow";
import { raw } from "@cjean-fr/jsx-string";
import { setVite } from "@cjean-fr/jsx-vite";
import { existsSync } from "node:fs";
import path from "node:path";
import type { Plugin, ViteDevServer } from "vite";

export interface VitePluginOptions<C extends BuildConfig> {
  /** Path to the user's config file, relative to project root. Default: `"./docs.config.ts"`. */
  configFile?: string;
  /** Distro's renderPage implementation — same shape as build's. */
  renderPage: RenderPageHook<C>;
}

export function createSitePlugin<C extends BuildConfig>(
  options: VitePluginOptions<C>,
): Plugin {
  const configFile = options.configFile ?? "./docs.config.ts";
  let server: ViteDevServer | null = null;
  let configPromise: Promise<C> | null = null;

  const loadConfig = (): Promise<C> => {
    if (!server) {
      throw new Error("[@cjean-fr/build-core] Vite server not yet configured.");
    }
    if (!configPromise) {
      const absPath = path.resolve(server.config.root, configFile);
      configPromise = server.ssrLoadModule(absPath).then((mod) => {
        if (!mod["default"]) {
          throw new Error(
            `[@cjean-fr/build-core] ${configFile} must \`export default defineConfig({ ... })\`.`,
          );
        }
        return mod["default"] as C;
      });
    }
    return configPromise;
  };

  return {
    name: "@cjean-fr/build-core",

    async configureServer(devServer) {
      server = devServer;

      devServer.middlewares.use((req, res, next) => {
        const url = (req.url ?? "/").split("?")[0]!;

        Promise.resolve()
          .then(() => loadConfig())
          .then(async (config) => {
            // 1. Delegate search routes if the adapter handles them.
            if (config.search && config.search.serve) {
              const result = await config.search.serve({
                url: new URL(url, "http://localhost"),
                pages: () =>
                  collectRenderedPages(devServer, config, options.renderPage),
              });
              if (result) {
                respondWith(res, result);
                return;
              }
            }

            // 2. Skip non-HTML requests (assets, etc.).
            if (url.includes(".") && !url.endsWith(".html")) {
              next();
              return;
            }
            const compFile = findComponentFile(config, url);
            if (!compFile) {
              next();
              return;
            }

            const html = await renderOne(
              devServer,
              config,
              compFile,
              url,
              options.renderPage,
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

function findComponentFile(config: BuildConfig, url: string): string | null {
  const pagesDir = path.resolve(config.pages);
  let page = url.replace(/^\//, "") || "index";
  if (page.endsWith(".html")) page = page.slice(0, -5);
  if (page.endsWith("/")) page = page + "index";
  const candidates = [
    path.join(pagesDir, page + ".tsx"),
    path.join(pagesDir, page + ".md"),
    path.join(pagesDir, page, "index.tsx"),
    path.join(pagesDir, page, "index.md"),
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

async function renderOne<C extends BuildConfig>(
  devServer: ViteDevServer,
  config: C,
  compFile: string,
  url: string,
  renderPage: RenderPageHook<C>,
): Promise<string> {
  const page = await loadPageInDev(devServer, config, compFile, url);
  const allPages = await listAllPagesInDev(devServer, config);

  const lastUpdated = page.meta.updatedAt ?? null;
  const editUrl = resolveEditUrl(
    config.editUrl ?? null,
    path.relative(devServer.config.root, page.file),
  );

  const inner = await renderToStatic(async (ctx) => {
    setVite(null);
    return renderPage(page, { ctx, allPages, lastUpdated, editUrl, config });
  });
  return injectToc(inner);
}

async function loadPageInDev(
  devServer: ViteDevServer,
  config: BuildConfig,
  file: string,
  url: string,
): Promise<Page> {
  if (file.endsWith(".md")) {
    const { html, meta: rawMeta } = await processMarkdown(
      file,
      config.markdown,
    );
    const rendered = raw(html);
    return {
      url,
      file,
      outPath: "",
      meta: rawMeta as unknown as PageMeta,
      Component: () => rendered,
    };
  }
  const mod = await devServer.ssrLoadModule(file);
  return {
    url,
    file,
    outPath: "",
    meta: mod["meta"] as PageMeta,
    Component: mod["default"] as Page["Component"],
  };
}

async function listAllPagesInDev(
  devServer: ViteDevServer,
  config: BuildConfig,
): Promise<Page[]> {
  const pagesDir = path.resolve(config.pages);
  const files = await walkPages(pagesDir);
  const pages: Page[] = [];
  for (const file of files) {
    const rel = path.relative(pagesDir, file).replace(/\\/g, "/");
    const route = rel.replace(/\.(tsx|md)$/, "");
    const url = routeToUrl(route);
    pages.push(await loadPageInDev(devServer, config, file, url));
  }
  pages.sort((a, b) => a.url.localeCompare(b.url));
  return pages;
}

async function collectRenderedPages<C extends BuildConfig>(
  devServer: ViteDevServer,
  config: C,
  renderPage: RenderPageHook<C>,
): Promise<ReadonlyArray<{ url: string; html: string; meta: PageMeta }>> {
  const pages = await listAllPagesInDev(devServer, config);
  const out: Array<{ url: string; html: string; meta: PageMeta }> = [];
  for (const page of pages) {
    const html = await renderOne(
      devServer,
      config,
      page.file,
      page.url,
      renderPage,
    );
    out.push({
      url: page.url,
      html: "<!DOCTYPE html>\n" + html,
      meta: page.meta,
    });
  }
  return out;
}

function respondWith(
  res: import("node:http").ServerResponse,
  response: Response,
): void {
  res.statusCode = response.status;
  response.headers.forEach((value, key) => res.setHeader(key, value));
  response.text().then((body) => res.end(body));
}

async function walkPages(dir: string): Promise<string[]> {
  const out: string[] = [];
  if (!existsSync(dir)) return out;
  const { readdir } = await import("node:fs/promises");
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walkPages(full)));
    } else if (
      entry.isFile() &&
      (entry.name.endsWith(".tsx") || entry.name.endsWith(".md"))
    ) {
      out.push(full);
    }
  }
  return out;
}

function routeToUrl(route: string): string {
  if (route === "index") return "/";
  if (route.endsWith("/index")) return "/" + route.slice(0, -"/index".length);
  return "/" + route;
}
