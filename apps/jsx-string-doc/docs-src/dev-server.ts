import { serve } from "bun";
import { watch } from "node:fs";
import { join, extname, relative, resolve } from "node:path";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import type { ServerWebSocket } from "bun";

const PORT = 3000;
const APP_ROOT = resolve(import.meta.dirname!, "..");
const DIST = join(APP_ROOT, "dist");

const clients = new Set<ServerWebSocket<undefined>>();

function injectLiveReload(html: string): string {
  const script = `<script>
(function(){var ws=new WebSocket("ws://"+location.host+"/__hmr");
ws.onmessage=function(e){if(e.data==="reload")location.reload()};
ws.onclose=function(){setTimeout(function(){location.reload()},1000)}})()
</script>`;
  return html.replace("</body>", script + "\n</body>");
}

async function rebuild(): Promise<boolean> {
  console.log("[dev] Building SSG...");
  return await run("bun", ["run", "build:ssg"]);
}

function run(cmd: string, args: string[]): Promise<boolean> {
  return new Promise((resolve) => {
    const proc = spawn(cmd, args, { cwd: APP_ROOT, stdio: ["ignore", "inherit", "inherit"] });
    proc.on("exit", (code) => resolve(code === 0));
  });
}

function notifyClients(): void {
  for (const ws of clients) {
    try { ws.send("reload"); } catch { clients.delete(ws); }
  }
}

let rebuilding = false;

async function onSourceChange(filePath: string): Promise<void> {
  if (filePath.includes("node_modules") || filePath.includes("/dist/")) return;
  const rel = relative(APP_ROOT, filePath);
  if (!rel.startsWith("docs-src") && rel !== "docs.config.ts") return;
  if (rebuilding) return;

  rebuilding = true;
  try {
    const ok = await rebuild();
    if (ok) notifyClients();
  } finally {
    rebuilding = false;
  }
}

const mimeTypes: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".wasm": "application/wasm",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

async function main(): Promise<void> {
  const initialOk = await rebuild();
  if (!initialOk) process.exit(1);
  console.log(`[dev] Serving http://localhost:${PORT}`);

  // Watch source files
  watch(APP_ROOT, { recursive: true }, (event, filename) => {
    if (filename) onSourceChange(resolve(APP_ROOT, filename));
  });

  serve({
    port: PORT,
    websocket: {
      message() {},
      open(ws) {
        clients.add(ws);
      },
      close(ws) {
        clients.delete(ws);
      },
    },
    fetch(req, server) {
      const url = new URL(req.url);

      if (url.pathname === "/__hmr") {
        server.upgrade(req);
        return;
      }

      let filePath = join(DIST, url.pathname === "/" ? "index.html" : url.pathname);
      if (!existsSync(filePath)) {
        const alt = join(DIST, url.pathname + ".html");
        if (existsSync(alt)) filePath = alt;
        else return new Response("Not Found", { status: 404 });
      }

      return readFile(filePath).then((content) => {
        const ext = extname(filePath);
        const mime = mimeTypes[ext] || "application/octet-stream";
        let body: string | Uint8Array = content;
        if (ext === ".html") body = injectLiveReload(content.toString("utf-8"));
        return new Response(body as BodyInit, { headers: { "Content-Type": mime } });
      });
    },
    error(err) { console.error("[dev]", err); },
  });
}

main().catch(console.error);
