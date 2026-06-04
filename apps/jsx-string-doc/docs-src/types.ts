export interface PageMeta {
  title: string;
  description?: string;
  slug?: string;
  draft?: boolean;
  sidebar?: {
    label?: string;
    order?: number;
    group?: string;
    hidden?: boolean;
  };
}

export type SidebarConfig = "auto" | readonly string[];

export interface SidebarGroup {
  label: string;
  items: SidebarItem[];
}

export type SidebarItem = string | SidebarLink;

export interface SidebarLink {
  label: string;
  href: string;
  external?: boolean;
}

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
  current: boolean;
}

export interface ResolvedSidebarLink {
  kind: "link";
  label: string;
  href: string;
  external: boolean;
}

export interface DocsConfig {
  title: string;
  tagline?: string;
  description?: string;
  pages?: string;
  examples?: string;
  clientEntry?: string;
  out?: string;
  base?: string;
  viteManifest?: string;
  sidebar?: SidebarConfig;
  editUrl?: string | null;
  site?: string | null;
  sitemap?: boolean;
}

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
}

export type PageFormat = "tsx" | "mdx" | "md";

export interface Page {
  url: string;
  file: string;
  outPath: string;
  format: PageFormat;
  meta: PageMeta;
  Component: (props: object) => unknown;
}
