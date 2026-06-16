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
 * @example
 * createAdapter({
 *   ...NativeAdapter,
 *   transformShell: composeShell(NativeAdapter.transformShell, metadata(), assets()),
 * });
 */
export function composeShell(
  ...transforms: Array<((shell: string) => string) | undefined | null | false>
): (shell: string) => string {
  const fns = transforms.filter(Boolean) as Array<(shell: string) => string>;
  return (shell) => fns.reduce((html, t) => t(html), shell);
}
