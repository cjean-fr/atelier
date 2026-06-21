import type { DeferContent, MergeType, OnError } from "../types.js";
import { useFlowContext } from "./shared.js";
import type { JSX, JSXNode } from "@cjean-fr/jsx-string";

export interface DeferProps {
  children: DeferContent;
  name?: string;
  merge?: MergeType;
  timeout?: number;
  onError?: OnError;
  fallback?: JSXNode;
}

export function Defer(props: DeferProps): JSX.Element | null {
  const { adapter, config, defer, nextId } = useFlowContext();
  const { children, name, merge, timeout, onError, fallback } = props;
  const id = name ?? nextId();

  defer(id, {
    content: children,
    merge: merge ?? "replace",
    timeout,
    onError,
  });

  return adapter.Placeholder({
    id,
    src: config.mode === "static" ? config.generatePath(id) : null,
    children: fallback ?? null,
  }) as JSX.Element | null;
}
