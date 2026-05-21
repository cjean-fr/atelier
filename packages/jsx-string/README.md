# @cjean-fr/jsx-string

[![CI](https://github.com/cjean-fr/atelier/actions/workflows/ci.yml/badge.svg)](https://github.com/cjean-fr/atelier/actions/workflows/ci.yml)

**JSX → HTML strings. Async-first. Secure by default. Zero runtime dependencies.**

A server-side JSX renderer that evaluates eagerly during JSX construction — no virtual DOM, no reconciliation pass.

- Components can be `async` — `await` inside them, no hooks.
- Concurrent-safe context via `AsyncLocalStorage` (no provider component).
- Built-in XSS guards (escape, URL schemes, attribute validation).
- ~3 KB gzip runtime, zero dependencies.

## Install

```bash
bun add @cjean-fr/jsx-string   # or: npm install
```

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@cjean-fr/jsx-string"
  }
}
```

For Vite/esbuild use `jsx: "automatic"` with the same `jsxImportSource`. `@types/react` is optional — install it for attribute autocomplete.

## Quickstart

```tsx
import { renderToString } from "@cjean-fr/jsx-string";

const Greeting = async ({ id }: { id: string }) => {
  const user = await db.users.find(id);
  return <h1>Hello {user.name}</h1>;
};

const html = await renderToString(<Greeting id="42" />);
// => "<h1>Hello Alice</h1>"
```

`renderToString` always returns `Promise<string>`. Concurrent renders (`Promise.all(...)`) work out of the box.

## Context (when you need shared data)

```ts
import { context, useContext, setContext, withScope } from "@cjean-fr/jsx-string";

const Auth = context<{ userId: string }>();

const Page = () => <p>User: {useContext(Auth).userId}</p>;

const html = await withScope(async () => {
  setContext(Auth, { userId: "42" });
  return renderToString(<Page />);
});
```

Each `withScope` is isolated — two concurrent requests never bleed into each other. `useContext` throws if called outside a scope or before the value is set.

Sub-scopes can inherit parent data via `snapshot()`:

```ts
await withScope(async () => {
  setContext(Auth, { userId: "42" });
  await withScope(child, { seed: snapshot() });
});
```

## Performance

Two scenarios ported from [preact-render-to-string's official benchmarks](https://github.com/preactjs/preact-render-to-string/tree/main/benchmarks): `text` (1000 text-heavy blocks) and `stack` (10 × 1000-deep nested trees). Source: [`packages/jsx-string-bench/src/bench.ts`](../jsx-string-bench/src/bench.ts).

| Runtime       | Scenario               | jsx-string | preact-render-to-string@6 | react-dom@18 |
| ------------- | ---------------------- | ---------- | ------------------------- | ------------ |
| Node 26 (V8)  | text — 1000 wide       | 635 µs     | 650 µs                    | 5.1 ms       |
| Node 26 (V8)  | stack — 10 × 1000 deep | **770 µs** | 820 µs                    | 6.7 ms       |
| Bun 1.3 (JSC) | text — 1000 wide       | **460 µs** | 670 µs                    | 6.2 ms       |
| Bun 1.3 (JSC) | stack — 10 × 1000 deep | **697 µs** | 1.15 ms                   | 8.4 ms       |

(Ryzen 7 PRO 8840HS, median of 3 runs each.)

Reading the numbers honestly: on Node 26, V8's escape-loop optimizations leave us at parity with preact on wide trees and ~7 % faster on deep trees. On Bun (JSC) — and on older Node versions — the absence of a virtual DOM is a clear win, ~30–40 % faster than preact across the board. Against React the gap is structural: 8–14× faster on both runtimes regardless of tree shape. Numbers from your machine will differ — re-run the bench locally.

## Security model

**Defended by default (no opt-in):**

- Text content: `&`, `<`, `>` escaped.
- Attribute values: `&`, `<`, `>`, `"` escaped (attrs are always double-quoted).
- Attribute names: rejects whitespace, quotes, `>`, `/`, `=`, and Unicode "Other" chars (controls, ZWSP, LRM, surrogates).
- Tag names: must match `/^[a-zA-Z][a-zA-Z0-9-]*$/`; invalid → element dropped with a warning.
- URL attributes (`href`, `src`, `action`, `formaction`, `cite`, `poster`, `icon`, `data`, `xlink:href`, `srcset`): `javascript:`, `vbscript:`, and non-image `data:` schemes replaced with `#blocked`. Obfuscation via `\0`, `\t`, `\n` inside the scheme is stripped before checking.
- Inline `style`: `expression(...)` and `javascript:` rejected; `url(...)` arguments routed through the same URL check.
- Event handlers (`onClick`, `onclick`, `ONCLICK`…): only string values accepted. Functions warn and drop. Numbers/objects/etc. drop silently.

```tsx
<div>{"<script>alert(1)</script>"}</div>
// => <div>&lt;script&gt;alert(1)&lt;/script&gt;</div>

<a href="javascript:alert(1)">x</a>
// => <a href="#blocked">x</a>

<button onClick={() => {}}>x</button>
// ⚠️ warn + onClick dropped
```

**Your responsibility:**

- Anything wrapped in `raw(...)` or `dangerouslySetInnerHTML.__html` is injected verbatim. _Never_ pass untrusted input through these.
- The **string body** of an event handler (`onClick="alert('x')"`) is HTML-escaped for serialization, but the JavaScript inside is whatever you wrote. Treat it like inline JS: never interpolate untrusted data.
- Out of scope: SQL/NoSQL injection, CSRF, prototype pollution, server-side concerns.

Trusted HTML when you need it:

```tsx
import { raw } from "@cjean-fr/jsx-string";
<div>{raw("<b>trusted</b>")}</div>
// or
<div dangerouslySetInnerHTML={{ __html: "<b>trusted</b>" }} />
```

## Design notes

- **`class` and `className` are kept separate.** Setting both on the same element emits two `class="…"` attributes — no merge. Use a single prop. This matches Deno's `precompile` JSX transform contract, where each attribute is rendered in isolation.
- **No hooks, no refs.** Async data fetching belongs _in the component_ (`await fetch(...)`), not in lifecycle.
- **String event handlers only.** Function handlers can't survive HTML serialization; if you need interactivity, ship the JS separately.

## API

| Export                     | Description                                                           |
| -------------------------- | --------------------------------------------------------------------- |
| `renderToString(node)`     | Renders a JSX tree to an HTML string. Returns `Promise<string>`.      |
| `raw(string)`              | Marks an HTML string as trusted (no escape).                          |
| `Fragment`                 | Standard JSX Fragment (`<>…</>`).                                     |
| `context<T>()`             | Creates a typed, isolated context token.                              |
| `setContext(token, value)` | Writes to the current scope.                                          |
| `useContext(token)`        | Reads; throws if absent.                                              |
| `withScope(fn, options?)`  | Runs `fn` in an isolated async scope. Needed only when using context. |
| `snapshot()`               | Captures current scope state for seeding sub-scopes.                  |

## Other runtimes

- **Cloudflare Workers** — works with `compatibility_flags = ["nodejs_compat_v2"]` (needed for `AsyncLocalStorage`).
- **Deno (`jsx: "precompile"`)** — set `jsxImportSource` to this package; the `jsxTemplate` / `jsxAttr` / `jsxEscape` runtime functions are exported. `dangerouslySetInnerHTML` is dropped in precompile mode (use `{raw(html)}` as a child instead).
- **Bun / Node 20+** — supported, no setup beyond `tsconfig.json`.

## When NOT to use

- Client-side rendering or hydration — this library is server-only.
- Existing React-component ecosystems (MUI, Radix, React Query…) — they need React's runtime.
- Next.js App Router / RSC — jsx-string isn't RSC-aware.

For streaming and islands, see [`@cjean-fr/jsx-string-island`](https://github.com/cjean-fr/atelier/tree/main/packages/jsx-string-island) (early / v0.1.0).

## License

MIT © Christophe Jean
