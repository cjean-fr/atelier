import { pathToFileURL } from "node:url";
import type { PageHandler, Page, ResolvedDocsConfig } from "../types.js";
import { getRelativeRoute, createPage } from "../lib/page-utils.js";

export const JsxStringHandler: PageHandler = {
  name: "jsx-string",

  async load(file: string, pagesDir: string, config: ResolvedDocsConfig): Promise<Page> {
    const rel = getRelativeRoute(file, pagesDir);
    const mod = await import(pathToFileURL(file).href);
    const Component = mod["default"];
    if (typeof Component !== "function") {
      throw new Error(`[jsx-string-doc] ${rel} has no default export, or it is not a function.`);
    }
    return createPage(file, pagesDir, config, "jsx-string", mod["meta"], Component);
  },
};
