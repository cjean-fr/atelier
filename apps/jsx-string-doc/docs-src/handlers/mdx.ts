import { compile } from "@mdx-js/mdx";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { pathToFileURL } from "node:url";
import path from "node:path";
import grayMatter from "gray-matter";
import rehypeSlug from "rehype-slug";
import type { PageHandler, Page, ResolvedDocsConfig } from "../types.js";
import { getRelativeRoute, normalizeMeta, routeToUrl, urlToOutPath } from "../lib/page-utils.js";

export const MdxHandler: PageHandler = {
  name: "mdx",

  async load(file: string, pagesDir: string, config: ResolvedDocsConfig): Promise<Page> {
    const rel = getRelativeRoute(file, pagesDir);
    const ext = path.extname(file);
    const route = rel.slice(0, -ext.length);
    const { code, meta: rawMeta } = await compileMdx(file);


    const tmpFile = path.join(pagesDir, ".compiled", rel.replace(/\.mdx$/, ".tsx"));
    const tmpDir = path.dirname(tmpFile);
    if (!existsSync(tmpDir)) {
      await mkdir(tmpDir, { recursive: true });
    }
    await writeFile(tmpFile, code, "utf-8");

    const mod = await import(pathToFileURL(tmpFile).href);
    const Component = mod["default"];
    if (typeof Component !== "function") {
      throw new Error(`[jsx-string-doc] Compiled MDX ${rel} has no default export.`);
    }
    const meta = normalizeMeta(rawMeta, rel);
    const url = meta.slug ?? routeToUrl(route);
    return {
      url,
      file,
      outPath: path.join(config.out, urlToOutPath(url)),
      handler: "mdx",
      meta,
      Component,
    };
  },
};

async function compileMdx(file: string): Promise<{ code: string; meta: Record<string, unknown> }> {
  const raw = await readFile(file, "utf-8");
  const { data: frontmatter, content } = grayMatter(raw);
  const compiled = String(await compile(content, {
    jsxImportSource: "@cjean-fr/jsx-string",
    providerImportSource: pathToFileURL(path.resolve("docs-src/mdx-components.jsx")).href,
    rehypePlugins: [rehypeSlug],
  }));
  return { code: compiled, meta: frontmatter as Record<string, unknown> };
}
