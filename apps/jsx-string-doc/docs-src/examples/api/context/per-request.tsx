// Per-request context injection in an HTTP server
const requestCtx = context<{ userId: string; locale: string }>(
  "my-app:request",
);

async function handleRequest(req: Request): Promise<Response> {
  const session = await getSession(req);

  const html = await renderToString(() => <App />, {
    context: [
      requestCtx.with({
        userId: session.userId,
        locale: req.headers.get("Accept-Language") ?? "en",
      }),
    ],
  });

  return new Response("<!DOCTYPE html>\n" + html, {
    headers: { "Content-Type": "text/html" },
  });
}
