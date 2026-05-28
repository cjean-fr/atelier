import type { PatchAdapter } from "./adapters.js";
import type { FragmentEffect } from "./context.js";
import { renderToString } from "@cjean-fr/jsx-string";

export async function streamFragments(
  fragments: Map<string, FragmentEffect>,
  adapter: PatchAdapter,
  callback: (id: string, html: string) => void | Promise<void>,
): Promise<void> {
  const pendings = [];
  for (const [id, entry] of fragments) {
    const run = async (): Promise<void> => {
      try {
        const html = await renderToString(
          adapter.Patch({ id, children: entry.factory(), merge: entry.merge }),
        );
        await callback(id, html);
      } catch (error) {
        console.error("Error rendering fragment", { id, error });
      }
    };
    pendings.push(run());
  }
  await Promise.allSettled(pendings);
}
