import { Deferred, renderToReadableStream, TurboAdapter } from "@cjean-fr/jsx-flow";

async function Comments() {
  const items = await fetchComments();
  return <ul>{items.map((c) => <li>{c.text}</li>)}</ul>;
}

function Page() {
  return (
    <html>
      <body>
        <h1>My page</h1>
        <Deferred fallback={<p>Loading comments…</p>}>
          {() => <Comments />}
        </Deferred>
      </body>
    </html>
  );
}

// The shell is sent immediately; <Comments /> streams in after it resolves.
const stream = await renderToReadableStream(() => <Page />, TurboAdapter);
