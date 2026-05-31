/**
 * Tabbed content. Static markup with all panels rendered; the client script
 * shows one at a time and persists the choice across pages via `syncKey`.
 *
 *   <Tabs syncKey="install" tabs={[
 *     { label: "Bun", content: <CodeExample src="install/bun.sh" /> },
 *     { label: "npm", content: <CodeExample src="install/npm.sh" /> },
 *   ]} />
 *
 * Tabs with the same `syncKey` synchronize (clicking "Bun" in one switches
 * every other Tabs on the page that has a "Bun" panel to it, and the choice
 * is restored on next visit).
 */
import type { JSXNode } from "@cjean-fr/jsx-string";

export interface TabsProps {
  /** Synchronization key — Tabs sharing this key share their active label. */
  syncKey?: string;
  tabs: ReadonlyArray<{ label: string; content: JSXNode }>;
}

export function Tabs({ syncKey, tabs }: TabsProps) {
  if (tabs.length === 0) return null;

  return (
    <div
      class="docs-tabs my-4 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800"
      {...(syncKey
        ? { "data-docs-tabs-sync": syncKey }
        : { "data-docs-tabs": "" })}
    >
      <div
        role="tablist"
        class="docs-tabs-list flex border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50"
      >
        {tabs.map((tab, i) => (
          <button
            type="button"
            role="tab"
            data-docs-tab-target={String(i)}
            data-docs-tab-label={tab.label}
            aria-selected={i === 0 ? "true" : "false"}
            class={tabButtonClass(i === 0)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, i) => (
        <div
          role="tabpanel"
          data-docs-tab-panel={String(i)}
          class="docs-tabs-panel p-4"
          {...(i === 0 ? {} : { hidden: true })}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}

function tabButtonClass(active: boolean): string {
  const base =
    "docs-tabs-tab px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px";
  return active
    ? `${base} docs-tabs-tab-active border-blue-500 text-blue-600 dark:text-blue-400`
    : `${base} border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100`;
}
