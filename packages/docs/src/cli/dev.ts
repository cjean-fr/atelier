import { docs } from "../vite.js";

/**
 * Start a Vite dev server with the docs plugin pre-registered.
 *
 * The user's `vite.config.ts` (if any) is still honored for other plugins
 * (Tailwind, custom transforms, …). Following the distro model, the CLI
 * owns the docs plugin so consumers don't need to import it themselves.
 */
export async function runDev(cwd: string, port?: number): Promise<void> {
  const vite = await import("vite");
  const server = await vite.createServer({
    root: cwd,
    server: port ? { port } : undefined,
    plugins: [docs()],
    appType: "custom",
  });
  await server.listen();
  server.printUrls();
}
