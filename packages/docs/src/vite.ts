/**
 * Vite plugin entry — thin wrapper around `@cjean-fr/build-core`'s
 * `createSitePlugin`. Pre-wires the docs `renderPage` hook so the user's
 * `vite.config.ts` doesn't need to know about it.
 *
 * The CLI (`docs dev`) registers this plugin automatically. Users who
 * bypass the CLI can install it manually in their `vite.config.ts`.
 */
import { renderPage } from "./renderHook.js";
import { renderToc } from "./toc.js";
import type { ResolvedDocsConfig } from "./types.js";
import { createSitePlugin } from "@cjean-fr/build-core/vite";
import type { Plugin } from "vite";

export interface DocsPluginOptions {
  /** Path to the docs config file (relative to project root). Default: `"./docs.config.ts"`. */
  configFile?: string;
}

export function docs(options: DocsPluginOptions = {}): Plugin {
  return createSitePlugin<ResolvedDocsConfig>({
    configFile: options.configFile,
    renderPage,
    renderToc,
  });
}
