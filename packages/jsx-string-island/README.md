# @cjean-fr/jsx-string-island

> 🚧 **Early development — API may change.** Version 0.1.0.

Islands extension for [@cjean-fr/jsx-string](../jsx-string). Adds deferred rendering and streaming or static fragment delivery on top of a standard `renderToString` response.

## When to use

Use `jsx-string` alone for SSG, emails, and pure SSR. Add `jsx-string-island` when you need **progressive enhancement**: the initial HTML loads fast with placeholders, and heavy components are rendered separately and swapped in without a full-page reload.

| `@cjean-fr/jsx-string`    | `@cjean-fr/jsx-string-island`                   |
| ------------------------- | ----------------------------------------------- |
| Renders JSX → HTML string | Adds `<Island>` placeholders + fragment streams |
| Server-only, zero runtime | Emits adapter-specific markup for DOM updates   |
| `renderToString()`        | `renderToReadableStream()` / `renderToStatic()` |
| Context via `withScope()` | Adapters: Turbo Streams, HTMX, NativeDOM        |

## Install

```bash
bun add @cjean-fr/jsx-string-island
```

## Concepts

### Islands

An `<Island>` is a component whose rendering is deferred. During the initial render it emits a placeholder (managed by the adapter). After the main HTML is sent, each island is rendered concurrently and its fragment is delivered to the client.

```tsx
import { Island } from "@cjean-fr/jsx-string-island";

// Static mode: client fetches the fragment from `src`
<Island src="/fragments/heavy" fallback={<Spinner />} />

// Streaming mode: server pushes the fragment in the same response
<Island fallback={<Spinner />}>
  {() => <HeavyComponent />}
</Island>
```

### Adapters

Adapters control how placeholders and fragments are expressed in HTML.

| Adapter         | Placeholder            | Fragment delivery   |
| --------------- | ---------------------- | ------------------- |
| `TurboAdapter`  | `<turbo-frame>`        | `<turbo-stream>`    |
| `HtmxAdapter`   | `<div hx-get>`         | `<div hx-swap-oob>` |
| `NativeAdapter` | `<?start name>…<?end>` | `<template for>`    |

`NativeAdapter` uses Chrome's [Declarative Partial Updates](https://developer.chrome.com/blog/declarative-partial-updates) (Chrome 130+). For broader support add [`template-for-polyfill`](https://www.npmjs.com/package/template-for-polyfill) and [`html-setters-polyfill`](https://www.npmjs.com/package/html-setters-polyfill).

## Usage

### Streaming (server pushes fragments)

```ts
import { renderToReadableStream, TurboAdapter } from "@cjean-fr/jsx-string-island";
import { Island } from "@cjean-fr/jsx-string-island";

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

```ts
import {
  renderToStatic,
  streamIslands,
  NativeAdapter,
} from "@cjean-fr/jsx-string-island";
import { renderToString } from "@cjean-fr/jsx-string";

const { pages, fragments } = await renderToStatic(
  async ({ collected, generatePath }) => {
    const html = await renderToString(
      <Island src={generatePath("dashboard")} fallback={<p>Loading…</p>} />,
    );
    const fragments = new Map<string, string>();
    await streamIslands(collected, NativeAdapter, (id, html) => {
      fragments.set(generatePath(id), html);
    });
    return { pages: new Map([["/index.html", html]]), fragments };
  },
  NativeAdapter,
  (id) => `/fragments/${id}.html`,
);
```

### Low-level: manual scope

```ts
import {
  initIslands,
  streamIslands,
  TurboAdapter,
} from "@cjean-fr/jsx-string-island";
import { withScope, renderToString } from "@cjean-fr/jsx-string";

const html = await withScope(async () => {
  initIslands({ adapter: TurboAdapter, mode: "streaming" });
  return renderToString(<App />);
});
```

## API

| Export                                           | Description                                                      |
| ------------------------------------------------ | ---------------------------------------------------------------- |
| `Island`                                         | Component that registers a deferred render slot                  |
| `initIslands(config)`                            | Initializes island context in the current `withScope`            |
| `render(handler, config)`                        | Runs `handler` inside an isolated scope with islands initialized |
| `renderToReadableStream(fn, adapter)`            | Streams shell + island fragments as a `ReadableStream<string>`   |
| `renderToStatic(handler, adapter, generatePath)` | Renders shell + island routes for static output                  |
| `streamIslands(collected, adapter, cb)`          | Renders collected islands and calls `cb(id, html)` for each      |
| `TurboAdapter`                                   | Adapter for Hotwire Turbo Streams                                |
| `HtmxAdapter`                                    | Adapter for HTMX                                                 |
| `NativeAdapter`                                  | Adapter for Chrome Declarative Partial Updates                   |

## License

MIT
