/**
 * Kernel-level types shared by all distros (docs, blog, …).
 *
 * Each distro extends these (via `interface extends PageMeta`) with its own
 * fields — `sidebar` and `layout` for docs, `tags`/`author`/`coverImage` for
 * blog, etc. The kernel never reads distro-specific fields.
 */
import type { JSXNode } from "@cjean-fr/jsx-string";

// ─────────────────────────────────────────────────────────────────────────────
// Page metadata — base shape every page must provide
// ─────────────────────────────────────────────────────────────────────────────

export interface PageMeta {
  /** Required. Used as `<title>`, default h1, default sidebar label. */
  title: string;

  /** Used as `<meta name="description">` and SEO. */
  description?: string;

  /** Override the URL. Defaults to the file path under `pages/`. */
  slug?: string;

  /** Excluded from production build; still visible in dev. */
  draft?: boolean;

  /** ISO 8601 publication date (used by sitemap / RSS). */
  publishedAt?: string;

  /** ISO 8601 last-update date (used by `<lastmod>` and `Last updated:`). */
  updatedAt?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Routing / build orchestration
// ─────────────────────────────────────────────────────────────────────────────

/** Minimal config the kernel needs — distros wrap this with their own fields. */
export interface CoreConfig {
  /** Directory containing page files (relative to project root). */
  pages: string;
  /** Output directory for built HTML files. */
  out: string;
}

/** Source format a page was authored in. */
export type PageFormat = "tsx" | "mdx" | "md";

/** A discovered page (post-routing). */
export interface Page {
  /** Canonical URL (e.g. `/guide/installation`). */
  url: string;
  /** Page file path on disk (absolute). */
  file: string;
  /** Disk output path (absolute, .html). */
  outPath: string;
  /**
   * Source format. `"md"` / `"mdx"` are markdown-authored (distros typically
   * wrap them in a prose container); `"tsx"` is a hand-authored component.
   */
  format: PageFormat;
  /** Imported meta from the file. */
  meta: PageMeta;
  /** The default export from the file. */
  Component: (props: object) => JSXNode;
}

// ─────────────────────────────────────────────────────────────────────────────
// Search adapter contract
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
   * Optional dev-server hook. Returns a Response for paths the adapter owns,
   * `null` otherwise.
   */
  serve?(input: SearchServeInput): Promise<Response | null>;

  /**
   * Module specifier of the ESM client script that wires the search trigger
   * to this adapter at runtime. Resolved by Vite — relative or package import.
   */
  clientEntry: string;

  /** Optional extra `<head>` tags (preload hints, external runtimes). */
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
  /** Returns the same pages snapshot as `build()` would receive. */
  pages: () => Promise<SearchBuildInput["pages"]>;
}
