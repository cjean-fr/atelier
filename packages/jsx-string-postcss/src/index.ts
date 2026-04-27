import { raw, RawString, isRawString } from "@cjean-fr/jsx-string";
import postcss, { type AcceptedPlugin } from "postcss";

const cache = new Map<string, string>();

async function hashHtml(html: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(html);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export interface PostCssOptions {
  /** PostCSS plugins to apply */
  plugins?: AcceptedPlugin[];
  /** Base CSS string to process (e.g. '@import "tailwindcss";') */
  css?: string;
  /** Whether to cache the processed output. Default is true. */
  useCache?: boolean;
}

/**
 * Transforms HTML string by injecting PostCSS-processed CSS
 *
 * @param html - The input HTML string or a RawString object from @cjean-fr/jsx-string
 * @param options - Configuration options
 * @returns The transformed HTML string with injected CSS
 */
export async function withPostCss(
  html: string | RawString,
  { plugins = [], css = "", useCache = true }: PostCssOptions = {},
): Promise<string> {
  const htmlString = isRawString(html) ? html.toString() : String(html);
  const key = useCache ? await hashHtml(htmlString + css) : null;
  if (useCache && key && cache.has(key)) {
    return cache.get(key)!;
  }

  const result = await postcss(plugins).process(css, {
    from: undefined,
    content: [{ raw: htmlString, extension: "html" }],
  } as any);

  const styleTag = raw(`<style>${result.css}</style>`);
  const output = htmlString.includes("</head>")
    ? htmlString.replace("</head>", `${styleTag.value}</head>`)
    : `${styleTag.value}${htmlString}`;

  if (useCache && key) {
    cache.set(key, output);
  }

  return output;
}
