/**
 * Tabs behaviour: tab click → switch panel + persist + cross-sync.
 *
 * Each `<Tabs>` container has either `data-docs-tabs` (local) or
 * `data-docs-tabs-sync="<key>"` (synced). When a synced tabs group is
 * activated, the script also activates the panel with the same label on
 * every other group sharing the key, and stores the label in
 * `localStorage["docs-tabs-sync:<key>"]`.
 *
 * On page load, synced groups restore their persisted label.
 */

const STORAGE_PREFIX = "docs-tabs-sync:";

function activate(container: Element, index: number): void {
  const buttons = Array.from(
    container.querySelectorAll<HTMLButtonElement>("[data-docs-tab-target]"),
  );
  const panels = Array.from(
    container.querySelectorAll<HTMLElement>("[data-docs-tab-panel]"),
  );
  buttons.forEach((btn, i) => {
    const active = i === index;
    btn.setAttribute("aria-selected", active ? "true" : "false");
    btn.classList.toggle("docs-tabs-tab-active", active);
    btn.classList.toggle("border-blue-500", active);
    btn.classList.toggle("text-blue-600", active);
    btn.classList.toggle("dark:text-blue-400", active);
    btn.classList.toggle("border-transparent", !active);
    btn.classList.toggle("text-gray-600", !active);
    btn.classList.toggle("dark:text-gray-400", !active);
  });
  panels.forEach((panel, i) => {
    panel.toggleAttribute("hidden", i !== index);
  });
}

function activateByLabel(container: Element, label: string): boolean {
  const buttons = Array.from(
    container.querySelectorAll<HTMLButtonElement>("[data-docs-tab-target]"),
  );
  const idx = buttons.findIndex((b) => b.dataset["docsTabLabel"] === label);
  if (idx === -1) return false;
  activate(container, idx);
  return true;
}

// Click handler.
document.addEventListener("click", (e) => {
  const target = e.target as Element | null;
  const btn = target?.closest<HTMLButtonElement>("[data-docs-tab-target]");
  if (!btn) return;
  const container = btn.closest(".docs-tabs");
  if (!container) return;
  const idx = Number(btn.dataset["docsTabTarget"]);
  if (Number.isNaN(idx)) return;
  activate(container, idx);

  // Sync across other groups with the same key.
  const syncKey = container.getAttribute("data-docs-tabs-sync");
  const label = btn.dataset["docsTabLabel"];
  if (syncKey && label) {
    try {
      localStorage.setItem(STORAGE_PREFIX + syncKey, label);
    } catch {
      // Ignore.
    }
    for (const other of document.querySelectorAll(
      `[data-docs-tabs-sync="${cssEscape(syncKey)}"]`,
    )) {
      if (other === container) continue;
      activateByLabel(other, label);
    }
  }
});

// Restore persisted choices on load.
for (const container of document.querySelectorAll("[data-docs-tabs-sync]")) {
  const syncKey = container.getAttribute("data-docs-tabs-sync");
  if (!syncKey) continue;
  let stored: string | null = null;
  try {
    stored = localStorage.getItem(STORAGE_PREFIX + syncKey);
  } catch {
    // Ignore.
  }
  if (stored) activateByLabel(container, stored);
}

function cssEscape(s: string): string {
  if (typeof CSS !== "undefined" && CSS.escape) return CSS.escape(s);
  return s.replace(/["\\]/g, "\\$&");
}

export {};
