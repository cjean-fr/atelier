import type { JSXNode } from "@cjean-fr/jsx-string";

export type MergeType = "replace" | "append" | "prepend" | "before" | "after";

/** Semantic event emitted by the streaming supervisor. */
export type FlowEvent =
  | { type: "shell"; html: string }
  | { type: "patch"; id: string; html: string; merge: MergeType }
  | { type: "close"; html: string };

export type FlowErrorInfo = { id: string; kind: "fragment" | "stream" };

export interface FlowOptions {
  signal?: AbortSignal;
  onError?: (error: unknown, info: FlowErrorInfo) => JSXNode | void;
}

/**
 * HTTP negotiation result: hints extracted from the incoming request that an
 * adapter uses to decide how to encode the response.
 */
export interface Negotiation {
  headers?: HeadersInit;
  mode?: "full" | "patches-only";
  target?: string;
  failTarget?: string;
}
