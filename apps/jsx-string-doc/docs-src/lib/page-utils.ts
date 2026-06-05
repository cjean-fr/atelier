import path from "node:path";
import type { PageMeta } from "../types.js";

export function routeToUrl(route: string): string {
  if (route === "index") return "/";
  if (route.endsWith("/index")) return "/" + route.slice(0, -"/index".length);
  return "/" + route;
}

export function urlToOutPath(url: string): string {
  if (url === "/") return "index.html";
  return url.replace(/^\//, "") + ".html";
}

export function normalizeMeta(raw: unknown, file: string): PageMeta {
  if (raw == null) throw new Error(`[jsx-string-doc] ${file} is missing meta/frontmatter.`);
  if (typeof raw !== "object") throw new Error(`[jsx-string-doc] ${file}: meta must be an object.`);
  const meta = raw as PageMeta;
  if (typeof meta.title !== "string" || meta.title.length === 0) {
    throw new Error(`[jsx-string-doc] ${file}: title is required.`);
  }
  return meta;
}

export function getRelativeRoute(file: string, pagesDir: string): string {
  return path.relative(pagesDir, file).replace(/\\/g, "/");
}
