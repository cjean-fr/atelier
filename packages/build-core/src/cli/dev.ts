import type { BuildConfig, RenderPageHook } from "../build.js";
import type { RenderTocHook } from "../toc.js";
import { createSitePlugin } from "../vite.js";
import type { Plugin } from "vite";

/**
 * Start a Vite dev server with the site plugin pre-registered.
 *
 * The user's `vite.config.ts` is honored for other plugins (Tailwind, etc.).
 * The distro provides its renderPage hook so the plugin knows how to wrap
 * pages in its Layout.
 */
export async function runDev<C extends BuildConfig>(
  cwd: string,
  hooks: { renderPage: RenderPageHook<C>; renderToc: RenderTocHook },
  options?: { port?: number },
): Promise<void> {
  const vite = await import("vite");
  const plugin = createSitePlugin<C>({
    renderPage: hooks.renderPage,
    renderToc: hooks.renderToc,
  });
  const server = await vite.createServer({
    root: cwd,
    server: options?.port ? { port: options.port } : undefined,
    plugins: [plugin as Plugin],
    appType: "custom",
  });
  await server.listen();
  server.printUrls();
}
