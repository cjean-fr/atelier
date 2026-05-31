/**
 * Mobile nav toggle behaviour.
 *
 * - `[data-docs-nav-toggle]` clicks open/close the sidebar by toggling
 *   `data-open` on the `.docs-nav` element.
 * - Clicking a link inside the open nav closes it (so navigation feels
 *   instant on mobile).
 * - `Escape` closes the open nav.
 * - The toggle's icons swap via the `hidden` attribute mirroring open state.
 */

const NAV_SELECTOR = ".docs-nav";
const TOGGLE_SELECTOR = "[data-docs-nav-toggle]";

function isOpen(nav: Element): boolean {
  return nav.hasAttribute("data-open");
}

function setOpen(open: boolean): void {
  const nav = document.querySelector(NAV_SELECTOR);
  const toggle = document.querySelector(TOGGLE_SELECTOR);
  if (!nav) return;
  if (open) nav.setAttribute("data-open", "");
  else nav.removeAttribute("data-open");
  toggle?.setAttribute("aria-expanded", String(open));
  // Swap toggle icons.
  toggle
    ?.querySelector(".docs-nav-toggle-open")
    ?.toggleAttribute("hidden", open);
  toggle
    ?.querySelector(".docs-nav-toggle-close")
    ?.toggleAttribute("hidden", !open);
  // Lock body scroll when nav is full-screen on mobile.
  document.body.style.overflow = open ? "hidden" : "";
}

document.addEventListener("click", (e) => {
  const target = e.target as Element | null;
  if (!target) return;

  // Toggle button.
  if (target.closest(TOGGLE_SELECTOR)) {
    const nav = document.querySelector(NAV_SELECTOR);
    setOpen(nav ? !isOpen(nav) : false);
    return;
  }

  // Link inside open nav.
  const navOpen = document.querySelector(`${NAV_SELECTOR}[data-open]`);
  if (navOpen && target.closest("a")) {
    setOpen(false);
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const navOpen = document.querySelector(`${NAV_SELECTOR}[data-open]`);
    if (navOpen) setOpen(false);
  }
});

export {};
