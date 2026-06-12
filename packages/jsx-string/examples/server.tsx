/**
 * Tiny HTTP server using Bun.serve. Renders JSX to HTML on each request,
 * with per-request context bound at the render entry point.
 *
 * Run: `bun examples/server.tsx`
 * Then: `curl -i http://localhost:3000/?name=World`
 */
import { context, renderToString } from "@cjean-fr/jsx-string";

const Request = context<{ name: string }>("examples:request");

function Page() {
  const { name } = Request.get();
  return (
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Hello, {name}</title>
      </head>
      <body>
        <h1>Hello, {name}!</h1>
        <p>Rendered by jsx-string on Bun.serve.</p>
      </body>
    </html>
  );
}

Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    const name = url.searchParams.get("name") ?? "stranger";

    const html = await renderToString(() => <Page />, {
      context: [Request.with({ name })],
    });

    return new Response("<!DOCTYPE html>\n" + html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  },
});

console.log("Listening on http://localhost:3000");
