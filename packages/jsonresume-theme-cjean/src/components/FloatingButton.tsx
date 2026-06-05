import { getIcon } from "./Icons.js";
import { type HTMLAttributes } from "@cjean-fr/jsx-string";

interface FloatingButtonProps extends HTMLAttributes {
  text: string;
  url: string;
  icon?: Parameters<typeof getIcon>[0];
  id?: string;
}

/**
 * Floating CTA that expands/collapses like a drawer: the icon stays put
 * while the label slides in/out, fading at the same time.
 *
 * The width animation relies on a single-column CSS grid track going from
 * `0fr` (closed) to `1fr` (open): the browser interpolates towards the
 * *intrinsic* width of the label, so the declared duration/easing apply
 * exactly for any text length — no `max-width` magic number, no dead time.
 *
 * Expansion is driven by the `fab-open` / `group-fab-open` custom variants
 * (defined in styles/tailwind.input.css): pointer hover, keyboard focus
 * (`:focus-visible`), or the `fab--extended` class toggled on scroll
 * direction by `initFloatingButton`.
 * While extended, the button's right padding grows (`px-4` → `pr-6`) to
 * balance the label, animated over the same 300ms as the drawer; the hover
 * background keeps its snappier 150ms via per-property durations.
 */
export default ({
  text,
  url,
  icon = "tabler:message-circle",
  id = "cta-fab",
  ...props
}: FloatingButtonProps) => {
  return (
    <>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        id={id}
        aria-label={text}
        className="fab fab--extended fab-open:pr-6 fixed right-8 bottom-8 z-20 inline-flex items-center overflow-hidden rounded-full bg-black/80 px-4 py-4 text-lg text-white shadow-md backdrop-blur-sm transition-[background-color,padding-right] [transition-duration:150ms,300ms] ease-in-out hover:bg-black dark:bg-gray-700 dark:text-white print:hidden"
        {...props}
      >
        <span className="shrink-0">{getIcon(icon)}</span>

        {/* Drawer: a single grid column animated between 0fr and 1fr.
            `overflow-hidden` must clip HERE (container), not on the item:
            a fractional track (e.g. `0.5fr` mid-animation) only claims that
            fraction of the container's free space, so clipping at the item
            would leave a growing empty gap between the text's cut edge and
            the button edge. Clipping at the container keeps the cut flush
            with the edge and the visible width linear with the easing. */}
        <span className="group-fab-open:grid-cols-[1fr] grid grid-cols-[0fr] overflow-hidden transition-[grid-template-columns] duration-300 ease-in-out">
          {/* `min-w-0` lets the track truly collapse to zero (grid items
              default to `min-width: auto`). The icon/label spacing uses
              `indent-2` rather than padding or margin: text-indent is part
              of the content so it collapses with it, whereas padding/margin
              are incompressible and would leak 8px into the closed circle. */}
          <span className="group-fab-open:opacity-100 min-w-0 indent-2 whitespace-nowrap opacity-0 transition-opacity duration-300 ease-in-out">
            {text}
          </span>
        </span>
      </a>

      <script
        dangerouslySetInnerHTML={{
          __html: `(${initFloatingButton.toString()})(${JSON.stringify(id)});`,
        }}
      />
    </>
  );
};

/**
 * Toggles `fab--extended` based on scroll direction: collapsed when
 * scrolling down, re-extended when scrolling up, with a small threshold to
 * ignore jitter. No-op when the user prefers reduced motion: global CSS
 * already neutralises the transitions, so direction-driven toggling would
 * make the label flash on every change of direction — the FAB stays
 * extended instead.
 *
 * Note: this function is inlined into the page via `toString()` (see the
 * <script> above), so keep it self-contained — and keep comments out of its
 * body, they would ship with the HTML.
 */
export const initFloatingButton = (id: string) => {
  const fab = document.getElementById(id);
  if (!fab) return;

  const isReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (isReduced) return;

  let lastScroll = window.scrollY;
  const threshold = 15;

  const handleScroll = () => {
    const current = window.scrollY;
    const diff = current - lastScroll;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        fab.classList.remove("fab--extended");
      } else {
        fab.classList.add("fab--extended");
      }

      lastScroll = Math.max(current, 0);
    }
  };

  window.addEventListener("scroll", handleScroll, {
    passive: true,
  });
};
