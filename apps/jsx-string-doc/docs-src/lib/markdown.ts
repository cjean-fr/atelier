import grayMatter from "gray-matter";
import { readFile } from "node:fs/promises";
import { markdownToHtml } from "satteri";

export interface MarkdownResult {
  html: string;
  meta: Record<string, unknown>;
}

export async function processMarkdown(file: string): Promise<MarkdownResult> {
  const raw = await readFile(file, "utf-8");
  const { data: meta, content } = grayMatter(raw);
  const { html } = await markdownToHtml(content);
  return { html, meta };
}
