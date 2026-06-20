import { writeFile } from "node:fs/promises";
import path from "node:path";

export async function buildRobots(
  siteUrl: string | null,
  outDir: string,
): Promise<void> {
  const lines: string[] = ["User-agent: *", "Allow: /"];

  if (siteUrl) {
    const base = siteUrl.replace(/\/+$/, "");
    lines.push(`Sitemap: ${base}/sitemap.xml`);
  }

  await writeFile(
    path.join(outDir, "robots.txt"),
    lines.join("\n") + "\n",
    "utf-8",
  );
  console.log(`[robots] Generated robots.txt`);
}
