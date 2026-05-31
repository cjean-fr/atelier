/**
 * Render-scope context shared by all built-in components.
 *
 * The builder calls `setDocs(...)` once per page render. Components like
 * `<Layout>`, `<Nav>`, `<SearchDialog>` read it with `useDocs()`. Users who
 * write their own components can call `useDocs()` too.
 */

import { context, setContext, useContext } from "@cjean-fr/jsx-string";
import type { PageMeta, ResolvedDocsConfig, ResolvedSidebar } from "./types.js";

export interface DocsRenderContext {
  /** The resolved configuration (with all defaults filled in). */
  config: ResolvedDocsConfig;
  /** URL of the page currently being rendered. */
  currentPage: string;
  /** Meta of the page currently being rendered. */
  meta: PageMeta;
  /** Sidebar groups, with the current page already flagged. */
  sidebar: ResolvedSidebar;
  /** ISO 8601 last-modified date for the page (meta.updatedAt or git log). */
  lastUpdated: string | null;
  /** Resolved edit URL for the current page, or null when not configured. */
  editUrl: string | null;
}

const DocsContext = context<DocsRenderContext>("@cjean-fr/docs:render");

/** Configure the docs context for the current render scope. */
export function setDocs(value: DocsRenderContext): void {
  setContext(DocsContext, value);
}

/** Read the docs context — throws if called outside an active render scope. */
export function useDocs(): DocsRenderContext {
  return useContext(DocsContext);
}

/** Exposed for plugin authors who want to read the raw context token. */
export { DocsContext };
