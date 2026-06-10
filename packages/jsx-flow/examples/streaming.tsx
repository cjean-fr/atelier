// @jsxImportSource @cjean-fr/jsx-string
/**
 * Demo: streaming SSR with the Native Declarative Partial Updates adapter
 *
 * Run: bun examples/streaming.tsx
 *
 * Open http://localhost:3080 — the shell loads instantly, then the slow
 * sections stream in as <template for="id"> elements that the browser
 * applies to the <?start name="id"> regions.
 *
 * Native in Chrome 130+. The MutationObserver polyfill below covers
 * other modern browsers.
 */
import {
  Deferred,
  Generator,
  renderToReadableStream,
  NativeAdapter,
} from "../src/index.js";

// Slow async components

async function SlowStats() {
  await Bun.sleep(800);
  return (
    <div class="stats">
      <strong>1 234</strong> users · <strong>56</strong> online
    </div>
  );
}

async function SlowFeed() {
  await Bun.sleep(1200);
  return (
    <ul>
      <li>Article published — 2 min ago</li>
      <li>New signup — 5 min ago</li>
      <li>Deploy succeeded — 12 min ago</li>
    </ul>
  );
}

// Live sequence: each yield is patched into #events as it arrives.
async function* liveEvents() {
  const events = ["Build started", "Tests green", "Deployed to prod"];
  for (const e of events) {
    await Bun.sleep(600);
    yield <li>{e}</li>;
  }
}

// Shell

function Shell() {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>jsx-flow · streaming demo</title>
        {/* NativeAdapter injects its minimal polyfill automatically via transformShell. */}
        <style>{`
          body { font-family: sans-serif; max-width: 640px; margin: 2rem auto; padding: 0 1rem; }
          .placeholder { color: #aaa; font-style: italic; }
          .stats, ul { border: 1px solid #e5e7eb; border-radius: 8px; padding: 1rem; }
        `}</style>
      </head>
      <body>
        <h1>Dashboard</h1>

        <h2>Stats</h2>
        <Deferred fallback={<p class="placeholder">Loading stats…</p>}>
          {() => <SlowStats />}
        </Deferred>

        <h2>Activity feed</h2>
        <Deferred fallback={<p class="placeholder">Loading feed…</p>}>
          {() => <SlowFeed />}
        </Deferred>

        <h2>Live events</h2>
        <ul id="events" />
        <Generator target="events" source={() => liveEvents()} />
      </body>
    </html>
  );
}

Bun.serve({
  port: 3080,
  async fetch() {
    const stream = renderToReadableStream(() => <Shell />, NativeAdapter);
    return new Response(stream.pipeThrough(new TextEncoderStream()), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  },
});

console.log("Streaming demo → http://localhost:3080");
