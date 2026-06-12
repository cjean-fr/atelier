import { withContext, type ContextBinding } from "./core/context.js";
import type { JSXNode } from "./core/types.js";
import { RawString, renderChild } from "./utils/html.js";

export { raw } from "./core/types.js";
export { Fragment } from "./jsx-runtime.js";
export type {
  CSSProperties,
  HTMLAttributes,
  SVGAttributes,
  JSXNode,
  Component,
  JSX,
} from "./core/types.js";
export {
  context,
  withContext,
  snapshot,
  type Context,
  type ContextBinding,
} from "./core/context.js";

export interface RenderOptions {
  /**
   * Bindings installed for the duration of this render. They inherit any
   * bindings already active (nested renders see their surroundings), and are
   * visible to every component, including async ones.
   */
  context?: readonly ContextBinding[];
}

/**
 * Render a JSX tree to an HTML string.
 *
 * Always returns `Promise<string>` — even when the tree contains no async
 * work — because any component can return a Promise. Output is HTML-safe by
 * default (see the README "Security model" section for what is and isn't
 * defended).
 *
 * To make context available to the tree, pass a **factory** plus bindings —
 * JSX evaluates eagerly, so an already-built node would have run before the
 * bindings were installed:
 *
 * ```tsx
 * const html = await renderToString(() => <App />, {
 *   context: [Theme.with("dark"), Request.with({ userId, locale })],
 * });
 * ```
 *
 * Concurrent calls are isolated: `Promise.all([renderToString(a), renderToString(b)])`
 * is safe even when both trees read context.
 *
 * @example
 * ```tsx
 * import { renderToString } from "@cjean-fr/jsx-string";
 *
 * const Page = async ({ id }: { id: string }) => {
 *   const user = await fetchUser(id);
 *   return <h1>Hello {user.name}</h1>;
 * };
 *
 * const html = await renderToString(<Page id="42" />);
 * ```
 */
export function renderToString(node: JSXNode): Promise<string>;
export function renderToString(
  node: () => JSXNode,
  options?: RenderOptions,
): Promise<string>;
export async function renderToString(
  node: JSXNode | (() => JSXNode),
  options?: RenderOptions,
): Promise<string> {
  if (typeof node === "function") {
    const factory = node as () => JSXNode;
    if (options?.context?.length) {
      return withContext(options.context, () => renderNode(factory()));
    }
    return renderNode(factory());
  }
  return renderNode(node);
}

async function renderNode(node: JSXNode): Promise<string> {
  if (node instanceof RawString) return node.value;
  if (node instanceof Promise)
    return node.then((r) =>
      r instanceof RawString ? r.value : renderChild(r),
    );
  return renderChild(node);
}
