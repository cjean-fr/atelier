import { type PatchAdapter } from "./adapters.js";
import { type FlowContext, type Config, initFlow, Flow } from "./context.js";
import { streamFragments } from "./streamFragments.js";
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
   * Render every pending fragment via the configured adapter and pass each one
   * to `cb`. `url` is the path produced by `generatePath(id)`.
   * Throws if no adapter was configured.
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
 * @example
 * const stream = await renderToReadableStream(() => <App />, TurboAdapter);
 */
export async function renderToReadableStream(
  node: () => JSXNode,
  adapter: PatchAdapter,
): Promise<ReadableStream<string>> {
  return withFlow(
    async function ({ fragments, streams }) {
      return new ReadableStream<string>({
        async start(controller) {
          const shell = await renderToString(node());
          const prepared = adapter.transformShell
            ? adapter.transformShell(shell)
            : shell;

          if (fragments.size === 0 && streams.length === 0) {
            controller.enqueue(`${prepared}\n`);
          } else {
            const match = prepared.match(/((?:<\/body>)?\s*<\/html>\s*)$/i);
            const closing = match?.[1] ?? "";
            const before = closing
              ? prepared.slice(0, -closing.length)
              : prepared;

            controller.enqueue(`${before}\n`);
            await streamFragments(
              fragments,
              adapter,
              (_id, html) => {
                controller.enqueue(`${html}\n`);
              },
              streams,
            );
            controller.enqueue(`${closing}\n`);
          }

          controller.close();
        },
      });
    },
    { adapter, mode: "streaming" },
  );
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
 * When pages use <Deferred>, pass { adapter } and materialize fragments:
 * @example
 * await renderToStatic(async (ctx) => {
 *   for (const page of pages) {
 *     const html = await ctx.renderPage(() => page.component({ ... }));
 *     await Bun.write(page.outPath, "<!DOCTYPE html>\n" + html);
 *   }
 *   await ctx.emitFragments(async (_id, url, html) => {
 *     await Bun.write("./out" + url, html);
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
          await streamFragments(
            ctx.fragments,
            adapter,
            async (id, html) => {
              await cb(id, generatePath(id), html);
            },
            ctx.streams,
          );
        },
      };
      return handler(staticCtx);
    },
    { adapter, mode: "static", generatePath },
  );
}
