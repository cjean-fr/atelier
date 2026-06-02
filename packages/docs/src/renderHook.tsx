/**
 * Docs-distro `renderPage` hook — wraps a page in the configured Layout,
 * populates the `DocsContext`, computes the sidebar.
 *
 * Used by both the build pipeline and the Vite dev plugin (same shape).
 */
import { setDocs } from "./context.js";
import { resolveSidebar } from "./sidebar.js";
import type { PageMeta, ResolvedDocsConfig } from "./types.js";
import type { RenderPageHook } from "@cjean-fr/build-core";

export const renderPage: RenderPageHook<ResolvedDocsConfig> = (
  page,
  { ctx, allPages, lastUpdated, editUrl, config },
) => {
  const meta = page.meta as PageMeta;
  const sidebar = resolveSidebar(
    allPages as readonly ((typeof allPages)[number] & { meta: PageMeta })[],
    config.sidebar,
    page.url,
  );

  setDocs({
    config,
    currentPage: page.url,
    meta,
    sidebar,
    lastUpdated,
    editUrl,
  });

  const LayoutChoice =
    meta.layout === false ? null : (meta.layout ?? config.components.Layout);
  const rawInner = page.Component({});
  // Markdown-authored pages (.md / .mdx) get wrapped in the prose container;
  // hand-authored .tsx pages style themselves. `format` comes from build-core,
  // which already knows how each page was loaded.
  const inner =
    page.format === "tsx" ? rawInner : <div class="docs-prose">{rawInner}</div>;
  return ctx.renderPage(() =>
    LayoutChoice === null ? inner : LayoutChoice({ children: inner }),
  );
};
