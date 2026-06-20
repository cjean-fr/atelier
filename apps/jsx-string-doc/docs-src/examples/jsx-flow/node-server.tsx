import { Slot, Fill, renderStream } from "@cjean-fr/jsx-flow";
import http from "node:http";

// Simulate a slow data source
async function Comments() {
  const items = await fetchComments();
  return (
    <ul>
      {items.map((c) => (
        <li>{c.text}</li>
      ))}
    </ul>
  );
}

function Page() {
  return (
    <html>
      <body>
        <h1>My page</h1>
        <Slot name="comments">
          <p>Loading comments…</p>
        </Slot>
        <Fill target="comments">
          <Comments />
        </Fill>
      </body>
    </html>
  );
}

http
  .createServer(async (_req, res) => {
    const stream = renderStream(() => <Page />);

    // renderStream returns a ReadableStream<string>.
    // The shell (everything outside <Fill />) is the first chunk —
    // flushed immediately so the browser starts parsing HTML.
    // <Comments /> resolves later and its fragment is injected
    // into the <Slot>.
    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Transfer-Encoding": "chunked",
    });

    for await (const chunk of stream) {
      res.write(chunk);
    }
    res.end();
  })
  .listen(3000);

console.log("Listening on http://localhost:3000");
