import type { PatchAdapter } from "./adapters.js";
import type { FragmentEffect, StreamEffect } from "./context.js";
import { renderToString, type JSXNode } from "@cjean-fr/jsx-string";

type Callback = (id: string, html: string) => void | Promise<void>;

/**
 * Render every registered fragment AND streamed sequence through the adapter,
 * handing each result to `callback`. Fragments and streams run concurrently:
 *
 * - Fragments (`<Deferred>`/`<Patch>`) are drained generation by generation, so
 *   a nested `<Deferred>` registered while its parent renders is picked up and
 *   emitted after its parent — the order the client patch mechanism needs.
 * - Streams (`<Generator>`) each run one `for await` loop, emitting one patch
 *   per `yield` as it arrives. A slow generator never blocks the rest.
 */
export async function streamFragments(
  fragments: Map<string, FragmentEffect>,
  adapter: PatchAdapter,
  callback: Callback,
  streams: readonly StreamEffect[] = [],
): Promise<void> {
  const tasks: Promise<void>[] = [];
  for (const effect of streams)
    tasks.push(runStream(effect, adapter, callback));
  tasks.push(drainFragments(fragments, adapter, callback));
  await Promise.allSettled(tasks);
}

async function drainFragments(
  fragments: Map<string, FragmentEffect>,
  adapter: PatchAdapter,
  callback: Callback,
): Promise<void> {
  const processed = new Set<string>();

  const renderOne = async (
    id: string,
    entry: FragmentEffect,
  ): Promise<void> => {
    try {
      const html = await renderToString(
        adapter.Patch({ id, children: entry.factory(), merge: entry.merge }),
      );
      await callback(id, html);
    } catch (error) {
      console.error("Error rendering fragment", { id, error });
    }
  };

  while (true) {
    const wave: Array<[string, FragmentEffect]> = [];
    for (const [id, entry] of fragments) {
      if (processed.has(id)) continue;
      processed.add(id);
      wave.push([id, entry]);
    }
    if (wave.length === 0) break;
    await Promise.allSettled(wave.map(([id, entry]) => renderOne(id, entry)));
  }
}

async function runStream(
  { target, source, map, merge }: StreamEffect,
  adapter: PatchAdapter,
  callback: Callback,
): Promise<void> {
  try {
    // `for await` consumes both sync and async iterables.
    for await (const item of source() as AsyncIterable<unknown>) {
      const node: JSXNode = map ? map(item) : (item as JSXNode);
      const html = await renderToString(
        adapter.Patch({ id: target, children: node, merge }),
      );
      await callback(target, html);
    }
  } catch (error) {
    console.error("Error streaming generator", { target, error });
  }
}
