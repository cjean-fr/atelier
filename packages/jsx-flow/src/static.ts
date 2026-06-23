import type { Adapter } from "./adapters/index.js";
import type { FlowContext } from "./context.js";
import { withFlow } from "./context.js";
import { streamFlow } from "./streamFlow.js";
import { raw, renderToString, type JSXNode } from "@cjean-fr/jsx-string";

/**
 * Default adapter used when renderToStatic is called without an adapter.
 * Renders pure-static pages fine; any access to fragment encoding throws with a
 * clear message pointing to the missing option.
 *
 * Implemented as a `Proxy` so adding new members to `Adapter` never
 * requires a manual stub — every property access on this sentinel throws
 * except for the two that are legitimately read during normal flow.
 */
const NOOP_ADAPTER: Adapter = new Proxy({} as Adapter, {
  get(_, prop) {
    if (prop === "capabilities")
      return { streaming: false, merges: ["replace"] };
    if (prop === "transformShell") return undefined;
    throw new Error(
      "jsx-flow: fragments require an adapter. Pass { adapter } to renderToStatic.",
    );
  },
});

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
   * Materialize every pending fragment as a standalone file. Each fragment is
   * wrapped with `adapter.Frame` and rendered, so `html` is ready to write as
   * is; `url` is the path from `generatePath(id)`. Throws if no adapter was
   * configured.
   */
  emitFragments(
    cb: (id: string, url: string, html: string) => void | Promise<void>,
  ): Promise<void>;
}

export interface StaticOptions {
  /** Required if any page uses <Defer> with content, or you call ctx.emitFragments. */
  adapter?: Adapter;
  /** Fragment URL convention. Default: (id) => `/fragments/${id}.html`. */
  generatePath?: (id: string) => string;
}

/**
 * Static generation.
 *
 * For pure-static sites (no <Defer> content), call without options:
 * @example
 * await renderToStatic(async (ctx) => {
 *   for (const page of pages) {
 *     const html = await ctx.renderPage(() => page.component({ ... }));
 *     await Bun.write(page.outPath, "<!DOCTYPE html>\n" + html);
 *   }
 * });
 *
 * When pages use <Defer> with content, pass { adapter } and materialize
 * fragments — `emitFragments` wraps each one in `adapter.Frame` for you:
 * @example
 * await renderToStatic(async (ctx) => {
 *   for (const page of pages) {
 *     const html = await ctx.renderPage(() => page.component({ ... }));
 *     await Bun.write(page.outPath, "<!DOCTYPE html>\n" + html);
 *   }
 *   await ctx.emitFragments((id, url, html) => Bun.write("./out" + url, html));
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
            if (ev.type === "fragment") {
              const framed = await renderToString(
                adapter.Frame({ id: ev.id, children: raw(ev.html) }),
              );
              await cb(ev.id, generatePath(ev.id), framed);
            }
          });
        },
      };
      return handler(staticCtx);
    },
    { adapter, mode: "static", generatePath },
  );
}
