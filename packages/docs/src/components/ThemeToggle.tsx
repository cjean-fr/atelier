/**
 * Dark/light theme toggle button.
 *
 * Two visible states (light, dark). System preference is the default until
 * the user explicitly picks one; subsequent visits respect their choice via
 * `localStorage`. FOUC prevention happens in <Layout> via an inline script
 * that applies the `dark` class to `<html>` BEFORE body paint.
 */
import { raw } from "@cjean-fr/jsx-string";

const SUN_ICON = raw(
  `<svg class="docs-theme-toggle-icon docs-theme-toggle-sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>`,
);

const MOON_ICON = raw(
  `<svg class="docs-theme-toggle-icon docs-theme-toggle-moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>`,
);

export function ThemeToggle() {
  return (
    <button
      type="button"
      data-docs-theme-toggle
      class="docs-theme-toggle inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
      aria-label="Toggle theme"
    >
      {SUN_ICON}
      {MOON_ICON}
    </button>
  );
}

/**
 * Returns the inline `<script>` snippet to drop in the Layout head BEFORE
 * any content paints. Reads localStorage + system preference and applies the
 * `dark` class synchronously. ~250 bytes minified.
 */
export const themeInitScript = raw(
  `<script>(function(){try{var t=localStorage.getItem("docs-theme");var d=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);if(d)document.documentElement.classList.add("dark")}catch(e){}})();</script>`,
);
