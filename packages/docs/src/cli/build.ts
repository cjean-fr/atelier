import { build as docsBuild } from "../build.js";
import { loadDocsConfig } from "./loadConfig.js";
import path from "node:path";

/**
 * Orchestrate a full production build: `vite build` for client assets, then
 * the docs render pipeline. Both steps run in `cwd` so the user's
 * `vite.config.ts` is picked up as usual.
 *
 * A short-lived Vite dev server in middleware mode provides `ssrLoadModule`
 * for the page-discovery step. This lets the CLI run under plain `node`
 * (e.g. `npx`) and still load `.tsx` files without an extra TS runtime.
 */
export async function runBuild(cwd: string): Promise<void> {
  const { config, configPath } = await loadDocsConfig(cwd);
  console.log(
    `[@cjean-fr/docs] using config ${path.relative(cwd, configPath)}`,
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
    const result = await docsBuild(config, {
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
