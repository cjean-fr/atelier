import { getIcon } from "./Icons.js";
import { type StandardAttributes } from "@cjean-fr/jsx-string";

interface FloatingButtonProps extends StandardAttributes {
  text: string;
  url: string;
  icon?: Parameters<typeof getIcon>[0];
}

export default ({
  text,
  url,
  icon = "tabler:message-circle",
  ...props
}: FloatingButtonProps) => {
  return (
    <>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        id="cta-fab"
        className="fab--extended group fixed right-8 bottom-8 z-20 inline-flex items-center space-x-2 rounded-full bg-black/80 p-4 text-lg whitespace-nowrap text-white shadow-md backdrop-blur-sm transition-colors hover:bg-black dark:bg-gray-700 dark:text-white print:hidden"
        {...props}
      >
        <span className="shrink-0">{getIcon(icon)}</span>
        <span className="-mr-2 max-w-0 overflow-hidden text-transparent transition-all duration-300 ease-in-out group-hover:mr-0 group-hover:max-w-96 group-hover:text-inherit group-focus:mr-0 group-focus:max-w-96 group-focus:text-inherit group-[.fab--extended]:mr-0 group-[.fab--extended]:max-w-96 group-[.fab--extended]:text-inherit">
          {text}
        </span>
      </a>
      <script
        dangerouslySetInnerHTML={{
          __html: `(${initFloatingButton.toString()})();`,
        }}
      />
    </>
  );
};

export const initFloatingButton = () => {
  const fab = document.getElementById("cta-fab");
  if (!fab) return;

  const isReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (isReduced) return;

  let lastScroll = window.scrollY || document.documentElement.scrollTop;
  const threshold = 15;

  const handleScroll = () => {
    const current = window.scrollY || document.documentElement.scrollTop;
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

  window.addEventListener("scroll", handleScroll, { passive: true });
};
