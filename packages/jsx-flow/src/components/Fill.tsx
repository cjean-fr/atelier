import type { DeferContent, MergeType } from "../types.js";
import { useFlowContext } from "./shared.js";

export interface FillProps {
  target: string;
  children: DeferContent;
  merge?: MergeType;
}

export function Fill(props: FillProps): null {
  const { defer } = useFlowContext();
  const { target, children, merge } = props;

  defer(target, {
    content: children,
    merge: merge ?? "replace",
  });

  return null;
}
