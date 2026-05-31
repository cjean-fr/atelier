/**
 * @cjean-fr/build-core — kernel for static-site builders on top of
 * @cjean-fr/jsx-string.
 *
 * Shared by `@cjean-fr/docs` (and future `@cjean-fr/blog`) distros. Provides
 * filesystem routing, git-based last-modified, sitemap/RSS, TOC injection,
 * edit-URL resolution, and the SearchAdapter contract.
 *
 * Distros build their opinionated UI (Layouts, components, themes) on top.
 *
 * @module
 */

// Routing
export { discoverPages, type DiscoverOptions } from "./routing.js";

// Page meta & types
export type {
  PageMeta,
  Page,
  CoreConfig,
  SearchAdapter,
  SearchBuildInput,
  SearchServeInput,
} from "./types.js";

// Git-based last modified
export { getLastModified, preloadLastModified } from "./git.js";

// Edit URL
export { resolveEditUrl } from "./editUrl.js";

// Sitemap + RSS
export {
  generateSitemap,
  generateRss,
  type SitemapInput,
  type RssInput,
} from "./sitemap.js";

// TOC injection
export { injectToc, slugify, type TocEntry } from "./toc.js";

// Markdown processing
export {
  processMarkdown,
  type MarkdownOptions,
  type MarkdownResult,
  type PluggableEntry,
} from "./markdown.js";

// Build orchestrator
export {
  buildSite,
  type BuildConfig,
  type BuildOptions,
  type BuildResult,
  type RenderPageContext,
  type RenderPageHook,
} from "./build.js";
