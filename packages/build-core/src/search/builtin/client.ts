/**
 * Client-side search: lazy-loads /search-index.json on first open, runs a
 * substring match with title-priority ranking, renders results with a
 * keyboard-navigable list. Progressive enhancement — works on top of the
 * static markup emitted by <SearchDialog />.
 *
 * Pure logic (ranking, snippet extraction, escaping, highlighting) lives in
 * ./searchEngine — DOM-free and unit-tested.
 */
import { rank, highlight, escapeAttr, type SearchEntry } from "./engine.js";

// Self-contained: inject the selection highlight so it works regardless of
// which theme CSS the consumer imports.
{
  const s = document.createElement("style");
  s.textContent =
    ".docs-search-active{border-left-color:#3b82f6;background:#eff6ff}" +
    ".dark .docs-search-active{border-left-color:#60a5fa;background:rgba(23,37,84,.6)}";
  document.head.appendChild(s);
}

const trigger = document.getElementById("search-trigger");
const dialogEl = document.getElementById("search-dialog");
const inputEl = document.getElementById("search-input");
const statusEl = document.getElementById("search-status");
const resultsEl = document.getElementById("search-results");

if (
  trigger instanceof HTMLButtonElement &&
  dialogEl instanceof HTMLDialogElement &&
  inputEl instanceof HTMLInputElement &&
  statusEl instanceof HTMLElement &&
  resultsEl instanceof HTMLUListElement
) {
  install({
    trigger,
    dialog: dialogEl,
    input: inputEl,
    status: statusEl,
    results: resultsEl,
  });
}

interface Refs {
  trigger: HTMLButtonElement;
  dialog: HTMLDialogElement;
  input: HTMLInputElement;
  status: HTMLElement;
  results: HTMLUListElement;
}

function install(refs: Refs): void {
  const { trigger, dialog, input, status, results } = refs;
  let index: SearchEntry[] | null = null;
  let indexPromise: Promise<SearchEntry[]> | null = null;
  let activeIndex = -1;

  const open = () => {
    if (!dialog.open) dialog.showModal();
    void ensureIndex();
    // Focus only if the input is already enabled; otherwise ensureIndex()
    // will focus once the index has loaded and re-enabled it.
    if (!input.disabled) input.focus();
  };

  const close = () => {
    if (dialog.open) dialog.close();
  };

  async function ensureIndex(): Promise<SearchEntry[]> {
    if (index) return index;
    if (!indexPromise) {
      indexPromise = fetch("/search-index.json")
        .then((r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json() as Promise<SearchEntry[]>;
        })
        .then((data) => {
          index = data;
          input.disabled = false;
          input.placeholder = "Search documentation…";
          status.textContent = "Type to search.";
          // If the dialog is already open, focus the input now that it's usable.
          if (dialog.open) input.focus();
          return data;
        })
        .catch((err) => {
          status.textContent = "Could not load search index.";
          throw err;
        });
    }
    return indexPromise;
  }

  function render(query: string) {
    if (!index) return;
    const q = query.trim().toLowerCase();
    if (!q) {
      results.classList.add("hidden");
      status.classList.remove("hidden");
      status.textContent = "Type to search.";
      activeIndex = -1;
      return;
    }
    const ranked = rank(index, q);
    if (ranked.length === 0) {
      results.classList.add("hidden");
      status.classList.remove("hidden");
      status.textContent = "No matches.";
      activeIndex = -1;
      return;
    }
    status.classList.add("hidden");
    results.classList.remove("hidden");
    results.innerHTML = ranked
      .map(
        (r, i) => `
          <li
            role="option"
            aria-selected="${i === 0}"
            data-idx="${i}"
            data-url="${escapeAttr(r.entry.url)}"
            class="border-l-2 border-transparent transition-colors${i === 0 ? " docs-search-active" : ""}"
          >
            <a href="${escapeAttr(r.entry.url)}" class="block px-4 py-2.5">
              <div class="text-sm font-semibold text-gray-900 dark:text-gray-100">${highlight(r.entry.title, q)}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">${highlight(r.snippet, q)}</div>
            </a>
          </li>`,
      )
      .join("");
    activeIndex = 0;
    syncActive();
  }

  function syncActive() {
    const items = results.querySelectorAll<HTMLLIElement>('li[role="option"]');
    items.forEach((li, i) => {
      const selected = i === activeIndex;
      li.setAttribute("aria-selected", selected ? "true" : "false");
      li.classList.toggle("docs-search-active", selected);
      if (selected) li.scrollIntoView({ block: "nearest" });
    });
  }

  function move(delta: number) {
    const items = results.querySelectorAll<HTMLLIElement>('li[role="option"]');
    if (items.length === 0) return;
    activeIndex = (activeIndex + delta + items.length) % items.length;
    syncActive();
  }

  function activate() {
    const items = results.querySelectorAll<HTMLLIElement>('li[role="option"]');
    const current = items[activeIndex];
    if (!current) return;
    current.querySelector("a")?.click();
  }

  // Open via Ctrl/Cmd + K
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      open();
    }
  });

  // Open via the trigger button
  trigger.addEventListener("click", open);

  // Type to search
  input.addEventListener("input", () => {
    if (!index) return;
    render(input.value);
  });

  // Mouse hover syncs the active index so keyboard and mouse stay aligned.
  results.addEventListener("mousemove", (e) => {
    const li = (e.target as HTMLElement).closest<HTMLLIElement>(
      'li[role="option"]',
    );
    if (!li) return;
    const idx = Number(li.dataset["idx"]);
    if (!Number.isNaN(idx) && idx !== activeIndex) {
      activeIndex = idx;
      syncActive();
    }
  });

  // Keyboard navigation inside the input
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      move(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      move(-1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      activate();
    }
  });

  // Click outside dialog content (on the backdrop) closes it.
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) close();
  });

  // Reset state when the dialog closes.
  dialog.addEventListener("close", () => {
    input.value = "";
    results.innerHTML = "";
    results.classList.add("hidden");
    status.classList.remove("hidden");
    status.textContent = index ? "Type to search." : "Loading…";
    activeIndex = -1;
  });
}
