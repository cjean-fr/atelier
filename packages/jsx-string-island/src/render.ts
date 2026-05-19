import { type IslandAdapter } from "./adapters.js";
import {
  type IslandsPluginContext,
  type Config,
  initIslands,
  Islands,
} from "./context.js";
import { streamIslands } from "./streamIslands.js";
import {
  renderToString,
  withScope,
  useContext,
  type JSXNode,
} from "@cjean-fr/jsx-string";

export async function render<T>(
  handler: (ctx: IslandsPluginContext) => T,
  config: Config,
): Promise<T> {
  return await withScope(async function () {
    initIslands(config);
    return handler(useContext(Islands));
  });
}

/**
 *
 * @example
 * renderToReadableStream(() => <App />, TurboAdapter);
 */
export async function renderToReadableStream(
  node: () => JSXNode,
  adapter: IslandAdapter,
): Promise<ReadableStream<string>> {
  return render(
    async function ({ collected }) {
      return new ReadableStream<string>({
        async start(controller) {
          const shell = await renderToString(node());
          controller.enqueue(`${shell}\n`);
          await streamIslands(collected, adapter, (_id, html) => {
            controller.enqueue(`${html}\n`);
          });
          controller.close();
        },
      });
    },
    { adapter, mode: "streaming" },
  );
}

/**
 *
 * @example
 * renderToStatic(async ({ collected, generatePath }) => {
 *   const pages = new Map();
 *   const fragments = new Map();
 *   pages.set('/page1.html', await renderToStringAsync(<Page name="page1" />));
 *   pages.set('/page2.html', await renderToStringAsync(<Page name="page2" />));
 *   await streamIslands(collected, adapter, (id, html) => {
 *      fragments.set(generatePath(id), html);
 *   });
 *   return {
 *      pages,
 *      fragments
 *   };
 * }, TurboAdapter, (id) => `/fragments/${id}.html`);
 */
export async function renderToStatic<T>(
  handler: (ctx: IslandsPluginContext) => T,
  adapter: IslandAdapter,
  generatePath: (id: string) => string,
): Promise<T> {
  return render(async (ctx) => handler(ctx), {
    adapter,
    mode: "static",
    generatePath,
  });
}
