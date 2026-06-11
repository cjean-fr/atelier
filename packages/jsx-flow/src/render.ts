import { type PatchAdapter } from "./adapters.js";
import { type FlowContext, type Config, initFlow, Flow } from "./context.js";
import type { FlowEvent, FlowOptions } from "./events.js";
import { streamFlow } from "./streamFlow.js";
import {
  renderToString,
  withScope,
  useContext,
  type JSXNode,
} from "@cjean-fr/jsx-string";

function withFlow<T>(
  handler: (ctx: FlowContext) => T,
  config: Config,
): Promise<T> {
  return withScope(async function () {
    initFlow(config);
    return handler(useContext(Flow));
  });
}

/**
 * Default adapter used when renderToStatic is called without an adapter.
 * Renders pure-static pages fine; any access to deferred-fragment encoding throws
 * with a clear message pointing to the missing option.
 */
const NOOP_ADAPTER: PatchAdapter = {
  Placeholder: () => {
    throw new Error(
      "jsx-flow: <Deferred> requires an adapter. Pass { adapter } to renderToStatic.",
    );
  },
  Patch: () => {
    throw new Error(
      "jsx-flow: deferred fragments require an adapter. Pass { adapter } to renderToStatic.",
    );
  },
  Frame: () => {
    throw new Error(
      "jsx-flow: deferred fragments require an adapter. Pass { adapter } to renderToStatic.",
    );
  },
  encode: () => {
    throw new Error(
      "jsx-flow: encode requires an adapter. Pass { adapter } to renderToReadableStream.",
    );
  },
};

const DEFAULT_GENERATE_PATH = (id: string) => `/fragments/${id}.html`;

/**
 * FlowContext extended for static generation.
 * `renderPage` applies `transformShell` so streaming and static produce the same
 * shell bytes for a given input.
 */
export interface StaticContext extends FlowContext {
  /** Render a page node, applying adapter.transformShell if present. */
  renderPage(node: () => JSXNode): Promise<string>;
  /**
   * Render every pending fragment and pass it to `cb` as raw HTML (no adapter
   * wrapper). `url` is the path produced by `generatePath(id)`. For lazy-load
   * formats that need a wrapper (Turbo frames, Native templates), wrap with
   * `adapter.Frame` before writing. Throws if no adapter was configured.
   */
  emitFragments(
    cb: (id: string, url: string, html: string) => void | Promise<void>,
  ): Promise<void>;
}

export interface StaticOptions {
  /** Required if any page uses <Deferred> or you call ctx.emitFragments. */
  adapter?: PatchAdapter;
  /** Fragment URL convention. Default: (id) => `/fragments/${id}.html`. */
  generatePath?: (id: string) => string;
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
  adapter: PatchAdapter,
  opts: FlowOptions & { mode?: "full" | "patches-only" } = {},
): ReadableStream<FlowEvent> {
  const internal = new AbortController();
  const signal = opts.signal
    ? AbortSignal.any([opts.signal, internal.signal])
    : internal.signal;
  let controller!: ReadableStreamDefaultController<FlowEvent>;
  const waiters: Array<() => void> = [];
  const flushWaiters = () => {
    for (const r of waiters.splice(0)) r();
  };
  signal.addEventListener("abort", flushWaiters, { once: true });

  const emit = async (ev: FlowEvent) => {
    if (signal.aborted) return;
    controller.enqueue(ev);
    while ((controller.desiredSize ?? 1) <= 0 && !signal.aborted)
      await new Promise<void>((r) => waiters.push(r));
  };

  const run = () =>
    withFlow(
      async ({ fragments, streams }) => {
        if (signal.aborted) return;
        const shell = await renderToString(node());
        const match = shell.match(/((?:<\/body>)?\s*<\/html>\s*)$/i);
        const closing = match?.[1] ?? "";
        if (opts.mode !== "patches-only") {
          const body = closing ? shell.slice(0, -closing.length) : shell;
          await emit({
            type: "shell",
            html: adapter.transformShell ? adapter.transformShell(body) : body,
          });
        }
        await streamFlow({ fragments, streams }, emit, { ...opts, signal });
        if (opts.mode !== "patches-only" && closing)
          await emit({ type: "close", html: closing });
      },
      { adapter, mode: "streaming" },
    );

  return new ReadableStream<FlowEvent>({
    start(c) {
      controller = c;
      run().then(
        () => {
          try {
            c.close();
          } catch {}
        },
        (e) => {
          try {
            c.error(e);
          } catch {}
        },
      );
    },
    pull() {
      flushWaiters();
    },
    cancel(reason) {
      internal.abort(reason);
    },
  });
}

/**
 * @example
 * const stream = renderToReadableStream(() => <App />, TurboAdapter);
 * // stream is a ReadableStream<string>
 */
export function renderToReadableStream(
  node: () => JSXNode,
  adapter: PatchAdapter,
  opts?: FlowOptions & { mode?: "full" | "patches-only" },
): ReadableStream<string> {
  return renderToFlowEvents(node, adapter, opts).pipeThrough(adapter.encode());
}

/**
 * Static generation.
 *
 * For pure-static sites (no <Deferred>), call without options:
 * @example
 * await renderToStatic(async (ctx) => {
 *   for (const page of pages) {
 *     const html = await ctx.renderPage(() => page.component({ ... }));
 *     await Bun.write(page.outPath, "<!DOCTYPE html>\n" + html);
 *   }
 * });
 *
 * When pages use <Deferred>, pass { adapter } and materialize fragments.
 * `html` is the raw fragment — wrap it with `adapter.Frame` so the lazy-load
 * mechanism can target the placeholder:
 * @example
 * await renderToStatic(async (ctx) => {
 *   for (const page of pages) {
 *     const html = await ctx.renderPage(() => page.component({ ... }));
 *     await Bun.write(page.outPath, "<!DOCTYPE html>\n" + html);
 *   }
 *   await ctx.emitFragments(async (id, url, html) => {
 *     const framed = NativeAdapter.Frame({ id, children: raw(html) });
 *     await Bun.write("./out" + url, await renderToString(framed));
 *   });
 * }, { adapter: NativeAdapter });
 */
export async function renderToStatic<T>(
  handler: (ctx: StaticContext) => T,
  options?: StaticOptions,
): Promise<T> {
  const adapter = options?.adapter ?? NOOP_ADAPTER;
  const generatePath = options?.generatePath ?? DEFAULT_GENERATE_PATH;
  const hasAdapter = adapter !== NOOP_ADAPTER;

  return withFlow(
    async (ctx) => {
      const staticCtx: StaticContext = {
        ...ctx,
        renderPage: async (node) => {
          const html = await renderToString(node());
          return adapter.transformShell ? adapter.transformShell(html) : html;
        },
        emitFragments: async (cb) => {
          if (!hasAdapter) {
            throw new Error(
              "jsx-flow: emitFragments requires an adapter. Pass { adapter } to renderToStatic.",
            );
          }
          await streamFlow(ctx, async (ev) => {
            if (ev.type === "patch") {
              await cb(ev.id, generatePath(ev.id), ev.html);
            }
          });
        },
      };
      return handler(staticCtx);
    },
    { adapter, mode: "static", generatePath },
  );
}
