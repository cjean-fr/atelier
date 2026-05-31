/**
 * Minimal renderToString — synchronous JSX in, HTML string out.
 *
 * Run: `bun examples/hello.tsx`
 */
import { renderToString } from "@cjean-fr/jsx-string";

const html = await renderToString(
  <main>
    <h1>Hello, world!</h1>
    <p>jsx-string renders JSX to plain HTML strings.</p>
  </main>,
);

console.log(html);
