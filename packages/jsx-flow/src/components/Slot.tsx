import { requireFlow } from "../context.js";
import { assertFragmentId } from "../fragmentId.js";
import { type JSXNode } from "@cjean-fr/jsx-string";

export interface SlotProps {
  /** DOM id for this slot — targeted by <Patch target={name}>. */
  name: string;
  /** Rendered in the shell until the slot is filled. Default: empty. */
  fallback?: JSXNode;
}

/**
 * Declares a named placeholder in the HTML shell without registering any
 * content. Unlike <Deferred>, Slot carries no factory — fill it later
 * with <Patch target={name}> or ctx.patch(name, factory).
 *
 * @example
 * // Shell
 * <Slot name="sidebar-widget" fallback={<Spinner />} />
 *
 * // Elsewhere in the same render (or in a separate streaming pass)
 * <Patch target="sidebar-widget">{() => <Widget />}</Patch>
 */
// Returns `any` — same reason as Deferred: adapter.Placeholder returns JSXNode,
// not the narrower JSX.Element TypeScript requires for JSX components.
export function Slot({ name, fallback = null }: SlotProps): any {
  assertFragmentId(name, "Slot");
  const { config } = requireFlow("Slot");
  return config.adapter.Placeholder({
    id: name,
    src: null,
    children: fallback,
  });
}
