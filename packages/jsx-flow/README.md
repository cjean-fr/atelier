# @cjean-fr/jsx-flow

> 🚧 Early development — API may change. Version 0.2.0.

Fragment streaming extension for [@cjean-fr/jsx-string](../jsx-string). Renders deferred JSX fragments and delivers them to the browser as DOM patches — via Turbo Streams, HTMX, the WICG Declarative Partial Updates API, or ESI-based CDN composition.

## When to use

Use `jsx-string` alone for SSG, emails, and pure SSR. Add `jsx-flow` when you need **progressive enhancement**: the initial HTML loads fast with placeholders, and heavy or slow components are rendered separately and patched into the page without a full reload.

| `@cjean-fr/jsx-string`    | `@cjean-fr/jsx-flow`                               |
| ------------------------- | -------------------------------------------------- |
| Renders JSX → HTML string | Adds deferred fragments + streaming patch delivery |
| Server-only, zero runtime | Emits adapter-specific markup for DOM updates      |
| `renderToString()`        | `renderStream()` / `renderToStatic()`              |
| —                         | Adapters: Turbo, HTMX, Native, WebPlatform, ESI    |

## Why deferred regions in streaming SSR

A standard `renderToString` call is a serial pipeline: the server computes the full page before sending the first byte. With streaming, the shell (layout, navigation, above-the-fold content) goes to the browser immediately while heavy components are still rendering.

Each deferred region renders **concurrently** and independently — the slowest component does not block the others. The browser receives the shell, paints it, then receives patches as they arrive and applies them in-place.

- **TTFB / FCP** — users see content in one round-trip, not after all async work settles
- **No virtual DOM, no hydration** — patches are applied as plain HTML by the adapter's client mechanism (Turbo, HTMX) or a minimal polyfill
- **Fault isolation** — a failed fragment routes to `onError` (or logs) and is skipped; the rest of the page is unaffected
- **Memory** — fragments are streamed out as they render, not accumulated before flushing

## Why deferred regions in SSG

In static generation every page is a snapshot. Cache invalidation is the hard part: when a deeply nested component changes, you regenerate the entire page. Deferred fragments split that snapshot.

The shell (stable layout, navigation) is one file. Each fragment is a separate file at a predictable URL. Your build pipeline treats them independently:

- **Granular invalidation** — only fragments whose data changed need to be regenerated; the shell stays cached
- **Per-fragment TTL** — a "live prices" fragment can expire in 60 s while the surrounding page is cached for a day
- **CDN composition** — shell and fragments are plain HTML files; any CDN can serve them
- **Incremental builds** — on large sites, regenerating ten fragment files instead of ten thousand pages cuts build time

## Install

```bash
bun add @cjean-fr/jsx-flow
```

## Components

jsx-flow provides four declarative primitives for deferred content. Each works with any adapter, in both streaming and static generation.

### `<Slot>` — a hole with optional default content

Declares a named insertion point in the shell. Its children are the default content, rendered immediately. An empty slot tells the adapter to render an empty placeholder.

```tsx
import { Slot, Fill } from "@cjean-fr/jsx-flow";

function Layout() {
  return (
    <html>
      <body>
        <nav>...</nav>
        <main>
          <Slot name="page">
            <p>Loading…</p>
          </Slot>
        </main>
      </body>
    </html>
  );
}

// Elsewhere in the tree (or a different component):
function PageContent() {
  return (
    <Fill target="page">
      <h1>Hello</h1>
    </Fill>
  );
}
```

`Slot` registers nothing in the pending store when called without children — it's just a passive hole. When called with children, it registers them as the default and renders a placeholder.

### `<Fill>` — push content into a slot

Pushes content into an existing slot by name. Renders nothing itself (returns `null`). Accepts children as a node, a `Promise<node>`, an `AsyncIterable<node>` (streams one patch per item), or a `(signal) => …` factory.

```tsx
import { Fill } from "@cjean-fr/jsx-flow";

// One-shot: replaces the target
<Fill target="page"><h1>Hello</h1></Fill>

// Async: resolves and patches in
<Fill target="comments"><Comments /></Fill>

// Stream: each yield is a separate patch
<Fill target="feed" merge="append">
  {liveRows()}
</Fill>

// Cancellable factory with timeout
<Fill target="dashboard" timeout={2000}>
  {(signal) => <Dashboard signal={signal} />}
</Fill>
```

### `<Defer>` — deferred content (streaming or SSG)

Same shape as `Fill`, but renders a placeholder in the shell instead of returning `null`. Use `<Defer>` when the content should have a visible placeholder in the initial HTML. The placeholder is rendered by the active adapter (e.g. `<turbo-frame id="…">`, `<div id="…">`, `<?start name="…">`).

```tsx
import { Defer, Fill } from "@cjean-fr/jsx-flow";

// Default content is shown in the shell; <Comments /> replaces it
<Defer name="comments">
  <Comments />
</Defer>

// Same pattern with Slot for the placeholder + Fill for the content:
<Slot name="comments"><p>Loading…</p></Slot>
<Fill target="comments"><Comments /></Fill>
```

### `<ClientFetch>` — client-side fetch only

Renders a placeholder with a `src` attribute — the browser fetches the fragment after the shell lands. No server-push, works with any static host. Renders no deferred work on the server.

```tsx
import { ClientFetch } from "@cjean-fr/jsx-flow";

<ClientFetch src="/fragments/comments.html" />;

// @ts-expect-error — dangerous schemes are rejected at compile time
<ClientFetch src="javascript:alert(1)" />;
```

`src` uses a strict **whitelist**: for string **literals**, only `http(s):` and relative paths compile. Every other scheme (`javascript:`, `data:`, `mailto:`, …) is a compile-time error — exactly what a fragment fetch needs. Dynamic `string` values pass through and remain the caller's responsibility.

### Content forms

All three content-bearing primitives (`Defer`, `Fill`, `Slot` with children) accept:

| Child                        | Behaviour                                                        |
| ---------------------------- | ---------------------------------------------------------------- |
| a node / `Promise<node>`     | one-shot patch — write JSX as usual, it streams when it resolves |
| an `AsyncIterable<node>`     | a **stream** — one patch per item, as each arrives               |
| `(signal: AbortSignal) => …` | the **cancellable** form — aborts on request cancel or `timeout` |

The node form starts its work eagerly and is not cancellable; reach for the `(signal) => …` factory only when you need cancellation or a `timeout`. Detection of a stream is by `Symbol.asyncIterator` — synchronous iterables are treated as ordinary nodes.

### Common props

| Prop      | Applies to      | Meaning                                                             |
| --------- | --------------- | ------------------------------------------------------------------- |
| `name`    | `Slot`, `Defer` | id of the rendered placeholder (auto-generated if omitted)          |
| `target`  | `Fill`          | target slot id to push content into                                 |
| `merge`   | `Defer`, `Fill` | how content applies to its target (default `"replace"`) — see below |
| `timeout` | `Defer`, `Fill` | per-fragment render timeout in ms (factory content only)            |
| `onError` | `Defer`, `Fill` | per-fragment error handler, overriding the renderer's `onError`     |
| `src`     | `ClientFetch`   | URL the browser fetches for the fragment content                    |

### Merge types

`merge` describes how content is applied **relative to the target DOM element identified by `id`**.

| `merge`     | Effect                                          |
| ----------- | ----------------------------------------------- |
| `"replace"` | Target element is replaced by content (default) |
| `"append"`  | Content inserted as last child of target        |
| `"prepend"` | Content inserted as first child of target       |
| `"before"`  | Content inserted as previous sibling of target  |
| `"after"`   | Content inserted as next sibling of target      |

An adapter that cannot express a merge **rejects it at registration** with a clear error (see capabilities). `WebPlatformAdapter` and `EsiAdapter` support `"replace"` only.

## Adapters

Each adapter implements `Placeholder`/`Patch`/`Frame` (JSX), `encode()` (streaming wire format, delegated to `Patch`), optional `transformShell`, and a `capabilities` descriptor. Adapters are **pure wire formats** — HTTP negotiation is a separate concern (see below).

| Adapter              | `Placeholder`          | `Patch` (streaming inline)                      | `Frame` (SSG lazy-load) |
| -------------------- | ---------------------- | ----------------------------------------------- | ----------------------- |
| `TurboAdapter`       | `<turbo-frame>`        | `<turbo-stream action="…">`                     | `<turbo-frame id="…">`  |
| `HtmxAdapter`        | `<div hx-get>`         | `<div hx-swap-oob="…">`                         | `<div id="…">`          |
| `NativeAdapter`      | `<?start name>…<?end>` | `<template for>` (`data-merge` for non-replace) | `<template for="…">`    |
| `WebPlatformAdapter` | `<?start name>…<?end>` | `<template for="…">` (`replace` only)           | `<template for="…">`    |
| `EsiAdapter`         | `<esi:include src>`    | `<esi:inline name fetchable>` (static only)     | raw HTML                |

- **`Patch`** — fragment delivered inline in the same HTTP response as the shell.
- **`Frame`** — fragment served as a standalone file fetched by the client (SSG).
- `NativeAdapter` is the **default** — pass nothing to `renderStream` / `serve` to use it.

### Capabilities

Every adapter declares what its wire format can express:

```ts
type AdapterCapabilities = {
  streaming: boolean; // can carry a live FlowEvent stream
  merges: readonly MergeType[]; // which merges it supports
};
```

This is surfaced in the type system. `renderStream` / `serve` require a streaming adapter, so **`EsiAdapter` is rejected at compile time** there — ESI composition happens at the CDN, via `renderToStatic` + `emitFragments`. An unsupported `merge` fails fast at registration.

#### `NativeAdapter` (default)

Uses the [Declarative Partial Updates](https://developer.chrome.com/blog/declarative-partial-updates) API plus a minimal polyfill injected via `transformShell`. All merge types, no external client library, works in modern browsers.

Every update is a **declarative `<template for>`** — the merge mode rides on `data-merge`, lazy client fetches on `data-src`. There are **no per-fragment inline scripts**; the only JS is a single static polyfill, which makes a strict CSP straightforward:

```ts
import {
  NativeAdapter,
  nativePolyfillHash,
  NATIVE_POLYFILL,
} from "@cjean-fr/jsx-flow";

// Option A — keep the inline <script>, pin it by hash (static ⇒ cache/SSG-safe):
res.headers.set(
  "Content-Security-Policy",
  `script-src 'self' '${await nativePolyfillHash()}'`,
);

// Option B — serve the polyfill from your origin under script-src 'self':
//   write NATIVE_POLYFILL to e.g. /jsx-flow.js, then:
const selfHosted = {
  ...NativeAdapter,
  transformShell: (shell: string) =>
    injectIntoHead(shell, `<script src="/jsx-flow.js"></script>`),
};
```

A per-request **nonce** is intentionally not offered: it would break the static-cache/SSG story. A hash works because the script never changes.

#### `WebPlatformAdapter`

Pure WICG spec — no JS at all. Requires `chrome://flags/#enable-experimental-web-platform-features` until the spec ships. `"replace"` only.

#### `EsiAdapter` — CDN-level composition

For **SSG with a CDN ESI processor** (Varnish, Fastly, nginx ESI module). The shell contains `<esi:include src="…">` tags; the CDN fetches each fragment independently, applies separate TTLs, and assembles the final response before it reaches the browser. `"replace"` only; no client-side JS.

```tsx
// Defer with explicit src pointing to the fragment URL
<Defer name="nav" />
<Defer name="feed" />
```

## Usage

### Streaming (server pushes fragments)

```tsx
import { renderStream, Defer } from "@cjean-fr/jsx-flow";

const stream = renderStream(() => (
  <html>
    <body>
      <header>Fast</header>
      <Defer name="dashboard">
        {(signal) => <HeavyDashboard signal={signal} />}
      </Defer>
    </body>
  </html>
));
// → ReadableStream<string> (NativeAdapter by default). Pipe it to the HTTP response.
// Pass a second arg (TurboAdapter, HtmxAdapter, …) to switch wire format.
```

### Static generation, pure-static (no deferred content)

```tsx
import { renderToStatic } from "@cjean-fr/jsx-flow";

await renderToStatic(async (ctx) => {
  for (const page of pages) {
    const html = await ctx.renderPage(() =>
      page.component({ currentPage: page.url }),
    );
    await Bun.write(page.outPath, "<!DOCTYPE html>\n" + html);
  }
});
```

No adapter required — jsx-flow stays invisible for pure-static rendering.

### Static generation with deferred fragments

```tsx
import { renderToStatic, NativeAdapter } from "@cjean-fr/jsx-flow";

await renderToStatic(
  async (ctx) => {
    for (const page of pages) {
      const html = await ctx.renderPage(() =>
        page.component({ currentPage: page.url }),
      );
      await Bun.write(page.outPath, "<!DOCTYPE html>\n" + html);
    }

    // Each fragment is already wrapped in adapter.Frame and rendered —
    // `html` is ready to write, no raw()/renderToString needed.
    await ctx.emitFragments((id, url, html) => Bun.write("./out" + url, html));
  },
  {
    adapter: NativeAdapter,
    generatePath: (id) => `/fragments/${id}.html`,
  },
);
```

### HTTP responses with negotiation

Negotiation is **opt-in and decoupled from the adapter**: pass a `negotiate` function (`negotiateHtmx`, `negotiateUnpoly`, or your own) to extract per-request hints and headers. Without it, the full page is rendered and the client library extracts its own target.

```tsx
import { serve, NativeAdapter, negotiateUnpoly } from "@cjean-fr/jsx-flow";

Bun.serve({
  fetch(req) {
    // Unpoly's wire format IS the Native one — pair NativeAdapter with negotiateUnpoly.
    return serve(req, (n) => <App target={n.target} />, NativeAdapter, {
      negotiate: negotiateUnpoly,
      // `mode: "fragment"` (shell suppressed) is an explicit opt-in and only
      // produces output when the targeted content is expressed as deferred fragments.
    });
  },
});
```

### Composing shell transforms

`composeShell` chains several `transformShell` functions (e.g. to inject `<title>`, asset links) into one — falsy entries are skipped, so an adapter's own transform splices in cleanly:

```tsx
import {
  createAdapter,
  NativeAdapter,
  composeShell,
  injectIntoHead,
} from "@cjean-fr/jsx-flow";

const metadata = () => (html: string) =>
  injectIntoHead(html, "<title>Home</title>");

const MyAdapter = createAdapter({
  ...NativeAdapter,
  transformShell: composeShell(NativeAdapter.transformShell, metadata()),
});
```

## API

### Components

| Export        | Description                                                       |
| ------------- | ----------------------------------------------------------------- |
| `Slot`        | Passive hole with optional default content; renders a placeholder |
| `Fill`        | Push content into a slot by target id; renders nothing            |
| `Defer`       | Deferred content with a placeholder; fills when resolved          |
| `ClientFetch` | Client-side fetch placeholder — no server deferral                |

### Renderers

| Export                                      | Description                                                                                                                                 |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `renderStream(node, adapter?, opts?)`       | Streams shell + fragments as a `ReadableStream<string>`. Defaults to `NativeAdapter`. `opts`: `signal`, `onError`, `defaultTimeout`, `mode` |
| `renderToFlowEvents(node, adapter?, opts?)` | Lower level: `ReadableStream<FlowEvent>` (semantic events, before adapter encoding) with backpressure and cancellation                      |
| `serve(req, page, adapter?, opts?)`         | Full HTTP `Response`. Runs the opt-in `opts.negotiate(req)`, encodes, merges protocol + Vary headers                                        |
| `renderToStatic(handler, options?)`         | Runs `handler` in a static render scope. `options.adapter` + `options.generatePath` needed only for deferred content / `ctx.emitFragments`  |

### Negotiation (decoupled)

| Export            | Description                                                                                                      |
| ----------------- | ---------------------------------------------------------------------------------------------------------------- |
| `negotiateHtmx`   | `(req) => Negotiation` — reads `HX-Target`, sets `Vary`                                                          |
| `negotiateUnpoly` | `(req) => Negotiation` — reads `X-Up-Target` / `X-Up-Fail-Target`, echoes + `Vary` (does not force `"fragment"`) |
| `Negotiate`       | Type: `(req: Request) => Negotiation`                                                                            |

### Context

| Export          | Description                                                                    |
| --------------- | ------------------------------------------------------------------------------ |
| `StaticContext` | `{ config, pendingStore, nextId, defer, renderPage(node), emitFragments(cb) }` |

### Adapters & types

| Export                | Description                                                                            |
| --------------------- | -------------------------------------------------------------------------------------- |
| `createAdapter`       | Build an adapter; defaults `encode` (delegates to `Patch`) and `capabilities`          |
| `TurboAdapter`        | Hotwire Turbo Streams — all merge types                                                |
| `HtmxAdapter`         | HTMX OOB swaps — all merge types                                                       |
| `NativeAdapter`       | Declarative Partial Updates + bundled polyfill — all merge types (default)             |
| `WebPlatformAdapter`  | Pure WICG spec, zero JS — `replace` only                                               |
| `EsiAdapter`          | CDN-level ESI composition — `replace` only, static only                                |
| `Adapter`             | `{ Placeholder, Patch, Frame, capabilities, encode, transformShell? }`                 |
| `NATIVE_POLYFILL`     | The Native adapter's client polyfill as a JS string — serve it for `script-src 'self'` |
| `nativePolyfillHash`  | `() => Promise<string>` — the `'sha256-…'` CSP token for the inline polyfill           |
| `StreamingAdapter`    | An `Adapter` with `capabilities.streaming: true`                                       |
| `AdapterCapabilities` | `{ streaming: boolean; merges: readonly MergeType[] }`                                 |
| `MergeType`           | `"replace" \| "append" \| "prepend" \| "before" \| "after"`                            |
| `DeferContent`        | `JSXNode \| ((signal: AbortSignal) => JSXNode)`                                        |
| `FlowEvent`           | `{ type: "shell" \| "fragment" \| "close", … }` — semantic streaming event             |
| `Negotiation`         | `{ headers?, mode?, target?, failTarget? }`                                            |
| `composeShell`        | Compose several `transformShell` (string→string) into one                              |
| `injectIntoHead`      | Insert markup before `</head>` (building block for shell transforms)                   |

## License

MIT © Christophe Jean
