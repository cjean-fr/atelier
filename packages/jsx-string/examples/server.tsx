/**
 * Tiny HTTP server using Bun.serve. Renders JSX to HTML on each request,
 * with per-request context injected at the top of the scope.
 *
 * Run: `bun examples/server.tsx`
 * Then: `curl -i http://localhost:3000/?name=World`
 */

import {
  context,
  setContext,
  useContext,
  withScope,
  renderToString,
} from "@cjean-fr/jsx-string";

const Request = context<{ name: string }>("examples:request");

function Page() {
  const { name } = useContext(Request);
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

    const html = await withScope(async () => {
      setContext(Request, { name });
      return renderToString(<Page />);
    });

    return new Response("<!DOCTYPE html>\n" + html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  },
});

console.log("Listening on http://localhost:3000");
