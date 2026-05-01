import { useAwaitEntries } from "./hooks.js";
import type { RenderStrategy, IdGenerator, AwaitEntry } from "./types.js";
import {
  withContext,
  useContext,
  renderToStringAsync,
  type JSXChild,
} from "@cjean-fr/jsx-string";

export interface RenderToStreamOptions {
  strategy: RenderStrategy;
  idGenerator?: IdGenerator;
}

export function renderToStream(
  node: JSXChild | (() => JSXChild),
  options: RenderToStreamOptions,
): ReadableStream {
  return new ReadableStream({
    async start(controller) {
      await withContext(async () => {
        const ctx = useContext();
        ctx.strategy = options.strategy;
        if (options.idGenerator) {
          ctx.idGenerator = options.idGenerator;
        }

        const encoder = new TextEncoder();

        try {
          // Render the shell (synchronous layout but allowing async children via await)
          const nodeChild = typeof node === "function" ? node() : node;
          const shellStr = await renderToStringAsync(nodeChild);
          controller.enqueue(encoder.encode(shellStr));

          const entries = useAwaitEntries();
          const pendingPromises = new Map<Promise<any>, AwaitEntry>();

          for (const entry of entries) {
            const p = entry.promise.then(
              (result) => ({ entry, ok: true, result: result as string }),
              (error) => ({ entry, ok: false, error }),
            );
            pendingPromises.set(p, entry);
          }

          while (pendingPromises.size > 0) {
            const resolved = await Promise.race(
              Array.from(pendingPromises.keys()),
            );
            const { entry, ok, result } = resolved;

            // Remove the resolved promise from the map
            for (const [p, e] of pendingPromises.entries()) {
              if (e === entry) {
                pendingPromises.delete(p);
                break;
              }
            }

            if (ok && result !== undefined) {
              const chunk = options.strategy.wrapResolved(entry.id, result);
              controller.enqueue(encoder.encode(chunk));
            } else {
              const errorFallbackStr = entry.errorFallback
                ? entry.errorFallback()
                : "";
              const chunk = options.strategy.wrapError(
                entry.id,
                errorFallbackStr,
              );
              controller.enqueue(encoder.encode(chunk));
            }
          }

          controller.close();
        } catch (shellError) {
          // If the shell errors out synchronously before any chunks, we fail the stream
          controller.error(shellError);
        }
      });
    },
  });
}
