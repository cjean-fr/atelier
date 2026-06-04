document.addEventListener("click", (e) => {
  const target = e.target as Element | null;
  const btn = target?.closest("[data-docs-theme-toggle]");
  if (!btn) return;

  const html = document.documentElement;
  const nextDark = !html.classList.contains("dark");
  html.classList.toggle("dark", nextDark);
  try {
    localStorage.setItem("docs-theme", nextDark ? "dark" : "light");
  } catch {
    // localStorage may be unavailable.
  }
});

export {};
