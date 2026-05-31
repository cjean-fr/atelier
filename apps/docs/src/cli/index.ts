import { runBuild } from "./build.js";
import { runDev } from "./dev.js";
import { runInit } from "./init.js";

const USAGE = `@cjean-fr/docs

Usage:
  docs init [--with-tailwind] [--force]
                          Scaffold a starter project in the current directory.
  docs dev [--port N]     Start the dev server with HMR.
  docs build              Build the documentation site (vite build + render).
  docs --help             Show this message.
`;

export async function run(argv: string[]): Promise<void> {
  const cmd = argv[0];
  switch (cmd) {
    case "build":
      await runBuild(process.cwd());
      return;
    case "dev": {
      const port = parsePortFlag(argv.slice(1));
      await runDev(process.cwd(), port);
      return;
    }
    case "init": {
      const rest = argv.slice(1);
      await runInit(process.cwd(), {
        withTailwind: rest.includes("--with-tailwind"),
        force: rest.includes("--force"),
      });
      return;
    }
    case undefined:
    case "-h":
    case "--help":
      process.stdout.write(USAGE);
      return;
    default:
      process.stderr.write(`Unknown command: ${cmd}\n\n${USAGE}`);
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
