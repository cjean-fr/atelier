const toc = document.querySelector(".docs-toc");
if (toc instanceof HTMLElement) {
  installScrollSpy(toc);
}

function installScrollSpy(toc: HTMLElement): void {
  const headings = Array.from(
    document.querySelectorAll<HTMLElement>("main h2[id], main h3[id]"),
  );
  if (headings.length === 0) return;

  const visible = new Set<string>();

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const id = entry.target.id;
        if (entry.isIntersecting) {
          visible.add(id);
        } else {
          visible.delete(id);
        }
      }
      let activeId: string | null = null;
      for (const h of headings) {
        if (visible.has(h.id)) {
          activeId = h.id;
          break;
        }
      }
      toc
        .querySelectorAll<HTMLAnchorElement>(".docs-toc-link")
        .forEach((link) => {
          const isActive =
            activeId !== null && link.getAttribute("href") === `#${activeId}`;
          link.classList.toggle("is-active", isActive);
          if (isActive) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
    },
    {
      rootMargin: "0% 0% -75% 0%",
      threshold: 0,
    },
  );

  for (const h of headings) observer.observe(h);

  const activeLink = toc.querySelector<HTMLAnchorElement>(
    ".docs-toc-link.is-active",
  );
  if (activeLink) {
    activeLink.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
}

export {};
