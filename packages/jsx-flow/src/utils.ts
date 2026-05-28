/** Injects `content` immediately before the first `</head>` tag, or prepends if absent. */
export function injectIntoHead(html: string, content: string): string {
  return html.includes("</head>")
    ? html.replace("</head>", `${content}</head>`)
    : `${content}${html}`;
}
