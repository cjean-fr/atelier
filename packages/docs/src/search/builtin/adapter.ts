/**
 * Builtin search adapter — substring + title-priority ranking, JSON index,
 * tiny client. The default for `defineDocs({ search })`.
 */

import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import type { SearchAdapter, SearchBuildInput, SearchServeInput } from "../../types.js";
import { indexEntry } from "./extract.js";

export interface BuiltinSearchOptions {
  /** URL path served at dev time and built as a file. Default: `/search-index.json`. */
  url?: string;
}

const DEFAULT_URL = "/search-index.json";

/** Factory returning the builtin SearchAdapter. */
export function builtin(options: BuiltinSearchOptions = {}): SearchAdapter {
  const url = options.url ?? DEFAULT_URL;

  return {
    name: "builtin",

    clientEntry: "@cjean-fr/docs/search/builtin/client",

    async build({ pages, outDir }: SearchBuildInput): Promise<void> {
      const index = pages.map(({ url: pageUrl, html }) => indexEntry(pageUrl, html));
      const outPath = path.join(outDir, urlToFilePath(url));
      await mkdir(path.dirname(outPath), { recursive: true });
      await writeFile(outPath, JSON.stringify(index), "utf-8");
    },

    async serve({ url: requestUrl, pages }: SearchServeInput): Promise<Response | null> {
      if (requestUrl.pathname !== url) return null;
      const list = await pages();
      const index = list.map(({ url: pageUrl, html }) => indexEntry(pageUrl, html));
      return new Response(JSON.stringify(index), {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store",
        },
      });
    },
  };
}

function urlToFilePath(url: string): string {
  // "/search-index.json" → "search-index.json"
  return url.replace(/^\//, "");
}
