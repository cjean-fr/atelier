import { useIslandEntries, useIdGenerator } from "../hooks.js";
import type { IslandEntry } from "../types.js";
import {
  useContext,
  type JSXChild,
  renderToStringAsync,
} from "@cjean-fr/jsx-string";

export interface IslandProps {
  id?: string;
  fallback: JSXChild;
  errorFallback?: JSXChild;
  timeout?: number;
  onTimeout?: () => void;
  onError?: (error: Error) => void;
  children: () => JSXChild;
}

export function Island({
  id,
  fallback,
  errorFallback,
  timeout,
  onTimeout,
  onError,
  children,
}: IslandProps): any {
  const ctx = useContext();
  const entries = useIslandEntries();
  const generator = useIdGenerator();

  if (!ctx.adapter) {
    throw new Error(
      "[jsx-string-island] Missing RenderAdapter in Context. Use renderToStream().",
    );
  }

  const islandId = id || generator.next();

  // Thunk to render children
  const renderPromise = async () => {
    return renderToStringAsync(children());
  };

  const entry: IslandEntry = {
    id: islandId,
    status: "pending",
    render: renderPromise,
    errorFallback: errorFallback ? () => errorFallback : () => "",
    onTimeout,
    onError,
    // promise will be assigned below to ensure it handles race conditions properly
    promise: Promise.resolve(),
  };

  const executeRender = async () => {
    try {
      let renderResult: string;
      if (timeout !== undefined && timeout > 0) {
        let timer: ReturnType<typeof setTimeout>;
        const timeoutPromise = new Promise<never>((_, reject) => {
          timer = setTimeout(() => reject(new Error("Timeout")), timeout);
        });

        try {
          renderResult = await Promise.race([entry.render(), timeoutPromise]);
        } finally {
          clearTimeout(timer!);
        }
      } else {
        renderResult = await entry.render();
      }

      entry.status = "resolved";
      entry.result = renderResult;
      return renderResult;
    } catch (err: any) {
      entry.status = "rejected";
      entry.error = err;
      if (err.message === "Timeout" && entry.onTimeout) {
        entry.onTimeout();
      } else if (entry.onError) {
        entry.onError(err);
      }
      throw err;
    }
  };

  entry.promise = executeRender();
  entries.push(entry);

  return ctx.adapter.wrapFallback(islandId, fallback);
}
