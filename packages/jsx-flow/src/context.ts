import type { PatchAdapter, MergeType } from "./adapters.js";
import { assertFragmentId } from "./fragmentId.js";
import { context, setContext, type JSXNode } from "@cjean-fr/jsx-string";

export type ChannelType = "fragment" | "head";

/** Fragment channel: targets a DOM element, delivered via the adapter's Patch method. */
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
  channels: {
    fragment: Map<string, FragmentEffect>;
    head: Map<string, () => JSXNode>;
  };
  nextId: () => string;
  enqueue(channel: "fragment", target: string, factory: () => JSXNode, merge?: MergeType): void;
  enqueue(channel: "head", target: string, factory: () => JSXNode): void;
  enqueue(channel: ChannelType, target: string, factory: () => JSXNode, merge?: MergeType): void;
}

export const Flow = context<FlowContext>();

export function initFlow(config: Config): void {
  let counter = 0;
  const channels = {
    fragment: new Map<string, FragmentEffect>(),
    head: new Map<string, () => JSXNode>(),
  };
  setContext(Flow, {
    config,
    channels,
    nextId: () => `${config.idPrefix ?? "fragment-"}${++counter}`,
    enqueue(channel: ChannelType, target: string, factory: () => JSXNode, merge?: MergeType) {
      if (channel === "fragment") {
        assertFragmentId(target, "enqueue");
        channels.fragment.set(target, { factory, merge: merge ?? "replace" });
      } else {
        if (!target) throw new Error(`enqueue: head target must not be empty`);
        channels.head.set(target, factory);
      }
    },
  });
}
