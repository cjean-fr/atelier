/**
 * Public type surface of @cjean-fr/docs.
 *
 * The user-facing types are intentionally minimal. Implementation details
 * (Page, ResolvedConfig, etc.) live below the `// internal` divider.
 */
import type { JSXNode } from "@cjean-fr/jsx-string";

// ─────────────────────────────────────────────────────────────────────────────
// Page-level metadata (user-facing)
// ─────────────────────────────────────────────────────────────────────────────

export interface PageMeta {
  /** Required. Used as `<title>`, default h1, default sidebar label. */
  title: string;

  /** Used as `<meta name="description">` and SEO. */
  description?: string;

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

  /** Override the URL. Defaults to the file path under `pages/`. */
  slug?: string;

  /** Excluded from production build; still visible in dev. */
  draft?: boolean;

  /** Override the default Layout for this page only. */
  layout?: LayoutComponent | false;

  /** ISO 8601 publication date (e.g. "2026-05-29"). Phase 2 falls back to git mtime. */
  publishedAt?: string;

  /** ISO 8601 update date. Phase 2 falls back to git mtime. */
  updatedAt?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar config (user-facing)
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
// Search adapter (user-facing — same shape as jsx-flow PatchAdapter)
// ─────────────────────────────────────────────────────────────────────────────

export interface SearchAdapter {
  /** Adapter identifier — appears in dev logs and as a cache key. */
  name: string;

  /**
   * Build-time hook. Receives the rendered pages and the output directory
   * where the adapter writes whatever artifacts its client runtime needs.
   */
  build(input: SearchBuildInput): Promise<void>;

  /**
   * Optional dev-server hook. Returns a Response for paths the adapter owns
   * (e.g. `/search-index.json` for builtin), `null` otherwise.
   */
  serve?(input: SearchServeInput): Promise<Response | null>;

  /**
   * Module specifier of the ESM client script that wires `<SearchDialog>` to
   * this adapter at runtime. Resolved by Vite — relative or package import.
   */
  clientEntry: string;

  /** Optional extra `<head>` tags (e.g. preload hints, external runtimes). */
  headTags?(): JSXNode;
}

export interface SearchBuildInput {
  pages: ReadonlyArray<{
    url: string;
    html: string;
    meta: PageMeta;
  }>;
  outDir: string;
}

export interface SearchServeInput {
  url: URL;
  /** Returns the same pages snapshot as build() would receive. */
  pages: () => Promise<SearchBuildInput["pages"]>;
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
   * Example: `"https://github.com/cjean-fr/atelier/edit/main/{slug}"`.
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

  /** Search adapter — pass `builtin()`, `pagefind()`, custom adapter, or `false`. */
  search?: SearchAdapter | false;

  /** Override built-in components. */
  components?: {
    Layout?: LayoutComponent;
  };
}

/**
 * The shape returned by `defineDocs()` — same as DocsConfig but with all
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
// Internal types — exposed for plugin authors and tests
// ─────────────────────────────────────────────────────────────────────────────

/** A discovered page (post-routing). */
export interface Page {
  /** Canonical URL (e.g. `/guide/installation`). */
  url: string;
  /** Page file path on disk (absolute). */
  file: string;
  /** Disk output path (absolute, .html). */
  outPath: string;
  /** Imported meta from the file. */
  meta: PageMeta;
  /** The default export from the file. */
  Component: (props: object) => JSXNode;
}

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
