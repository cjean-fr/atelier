import type { JSXChild } from "@cjean-fr/jsx-string";

export interface IdGenerator {
  next(): string;
}

export interface RenderAdapter {
  wrapFallback(id: string, fallback: JSXChild): JSXChild;
  wrapResolved(id: string, content: JSXChild): JSXChild;
  wrapError(id: string, errorFallback: JSXChild): JSXChild;
}

export interface IslandEntry {
  id: string;
  promise: Promise<unknown>;
  render: () => Promise<string>;
  errorFallback?: () => JSXChild;
  status: "pending" | "resolved" | "rejected";
  result?: string;
  error?: Error;
  onTimeout?: () => void;
  onError?: (error: Error) => void;
}

declare module "@cjean-fr/jsx-string" {
  interface Context {
    islands?: IslandEntry[];
    idGenerator?: IdGenerator;
    adapter?: RenderAdapter;
  }
}
