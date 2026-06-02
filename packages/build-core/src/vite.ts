/**
 * Generic Vite dev plugin — intercepts HTTP requests, finds the matching
 * page file (`.tsx` / `.mdx` / `.md`), loads it via `ssrLoadModule`, and
 * renders it through the distro-provided `renderPage` hook.
 *
 * Page discovery/loading is shared with the production build: this plugin
 * resolves a URL with `findPageFile` and loads it with `loadPageFile`, and
 * lists all pages with `discoverPages` — the same functions the build uses.
 *
 * Distros (docs, blog) wrap this with their own factory that supplies the
 * hook (setting up Layout, context, sidebar, etc.).
 */
import type { BuildConfig, RenderPageHook } from "./build.js";
import { resolveEditUrl } from "./editUrl.js";
import {
  discoverPages,
  findPageFile,
  loadPageFile,
  type DiscoverOptions,
} from "./routing.js";
import { injectToc, type RenderTocHook } from "./toc.js";
import type { PageMeta } from "./types.js";
import { renderToStatic } from "@cjean-fr/jsx-flow";
import { setVite } from "@cjean-fr/jsx-vite";
import path from "node:path";
import type { Plugin, ViteDevServer } from "vite";

export interface VitePluginOptions<C extends BuildConfig> {
  /** Path to the user's config file, relative to project root. Default: `"./docs.config.ts"`. */
  configFile?: string;
  /** Distro's renderPage implementation — same shape as build's. */
  renderPage: RenderPageHook<C>;
  /** Distro's TOC markup renderer — same shape as build's. */
  renderToc: RenderTocHook;
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
                  collectRenderedPages(
                    devServer,
                    config,
                    options.renderPage,
                    options.renderToc,
                  ),
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
            const file = findPageFile(config, url);
            if (!file) {
              next();
              return;
            }

            const html = await renderOne(
              devServer,
              config,
              file,
              options.renderPage,
              options.renderToc,
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

/** Discover options that route page loading through Vite's SSR module graph. */
function devLoadOptions(
  devServer: ViteDevServer,
  config: BuildConfig,
): DiscoverOptions {
  return {
    loadPage: (file) => devServer.ssrLoadModule(file),
    markdown: config.markdown,
  };
}

async function renderOne<C extends BuildConfig>(
  devServer: ViteDevServer,
  config: C,
  file: string,
  renderPage: RenderPageHook<C>,
  renderToc: RenderTocHook,
): Promise<string> {
  const opts = devLoadOptions(devServer, config);
  const page = await loadPageFile(file, config, opts);
  const allPages = await discoverPages(config, opts);

  const lastUpdated = page.meta.updatedAt ?? null;
  const editUrl = resolveEditUrl(
    config.editUrl ?? null,
    path.relative(devServer.config.root, page.file),
  );

  const inner = await renderToStatic(async (ctx) => {
    setVite(null);
    return renderPage(page, { ctx, allPages, lastUpdated, editUrl, config });
  });
  return injectToc(inner, renderToc);
}

async function collectRenderedPages<C extends BuildConfig>(
  devServer: ViteDevServer,
  config: C,
  renderPage: RenderPageHook<C>,
  renderToc: RenderTocHook,
): Promise<ReadonlyArray<{ url: string; html: string; meta: PageMeta }>> {
  const pages = await discoverPages(config, devLoadOptions(devServer, config));
  const out: Array<{ url: string; html: string; meta: PageMeta }> = [];
  for (const page of pages) {
    const html = await renderOne(
      devServer,
      config,
      page.file,
      renderPage,
      renderToc,
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
