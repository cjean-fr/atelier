import { useAwaitEntries, useIdGenerator } from "./hooks.js";
import type { AwaitEntry } from "./types.js";
import {
  useContext,
  type JSXChild,
  renderToStringAsync,
  renderToString,
  raw,
} from "@cjean-fr/jsx-string";

export interface AwaitProps {
  id?: string;
  fallback: JSXChild;
  errorFallback?: JSXChild;
  timeout?: number;
  onTimeout?: () => void;
  onError?: (error: Error) => void;
  children: () => JSXChild;
}

export function Await({
  id,
  fallback,
  errorFallback,
  timeout,
  onTimeout,
  onError,
  children,
}: AwaitProps) {
  const ctx = useContext();
  const entries = useAwaitEntries();
  const generator = useIdGenerator();

  if (!ctx.strategy) {
    throw new Error(
      "[jsx-string-await] Missing RenderStrategy in Context. Use renderToStream().",
    );
  }

  const awaitId = id || generator.next();

  // Thunk to render children
  const renderPromise = async () => {
    return renderToStringAsync(children());
  };

  const entry: AwaitEntry = {
    id: awaitId,
    status: "pending",
    render: renderPromise,
    errorFallback: errorFallback
      ? () => renderToString(errorFallback)
      : () => "",
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

  const fallbackStr = renderToString(fallback);
  return raw(ctx.strategy.wrapFallback(awaitId, fallbackStr));
}
