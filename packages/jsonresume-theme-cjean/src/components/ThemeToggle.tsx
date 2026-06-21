import { raw } from "@cjean-fr/jsx-string";

const SUN_ICON = raw(
  `<svg class="resume-theme-toggle-icon resume-theme-toggle-sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
);

const MOON_ICON = raw(
  `<svg class="resume-theme-toggle-icon resume-theme-toggle-moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
);

export default function ThemeToggle() {
  return (
    <button
      type="button"
      data-resume-theme-toggle
      class="resume-theme-toggle inline-grid h-9 w-9 place-items-center rounded-lg bg-white/60 text-gray-700 shadow-sm backdrop-blur-sm transition-colors hover:bg-white/90 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none dark:bg-gray-800/60 dark:text-gray-300 dark:hover:bg-gray-800/90 dark:hover:text-white"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {SUN_ICON}
      {MOON_ICON}
    </button>
  );
}

export const themeInitScript = raw(
  `<script>(function(){try{var t=localStorage.getItem("resume-theme");var d=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);if(d)document.documentElement.classList.add("dark")}catch(e){}})();</script>`,
);

export const initThemeToggle = () => {
  document.addEventListener("click", (e) => {
    const target = e.target;
    const btn =
      target instanceof Element
        ? target.closest("[data-resume-theme-toggle]")
        : null;
    if (!btn) return;

    const html = document.documentElement;
    const nextDark = !html.classList.contains("dark");
    html.classList.toggle("dark", nextDark);
    try {
      localStorage.setItem("resume-theme", nextDark ? "dark" : "light");
    } catch {
      // localStorage may be unavailable.
    }
  });
};
