import { buildSite, type BuildConfig, type RenderPageHook } from "../build.js";
import { loadDocsConfig } from "./loadConfig.js";
import path from "node:path";

/**
 * Orchestrate a full production build: `vite build` for client assets,
 * then the docs render pipeline driven by the distro's `renderPage` hook.
 *
 * A short-lived Vite dev server in middleware mode provides `ssrLoadModule`
 * for page discovery — lets the CLI run under plain `node` (npx) without
 * requiring a TS runtime.
 */
export async function runBuild<C extends BuildConfig>(
  cwd: string,
  hooks: { renderPage: RenderPageHook<C> },
): Promise<void> {
  const { config, configPath } = await loadDocsConfig(cwd);
  console.log(
    `[@cjean-fr/build-core] using config ${path.relative(cwd, configPath)}`,
  );

  const vite = await import("vite");
  await vite.build({ root: cwd });

  const server = await vite.createServer({
    root: cwd,
    server: { middlewareMode: true },
    appType: "custom",
    logLevel: "silent",
  });
  try {
    const result = await buildSite(config as C, {
      renderPage: hooks.renderPage,
      loadPage: (file) => server.ssrLoadModule(file),
    });
    console.log(`Built ${result.pages.length} pages.`);
    if (result.searchBuilt) console.log("  ✓ search index");
    if (result.sitemapBuilt) console.log("  ✓ sitemap.xml");
    if (result.rssBuilt) console.log("  ✓ feed.xml");
  } finally {
    await server.close();
  }
}
