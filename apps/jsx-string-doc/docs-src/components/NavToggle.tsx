import { raw } from "@cjean-fr/jsx-string";

const HAMBURGER = raw(
  `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="18" y2="18"></line></svg>`,
);

const CLOSE = raw(
  `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
);

export function NavToggle() {
  return (
    <button
      type="button"
      data-docs-nav-toggle
      aria-label="Open navigation"
      aria-expanded="false"
      aria-controls="docs-nav"
      class="docs-nav-toggle fixed top-3 right-3 z-50 inline-flex h-11 w-11 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 shadow-md transition-colors hover:bg-gray-50 active:bg-gray-100 md:hidden dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:active:bg-gray-700"
    >
      <span class="docs-nav-toggle-open">{HAMBURGER}</span>
      <span class="docs-nav-toggle-close" hidden>
        {CLOSE}
      </span>
    </button>
  );
}
