import { renderPage } from "../renderHook.js";
import type { ResolvedDocsConfig } from "../types.js";
import { runInit } from "./init.js";
import { run as coreRun } from "@cjean-fr/build-core/cli";

const USAGE = `@cjean-fr/docs

Usage:
  docs init [--with-tailwind] [--force]
                          Scaffold a starter project in the current directory.
  docs dev [--port N]     Start the dev server with HMR.
  docs build              Build the documentation site (vite build + render).
  docs --help             Show this message.
`;

export function run(argv: string[]): Promise<void> {
  return coreRun<ResolvedDocsConfig>(argv, {
    renderPage,
    usage: USAGE,
    extraCommands: {
      init: async (rest) => {
        await runInit(process.cwd(), {
          withTailwind: rest.includes("--with-tailwind"),
          force: rest.includes("--force"),
        });
      },
    },
  });
}
