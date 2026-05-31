/**
 * Mobile-only hamburger button that opens the sidebar. Hidden on `md:` and up.
 * The actual visibility toggle is handled by the nav/client.ts script — this
 * just emits stable markup.
 */
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
      class="docs-nav-toggle md:hidden fixed top-4 right-4 z-50 inline-flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 shadow-md"
    >
      <span class="docs-nav-toggle-open">{HAMBURGER}</span>
      <span class="docs-nav-toggle-close" hidden>
        {CLOSE}
      </span>
    </button>
  );
}
