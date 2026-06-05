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

export interface PageHandler {
  name: string;
  load(file: string, pagesDir: string, config: ResolvedDocsConfig): Promise<Page>;
}

export interface HandlerEntry {
  handler: PageHandler;
  prose?: boolean;
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
  handlers?: Record<string, HandlerEntry>;
  /** Override the default page shell (Layout). Receives children already wrapped by the handler's prose wrapper. */
  layout?: (props: { children: import("@cjean-fr/jsx-string").JSXNode }) => import("@cjean-fr/jsx-string").JSXNode;
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
  handlers: Record<string, HandlerEntry>;
  layout: (props: { children: import("@cjean-fr/jsx-string").JSXNode }) => import("@cjean-fr/jsx-string").JSXNode;
}

export interface Page {
  url: string;
  file: string;
  outPath: string;
  handler: string;
  meta: PageMeta;
  Component: (props: object) => unknown;
}
