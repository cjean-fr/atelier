import { type PatchAdapter } from "./adapters.js";
import {
  type FlowContext,
  type Config,
  initFlow,
  Flow,
} from "./context.js";
import { streamFragments } from "./streamFragments.js";
import { injectIntoHead } from "./utils.js";
import {
  renderToString,
  withScope,
  useContext,
  type JSXNode,
} from "@cjean-fr/jsx-string";

function withFlow<T>(handler: (ctx: FlowContext) => T, config: Config): Promise<T> {
  return withScope(async function () {
    initFlow(config);
    return handler(useContext(Flow));
  });
}

async function flushHeadInto(head: Map<string, () => JSXNode>, html: string): Promise<string> {
  if (head.size === 0) return html;
  const results = await Promise.allSettled(
    [...head.values()].map(async (factory) => renderToString(factory())),
  );
  const headHtml = results
    .map((r) => {
      if (r.status === "rejected") {
        console.error("Error rendering head effect", { error: r.reason });
        return "";
      }
      return r.value;
    })
    .join("");
  return headHtml ? injectIntoHead(html, headHtml) : html;
}

/**
 * FlowContext extended for static generation.
 * renderPage applies the same head + adapter transforms that streaming does automatically,
 * making both modes symmetric.
 */
export interface StaticContext extends FlowContext {
  /**
   * Renders a page node with head effects and adapter transforms applied.
   *
   * @example
   * const html = await ctx.renderPage(() => <App />);
   */
  renderPage: (node: () => JSXNode) => Promise<string>;
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
    async function ({ channels }) {
      return new ReadableStream<string>({
        async start(controller) {
          const shell = await renderToString(node());

          let prepared = adapter.transformShell ? adapter.transformShell(shell) : shell;
          prepared = await flushHeadInto(channels.head, prepared);

          if (channels.fragment.size === 0) {
            controller.enqueue(`${prepared}\n`);
          } else {
            const match = prepared.match(/((?:<\/body>)?\s*<\/html>\s*)$/i);
            const closing = match?.[1] ?? "";
            const body = closing ? prepared.slice(0, -closing.length) : prepared;

            controller.enqueue(`${body}\n`);
            await streamFragments(channels.fragment, adapter, (_id, html) => {
              controller.enqueue(`${html}\n`);
            });
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
 * @example
 * const generatePath = (id: string) => `/fragments/${id}.html`;
 *
 * await renderToStatic(async (ctx) => {
 *   const html = await ctx.renderPage(() => <App />);
 *
 *   const fragments = new Map<string, string>();
 *   await streamFragments(ctx.channels.fragment, TurboAdapter, (id, content) => {
 *     fragments.set(generatePath(id), content);
 *   });
 *
 *   return { pages: new Map([["/index.html", html]]), fragments };
 * }, TurboAdapter, generatePath);
 */
export async function renderToStatic<T>(
  handler: (ctx: StaticContext) => T,
  adapter: PatchAdapter,
  generatePath: (id: string) => string,
): Promise<T> {
  return withFlow(
    async (ctx) => {
      const staticCtx: StaticContext = {
        ...ctx,
        renderPage: async (node: () => JSXNode) => {
          const html = await renderToString(node());
          const prepared = adapter.transformShell ? adapter.transformShell(html) : html;
          return flushHeadInto(ctx.channels.head, prepared);
        },
      };
      return handler(staticCtx);
    },
    { adapter, mode: "static", generatePath },
  );
}
