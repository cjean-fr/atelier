import { existsSync } from "node:fs";
import path from "node:path";
import type { ResolvedDocsConfig } from "../types.js";

const CANDIDATES = ["docs.config.ts", "docs.config.js", "docs.config.mjs"];

/**
 * Find and load the user's docs.config.{ts,js,mjs} from `cwd`. TS files are
 * transpiled via Vite's loader (`loadConfigFromFile`) — Vite is already a
 * peer dep, so no extra runtime is required.
 */
export async function loadDocsConfig(
  cwd: string,
): Promise<{ config: ResolvedDocsConfig; configPath: string }> {
  const found = CANDIDATES.map((f) => path.join(cwd, f)).find(existsSync);
  if (!found) {
    throw new Error(
      `[@cjean-fr/docs] No docs.config.{ts,js,mjs} found in ${cwd}.`,
    );
  }

  const { loadConfigFromFile } = await import("vite");
  const loaded = await loadConfigFromFile(
    { command: "build", mode: "production" },
    found,
    cwd,
    "silent",
  );
  if (!loaded) {
    throw new Error(`[@cjean-fr/docs] Failed to load ${found}.`);
  }

  return {
    config: loaded.config as unknown as ResolvedDocsConfig,
    configPath: loaded.path,
  };
}
