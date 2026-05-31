/**
 * @cjean-fr/docs — documentation site builder.
 *
 * @module
 */

// Config helper
export { defineConfig } from "./config.js";

// Build entry
export { build, type BuildResult, type BuildOptions } from "./build.js";

// Components
export { Layout } from "./components/Layout.js";
export { Nav } from "./components/Nav.js";
export { SearchDialog } from "./components/SearchDialog.js";
export { CodeBlock, type CodeBlockProps } from "./components/CodeBlock.js";
export {
  CodeExample,
  type CodeExampleProps,
} from "./components/CodeExample.js";
export { TableOfContents } from "./components/TableOfContents.js";
export { ThemeToggle, themeInitScript } from "./components/ThemeToggle.js";
export { NavToggle } from "./components/NavToggle.js";
export { Aside, type AsideProps, type AsideType } from "./components/Aside.js";
export { Tabs, type TabsProps } from "./components/Tabs.js";
export { PageFooter } from "./components/PageFooter.js";

// Context (for custom components)
export {
  useDocs,
  setDocs,
  DocsContext,
  type DocsRenderContext,
} from "./context.js";

// Sidebar — docs-specific UX
export { resolveSidebar } from "./sidebar.js";

// Re-export commonly-used kernel primitives so consumers don't need a
// separate `@cjean-fr/build-core` import for the typical case.
export {
  discoverPages,
  getLastModified,
  preloadLastModified,
  resolveEditUrl,
  generateSitemap,
  generateRss,
  injectToc,
  slugify,
  type TocEntry,
  type SitemapInput,
  type RssInput,
  type Page,
  type PageMeta,
  type SearchAdapter,
  type SearchBuildInput,
  type SearchServeInput,
} from "@cjean-fr/build-core";

// Docs-specific types
export type {
  SidebarConfig,
  SidebarGroup,
  SidebarItem,
  SidebarLink,
  DocsConfig,
  ResolvedDocsConfig,
  LayoutProps,
  LayoutComponent,
  ResolvedSidebar,
  ResolvedSidebarItem,
  ResolvedSidebarPage,
  ResolvedSidebarLink,
} from "./types.js";
