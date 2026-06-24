import type { FlowContext } from "./context.js";

const FRAGMENT_ID = /^[a-zA-Z][a-zA-Z0-9_-]*$/;

export function assertFragmentId(id: string, label: string): void {
  if (!FRAGMENT_ID.test(id)) {
    throw new Error(
      `${label}: "${id}" is not a valid fragment id. Use letters, digits, hyphens and underscores only, starting with a letter.`,
    );
  }
}

/** Injects `content` immediately before the first `</head>` tag, or prepends if absent. */
export function injectIntoHead(html: string, content: string): string {
  return html.includes("</head>")
    ? html.replace("</head>", `${content}</head>`)
    : `${content}${html}`;
}

/**
 * Compose shell transforms left-to-right into a single `transformShell`. Each
 * transform receives the output of the previous one; falsy entries are skipped,
 * so an adapter's own (possibly `undefined`) transform can be spliced in:
 *
 * Each transform receives the active `FlowContext` as its second argument, so a
 * fragment-aware transform (e.g. NativeAdapter's polyfill injection) still sees
 * the flow state; transforms that don't need it simply ignore it.
 *
 * @example
 * createAdapter({
 *   ...NativeAdapter,
 *   transformShell: composeShell(NativeAdapter.transformShell, metadata(), assets()),
 * });
 */
export function composeShell(
  ...transforms: Array<
    ((shell: string, ctx: FlowContext) => string) | undefined | null | false
  >
): (shell: string, ctx: FlowContext) => string {
  const fns = transforms.filter(Boolean) as Array<
    (shell: string, ctx: FlowContext) => string
  >;
  return (shell, ctx) => fns.reduce((html, t) => t(html, ctx), shell);
}
