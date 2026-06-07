import type { PageMeta, SidebarConfig, ResolvedSidebar, ResolvedSidebarItem, ResolvedSidebarPage } from "../types.js";
import type { Page } from "../types.js";

export interface NavLink {
  label: string;
  href: string;
}

export function resolveNavigation(
  sidebar: ResolvedSidebar,
  currentUrl: string,
): { prev: NavLink | null; next: NavLink | null } {
  for (const group of sidebar.groups) {
    const pages = group.items.filter(
      (item): item is ResolvedSidebarPage => item.kind === "page",
    );
    const idx = pages.findIndex((p) => p.href === currentUrl);
    if (idx === -1) continue;

    return {
      prev: idx > 0 ? { label: pages[idx - 1].label, href: pages[idx - 1].href } : null,
      next: idx < pages.length - 1 ? { label: pages[idx + 1].label, href: pages[idx + 1].href } : null,
    };
  }

  return { prev: null, next: null };
}

type DocsPage = Page & { meta: PageMeta };

export function resolveSidebar(
  pages: readonly DocsPage[],
  config: SidebarConfig,
  currentUrl: string,
): ResolvedSidebar {
  const visible = pages.filter((p) => !p.meta.sidebar?.hidden);

  if (config === "auto") {
    return resolveAuto(visible, currentUrl);
  }
  return resolveGroupList(visible, config, currentUrl);
}

function resolveAuto(
  pages: readonly DocsPage[],
  currentUrl: string,
): ResolvedSidebar {
  const ungrouped: DocsPage[] = [];
  const byGroup = new Map<string, DocsPage[]>();

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
      items: sortPages(byGroup.get(name)!).map((p) =>
        pageToItem(p, currentUrl),
      ),
    });
  }

  return { groups };
}

function resolveGroupList(
  pages: readonly DocsPage[],
  groupOrder: readonly string[],
  currentUrl: string,
): ResolvedSidebar {
  const byGroup = new Map<string, DocsPage[]>();
  const ungrouped: DocsPage[] = [];
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
    if (!list || list.length === 0) continue;
    groups.push({
      label: name,
      items: sortPages(list).map((p) => pageToItem(p, currentUrl)),
    });
  }

  return { groups };
}

function sortPages(pages: readonly DocsPage[]): DocsPage[] {
  return [...pages].sort((a, b) => {
    const oa = a.meta.sidebar?.order ?? Number.POSITIVE_INFINITY;
    const ob = b.meta.sidebar?.order ?? Number.POSITIVE_INFINITY;
    if (oa !== ob) return oa - ob;
    return (a.meta.sidebar?.label ?? a.meta.title).localeCompare(
      b.meta.sidebar?.label ?? b.meta.title,
    );
  });
}

function pageToItem(page: DocsPage, currentUrl: string): ResolvedSidebarItem {
  return {
    kind: "page",
    label: page.meta.sidebar?.label ?? page.meta.title,
    href: page.url,
    current: page.url === currentUrl,
  };
}
