# @cjean-fr/jsx-flow

> 🚧 **Early development — API may change.** Version 0.2.0.

Fragment streaming extension for [@cjean-fr/jsx-string](../jsx-string). Renders deferred JSX fragments and delivers them to the browser as targeted DOM patches — via Turbo Streams, HTMX, or the native Declarative Partial Updates API.

## When to use

Use `jsx-string` alone for SSG, emails, and pure SSR. Add `jsx-flow` when you need **progressive enhancement**: the initial HTML loads fast with placeholders, and heavy or slow components are rendered separately and patched into the page without a full reload.

| `@cjean-fr/jsx-string`    | `@cjean-fr/jsx-flow`                      |
| ------------------------- | -------------------------------------------------- |
| Renders JSX → HTML string | Adds deferred fragments + streaming patch delivery |
| Server-only, zero runtime | Emits adapter-specific markup for DOM updates      |
| `renderToString()`        | `renderToReadableStream()` / `renderToStatic()`    |
| Context via `withScope()` | Adapters: Turbo Streams, HTMX, Native DOM          |

## Why islands in streaming SSR

A standard `renderToString` call is a serial pipeline: the server computes the full page before sending the first byte. With streaming, the shell (layout, navigation, above-the-fold content) goes to the browser immediately while heavy components are still rendering.

Islands amplify that further. Each `<Island>` renders **concurrently** and independently — the slowest component does not block the others. The browser receives the shell, paints it, then receives fragments as they arrive and applies them in-place. The user never waits for the full page.

Concrete gains:
- **TTFB / FCP** — users see content in one round-trip, not after all async work settles
- **No virtual DOM, no hydration** — patches are applied as plain HTML by each adapter's respective client-side mechanism (Turbo, HTMX, or a minimal polyfill)
- **Fault isolation** — a failed island logs an error and is silently skipped; the rest of the page is unaffected
- **Memory** — fragments are streamed out as they render, not accumulated in memory before flushing

> **On client-side JS**: `TurboAdapter` requires the Turbo library; `HtmxAdapter` requires HTMX; `NativeAdapter` injects a minimal inline polyfill automatically; `WebPlatformAdapter` requires no JS at all — but depends on a browser flag until the spec ships natively.

Best fit: dashboards, feeds, any page where some sections are fast and some are slow.

## Why islands in SSG

In static generation every page is a snapshot. The problem is cache invalidation: when a deeply nested component changes you must regenerate the entire page. Islands let you split that snapshot.

The shell (stable layout, navigation) is one file. Each island is a separate fragment file at a predictable URL. Your build pipeline can treat them independently:

- **Granular invalidation** — only the fragments whose data changed need to be regenerated; the shell stays cached
- **Per-fragment TTL** — a "live prices" fragment can expire in 60 s while the surrounding page is cached for a day
- **CDN composition** — shell and fragments are plain HTML files; any CDN can serve them without edge compute
- **Incremental builds** — on large sites, regenerating ten fragment files instead of ten thousand pages cuts build time significantly

Best fit: marketing sites, documentation, e-commerce catalogues — anywhere the shell is stable but some sections update on their own schedule.

## Install

```bash
bun add @cjean-fr/jsx-flow
```

## Concepts

### `<Island>` — deferred render with placeholder

An `<Island>` renders a placeholder immediately in the shell. After the shell is sent, the real content renders concurrently and is delivered as a DOM patch.

```tsx
import { Island } from "@cjean-fr/jsx-flow";

// Streaming: server pushes the fragment in the same response
<Island fallback={<Spinner />}>
  {() => <HeavyDashboard />}
</Island>

// Static: client fetches the fragment from `src`
<Island src="/fragments/heavy" fallback={<Spinner />} />

// Append items into a container instead of replacing the placeholder
<Island merge="append" fallback={<ul id="feed" />}>
  {() => <li>Latest post</li>}
</Island>
```

The `children` prop must be a **factory** `() => JSXNode`, not a plain node. JSX evaluates eagerly — the thunk defers rendering to streaming time.

### `<Patch>` — headless fragment push

`<Patch>` registers a fragment without rendering anything in the shell. Use it to push content to a DOM element that already exists in the page.

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

Both `<Island>` and `<Patch>` accept a `merge` prop that controls how the patch is applied to the target element. Defaults to `"replace"`.

| `merge`     | Effect                                      |
| ----------- | ------------------------------------------- |
| `"replace"` | Replaces the target element (default)       |
| `"append"`  | Inserts content at the end of the target    |
| `"prepend"` | Inserts content at the start of the target  |
| `"before"`  | Inserts content before the target element   |
| `"after"`   | Inserts content after the target element    |

> `NativeAdapter` only supports `"replace"` (WICG spec limitation).

### Patch adapters

Each adapter implements three methods covering both delivery strategies, plus an optional `transformShell` for injecting client-side requirements into the shell HTML.

| Adapter                | `Placeholder`          | `Patch` (streaming inline)           | `Frame` (SSG lazy-load)  |
| ---------------------- | ---------------------- | ------------------------------------ | ------------------------ |
| `TurboAdapter`         | `<turbo-frame>`        | `<turbo-stream action="…">`          | `<turbo-frame id="…">`   |
| `HtmxAdapter`          | `<div hx-get>`         | `<div hx-swap-oob="…">`              | `<div id="…">`           |
| `WebPlatformAdapter`   | `<?start name>…<?end>` | `<template for="…">` (`replace` only)| `<template for="…">`     |
| `NativeAdapter`        | `<?start name>…<?end>` | `<template for>` + `insertAdjacentHTML` | `<template for="…">`  |

- **`Patch`** — fragment delivered inline in the same HTTP response as the shell. All adapters support all merge types; `WebPlatformAdapter` is `replace` only (WICG spec).
- **`Frame`** — fragment served as a standalone file fetched by the client (SSG). Always replace semantics.

#### `WebPlatformAdapter` vs `NativeAdapter`

Both use the [Declarative Partial Updates](https://developer.chrome.com/blog/declarative-partial-updates) API (`<?start>`/`<?end>` regions + `<template for>`).

| | `WebPlatformAdapter` | `NativeAdapter` |
| --- | --- | --- |
| Merge types | `replace` only (spec) | All (JS fallback for others) |
| Polyfill | User's choice — add to shell | Bundled minimal polyfill (injected automatically via `transformShell`) |
| JS required | No (native) / polyfill only | Minimal |

⚠️ Both require `chrome://flags/#enable-experimental-web-platform-features` in Chrome until the spec ships. `NativeAdapter` is the recommended choice for production — it is self-contained and works in all modern browsers.

## Usage

### Streaming (server pushes fragments)

```tsx
import { renderToReadableStream, TurboAdapter, Island } from "@cjean-fr/jsx-flow";

const stream = await renderToReadableStream(
  () => (
    <main>
      <header>Fast</header>
      <Island fallback={<p>Loading…</p>}>
        {() => <HeavyDashboard />}
      </Island>
    </main>
  ),
  TurboAdapter,
);

// stream is a ReadableStream<string> — pipe it to the HTTP response
```

### Static (client fetches fragments)

Fragment files must use `adapter.Frame` — the lazy-load format — not `Patch` which is for inline streaming.

```tsx
import { renderToStatic, TurboAdapter, Island } from "@cjean-fr/jsx-flow";
import { renderToString } from "@cjean-fr/jsx-string";

const generatePath = (id: string) => `/fragments/${id}.html`;

const { pages, collected } = await renderToStatic(
  async ({ collected }) => {
    const html = await renderToString(<App />); // <Island> auto-generates src via generatePath
    return { pages: new Map([["/index.html", html]]), collected };
  },
  TurboAdapter,
  generatePath,
);

// Build fragment files in the format the adapter expects for lazy-loading
const fragments = new Map<string, string>();
for (const [id, { factory }] of collected) {
  fragments.set(generatePath(id), await renderToString(
    TurboAdapter.Frame({ id, children: factory() }),
  ));
}
```

### Pushing fragments from plugins

Any code running inside the same `withScope` can register fragments imperatively via `enqueue`:

```ts
import { Fragments } from "@cjean-fr/jsx-flow";
import { useContext } from "@cjean-fr/jsx-string";

const { enqueue } = useContext(Fragments);
enqueue("badge-count", () => <span>{count}</span>);
enqueue("toast-list", () => <li>Saved</li>, "append");
```

### Low-level: manual scope

```ts
import { initFragments, streamFragments, TurboAdapter, Fragments } from "@cjean-fr/jsx-flow";
import { withScope, renderToString, useContext } from "@cjean-fr/jsx-string";

const html = await withScope(async () => {
  initFragments({ adapter: TurboAdapter, mode: "streaming" });
  const rendered = await renderToString(<App />);
  const { collected } = useContext(Fragments);
  // collected is available here for custom streaming logic
  return rendered;
});
```

## API

### Components

| Export    | Description                                                           |
| --------- | --------------------------------------------------------------------- |
| `Island`  | Renders a placeholder; delivers real content as a patch after the shell |
| `Patch`   | Renders nothing; pushes a fragment to an existing DOM target          |

### Orchestration

| Export                                           | Description                                                       |
| ------------------------------------------------ | ----------------------------------------------------------------- |
| `renderToReadableStream(fn, adapter)`            | Streams shell + fragments as a `ReadableStream<string>`           |
| `renderToStatic(handler, adapter, generatePath)` | Renders shell + fragment routes for static output                 |
| `render(handler, config)`                        | Runs `handler` inside an isolated scope with fragments initialized |
| `streamFragments(collected, adapter, cb)`        | Renders collected fragments and calls `cb(id, html)` for each     |
| `initFragments(config)`                          | Initializes the fragment context in the current `withScope`       |

### Context

| Export              | Description                                                   |
| ------------------- | ------------------------------------------------------------- |
| `Fragments`         | Context token — use with `useContext(Fragments)`              |
| `FragmentsContext`  | Type: `{ config, collected, nextId, enqueue }`                |
| `CollectedFragment` | Type: `{ factory: () => JSXNode, merge: MergeType }`         |

### Adapters & types

| Export                | Description                                                                 |
| --------------------- | --------------------------------------------------------------------------- |
| `TurboAdapter`        | Hotwire Turbo Streams — all merge types                                     |
| `HtmxAdapter`         | HTMX OOB swaps — all merge types                                            |
| `NativeAdapter`       | Declarative Partial Updates, all merge types, bundled polyfill              |
| `WebPlatformAdapter`  | Declarative Partial Updates, `replace` only, no bundled polyfill            |
| `PatchAdapter`        | Type: `{ Placeholder, Patch, Frame, transformShell? }`                      |
| `MergeType`           | `"replace" \| "append" \| "prepend" \| "before" \| "after"`                |
| `assertFragmentId`    | Validates a fragment id — use in custom plugins that call `enqueue` directly |

## License

MIT © Christophe Jean
