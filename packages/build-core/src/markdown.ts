/**
 * Markdown processing via unified (remark + rehype).
 *
 * Used by `discoverPages` to load `.md` files alongside `.tsx` ones. The
 * frontmatter (YAML) becomes the page's `meta`; the body is rendered to
 * HTML through a configurable pipeline.
 *
 * Users plug their own remark/rehype plugins through the docs/blog config:
 *
 *     defineConfig({
 *       markdown: {
 *         remarkPlugins: [remarkGfm, remarkFrontmatter],
 *         rehypePlugins: [rehypeSlug, [rehypeShiki, { theme: "github-dark" }]],
 *       },
 *     });
 */
import grayMatter from "gray-matter";
import { readFile } from "node:fs/promises";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified, type Plugin, type Preset } from "unified";

/**
 * A unified-style plugin entry: a plugin function, or a tuple of
 * `[plugin, options]`. Same shape Astro / Next / Docusaurus accept.
 */
export type PluggableEntry = Plugin | Preset | [Plugin | Preset, ...unknown[]];

export interface MarkdownOptions {
  /** Extra remark plugins inserted before `remark-rehype`. */
  remarkPlugins?: ReadonlyArray<PluggableEntry>;
  /** Extra rehype plugins inserted before `rehype-stringify`. */
  rehypePlugins?: ReadonlyArray<PluggableEntry>;
}

export interface MarkdownResult {
  /** Rendered HTML — wrap with `raw(...)` before injecting in JSX. */
  html: string;
  /** Parsed frontmatter as a record. The caller validates the shape. */
  meta: Record<string, unknown>;
}

/**
 * Read a `.md` file, parse its YAML frontmatter and render its body to HTML.
 */
export async function processMarkdown(
  file: string,
  options: MarkdownOptions = {},
): Promise<MarkdownResult> {
  const raw = await readFile(file, "utf-8");
  const { data: meta, content } = grayMatter(raw);

  // Unified's typing forbids dynamic plugin lists at chain level — cast
  // through any once we leave the strongly-typed chain. Plugins are
  // user-supplied and validated at runtime by unified itself.
  // deno-lint-ignore no-explicit-any
  let processor: any = unified().use(remarkParse);
  for (const entry of options.remarkPlugins ?? []) {
    processor = applyPlugin(processor, entry);
  }
  processor = processor.use(remarkRehype, { allowDangerousHtml: true });
  for (const entry of options.rehypePlugins ?? []) {
    processor = applyPlugin(processor, entry);
  }
  processor = processor.use(rehypeStringify, { allowDangerousHtml: true });

  const result = await processor.process(content);
  return { html: String(result), meta };
}

function applyPlugin(processor: any, entry: PluggableEntry): any {
  if (Array.isArray(entry)) {
    const [plugin, ...opts] = entry;
    return processor.use(plugin, ...opts);
  }
  return processor.use(entry);
}
