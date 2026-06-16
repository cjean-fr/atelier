import type { JSXNode } from "@cjean-fr/jsx-string";

export type MergeType = "replace" | "append" | "prepend" | "before" | "after";

/**
 * What an adapter's wire format can express. Surfaced in the type system so the
 * renderer can reject impossible combinations early instead of at runtime:
 * `streaming` gates the streaming entry points, `merges` lists supported merges.
 */
export interface AdapterCapabilities {
  /** Can encode a live `FlowEvent` stream. `false` for CDN-level formats (ESI). */
  streaming: boolean;
  /** Merge types this adapter can express. */
  merges: readonly MergeType[];
}

/**
 * The content a `<Defer>` resolves to, evaluated at streaming time:
 *
 * - a `JSXNode` (incl. a `Promise<JSXNode>` from an async component, or an
 *   `AsyncIterable<JSXNode>` to stream item by item) — written as plain JSX,
 *   exactly like any other child;
 * - a `(signal) => JSXNode` factory — the cancellable form. The `AbortSignal`
 *   aborts on request cancel or the fragment's `timeout`.
 *
 * A factory that returns an `AsyncIterable` synchronously is streamed; anything
 * else (including a `Promise` of one) is rendered once as a single patch.
 */
export type DeferContent = JSXNode | ((signal: AbortSignal) => JSXNode);

export interface Shell {
  type: "shell";
  html: string;
}

export interface Fragment {
  type: "fragment";
  id: string;
  html: string;
  merge: MergeType;
}

/** Semantic event emitted by the streaming supervisor. */
export type FlowEvent = Shell | Fragment | { type: "close"; html: string };
