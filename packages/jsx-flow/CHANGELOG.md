# @cjean-fr/jsx-flow

## 1.0.0

> 🚧 Early development — API may change.

### Added

- **`<Defer>` / `<Fill>` / `<Slot>` API**: Replaces the old `Island` / `Patch`
  naming. `Defer` declares a deferred region with a fallback placeholder;
  `Fill` pushes content into a named slot; `Slot` declares an insertion point
  with optional default content.
- **`<ClientFetch>` component**: Declarative client-side fragment fetching
  without inline scripts (CSP-friendly).
- **`renderStream()`**: New streaming entry point that returns a
  `ReadableStream<string>` of adapter-encoded HTML. Replaces
  `renderToReadableStream`.
- **`renderToFlowEvents()`**: Lower-level stream of semantic `FlowEvent`
  objects (`shell` / `fragment` / `close`).
- **`renderToStatic()`**: Static generation entry point with
  `StaticContext.renderPage()` and `emitFragments()` for materializing
  deferred content as standalone files.
- **`serve()`**: HTTP helper that builds a `Response` from a page function,
  with built-in HTMX/Unpoly negotiation and header management.
- **`negotiateHtmx()` / `negotiateUnpoly()`**: Request negotiation helpers
  that read `HX-Target` / `X-Up-Target` headers and set `Vary` correctly.
- **`composeShell()`**: Chains multiple `transformShell` functions (left to
  right), skipping falsy entries.
- **`injectIntoHead()`**: Inserts markup before `</head>`.
- **`EsiAdapter`**: CDN-level ESI composition (`esi:include` /
  `esi:inline`). Static-only, replace-only.
- **`createAdapter()`**: Factory to build a custom adapter with partial
  override of an existing one.
- **`NATIVE_POLYFILL` / `nativePolyfillHash()`**: CSP-ready polyfill source
  with a stable `sha256-` hash for `script-src` policies.
- **NativeAdapter declarative patches**: All merge types now emit declarative
  `<template>` markup instead of per-fragment `<script>` tags — fully
  CSP-compatible.
- **`assertFragmentId()`**: Validates fragment IDs against a strict pattern.
- **`AbortSignal` support**: `signal` option on all streaming paths; reader
  cancel stops infinite generators cleanly.
- **Backpressure**: Producer parks while consumer pauses, preventing
  unbounded buffering.
- **`onError` callback**: Per-fragment error handling with `fragment` /
  `stream` kind distinction.
- **`EsiAdapter` encodes ESI safely**: URL-escapes the `src` attribute.

### Changed

- **Complete architecture rewrite**: New internal modules (`create-flow-stream`,
  `streamFlow`, `fragment-runner`, `types`, `http`, `static`, `adapters`).
  The old `streamFragments`, `Island`, `Patch`, and monolithic `render.ts` are
  removed.
- **`streamFlow`**: Replacement for `streamFragments`. Drains pending work in
  waves: one-shots barrier-first, streams run concurrently, continues until
  quiescence.
- **Public API re-exports**: Clean, flat surface in `index.ts` — all
  components, adapters, and utilities export from the package root.
- **Adapter interface split**: `Adapter` (base) vs `StreamingAdapter`
  (requires `capabilities.streaming: true`). Non-streaming adapters (ESI)
  are rejected at compile time.
- **`renderShell()`**: Extracted shell rendering into a shared function used
  by both streaming and static paths.

### Removed

- **`Island` component** → use `<Defer>`.
- **`Patch` component** → use `<Fill>`.
- **`renderToReadableStream`** → use `renderStream`.
- **`streamFragments`** → use `streamFlow` (internal).
