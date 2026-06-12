import type { NavLink } from "./lib/sidebar.js";
import type { ResolvedDocsConfig, PageMeta, ResolvedSidebar } from "./types.js";
import { context, type Context } from "@cjean-fr/jsx-string";

export interface DocsRenderContext {
  config: ResolvedDocsConfig;
  currentPage: string;
  meta: PageMeta;
  sidebar: ResolvedSidebar;
  lastUpdated: string | null;
  editUrl: string | null;
  prev: NavLink | null;
  next: NavLink | null;
}

/**
 * Per-page render context. Bound by build.tsx via `Docs.with(...)` on each
 * `renderPage` call; read by components with `Docs.get()`.
 */
export const Docs: Context<DocsRenderContext> = context<DocsRenderContext>(
  "jsx-string-doc:render",
);
