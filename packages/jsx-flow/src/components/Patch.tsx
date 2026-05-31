import type { MergeType } from "../adapters.js";
import { Flow } from "../context.js";
import { useContext, type JSXNode } from "@cjean-fr/jsx-string";

export interface PatchProps {
  /** Id of the existing DOM element to target. */
  target: string;
  merge?: MergeType;
  // Factory, not a node — JSX evaluates eagerly; the thunk defers rendering to streaming time.
  children: () => JSXNode;
}

/** Pushes a fragment to an existing DOM target without rendering a placeholder. */
export function Patch({
  target,
  merge = "replace",
  children,
}: PatchProps): any {
  const { patch } = useContext(Flow);
  patch(target, children, merge);
  return null;
}
