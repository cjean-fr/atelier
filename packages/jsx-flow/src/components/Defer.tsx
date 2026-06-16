import type { OnError } from "../flow-options.js";
import type { DeferContent, MergeType } from "../protocol.js";
import { useFlowContext } from "./shared.js";
import type { JSXNode, JSX } from "@cjean-fr/jsx-string";

export interface DeferProps {
  children: JSXNode;
  name?: string;
  merge?: MergeType;
  timeout?: number;
  onError?: OnError;
}

export function Defer(props: DeferProps): JSX.Element | null {
  const { adapter, config, defer, nextId } = useFlowContext();
  const { children, name, merge, timeout, onError } = props;
  const id = name ?? nextId();

  defer(id, {
    content: children as DeferContent,
    merge: merge ?? "replace",
    timeout,
    onError,
  });

  return adapter.Placeholder({
    id,
    src: config.mode === "static" ? config.generatePath(id) : null,
    children: null,
  }) as JSX.Element | null;
}
