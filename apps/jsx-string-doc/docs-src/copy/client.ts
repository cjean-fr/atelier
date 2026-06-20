function initCopyButtons(): void {
  document.querySelectorAll<HTMLPreElement>("pre").forEach((pre) => {
    if (pre.closest("[data-no-copy]")) return;
    const btn = document.createElement("button");
    btn.className =
      "docs-copy-btn absolute top-2 right-2 z-10 px-2 py-1 text-xs rounded " +
      "bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 " +
      "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 " +
      "opacity-0 group-hover:opacity-100 transition-opacity duration-200 " +
      "focus:opacity-100 focus:outline-none";
    btn.textContent = "Copy";
    btn.setAttribute("aria-label", "Copy code to clipboard");

    pre.classList.add("group", "relative");
    pre.appendChild(btn);

    btn.addEventListener("click", async () => {
      const code = pre.querySelector("code");
      if (!code) return;
      try {
        await navigator.clipboard.writeText(code.textContent ?? "");
        btn.textContent = "Copied!";
        setTimeout(() => {
          btn.textContent = "Copy";
        }, 2000);
      } catch {
        btn.textContent = "Failed";
        setTimeout(() => {
          btn.textContent = "Copy";
        }, 2000);
      }
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCopyButtons);
} else {
  initCopyButtons();
}
