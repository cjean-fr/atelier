import { ClientFetch } from "@cjean-fr/jsx-flow";

// The browser fetches /fragments/comments.html after the shell lands.
// No server-push needed — works with any static file server.
// ClientFetch renders its own placeholder — no <Slot> required.
function Page() {
  return (
    <html>
      <body>
        <ClientFetch src="/fragments/comments.html" />
      </body>
    </html>
  );
}
