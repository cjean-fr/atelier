import type { Adapter } from "./adapters.js";
import type { JSXNode } from "@cjean-fr/jsx-string";

export type FlowErrorInfo = { id: string; kind: "fragment" | "stream" };

export type OnError = (error: unknown, info: FlowErrorInfo) => JSXNode | void;

export interface FlowOptions {
  signal?: AbortSignal;
  /** Fallback handler for any fragment/stream that doesn't set its own `onError`. */
  onError?: OnError;
  /**
   * Default per-fragment render timeout in ms, applied to any `<Defer>` that
   * doesn't set its own `timeout`. Omit for no bound. Does not apply to
   * streaming (`AsyncIterable`) content, which is long-lived.
   */
  defaultTimeout?: number;
}

export type FlowConfig =
  | {
      adapter: Adapter;
      mode: "streaming";
      generatePath?: never;
      idPrefix?: string;
    }
  | {
      adapter: Adapter;
      mode: "static";
      generatePath: (id: string) => string;
      idPrefix?: string;
    };
