import type { FragmentEffect, StreamEffect } from "./context.js";
import type { FlowEvent, FlowOptions } from "./events.js";
import { renderToString, type JSXNode } from "@cjean-fr/jsx-string";

/**
 * Drain every registered fragment AND streamed sequence, emitting semantic
 * `FlowEvent` values to `emit`. Fragments and streams run concurrently:
 *
 * - Fragments (`<Deferred>`/`<Patch>`) are drained generation by generation,
 *   so a nested `<Deferred>` registered while its parent renders is picked up
 *   and emitted after its parent — the order the client patch mechanism needs.
 * - Streams (`<Generator>`) each run one `for await` loop, emitting one patch
 *   per `yield` as it arrives. A slow generator never blocks the rest.
 *
 * The loop continues until full quiescence: each wave may register new
 * fragments AND new streams (Generator inside a Deferred factory), and stream
 * items may themselves register fragments or streams — when no fragment is
 * pending, the loop waits for the live streams and re-checks before exiting.
 */
export async function streamFlow(
  ctx: {
    fragments: ReadonlyMap<string, FragmentEffect>;
    streams: readonly StreamEffect[];
  },
  emit: (ev: FlowEvent) => Promise<void>,
  opts: FlowOptions = {},
): Promise<void> {
  const processed = new Set<string>();
  const started = new Set<StreamEffect>();
  const live: Promise<void>[] = [];

  while (!opts.signal?.aborted) {
    for (const s of ctx.streams)
      if (!started.has(s)) {
        started.add(s);
        live.push(runStream(s, emit, opts));
      }
    const wave = [...ctx.fragments].filter(([id]) => !processed.has(id));
    if (wave.length > 0) {
      for (const [id] of wave) processed.add(id);
      await Promise.allSettled(
        wave.map(([id, e]) => renderOne(id, e, emit, opts)),
      );
      continue;
    }
    // Nothing pending: streams may still register fragments/streams while
    // they run, so only exit once they are done AND no new work appeared.
    await Promise.allSettled(live);
    const moreWork =
      ctx.streams.some((s) => !started.has(s)) ||
      [...ctx.fragments.keys()].some((id) => !processed.has(id));
    if (!moreWork) break;
  }
  await Promise.allSettled(live);
}

async function renderOne(
  id: string,
  entry: FragmentEffect,
  emit: (ev: FlowEvent) => Promise<void>,
  { onError, signal }: FlowOptions,
): Promise<void> {
  if (signal?.aborted) return;
  try {
    const html = await renderToString(entry.factory());
    await emit({ type: "patch", id, html, merge: entry.merge });
  } catch (error) {
    const ui = onError?.(error, { id, kind: "fragment" });
    if (ui != null) {
      await emit({
        type: "patch",
        id,
        html: await renderToString(ui),
        merge: "replace",
      });
    } else {
      console.error("Error rendering fragment", { id, error });
    }
  }
}

async function runStream(
  { target, source, map, merge }: StreamEffect,
  emit: (ev: FlowEvent) => Promise<void>,
  { onError, signal }: FlowOptions,
): Promise<void> {
  const iterable = source();
  const it =
    Symbol.asyncIterator in iterable
      ? iterable[Symbol.asyncIterator]()
      : (iterable as Iterable<unknown>)[Symbol.iterator]();
  // A generator parked in next() (e.g. awaiting an event that never fires)
  // would otherwise pin streamFlow forever after abort — race it.
  const aborted = signal
    ? new Promise<IteratorResult<unknown>>((resolve) => {
        const onAbort = () => resolve({ done: true, value: undefined });
        if (signal.aborted) onAbort();
        else signal.addEventListener("abort", onAbort, { once: true });
      })
    : null;
  try {
    while (true) {
      const step = Promise.resolve(it.next());
      if (aborted) step.catch(() => {}); // ignored if abort wins the race
      const r = await (aborted ? Promise.race([step, aborted]) : step);
      if (r.done) break;
      const node = map ? map(r.value) : (r.value as JSXNode);
      await emit({
        type: "patch",
        id: target,
        html: await renderToString(node),
        merge,
      });
    }
  } catch (error) {
    const ui = onError?.(error, { id: target, kind: "stream" });
    if (ui != null) {
      await emit({
        type: "patch",
        id: target,
        html: await renderToString(ui),
        merge: "replace",
      });
    } else {
      console.error("Error streaming generator", { target, error });
    }
  } finally {
    // On abort, ask the iterator to run its cleanup (finally blocks, closing
    // cursors…). Fire-and-forget: a parked generator only processes return()
    // once its pending await settles, and we must not wait for that.
    if (signal?.aborted)
      void Promise.resolve(it.return?.(undefined)).catch(() => {});
  }
}
