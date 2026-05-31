import { Deferred } from "@cjean-fr/jsx-flow";

// The browser fetches /fragments/comments.html after the shell lands.
// No server-push needed — works with any static file server.
function Page() {
  return (
    <Deferred src="/fragments/comments.html" fallback={<p>Loading…</p>} />
  );
}
