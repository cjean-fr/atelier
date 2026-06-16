import type { DeferContent, MergeType } from "../protocol.js";
import { useFlowContext } from "./shared.js";
import type { JSXNode } from "@cjean-fr/jsx-string";

export interface FillProps {
  target: string;
  children: JSXNode;
  merge?: MergeType;
}

export function Fill(props: FillProps): null {
  const { defer } = useFlowContext();
  const { target, children, merge } = props;

  defer(target, {
    content: children as DeferContent,
    merge: merge ?? "replace",
  });

  return null;
}
