/**
 * Substitute `{slug}` in `config.editUrl` with the page's source path
 * relative to the project root.
 */

import path from "node:path";

export function resolveEditUrl(
  template: string | null,
  pageFile: string,
  projectRoot: string = process.cwd(),
): string | null {
  if (!template) return null;
  const rel = path.relative(projectRoot, pageFile).replace(/\\/g, "/");
  return template.replace(/\{slug\}/g, rel);
}
