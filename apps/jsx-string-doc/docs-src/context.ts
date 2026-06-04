import type { ResolvedDocsConfig, PageMeta, ResolvedSidebar } from "./types.js";
import {
  context,
  setContext,
  useContext,
  type Context,
} from "@cjean-fr/jsx-string";

export interface DocsRenderContext {
  config: ResolvedDocsConfig;
  currentPage: string;
  meta: PageMeta;
  sidebar: ResolvedSidebar;
  lastUpdated: string | null;
  editUrl: string | null;
}

const DocsContext: Context<DocsRenderContext> = context<DocsRenderContext>(
  "jsx-string-doc:render",
);

export function setDocs(value: DocsRenderContext): void {
  setContext(DocsContext, value);
}

export function useDocs(): DocsRenderContext {
  return useContext(DocsContext);
}
