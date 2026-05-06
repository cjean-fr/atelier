# @cjean-fr/jsx-string-island

Islands plugin for [@cjean-fr/jsx-string](https://github.com/cjean-fr/atelier/tree/main/packages/jsx-string).

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

## License

MIT
