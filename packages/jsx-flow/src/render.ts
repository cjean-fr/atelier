import { type PatchAdapter, NativeAdapter } from "./adapters.js";
import {
  type FlowContext,
  type Config,
  createFlowContext,
  Flow,
} from "./context.js";
import type { FlowEvent, FlowOptions } from "./events.js";
import { streamFlow } from "./streamFlow.js";
import {
  renderToString,
  withContext,
  type ContextBinding,
  type JSXNode,
} from "@cjean-fr/jsx-string";

function withFlow<T>(
  handler: (ctx: FlowContext) => T,
  config: Config,
  bindings: readonly ContextBinding[] = [],
): Promise<T> {
  const ctx = createFlowContext(config);
  return withContext([Flow.with(ctx), ...bindings], () => handler(ctx));
}

const DEFAULT_GENERATE_PATH = (id: string) => `/fragments/${id}.html`;

/**
 * FlowContext extended for static generation.
 * `renderPage` applies `transformShell` so streaming and static produce the same
 * shell bytes for a given input.
 */
export interface StaticContext extends FlowContext {
  /**
   * Render a page node, applying adapter.transformShell if present.
   * `options.context` binds values for this page's render only. Fragments
   * registered during the render execute later, under the scope active when
   * `emitFragments` runs — page data they need belongs in their closure.
   */
  renderPage(
    node: () => JSXNode,
    options?: { context?: readonly ContextBinding[] },
  ): Promise<string>;
  /**
   * Render every pending fragment and pass it to `cb` as raw HTML (no adapter
   * wrapper). `url` is the path produced by `generatePath(id)`. For lazy-load
   * formats that need a wrapper (Turbo frames, Native templates), wrap with
   * `adapter.Frame` before writing.
   */
  emitFragments(
    cb: (id: string, url: string, html: string) => void | Promise<void>,
  ): Promise<void>;
}

export interface StaticOptions {
  /** Defaults to NativeAdapter. */
  adapter?: PatchAdapter;
  /** Fragment URL convention. Default: (id) => `/fragments/${id}.html`. */
  generatePath?: (id: string) => string;
  /** Bindings shared by every page of this build (e.g. the Vite manifest). */
  context?: readonly ContextBinding[];
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
  opts: FlowOptions & {
    mode?: "full" | "patches-only";
    /** Bindings installed for this render (shell, fragments and streams). */
    context?: readonly ContextBinding[];
  } = {},
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
      opts.context,
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
  opts?: FlowOptions & {
    mode?: "full" | "patches-only";
    context?: readonly ContextBinding[];
  },
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
 * When pages use <Deferred>, call `ctx.emitFragments` to materialize fragments.
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
 * });
 */
export async function renderToStatic<T>(
  handler: (ctx: StaticContext) => T,
  options?: StaticOptions,
): Promise<T> {
  const adapter = options?.adapter ?? NativeAdapter;
  const generatePath = options?.generatePath ?? DEFAULT_GENERATE_PATH;

  return withFlow(
    async (ctx) => {
      const staticCtx: StaticContext = {
        ...ctx,
        renderPage: async (node, pageOptions) => {
          const fragmentsBefore = ctx.fragments.size;
          const html = await renderToString(node, {
            context: pageOptions?.context,
          });
          const hasFragments = ctx.fragments.size > fragmentsBefore;
          return hasFragments && adapter.transformShell
            ? adapter.transformShell(html)
            : html;
        },
        emitFragments: async (cb) => {
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
    options?.context,
  );
}
