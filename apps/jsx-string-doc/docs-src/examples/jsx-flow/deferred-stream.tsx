import { Slot, Fill, Defer, renderStream } from "@cjean-fr/jsx-flow";

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

// <Slot> declares the placeholder with fallback content in the shell.
// <Fill> pushes the real content, which replaces it when resolved.
function Page() {
  return (
    <html>
      <body>
        <h1>My page</h1>
        <Slot name="comments">
          <p>Loading comments…</p>
        </Slot>
        <Fill target="comments">{() => <Comments />}</Fill>
      </body>
    </html>
  );
}

// The shell is sent immediately; <Comments /> streams in after it resolves.
// No adapter argument needed — NativeAdapter is the default.
const stream = renderStream(() => <Page />);
