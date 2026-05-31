/**
 * Sidebar navigation. Renders the resolved sidebar from the docs context,
 * with the current page visually highlighted.
 *
 * The site title is read from config.title. SearchDialog is embedded above
 * the link list as the default location — users who want a different layout
 * can swap the whole Layout component via config.components.Layout.
 */

import { useDocs } from "../context.js";
import { SearchDialog } from "./SearchDialog.js";
import { ThemeToggle } from "./ThemeToggle.js";

export function Nav() {
  const { config, sidebar } = useDocs();

  return (
    <nav class="docs-nav hidden data-[open]:block fixed inset-0 z-40 w-full max-w-xs px-6 py-8 overflow-y-auto bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 md:static md:block md:w-56 md:max-w-none md:shrink-0 md:px-0 md:pr-6 md:overflow-visible">
      <div class="docs-nav-header flex items-start justify-between mb-4 gap-2">
        <a href="/" class="docs-nav-brand block">
          <span class="docs-nav-brand-title font-bold text-lg text-gray-900 dark:text-white">
            {config.title}
          </span>
          {config.tagline && (
            <span class="docs-nav-brand-tagline block text-xs text-gray-500 dark:text-gray-400">
              {config.tagline}
            </span>
          )}
        </a>
        <ThemeToggle />
      </div>

      <div class="docs-nav-search mb-5">
        <SearchDialog />
      </div>

      {sidebar.groups.map((group) => (
        <div class="docs-nav-group">
          {group.label !== null && (
            <p class="docs-nav-group-label mt-5 mb-1 px-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              {group.label}
            </p>
          )}
          <ul class="docs-nav-list space-y-1">
            {group.items.map((item) => (
              <li class="docs-nav-item">
                <a
                  href={item.href}
                  class={navLinkClass(item.kind === "page" && item.current)}
                  {...(item.kind === "link" && item.external
                    ? { target: "_blank", rel: "noopener" }
                    : {})}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function navLinkClass(current: boolean): string {
  const base = "docs-nav-link block px-3 py-1.5 rounded text-sm";
  return current
    ? `${base} docs-nav-link-current bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-medium`
    : `${base} text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800`;
}
