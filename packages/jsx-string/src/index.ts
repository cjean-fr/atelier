import type { JSXNode } from "./core/types.js";
import { renderChild } from "./utils/html.js";

export { raw } from "./core/types.js";
export { Fragment } from "./jsx-runtime.js";
export type {
  CSSProperties,
  StringEventHandlers,
  ToStatic,
  HTMLAttributes,
  SVGAttributes,
  JSXNode,
  Component,
  JSX,
} from "./core/types.js";
export {
  context,
  setContext,
  useContext,
  withScope,
  snapshot,
  type Context,
  type ScopeOptions,
} from "./core/context.js";

/**
 * Render a JSX tree to an HTML string.
 *
 * Always returns `Promise<string>` — even when the tree contains no async
 * work — because any component can return a Promise. Output is HTML-safe by
 * default (see the README "Security model" section for what is and isn't
 * defended).
 *
 * Concurrent calls are isolated: `Promise.all([renderToString(a), renderToString(b)])`
 * is safe even when `a` and `b` use `context()` / `setContext()` inside a
 * `withScope()`.
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
export async function renderToString(node: JSXNode): Promise<string> {
  return renderChild(node);
}
