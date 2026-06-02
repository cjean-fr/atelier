import type { BuildConfig, RenderPageHook } from "../build.js";
import type { RenderTocHook } from "../toc.js";
import { runBuild } from "./build.js";
import { runDev } from "./dev.js";

/**
 * Distro-supplied extension point. Each distro provides its `renderPage`
 * hook and may register extra commands (typically `init`) on top of the
 * core `build` and `dev`.
 */
export interface CliHooks<C extends BuildConfig> {
  renderPage: RenderPageHook<C>;
  /** TOC markup renderer (build and dev both need it). */
  renderToc: RenderTocHook;
  /** Extra commands (e.g. `init`). Keys are command names. */
  extraCommands?: Record<string, (argv: string[]) => Promise<void>>;
  /** Override the help banner. */
  usage?: string;
}

const DEFAULT_USAGE = `Usage:
  <bin> dev [--port N]   Start the dev server with HMR.
  <bin> build            Build the documentation site (vite build + render).
  <bin> --help           Show this message.
`;

/**
 * Generic CLI dispatcher. Distros call this from their bin entry, passing
 * their `renderPage` hook and any extra commands.
 *
 * @example
 * // apps/docs/bin/docs.mjs
 * import { run } from "@cjean-fr/build-core/cli";
 * import { renderPage } from "../dist/render-hook.js";
 * import { runInit } from "../dist/cli/init.js";
 * await run(process.argv.slice(2), {
 *   renderPage,
 *   extraCommands: { init: (argv) => runInit(process.cwd(), parseInitFlags(argv)) },
 * });
 */
export async function run<C extends BuildConfig>(
  argv: string[],
  hooks: CliHooks<C>,
): Promise<void> {
  const cmd = argv[0];
  const extras = hooks.extraCommands ?? {};

  switch (cmd) {
    case "build":
      await runBuild(process.cwd(), {
        renderPage: hooks.renderPage,
        renderToc: hooks.renderToc,
      });
      return;
    case "dev": {
      const port = parsePortFlag(argv.slice(1));
      await runDev(
        process.cwd(),
        { renderPage: hooks.renderPage, renderToc: hooks.renderToc },
        port !== undefined ? { port } : undefined,
      );
      return;
    }
    case undefined:
    case "-h":
    case "--help":
      process.stdout.write(hooks.usage ?? DEFAULT_USAGE);
      return;
    default:
      if (extras[cmd]) {
        await extras[cmd]!(argv.slice(1));
        return;
      }
      process.stderr.write(
        `Unknown command: ${cmd}\n\n${hooks.usage ?? DEFAULT_USAGE}`,
      );
      process.exitCode = 1;
  }
}

function parsePortFlag(rest: string[]): number | undefined {
  const i = rest.indexOf("--port");
  if (i === -1) return undefined;
  const raw = rest[i + 1];
  const n = raw ? Number(raw) : NaN;
  if (!Number.isInteger(n) || n <= 0 || n > 65535) {
    throw new Error(`--port expects an integer 1-65535, got "${raw}"`);
  }
  return n;
}
