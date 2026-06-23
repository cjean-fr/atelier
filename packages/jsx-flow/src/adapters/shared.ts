import type { AdapterCapabilities, FlowEvent, MergeType } from "../types.js";
import { raw, renderToString, type JSXNode } from "@cjean-fr/jsx-string";

export type Adapter = {
  Placeholder(props: {
    id: string;
    src: string | null;
    children: JSXNode;
  }): JSXNode;
  Patch(props: { id: string; children: JSXNode; merge: MergeType }): JSXNode;
  Frame(props: { id: string; children: JSXNode }): JSXNode;
  capabilities: AdapterCapabilities;
  transformShell?(shell: string): string;
  encode(): TransformStream<FlowEvent, string>;
};

function encodeWith(
  adapter: Pick<Adapter, "Patch">,
): TransformStream<FlowEvent, string> {
  return new TransformStream<FlowEvent, string>({
    async transform(ev, c) {
      if (ev.type === "fragment") {
        const wire = await renderToString(
          adapter.Patch({ id: ev.id, children: raw(ev.html), merge: ev.merge }),
        );
        c.enqueue(wire + "\n");
      } else {
        c.enqueue(ev.html + "\n");
      }
    },
  });
}

const ALL_MERGES = ["replace", "append", "prepend", "before", "after"] as const;

const DEFAULT_CAPABILITIES: { streaming: true; merges: typeof ALL_MERGES } = {
  streaming: true,
  merges: ALL_MERGES,
};

type AdapterSpec<C extends AdapterCapabilities> = Omit<
  Adapter,
  "encode" | "capabilities"
> &
  Partial<Pick<Adapter, "encode">> & { capabilities?: C };

export function createAdapter<
  const C extends AdapterCapabilities = typeof DEFAULT_CAPABILITIES,
>(spec: AdapterSpec<C>): Adapter & { capabilities: C } {
  const adapter: Adapter & { capabilities: C } = {
    ...spec,
    capabilities: spec.capabilities ?? (DEFAULT_CAPABILITIES as unknown as C),
    encode: spec.encode ?? (() => encodeWith(adapter)),
  };
  return adapter;
}
