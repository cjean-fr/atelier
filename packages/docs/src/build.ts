/**
 * Build entry — thin wrapper around `@cjean-fr/build-core`'s `buildSite`.
 * Provides the docs `renderPage` hook (Layout + DocsContext + sidebar).
 */
import { renderPage } from "./renderHook.js";
import { renderToc } from "./toc.js";
import type { ResolvedDocsConfig } from "./types.js";
import {
  buildSite,
  type BuildOptions as CoreBuildOptions,
  type BuildResult,
} from "@cjean-fr/build-core";

export type { BuildResult };

export interface BuildOptions extends Omit<
  CoreBuildOptions<ResolvedDocsConfig>,
  "renderPage" | "renderToc"
> {}

export function build(
  config: ResolvedDocsConfig,
  options: BuildOptions = {},
): Promise<BuildResult> {
  return buildSite(config, { ...options, renderPage, renderToc });
}
