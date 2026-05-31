# @cjean-fr/jsx-flow

> 🚧 Early development — API may change. Version 0.2.0.

Fragment streaming extension for [@cjean-fr/jsx-string](../jsx-string). Renders deferred JSX fragments and delivers them to the browser as DOM patches — via Turbo Streams, HTMX, the WICG Declarative Partial Updates API, or ESI-based CDN composition.

## When to use

Use `jsx-string` alone for SSG, emails, and pure SSR. Add `jsx-flow` when you need **progressive enhancement**: the initial HTML loads fast with placeholders, and heavy or slow components are rendered separately and patched into the page without a full reload.

| `@cjean-fr/jsx-string`    | `@cjean-fr/jsx-flow`                               |
| ------------------------- | -------------------------------------------------- |
| Renders JSX → HTML string | Adds deferred fragments + streaming patch delivery |
| Server-only, zero runtime | Emits adapter-specific markup for DOM updates      |
| `renderToString()`        | `renderToReadableStream()` / `renderToStatic()`    |
| Context via `withScope()` | Adapters: Turbo, HTMX, Native, WebPlatform, ESI    |

## Why deferred regions in streaming SSR

A standard `renderToString` call is a serial pipeline: the server computes the full page before sending the first byte. With streaming, the shell (layout, navigation, above-the-fold content) goes to the browser immediately while heavy components are still rendering.

Each `<Deferred>` renders **concurrently** and independently — the slowest component does not block the others. The browser receives the shell, paints it, then receives patches as they arrive and applies them in-place.

- **TTFB / FCP** — users see content in one round-trip, not after all async work settles
- **No virtual DOM, no hydration** — patches are applied as plain HTML by the adapter's client mechanism (Turbo, HTMX) or a minimal polyfill
- **Fault isolation** — a failed fragment logs and is silently skipped; the rest of the page is unaffected
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

## Concepts

### `<Deferred>` — deferred render with placeholder

Renders a placeholder immediately in the shell. After the shell is sent, the real content renders concurrently and is delivered as a DOM patch.

```tsx
import { Deferred } from "@cjean-fr/jsx-flow";

// Streaming: server pushes the fragment in the same response
<Deferred fallback={<Spinner />}>
  {() => <HeavyDashboard />}
</Deferred>

// Static: client fetches the fragment from src
<Deferred src="/fragments/heavy.html" fallback={<Spinner />} />

// Append into a container rather than replacing the placeholder
<Deferred merge="append" fallback={<ul id="feed" />}>
  {() => <li>Latest post</li>}
</Deferred>
```

`children` must be a **factory** `() => JSXNode`, not a plain node. JSX evaluates eagerly — the thunk defers rendering to streaming time.

### `<Patch>` — headless fragment push

Registers a fragment without rendering anything in the shell. Use it to push content to a DOM element that already exists.

```tsx
import { Patch } from "@cjean-fr/jsx-flow";

// Appends a notification to an existing list
<Patch target="toast-list" merge="append">
  {() => <li>File uploaded</li>}
</Patch>

// Updates a badge counter in-place
<Patch target="cart-badge">
  {() => <span>{count}</span>}
</Patch>
```

### Merge types

Both `<Deferred>` and `<Patch>` accept a `merge` prop describing how the content is applied **relative to the target DOM element identified by `id`**. The content rendered by the factory has no id requirement.

| `merge`     | Effect                                          |
| ----------- | ----------------------------------------------- |
| `"replace"` | Target element is replaced by content (default) |
| `"append"`  | Content inserted as last child of target        |
| `"prepend"` | Content inserted as first child of target       |
| `"before"`  | Content inserted as previous sibling of target  |
| `"after"`   | Content inserted as next sibling of target      |

> `WebPlatformAdapter` only supports `"replace"` (WICG spec limitation). `EsiAdapter` only supports `"replace"` (ESI has no native insert/append semantics).

### Patch adapters

Each adapter is a pure encoding backend implementing three methods plus an optional `transformShell`.

| Adapter              | `Placeholder`          | `Patch` (streaming inline)                     | `Frame` (SSG lazy-load) |
| -------------------- | ---------------------- | ---------------------------------------------- | ----------------------- |
| `TurboAdapter`       | `<turbo-frame>`        | `<turbo-stream action="…">`                    | `<turbo-frame id="…">`  |
| `HtmxAdapter`        | `<div hx-get>`         | `<div hx-swap-oob="…">`                        | `<div id="…">`          |
| `WebPlatformAdapter` | `<?start name>…<?end>` | `<template for="…">` (`replace` only)          | `<template for="…">`    |
| `NativeAdapter`      | `<?start name>…<?end>` | `<template for>` + `insertAdjacentHTML`        | `<template for="…">`    |
| `EsiAdapter`         | `<esi:include src>`    | `<esi:inline name fetchable>` (`replace` only) | raw HTML                |

- **`Patch`** — fragment delivered inline in the same HTTP response as the shell.
- **`Frame`** — fragment served as a standalone file fetched by the client (SSG).

#### `NativeAdapter` (recommended default)

Uses the [Declarative Partial Updates](https://developer.chrome.com/blog/declarative-partial-updates) API plus a minimal inline polyfill injected via `transformShell`. All merge types, no external client library, works in modern browsers.

#### `WebPlatformAdapter`

Pure WICG spec — no JS at all. Requires `chrome://flags/#enable-experimental-web-platform-features` until the spec ships. Only supports `"replace"`.

#### `EsiAdapter` — CDN-level composition

Designed for **SSG with a CDN ESI processor** (Varnish, Fastly, nginx ESI module). The shell contains `<esi:include src="…">` tags; the CDN fetches each fragment independently, applies separate TTLs, and assembles the final response before it reaches the browser.

```tsx
// Each Deferred needs an explicit src pointing to the fragment URL
<Deferred src="/fragments/nav.html" fallback={<nav>…</nav>} />
<Deferred src="/fragments/feed.html" fallback={<p>Loading…</p>} />
```

Only `"replace"` is supported; ESI has no insert/append semantics. No client-side JS — composition is entirely at the CDN.

## Usage

### Streaming (server pushes fragments)

```tsx
import {
  renderToReadableStream,
  NativeAdapter,
  Deferred,
} from "@cjean-fr/jsx-flow";

const stream = await renderToReadableStream(
  () => (
    <html>
      <body>
        <header>Fast</header>
        <Deferred fallback={<p>Loading…</p>}>
          {() => <HeavyDashboard />}
        </Deferred>
      </body>
    </html>
  ),
  NativeAdapter,
);

// stream is a ReadableStream<string> — pipe it to the HTTP response
```

### Static generation, pure-static (no `<Deferred>`)

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

    // Materialize each pending fragment as a standalone file
    await ctx.emitFragments(async (_id, url, html) => {
      await Bun.write("./out" + url, html);
    });
  },
  {
    adapter: NativeAdapter,
    generatePath: (id) => `/fragments/${id}.html`,
  },
);
```

`emitFragments` walks the registered fragments, renders each through the adapter, and hands the resulting `(id, url, html)` to your callback — you decide where to write.

### Imperative push from a plugin or hook

```ts
import { Flow } from "@cjean-fr/jsx-flow";
import { useContext } from "@cjean-fr/jsx-string";

const { patch } = useContext(Flow);
patch("cart-badge", () => <span>{count}</span>);
patch("toast-list", () => <li>Saved</li>, "append");
```

## API

### Components

| Export     | Description                                                             |
| ---------- | ----------------------------------------------------------------------- |
| `Deferred` | Renders a placeholder; delivers real content as a patch after the shell |
| `Patch`    | Renders nothing; pushes a fragment to an existing DOM target            |

### Renderers

| Export                                    | Description                                                                                                                                         |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `renderToReadableStream(node, adapter)`   | Streams shell + fragments as a `ReadableStream<string>`                                                                                             |
| `renderToStatic(handler, options?)`       | Runs `handler` inside a static render scope. `options.adapter` + `options.generatePath` required only when using `<Deferred>` / `ctx.emitFragments` |
| `streamFragments(fragments, adapter, cb)` | Low-level: render a `Map<id, FragmentEffect>` and call `cb(id, html)` for each                                                                      |

### Context & scope

| Export          | Description                                                   |
| --------------- | ------------------------------------------------------------- |
| `Flow`          | Context token — `useContext(Flow)` from inside a render scope |
| `FlowContext`   | Type: `{ config, fragments, nextId, patch }`                  |
| `StaticContext` | `FlowContext` + `renderPage(node)` + `emitFragments(cb)`      |

### Adapters & types

| Export               | Description                                                                  |
| -------------------- | ---------------------------------------------------------------------------- |
| `TurboAdapter`       | Hotwire Turbo Streams — all merge types                                      |
| `HtmxAdapter`        | HTMX OOB swaps — all merge types                                             |
| `NativeAdapter`      | Declarative Partial Updates + bundled polyfill — all merge types             |
| `WebPlatformAdapter` | Pure WICG spec — `replace` only                                              |
| `EsiAdapter`         | CDN-level ESI composition — `replace` only                                   |
| `PatchAdapter`       | `{ Placeholder, Patch, Frame, transformShell? }`                             |
| `MergeType`          | `"replace" \| "append" \| "prepend" \| "before" \| "after"`                  |
| `FragmentEffect`     | `{ factory: () => JSXNode; merge: MergeType }`                               |
| `assertFragmentId`   | Validates a fragment id (helpful in custom plugins calling `patch` directly) |

## License

MIT © Christophe Jean
