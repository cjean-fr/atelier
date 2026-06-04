/** @jsxImportSource @cjean-fr/jsx-string */
export function SearchDialog() {
  return (
    <search>
      <button
        id="search-trigger"
        type="button"
        class="docs-search-trigger inline-flex w-full items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-500 transition-colors hover:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-gray-600"
        aria-label="Open search"
      >
        <svg
          class="docs-search-icon size-4 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
          />
        </svg>
        <span class="docs-search-trigger-label flex-1 text-left">Search…</span>
        <kbd class="docs-search-kbd hidden items-center gap-1 rounded border border-gray-300 bg-gray-50 px-1.5 py-0.5 font-mono text-xs text-gray-600 sm:inline-flex dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
          <span class="text-base leading-none">⌘</span>K
        </kbd>
      </button>

      <dialog
        id="search-dialog"
        closedby="any"
        class="docs-search-dialog m-0 mx-auto mt-[10vh] w-full max-w-lg rounded-xl bg-white p-0 shadow-2xl backdrop:bg-gray-900/40 backdrop:backdrop-blur-sm open:flex open:flex-col dark:bg-gray-900 dark:backdrop:bg-black/60"
        aria-label="Search documentation"
      >
        <div class="docs-search-input-row flex items-center gap-3 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
          <svg
            class="docs-search-icon size-5 shrink-0 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
            />
          </svg>
          <input
            id="search-input"
            type="search"
            placeholder="Loading index…"
            class="docs-search-input flex-1 bg-transparent text-gray-900 outline-none placeholder:text-gray-400 disabled:opacity-50 dark:text-gray-100"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck={false}
            disabled
            aria-label="Search query"
            aria-controls="search-results"
            aria-describedby="search-status"
          />
          <kbd class="docs-search-kbd hidden items-center rounded border border-gray-300 bg-gray-50 px-1.5 py-0.5 font-mono text-xs text-gray-500 sm:inline-flex dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
            Esc
          </kbd>
        </div>

        <p
          id="search-status"
          class="docs-search-status px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400"
        >
          Loading…
        </p>

        <ul
          id="search-results"
          class="docs-search-results m-0 hidden max-h-[60vh] overflow-y-auto py-2"
          role="listbox"
          aria-label="Search results"
        ></ul>
      </dialog>
    </search>
  );
}
