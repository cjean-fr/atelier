import { NativeAdapter, type Adapter } from "./adapters.js";
import { withFlow } from "./context.js";
import { createFlowStream } from "./create-flow-stream.js";
import { streamFlow } from "./streamFlow.js";
import type { FlowEvent, FlowOptions, StreamingAdapter } from "./types.js";
import { renderToString, type JSXNode } from "@cjean-fr/jsx-string";

/**
 * Render the page shell: run the node factory, strip closing `</body></html>`
 * tags, and apply `adapter.transformShell` if present.
 *
 * @returns The transformed shell body (minus closing tags) and the raw closing
 *   tag, so callers can emit them as separate `shell` / `close` events.
 *
 * @example
 * const { shellBody, closingTag } = await renderShell(() => <App />, adapter);
 * // shellBody: "<html><body><p>hi</p>"
 * // closingTag: "\n</body>\n</html>"
 */
export async function renderShell(
  node: () => JSXNode,
  adapter: { transformShell?: (html: string) => string },
): Promise<{ shellBody: string; closingTag: string }> {
  const shell = await renderToString(node());
  const match = shell.match(/((?:<\/body>)?\s*<\/html>\s*)$/);
  const closingTag = match?.[1] ?? "";
  const body = closingTag ? shell.slice(0, -closingTag.length) : shell;
  const shellBody = adapter.transformShell
    ? adapter.transformShell(body)
    : body;
  return { shellBody, closingTag };
}

/**
 * Run the full streaming sequence: emit shell → drain fragments → emit close.
 * Skips shell/close when `opts.mode === "fragment"`.
 *
 * Encapsulates the three‑step orchestration so `renderToFlowEvents` focuses on
 * stream lifecycle.
 */
export async function orchestrateFlow(
  emit: (ev: FlowEvent) => Promise<void>,
  signal: AbortSignal,
  node: () => JSXNode,
  adapter: Adapter,
  opts: FlowOptions & { mode?: "full" | "fragment" },
): Promise<void> {
  await withFlow(
    async ({ pendingStore }) => {
      try {
        if (signal.aborted) return;
        const { shellBody, closingTag } = await renderShell(node, adapter);
        if (opts.mode !== "fragment") {
          await emit({ type: "shell", html: shellBody });
        }
        await streamFlow({ pendingStore }, emit, { ...opts, signal });
        if (opts.mode !== "fragment" && closingTag) {
          await emit({ type: "close", html: closingTag });
        }
      } finally {
        pendingStore.clear();
      }
    },
    { adapter, mode: "streaming" },
  );
}

/**
 * Return a `ReadableStream<FlowEvent>` with proper backpressure and cancellation.
 *
 * - `pull()` is called by the consumer; `emit()` waits when `desiredSize <= 0`.
 * - `cancel(reason)` and `opts.signal` both feed one combined `AbortSignal`
 *   (pre-aborted signals included), which stops fragment rendering, generator
 *   iteration, and releases any producer parked on backpressure.
 */
export function renderToFlowEvents(
  node: () => JSXNode,
  adapter: StreamingAdapter = NativeAdapter,
  opts: FlowOptions & { mode?: "full" | "fragment" } = {},
): ReadableStream<FlowEvent> {
  return createFlowStream(
    (emit, signal) => orchestrateFlow(emit, signal, node, adapter, opts),
    { signal: opts.signal },
  );
}

/**
 * Render to a `ReadableStream<string>` of adapter-encoded HTML — the shell
 * followed by each fragment as wire-format markup. This is the stream you
 * put in an HTTP response body. Defaults to `NativeAdapter`;
 * non-streaming adapters (ESI) are rejected at compile time.
 *
 * @example
 * const stream = renderStream(() => <App />);            // NativeAdapter
 * const stream = renderStream(() => <App />, TurboAdapter);
 */
export function renderStream(
  node: () => JSXNode,
  adapter: StreamingAdapter = NativeAdapter,
  opts?: FlowOptions & { mode?: "full" | "fragment" },
): ReadableStream<string> {
  return renderToFlowEvents(node, adapter, opts).pipeThrough(adapter.encode());
}
