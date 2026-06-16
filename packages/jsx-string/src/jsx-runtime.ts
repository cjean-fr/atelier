import type { Component, JSXNode, HTMLAttributes } from "./core/types.js";
import { RawString, type RenderResult } from "./core/types.js";
import { renderChild } from "./utils/render-child.js";
import { renderElement } from "./utils/render-element.js";

export type { JSX } from "./core/types.js";

export { jsxAttr, jsxEscape, jsxTemplate } from "./precompile.js";

/**
 * Automatic JSX Transform — production variant.
 *
 * Per the JSX automatic runtime spec, signature is `(type, props, key?)`. The
 * `key` is diagnostic, NOT a child. Children always live in `props.children`.
 *
 * Older versions of this package accepted variadic positional children for
 * classic-transform compatibility. That overload was removed in v2.0 because
 * it silently mis-rendered any element with a `key` and no children — the key
 * string was treated as the child. If you need classic-style `jsx(tag, props,
 * child1, child2)`, pass an explicit `children` array on `props` instead.
 */
export function jsx<P extends {} = {}>(
  tag: string | Component<P>,
  props: P,
  _key?: unknown,
): RenderResult {
  const p = (props ?? {}) as P & { children?: any };

  if (typeof tag === "function") {
    const result = renderChild(tag(p));
    return typeof result === "string"
      ? new RawString(result)
      : result.then((s) => new RawString(s));
  }

  return renderElement(tag, p as HTMLAttributes, p.children as JSXNode);
}

/**
 * Automatic JSX Transform — multi-children variant. Same shape as `jsx`;
 * emitted by transforms when children are statically known to be an array.
 */
export const jsxs: typeof jsx = jsx;

/**
 * JSX Fragment — groups children without wrapping them in a DOM element.
 *
 * Use the shorthand `<>...</>` syntax in JSX; the runtime resolves it to this
 * function. Returns its children unchanged, so they are flattened into the
 * parent element's content during rendering.
 *
 * @example
 * ```tsx
 * const List = () => (
 * <>
 * <li>one</li>
 * <li>two</li>
 * </>
 * );
 * await renderToString(<ul><List /></ul>);
 * // => "<ul><li>one</li><li>two</li></ul>"
 * ```
 */
export function Fragment({
  children,
}: {
  children?: JSXNode;
}): JSXNode | undefined {
  return children;
}
