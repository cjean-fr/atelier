/**
 * @cjean-fr/docs — documentation site builder.
 *
 * @module
 */

// Config helper
export { defineDocs } from "./config.js";

// Build entry
export { build, type BuildResult } from "./build.js";

// Components
export { Layout } from "./components/Layout.js";
export { Nav } from "./components/Nav.js";
export { SearchDialog } from "./components/SearchDialog.js";
export { CodeBlock, type CodeBlockProps } from "./components/CodeBlock.js";
export { CodeExample, type CodeExampleProps } from "./components/CodeExample.js";
export { TableOfContents } from "./components/TableOfContents.js";
export { ThemeToggle, themeInitScript } from "./components/ThemeToggle.js";
export { NavToggle } from "./components/NavToggle.js";
export { Aside, type AsideProps, type AsideType } from "./components/Aside.js";
export { Tabs, type TabsProps } from "./components/Tabs.js";
export { PageFooter } from "./components/PageFooter.js";

// Helpers (exposed for users implementing custom Layouts)
export { getLastModified, preloadLastModified } from "./git.js";
export { resolveEditUrl } from "./editUrl.js";
export {
  generateSitemap,
  generateRss,
  type SitemapInput,
  type RssInput,
} from "./sitemap.js";

// Context (for custom components)
export { useDocs, setDocs, DocsContext, type DocsRenderContext } from "./context.js";

// Routing + sidebar — exposed for the Vite plugin and advanced users
export { discoverPages } from "./routing.js";
export { resolveSidebar } from "./sidebar.js";
export { injectToc, slugify, type TocEntry } from "./toc.js";

// Types
export type {
  PageMeta,
  SidebarConfig,
  SidebarGroup,
  SidebarItem,
  SidebarLink,
  SearchAdapter,
  SearchBuildInput,
  SearchServeInput,
  DocsConfig,
  ResolvedDocsConfig,
  LayoutProps,
  LayoutComponent,
  Page,
  ResolvedSidebar,
  ResolvedSidebarItem,
  ResolvedSidebarPage,
  ResolvedSidebarLink,
} from "./types.js";
