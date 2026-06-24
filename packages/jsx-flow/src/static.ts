import { NativeAdapter, type Adapter } from "./adapters/index.js";
import type { FlowContext } from "./context.js";
import { withFlow } from "./context.js";
import { streamFlow } from "./streamFlow.js";
import { raw, renderToString, type JSXNode } from "@cjean-fr/jsx-string";

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
   * is; `url` is the path from `generatePath(id)`. Uses NativeAdapter framing
   * unless another adapter was configured.
   */
  emitFragments(
    cb: (id: string, url: string, html: string) => void | Promise<void>,
  ): Promise<void>;
}

export interface StaticOptions {
  /** Wire-format adapter for fragment framing. Defaults to NativeAdapter. */
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
  const adapter = options?.adapter ?? NativeAdapter;
  const generatePath = options?.generatePath ?? DEFAULT_GENERATE_PATH;

  return withFlow(
    async (ctx) => {
      const staticCtx: StaticContext = {
        ...ctx,
        renderPage: async (node) => {
          const html = await renderToString(node());
          return adapter.transformShell
            ? adapter.transformShell(html, ctx)
            : html;
        },
        emitFragments: async (cb) => {
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
