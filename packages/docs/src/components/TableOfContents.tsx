/**
 * Placeholder for the auto-generated TOC. Renders an empty `<aside>` that
 * `injectToc()` (called post-render) finds and replaces with the actual
 * heading list. Put it in your Layout where the TOC should appear (typical:
 * right column on wide screens).
 *
 * If a page has no h2/h3, the placeholder is silently removed.
 */
import { raw } from "@cjean-fr/jsx-string";

export function TableOfContents() {
  return raw("<aside data-toc-placeholder></aside>");
}
