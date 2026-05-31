/**
 * Callout box. Four types with sensible defaults:
 *
 *   <Aside type="note">      …</Aside>   ← blue, info icon
 *   <Aside type="tip">       …</Aside>   ← green, sparkle icon
 *   <Aside type="caution">   …</Aside>   ← yellow, warning icon
 *   <Aside type="danger">    …</Aside>   ← red, alert icon
 *
 * Override the title with the `title` prop. Colors come from `docs-aside-*`
 * classes (Tailwind + the vendored stylesheet); restyle by overriding the
 * CSS variables `--docs-aside-{type}-bg` / `--docs-aside-{type}-border`.
 */
import { raw, type JSXNode } from "@cjean-fr/jsx-string";

export type AsideType = "note" | "tip" | "caution" | "danger";

export interface AsideProps {
  type?: AsideType;
  title?: string;
  children: JSXNode;
}

const ICONS: Record<AsideType, ReturnType<typeof raw>> = {
  note: raw(
    `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>`,
  ),
  tip: raw(
    `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.287 1.288L3 12l5.8 1.9a2 2 0 0 1 1.288 1.287L12 21l1.9-5.8a2 2 0 0 1 1.287-1.288L21 12l-5.8-1.9a2 2 0 0 1-1.288-1.287Z"></path></svg>`,
  ),
  caution: raw(
    `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>`,
  ),
  danger: raw(
    `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg>`,
  ),
};

const DEFAULT_TITLES: Record<AsideType, string> = {
  note: "Note",
  tip: "Tip",
  caution: "Caution",
  danger: "Danger",
};

const TYPE_CLASSES: Record<AsideType, string> = {
  note: "docs-aside-note border-blue-300 bg-blue-50 text-blue-900 dark:border-blue-700 dark:bg-blue-950/40 dark:text-blue-100",
  tip: "docs-aside-tip border-green-300 bg-green-50 text-green-900 dark:border-green-700 dark:bg-green-950/40 dark:text-green-100",
  caution:
    "docs-aside-caution border-yellow-300 bg-yellow-50 text-yellow-900 dark:border-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-100",
  danger:
    "docs-aside-danger border-red-300 bg-red-50 text-red-900 dark:border-red-700 dark:bg-red-950/40 dark:text-red-100",
};

export function Aside({ type = "note", title, children }: AsideProps) {
  return (
    <aside
      role="note"
      class={`docs-aside ${TYPE_CLASSES[type]} my-4 flex gap-3 rounded-lg border-l-4 p-4`}
    >
      <span class="docs-aside-icon mt-0.5 shrink-0">{ICONS[type]}</span>
      <div class="docs-aside-body min-w-0 flex-1">
        <p class="docs-aside-title mb-1 font-semibold">
          {title ?? DEFAULT_TITLES[type]}
        </p>
        <div class="docs-aside-content">{children}</div>
      </div>
    </aside>
  );
}
