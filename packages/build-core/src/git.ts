/**
 * Get the ISO 8601 timestamp of the last git commit touching `file`, or
 * `null` if git is unavailable, the file is untracked, or any error occurs.
 *
 * Cached by absolute path so repeat calls within one build are free. Call
 * `preloadLastModified(files)` before a batch to populate the cache with a
 * single `git log` invocation instead of one process per file.
 */
import { execFile } from "node:child_process";
import { stat } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const cache = new Map<string, string | null>();

export async function getLastModified(file: string): Promise<string | null> {
  const abs = path.resolve(file);
  if (cache.has(abs)) return cache.get(abs)!;

  let result: string | null = null;
  try {
    const { stdout } = await execFileAsync("git", [
      "log",
      "-1",
      "--format=%cI",
      "--",
      abs,
    ]);
    const trimmed = stdout.trim();
    result = trimmed || (await fsMtime(abs));
  } catch {
    result = await fsMtime(abs);
  }
  cache.set(abs, result);
  return result;
}

/**
 * Populate the cache for a batch of files with a single `git log` call.
 *
 * Walks history once with `--name-only` and records, for each file, the
 * timestamp of the first (most recent) commit it appears in. Files absent
 * from history fall back to filesystem mtime, mirroring `getLastModified`'s
 * single-file behavior.
 */
export async function preloadLastModified(files: string[]): Promise<void> {
  if (files.length === 0) return;
  const abs = files.map((f) => path.resolve(f));
  const wanted = new Set(abs.filter((a) => !cache.has(a)));
  if (wanted.size === 0) return;

  try {
    // Sentinel-prefixed timestamp lines, then plain file paths, then blank
    // line between commits. Most recent commit comes first, so the first
    // time a path appears wins.
    const SENTINEL = "__COMMIT__";
    const { stdout } = await execFileAsync(
      "git",
      ["log", `--format=${SENTINEL}%cI`, "--name-only", "--", ...wanted],
      { maxBuffer: 64 * 1024 * 1024 },
    );
    const repoRoot = (
      await execFileAsync("git", ["rev-parse", "--show-toplevel"])
    ).stdout.trim();
    let currentIso: string | null = null;
    for (const line of stdout.split("\n")) {
      if (line.startsWith(SENTINEL)) {
        currentIso = line.slice(SENTINEL.length);
        continue;
      }
      if (!line || !currentIso) continue;
      const resolved = path.resolve(repoRoot, line);
      if (wanted.has(resolved) && !cache.has(resolved)) {
        cache.set(resolved, currentIso);
      }
    }
  } catch {
    // git unavailable — leave cache empty, getLastModified will fsMtime per file
  }

  for (const a of wanted) {
    if (!cache.has(a)) cache.set(a, await fsMtime(a));
  }
}

async function fsMtime(file: string): Promise<string | null> {
  try {
    const s = await stat(file);
    return s.mtime.toISOString();
  } catch {
    return null;
  }
}
