import type { IslandAdapter } from "./adapters";
import { type JSXNode, renderToString } from "@cjean-fr/jsx-string";

export async function streamIslands(
  islands: Map<string, () => JSXNode>,
  adapter: IslandAdapter,
  callback: (id: string, html: string) => void | Promise<void>,
): Promise<void> {
  const pendings = [];
  for (const [id, children] of islands) {
    const run = async (): Promise<void> => {
      try {
        const html = await renderToString(
          adapter.Fragment({ id, children: children() }),
        );
        await callback(id, html);
      } catch (error) {
        console.error("Error rendering island", { id, error });
      }
    };
    pendings.push(run());
  }
  await Promise.allSettled(pendings);
}
