/**
 * Docs-distro types — opinionated for documentation sites.
 *
 * Generic kernel types (`PageMeta`, `Page`, `SearchAdapter`, …) live in
 * `@cjean-fr/build-core` and are re-exported from the package root.
 */
import type {
  PageMeta as CorePageMeta,
  SearchAdapter,
} from "@cjean-fr/build-core";
import type { JSXNode } from "@cjean-fr/jsx-string";

// ─────────────────────────────────────────────────────────────────────────────
// Docs-augmented PageMeta — adds sidebar + layout fields
// ─────────────────────────────────────────────────────────────────────────────

export interface PageMeta extends CorePageMeta {
  /** Sidebar positioning. */
  sidebar?: {
    /** Override the sidebar label. Defaults to `title`. */
    label?: string;
    /** Sort within a group. Lower numbers come first. */
    order?: number;
    /** Group this page belongs to (matched against config.sidebar level 2). */
    group?: string;
    /** Exclude from the sidebar (page is still built). */
    hidden?: boolean;
  };

  /** Override the default Layout for this page only. */
  layout?: LayoutComponent | false;
}

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar config — docs-specific UX
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Progressive disclosure: pass `'auto'`, a list of group names, or a full
 * tree. See DOCS_SPEC.md §5.1 + Q4.
 */
export type SidebarConfig =
  | "auto"
  | readonly string[]
  | readonly SidebarGroup[];

export interface SidebarGroup {
  label: string;
  items: readonly SidebarItem[];
}

export type SidebarItem = string | SidebarLink | SidebarGroup;

export interface SidebarLink {
  label: string;
  /** Either a page slug (resolved by routing) or an absolute URL. */
  href: string;
  /** When `true`, marks this as an external link (opens in a new tab). */
  external?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// User config
// ─────────────────────────────────────────────────────────────────────────────

export interface DocsConfig {
  /** Site title. Used in `<title>` and the nav header. */
  title: string;

  /** Short tagline shown in the sidebar under the title (e.g. "Documentation"). */
  tagline?: string;

  /** Site-wide description. Used as default `<meta name="description">`. */
  description?: string;

  /** Directory containing `.tsx` page files. Default: `"./pages"`. */
  pages?: string;

  /** Directory containing `<CodeExample>` source files. Default: `"./examples"`. */
  examples?: string;

  /** Path of the project's client entry (the file Vite bundles for the browser). Default: `"src/client.ts"`. */
  clientEntry?: string;

  /** Output directory for the static build. Default: `"./dist"`. */
  out?: string;

  /** Public path prefix for assets. Default: `"/"`. */
  base?: string;

  /** Path to the Vite manifest, relative to project root. Default: auto. */
  viteManifest?: string;

  /** Sidebar configuration — see SidebarConfig. Default: `'auto'`. */
  sidebar?: SidebarConfig;

  /**
   * Edit-on-GitHub link template. `{slug}` is substituted with the page file
   * path relative to the project root. Disables the link if absent.
   */
  editUrl?: string;

  /**
   * Public origin URL of the deployed site (e.g. `"https://docs.example.com"`).
   * Required for sitemap.xml and feed.xml generation; without it, neither
   * file is emitted.
   */
  site?: string;

  /** Generate sitemap.xml at build (requires `site`). Default: `true` when `site` is set. */
  sitemap?: boolean;

  /** Generate feed.xml at build (requires `site`). Default: `false`. */
  rss?: boolean | { title?: string; description?: string; language?: string };

  /** Search adapter — pass `builtin()`, custom adapter, or `false`. */
  search?: SearchAdapter | false;

  /** Override built-in components. */
  components?: {
    Layout?: LayoutComponent;
  };
}

/**
 * The shape returned by `defineConfig()` — same as DocsConfig but with all
 * defaults filled in. Consumed by the builder and the Vite plugin.
 */
export interface ResolvedDocsConfig {
  title: string;
  tagline: string | null;
  description: string;
  pages: string;
  examples: string;
  clientEntry: string;
  out: string;
  base: string;
  viteManifest: string;
  sidebar: SidebarConfig;
  editUrl: string | null;
  site: string | null;
  sitemap: boolean;
  rss: false | { title?: string; description?: string; language?: string };
  search: SearchAdapter | false;
  components: {
    Layout: LayoutComponent;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Layout contract
// ─────────────────────────────────────────────────────────────────────────────

export interface LayoutProps {
  children: JSXNode;
}

export type LayoutComponent = (props: LayoutProps) => JSXNode;

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar resolution (post-build)
// ─────────────────────────────────────────────────────────────────────────────

/** Resolved sidebar after applying config + page discovery. */
export interface ResolvedSidebar {
  groups: ReadonlyArray<{
    label: string | null;
    items: ReadonlyArray<ResolvedSidebarItem>;
  }>;
}

export type ResolvedSidebarItem = ResolvedSidebarPage | ResolvedSidebarLink;

export interface ResolvedSidebarPage {
  kind: "page";
  label: string;
  href: string;
  /** True when this item matches the currently rendered page. */
  current: boolean;
}

export interface ResolvedSidebarLink {
  kind: "link";
  label: string;
  href: string;
  external: boolean;
}
