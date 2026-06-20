# @cjean-fr/atelier — domain vocabulary

## Rendering core (`@cjean-fr/jsx-string`)

| Term | Definition |
|------|-----------|
| **renderToString** | Renders a JSX tree to a full HTML string. Returns `Promise<string>`. Entry point of the core. |
| **RawString** / **raw()** | Trusted HTML wrapper that bypasses escaping. The escape hatch — any string wrapped in `raw()` is rendered verbatim. |
| **Fragment** | JSX fragment (`<></>`), rendered as empty string (just children). |
| **renderElement** | Builds an HTML element string from tag + props + children. Validates tag names, applies escaping. |
| **renderAttributes** | Serializes JSX props to HTML attribute string. Handles event filtering, URL safety, style objects, boolean attrs. |
| **renderChild** / **toRenderString** | Converts any JSXNode to its string representation. Coerces null/boolean/string/number/RawString/Array/Promise/Iterable. |
| **escapeContent** / **escapeAttr** | HTML escaping: `& < >` for content, plus `"` for attributes. Two-stage fast-path + manual loop. |
| **context** / **setContext** / **useContext** / **withScope** | Async-scoped context API backed by `AsyncLocalStorage`. Used for per-request state without passing it through props. |
| **withScope** | Creates an isolated AsyncLocalStorage scope. Each render call runs in its own scope. |
| **snapshot** | Captures current scope state for seeding sub-scopes. |
| **jsxTemplate** / **jsxAttr** / **jsxEscape** | Deno-style precompile runtime helpers. Tagged template for static HTML, `jsxAttr` for attributes, `jsxEscape` for dynamic children. |
| **precompile** | Build-time transform that converts static JSX elements into `jsxTemplate` tagged template literals. Zero runtime overhead for static content. |
| **secure mode** | Precompile mode that loads the runtime's `jsxAttr` at build time for build-time sanitization of static attributes. |

## Streaming & fragments (`@cjean-fr/jsx-flow`)

| Term | Definition |
|------|-----------|
| **shell** | Initial page HTML sent before deferred content. Contains layout, navigation, above-the-fold content. |
| **fragment** | A unit of deferred content that replaces or modifies a placeholder in the shell. One-shot (Promise) or stream (AsyncIterable). |
| **defer** / **`<Defer>`** | Declares a deferred region with a placeholder in the shell. Content renders asynchronously and patches in when ready. |
| **fill** / **`<Fill>`** | Pushes content into a named slot. Renders nothing itself — pure registration. |
| **slot** / **`<Slot>`** | Declares a named insertion point in the shell. Optional default content. |
| **pending store** | Internal `Map<id, Pending>` that collects all deferred work during render. Drained by `streamFlow`. |
| **streamFlow** | Drain loop that processes the pending store in waves: one-shots barrier-first, streams run concurrently, loops until quiescence. |
| **FlowEvent** | Semantic streaming event: `{ type: "shell" | "fragment" | "close" }`. Emitted before adapter encoding. |
| **FlowContext** | Per-render-scope object: `{ config, pendingStore, nextId, defer }`. Carried through `useContext(Flow)`. |
| **adapter** | Wire format strategy. Each adapter implements `Placeholder`/`Patch`/`Frame` (JSX components) + `encode` (stream transform) + `capabilities`. |
| **merge** | How fragment content applies to its target DOM element: `replace` (default), `append`, `prepend`, `before`, `after`. |
| **capabilities** | What a wire format can express: `{ streaming: boolean, merges: MergeType[] }`. Gated at compile time and fail-fast at registration. |
| **transformShell** | Post-processing function `(html: string) => string` applied to the shell before it enters the stream (e.g., inject `<title>`, polyfill). |
| **encode** | Adapter method that transforms a `ReadableStream<FlowEvent>` into `ReadableStream<string>` (the wire format). |
| **NativeAdapter** | Default adapter. Uses WICG Declarative Partial Updates + a bundled ~550B MutationObserver polyfill. All merge types. |
| **TurboAdapter** | Hotwire Turbo Streams wire format: `<turbo-frame>` placeholders, `<turbo-stream>` patches. |
| **HtmxAdapter** | HTMX OOB swaps wire format: `<div hx-get>` placeholders, `<div hx-swap-oob>` patches. |
| **EsiAdapter** | CDN-level ESI composition. Static only (`streaming: false`), `replace` only. |
| **WebPlatformAdapter** | Pure WICG spec (`<?start>`/`<?end>` + `<template htmlFor>`), zero JS. `replace` only. |
| **renderStream** | Streaming entry point: renders a page function to `ReadableStream<string>`. Takes an adapter and options. |
| **renderToStatic** | Static generation entry point: runs a handler with `StaticContext` for rendering pages and emitting fragment files. |
| **StaticContext** | Extends `FlowContext` with `renderPage(node)` and `emitFragments(cb)`. |
| **serve** | HTTP helper: builds a `Response` from a page, with optional negotiation (HTMX/Unpoly). |
| **composeShell** | Chains multiple `transformShell` functions left-to-right, skipping falsy entries. |
| **injectIntoHead** | Inserts markup before `</head>`. Building block for shell transforms. |

## Precompile toolchain

| Term | Definition |
|------|-----------|
| **precompile-core** | AST-agnostic shared helpers: whitespace collapse, tag/attribute classification, attribute name mapping. |
| **vite-plugin-precompile** | Vite plugin (`enforce: "pre"`) that runs the precompile transform before esbuild. Uses oxc-parser. |
| **babel-plugin-precompile** | Babel plugin equivalent for non-Vite setups. Uses `@babel/types` AST. |

## Monorepo conventions

| Term | Definition |
|------|-----------|
| **workspace catalog** | Shared dependency versions in root `package.json` `workspaces.catalog`, referenced by `catalog:` protocol. |
| **Turborepo** | Build orchestrator. Tasks: `build`, `check` (typecheck), `test`, `format`, `dev`. |
| **bunup** | Bundler for packages. Each package has its own build script. |
| **dogfooding** | The doc site (`jsx-string-doc`) uses all the packages it documents. |
