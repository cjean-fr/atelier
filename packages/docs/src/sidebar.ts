/**
 * Resolve `config.sidebar` against the discovered pages.
 *
 * Three input shapes (DOCS_SPEC §5.1 Q4):
 *
 *   `'auto'`               → groups inferred from `meta.sidebar.group`,
 *                            alphabetical group order, items ordered by
 *                            `meta.sidebar.order` then label.
 *
 *   `['Guide', 'API']`     → explicit group order, items still auto-discovered
 *                            from `meta.sidebar.group`.
 *
 *   `[{ label, items }, …]`→ fully explicit tree. Items are page slugs
 *                            (including `*` glob suffix) or external links.
 *
 * The output is a `ResolvedSidebar` with `current` flagged on the matching
 * page item.
 */

import type {
  Page,
  ResolvedSidebar,
  ResolvedSidebarItem,
  SidebarConfig,
  SidebarGroup,
  SidebarItem,
  SidebarLink,
} from "./types.js";

export function resolveSidebar(
  pages: readonly Page[],
  config: SidebarConfig,
  currentUrl: string,
): ResolvedSidebar {
  const visible = pages.filter((p) => !p.meta.sidebar?.hidden);

  if (config === "auto") {
    return resolveAuto(visible, currentUrl);
  }
  if (isStringArray(config)) {
    return resolveGroupList(visible, config, currentUrl);
  }
  return resolveExplicit(visible, config, currentUrl);
}

// ─────────────────────────────────────────────────────────────────────────────
// Level 1: auto
// ─────────────────────────────────────────────────────────────────────────────

function resolveAuto(pages: readonly Page[], currentUrl: string): ResolvedSidebar {
  const ungrouped: Page[] = [];
  const byGroup = new Map<string, Page[]>();

  for (const page of pages) {
    const group = page.meta.sidebar?.group;
    if (group == null) {
      ungrouped.push(page);
    } else {
      const arr = byGroup.get(group) ?? [];
      arr.push(page);
      byGroup.set(group, arr);
    }
  }

  const groups: ResolvedSidebar["groups"][number][] = [];

  if (ungrouped.length > 0) {
    groups.push({
      label: null,
      items: sortPages(ungrouped).map((p) => pageToItem(p, currentUrl)),
    });
  }

  const groupNames = [...byGroup.keys()].sort((a, b) => a.localeCompare(b));
  for (const name of groupNames) {
    groups.push({
      label: name,
      items: sortPages(byGroup.get(name)!).map((p) => pageToItem(p, currentUrl)),
    });
  }

  return { groups };
}

// ─────────────────────────────────────────────────────────────────────────────
// Level 2: explicit group order, auto items
// ─────────────────────────────────────────────────────────────────────────────

function resolveGroupList(
  pages: readonly Page[],
  groupOrder: readonly string[],
  currentUrl: string,
): ResolvedSidebar {
  const byGroup = new Map<string, Page[]>();
  const ungrouped: Page[] = [];
  const usedGroups = new Set(groupOrder);

  for (const page of pages) {
    const group = page.meta.sidebar?.group;
    if (group == null) {
      ungrouped.push(page);
    } else if (usedGroups.has(group)) {
      const arr = byGroup.get(group) ?? [];
      arr.push(page);
      byGroup.set(group, arr);
    }
  }

  const groups: ResolvedSidebar["groups"][number][] = [];

  if (ungrouped.length > 0) {
    groups.push({
      label: null,
      items: sortPages(ungrouped).map((p) => pageToItem(p, currentUrl)),
    });
  }

  for (const name of groupOrder) {
    const list = byGroup.get(name);
    if (!list || list.length === 0) continue; // empty groups silently omitted
    groups.push({
      label: name,
      items: sortPages(list).map((p) => pageToItem(p, currentUrl)),
    });
  }

  return { groups };
}

// ─────────────────────────────────────────────────────────────────────────────
// Level 3: fully explicit
// ─────────────────────────────────────────────────────────────────────────────

function resolveExplicit(
  pages: readonly Page[],
  config: readonly SidebarGroup[],
  currentUrl: string,
): ResolvedSidebar {
  const byUrl = new Map(pages.map((p) => [p.url, p] as const));
  const groups: ResolvedSidebar["groups"][number][] = [];

  for (const group of config) {
    const items: ResolvedSidebarItem[] = [];
    for (const item of group.items) {
      items.push(...resolveItem(item, pages, byUrl, currentUrl));
    }
    if (items.length > 0) {
      groups.push({ label: group.label, items });
    }
  }

  return { groups };
}

function resolveItem(
  item: SidebarItem,
  pages: readonly Page[],
  byUrl: ReadonlyMap<string, Page>,
  currentUrl: string,
): ResolvedSidebarItem[] {
  if (typeof item === "string") return resolveSlug(item, pages, byUrl, currentUrl);
  if (isLink(item)) {
    return [
      {
        kind: "link",
        label: item.label,
        href: item.href,
        external: item.external ?? /^https?:/.test(item.href),
      },
    ];
  }
  // Nested group — Phase 1 flattens (no recursion in the visual tree).
  // Future enhancement: render nested groups visually.
  const flat: ResolvedSidebarItem[] = [];
  for (const child of item.items) {
    flat.push(...resolveItem(child, pages, byUrl, currentUrl));
  }
  return flat;
}

function resolveSlug(
  slug: string,
  pages: readonly Page[],
  byUrl: ReadonlyMap<string, Page>,
  currentUrl: string,
): ResolvedSidebarItem[] {
  // Wildcard suffix — e.g. `api/*` matches all pages whose URL starts with `/api/`.
  if (slug.endsWith("/*")) {
    const prefix = "/" + slug.slice(0, -1); // `api/*` → `/api/`
    const matches = pages.filter((p) => p.url.startsWith(prefix));
    return sortPages(matches).map((p) => pageToItem(p, currentUrl));
  }

  const url = "/" + slug;
  const page = byUrl.get(url);
  if (!page) {
    throw new Error(
      `[@cjean-fr/docs] sidebar references slug "${slug}" but no page has URL "${url}".`,
    );
  }
  return [pageToItem(page, currentUrl)];
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function sortPages(pages: readonly Page[]): Page[] {
  return [...pages].sort((a, b) => {
    const oa = a.meta.sidebar?.order ?? Number.POSITIVE_INFINITY;
    const ob = b.meta.sidebar?.order ?? Number.POSITIVE_INFINITY;
    if (oa !== ob) return oa - ob;
    return (a.meta.sidebar?.label ?? a.meta.title).localeCompare(
      b.meta.sidebar?.label ?? b.meta.title,
    );
  });
}

function pageToItem(page: Page, currentUrl: string): ResolvedSidebarItem {
  return {
    kind: "page",
    label: page.meta.sidebar?.label ?? page.meta.title,
    href: page.url,
    current: page.url === currentUrl,
  };
}

function isStringArray(v: SidebarConfig): v is readonly string[] {
  return Array.isArray(v) && v.every((x) => typeof x === "string");
}

function isLink(v: SidebarItem): v is SidebarLink {
  return typeof v === "object" && v !== null && "href" in v;
}
