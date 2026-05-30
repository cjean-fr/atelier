import type { PatchAdapter, MergeType } from "./adapters.js";
import { assertFragmentId } from "./fragmentId.js";
import { context, setContext, type JSXNode } from "@cjean-fr/jsx-string";

/** A deferred fragment: encoded by the adapter, applied as a DOM patch. */
export type FragmentEffect = { factory: () => JSXNode; merge: MergeType };

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
  /** Pending fragments, in registration order. Exposed for inspection and streamFragments. */
  fragments: Map<string, FragmentEffect>;
  nextId: () => string;
  /** Register a deferred fragment targeting the DOM element with id `id`. */
  patch(id: string, factory: () => JSXNode, merge?: MergeType): void;
}

export const Flow = context<FlowContext>();

export function initFlow(config: Config): void {
  let counter = 0;
  const fragments = new Map<string, FragmentEffect>();
  setContext(Flow, {
    config,
    fragments,
    nextId: () => `${config.idPrefix ?? "fragment-"}${++counter}`,
    patch(id, factory, merge) {
      assertFragmentId(id, "patch");
      fragments.set(id, { factory, merge: merge ?? "replace" });
    },
  });
}
