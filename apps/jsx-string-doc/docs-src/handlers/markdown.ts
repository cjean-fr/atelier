import path from "node:path";
import { raw } from "@cjean-fr/jsx-string";
import type { PageHandler, Page, ResolvedDocsConfig } from "../types.js";
import { getRelativeRoute, normalizeMeta, routeToUrl, urlToOutPath } from "../lib/page-utils.js";
import { processMarkdown } from "../lib/markdown.js";

export const MarkdownHandler: PageHandler = {
  name: "md",

  async load(file: string, pagesDir: string, config: ResolvedDocsConfig): Promise<Page> {
    const rel = getRelativeRoute(file, pagesDir);
    const ext = path.extname(file);
    const route = rel.slice(0, -ext.length);
    const { html, meta: rawMeta } = await processMarkdown(file);
    const meta = normalizeMeta(rawMeta, rel);
    const url = meta.slug ?? routeToUrl(route);
    const rendered = raw(html);
    return {
      url,
      file,
      outPath: path.join(config.out, urlToOutPath(url)),
      handler: "md",
      meta,
      Component: () => rendered,
    };
  },
};
