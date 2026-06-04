import grayMatter from "gray-matter";
import { readFile } from "node:fs/promises";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified, type Plugin, type Preset } from "unified";

export type PluggableEntry = Plugin | Preset | [Plugin | Preset, ...unknown[]];

export interface MarkdownOptions {
  remarkPlugins?: ReadonlyArray<PluggableEntry>;
  rehypePlugins?: ReadonlyArray<PluggableEntry>;
}

export interface MarkdownResult {
  html: string;
  meta: Record<string, unknown>;
}

export async function processMarkdown(
  file: string,
  options: MarkdownOptions = {},
): Promise<MarkdownResult> {
  const raw = await readFile(file, "utf-8");
  const { data: meta, content } = grayMatter(raw);

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
