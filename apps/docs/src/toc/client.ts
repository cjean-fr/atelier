/**
 * Client-side TOC scroll-spy.
 *
 * Watches every `<h2>` / `<h3>` inside `<main>` with an IntersectionObserver
 * and toggles `is-active` on the corresponding TOC link. The "current
 * section" is the highest intersecting heading.
 *
 * Server-side TOC ids are assigned by `injectToc()` in src/toc.ts. The links
 * here just react to which headings are visible.
 */

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
      // Active = first intersecting heading in document order.
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
      // Trigger when the heading enters the top quarter of the viewport.
      rootMargin: "0% 0% -75% 0%",
      threshold: 0,
    },
  );

  for (const h of headings) observer.observe(h);
}

export {};
