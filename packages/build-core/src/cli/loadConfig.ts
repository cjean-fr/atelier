import { existsSync } from "node:fs";
import path from "node:path";

const CANDIDATES = ["docs.config.ts", "docs.config.js", "docs.config.mjs"];

/**
 * Find and load the user's `docs.config.{ts,js,mjs}` from `cwd`. TS files
 * are transpiled via Vite's loader (`loadConfigFromFile`) — Vite is a
 * peer dep so no extra runtime is required.
 *
 * Returns the loaded config as `unknown` — caller (distro) types it.
 */
export async function loadDocsConfig(
  cwd: string,
): Promise<{ config: unknown; configPath: string }> {
  const found = CANDIDATES.map((f) => path.join(cwd, f)).find(existsSync);
  if (!found) {
    throw new Error(
      `[@cjean-fr/build-core] No docs.config.{ts,js,mjs} found in ${cwd}.`,
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
    throw new Error(`[@cjean-fr/build-core] Failed to load ${found}.`);
  }

  return { config: loaded.config, configPath: loaded.path };
}
