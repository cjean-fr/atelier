/** @jsxImportSource @cjean-fr/jsx-string */
import { useDocs } from "../context.js";
import { SearchDialog } from "./SearchDialog.js";
import { ThemeToggle } from "./ThemeToggle.js";

export function Nav() {
  const { config, sidebar } = useDocs();

  return (
    <nav
      id="docs-nav"
      class="docs-nav fixed inset-0 z-40 hidden w-full max-w-xs overflow-y-auto border-r border-gray-200 bg-white px-6 py-8 data-[open]:block md:sticky md:top-0 md:h-screen md:overflow-y-auto md:block md:w-56 md:max-w-none md:shrink-0 md:px-0 md:pr-6 dark:border-gray-800 dark:bg-gray-950"
      aria-label="Primary navigation"
      tabindex="-1"
    >
      <div class="docs-nav-header mb-4 flex items-start justify-between gap-2">
        <a href="/" class="docs-nav-brand block">
          <span class="docs-nav-brand-title text-lg font-bold text-gray-900 dark:text-white">
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
            <p class="docs-nav-group-label mt-5 mb-1 px-3 text-xs font-semibold tracking-wider text-gray-400 uppercase dark:text-gray-500">
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
