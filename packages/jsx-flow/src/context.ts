import type { PatchAdapter } from "./adapters.js";
import type { MergeType } from "./events.js";
import { assertFragmentId } from "./fragmentId.js";
import {
  context,
  setContext,
  type Context,
  type JSXNode,
} from "@cjean-fr/jsx-string";

/** A deferred fragment: encoded by the adapter, applied as a DOM patch. */
export type FragmentEffect = { factory: () => JSXNode; merge: MergeType };

/**
 * A streamed sequence: every item produced by `source` (a sync or async
 * iterable) is rendered — optionally through `map` — and patched into the DOM
 * element `target` as it arrives. One `<Generator>` registers one of these.
 */
export type StreamEffect = {
  target: string;
  source: () => Iterable<unknown> | AsyncIterable<unknown>;
  map: ((item: any) => JSXNode) | undefined;
  merge: MergeType;
};

export type Config =
  | {
      adapter: PatchAdapter;
      mode: "streaming";
      generatePath?: never;
      idPrefix?: string;
    }
  | {
      adapter: PatchAdapter;
      mode: "static";
      generatePath: (id: string) => string;
      idPrefix?: string;
    };

export interface FlowContext {
  config: Config;
  /** Pending fragments, in registration order. Exposed for inspection and streamFlow. */
  fragments: Map<string, FragmentEffect>;
  /** Pending streamed sequences, in registration order. */
  streams: StreamEffect[];
  nextId: () => string;
  /** Register a deferred fragment targeting the DOM element with id `id`. */
  patch(id: string, factory: () => JSXNode, merge?: MergeType): void;
  /** Register a streamed sequence targeting an existing DOM element. */
  stream(effect: StreamEffect): void;
}

export const Flow: Context<FlowContext> = context<FlowContext>(
  "@cjean-fr/jsx-flow:flow",
);

export function initFlow(config: Config): void {
  let counter = 0;
  const fragments = new Map<string, FragmentEffect>();
  const streams: StreamEffect[] = [];
  setContext(Flow, {
    config,
    fragments,
    streams,
    nextId: () => `${config.idPrefix ?? "fragment-"}${++counter}`,
    patch(id, factory, merge) {
      assertFragmentId(id, "patch");
      fragments.set(id, { factory, merge: merge ?? "replace" });
    },
    stream(effect) {
      assertFragmentId(effect.target, "stream");
      streams.push(effect);
    },
  });
}
