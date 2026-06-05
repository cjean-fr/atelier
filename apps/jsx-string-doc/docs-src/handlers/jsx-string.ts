import { pathToFileURL } from "node:url";
import path from "node:path";
import type { PageHandler, Page, ResolvedDocsConfig } from "../types.js";
import { getRelativeRoute, normalizeMeta, routeToUrl, urlToOutPath } from "../lib/page-utils.js";

export const JsxStringHandler: PageHandler = {
  name: "jsx-string",

  async load(file: string, pagesDir: string, config: ResolvedDocsConfig): Promise<Page> {
    const rel = getRelativeRoute(file, pagesDir);
    const ext = path.extname(file);
    const route = rel.slice(0, -ext.length);
    const mod = await import(pathToFileURL(file).href);
    const Component = mod["default"];
    if (typeof Component !== "function") {
      throw new Error(`[jsx-string-doc] ${rel} has no default export, or it is not a function.`);
    }
    const meta = normalizeMeta(mod["meta"], rel);
    const url = meta.slug ?? routeToUrl(route);
    return {
      url,
      file,
      outPath: path.join(config.out, urlToOutPath(url)),
      handler: "jsx-string",
      meta,
      Component,
    };
  },
};
