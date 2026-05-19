# @cjean-fr/jsx-string-island

Islands plugin for [@cjean-fr/jsx-string](https://github.com/cjean-fr/atelier/tree/main/packages/jsx-string).

## Boundary with `jsx-string`

| `@cjean-fr/jsx-string`    | `@cjean-fr/jsx-string-island`                  |
| ------------------------- | ---------------------------------------------- |
| Renders JSX → HTML string | Streams HTML + client-side hydration           |
| Server-only, zero runtime | Emits `<script>` placeholders + hydration code |
| `renderToString()`        | `<Island />` deferred rendering                |
| Context via `withScope()` | Adapters (Turbo, HTMX) for DOM orchestration   |

Use `jsx-string` alone for SSG, emails, pure SSR. Add `jsx-string-island` when you need progressive enhancement or partial hydration on the client.

## Features

- **Two render modes**: `streaming` (server pushes fragments) and `static` (client fetches each fragment via `src`)
- **Interchangeable adapters**: Turbo Streams, HTMX, or any DOM orchestrator
- **Islands pattern**: Deferred rendering of JSX components via `<Island>`

## Installation

```bash
bun add @cjean-fr/jsx-string-island
```

## Usage

### Configuration

```ts
import {
  defineConfig,
  withIslandsPlugin,
  Island,
} from "@cjean-fr/jsx-string-island";

const config = defineConfig({
  adapter: TurboAdapter,
  mode: "streaming",
});
```

### Rendering

```ts
import { withContext, renderToStringAsync } from "@cjean-fr/jsx-string";
import { withIslandsPlugin, Island } from "@cjean-fr/jsx-string-island";

await withContext(async () => {
  withIslandsPlugin(config);

  const html = await renderToStringAsync(
    <Island fallback={<Spinner />}>
      {() => <HeavyComponent />}
    </Island>
  );
});
```

### Streaming

```ts
import { streamIslands } from "@cjean-fr/jsx-string-island";

await withContext(async () => {
  withIslandsPlugin(config);
  await renderToStringAsync(<App />);

  const { useIslands } = require("@cjean-fr/jsx-string-island");
  const islands = useIslands();

  await streamIslands(islands, config.adapter, (id, html) => {
    // push to stream
  });
});
```

## Adapters

- `TurboAdapter` — Turbo Streams
- `HtmxAdapter` — HTMX
- `NativeAdapter` — [Chrome Declarative Partial Updates](https://developer.chrome.com/blog/declarative-partial-updates)

### NativeAdapter

Uses the browser's native declarative partial updates API — no framework dependency required.

**Streaming mode** — the server pushes `<template for="id">` fragments in the same HTTP stream, and the browser replaces `<?start name="id">…<?end>` placeholders declaratively.

**Static mode** — each island placeholder emits a `<script>` that calls `fetch(src)` and streams the response into the document via `document.body.streamAppendHTML()`. The server route at `src` must return a `<template for="id">…</template>` fragment.

> **Browser support**: requires Chrome 130+ or the [`template-for-polyfill`](https://www.npmjs.com/package/template-for-polyfill) and [`html-setters-polyfill`](https://www.npmjs.com/package/html-setters-polyfill) packages.

## License

MIT
