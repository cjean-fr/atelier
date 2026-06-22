/** @jsxImportSource @cjean-fr/jsx-string */
import { CodeExample } from "./CodeExample.js";

export function ClientFetchSection() {
  return (
    <section>
      <h2 id="clientfetch--client-side-fetch">
        <code>ClientFetch</code> — client-side fetch
      </h2>
      <p>
        The browser fetches the fragment from a URL after the shell lands. No
        server-push required — works with any static file server.
      </p>
      <CodeExample src="jsx-flow/deferred-src.tsx" />
    </section>
  );
}
