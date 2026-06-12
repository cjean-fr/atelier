import type { MergeType } from "../adapters.js";
import { requireFlow } from "../context.js";
import { type JSXNode } from "@cjean-fr/jsx-string";

export interface PatchProps {
  /** Id of the existing DOM element to target. */
  target: string;
  merge?: MergeType;
  /**
   * Factory returning the content to push. Must be a function (`() => JSXNode`),
   * not a JSX expression — JSX evaluates eagerly and the factory defers
   * execution to streaming time.
   */
  children: () => JSXNode;
}

/** Pushes a fragment to an existing DOM target without rendering a placeholder. */
export function Patch({
  target,
  merge = "replace",
  children,
}: PatchProps): null {
  const { patch } = requireFlow("Patch");
  patch(target, children, merge);
  return null;
}
