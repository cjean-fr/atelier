import type {
  FunctionalComponent,
  JSXChild,
  StandardAttributes,
} from "./core/types.js";
import { escape } from "./utils/escape.js";
import {
  renderChild,
  renderElement,
  SafeString,
  type RenderResult,
} from "./utils/html.js";

export { SafeString } from "./utils/html.js";
export * from "./core/types.js";

/**
 * Create a RenderResult from a JSX tag name or functional component.
 *
 * @param tag - The element tag name (string) or a functional component to invoke
 * @param props - Properties to pass to the element or component; may include a `children` field
 * @param _key - Optional key retained for compatibility (not used by the factory)
 * @returns The resulting RenderResult for the given tag and props
 */
export function jsx<P extends {} = {}>(
  tag: string | FunctionalComponent<P>,
  props: P,
  ...childrenArgs: any[]
): RenderResult {
  const finalProps = { ...(props || {}) } as P & { children?: any };

  if (childrenArgs.length > 0 && finalProps.children === undefined) {
    finalProps.children =
      childrenArgs.length === 1 ? childrenArgs[0] : childrenArgs;
  }

  const childProp = finalProps.children;
  const children = Array.isArray(childProp)
    ? childProp
    : childProp !== undefined
      ? [childProp]
      : [];

  if (typeof tag === "function") {
    return tag(finalProps) as RenderResult;
  }

  return renderElement(
    tag,
    finalProps as StandardAttributes,
    children as JSXChild[],
  );
}

export const jsxs: typeof jsx = jsx;
export const jsxDEV: typeof jsx = jsx;
export const h = (tag: any, props: any, ...children: any[]): RenderResult =>
  jsx(tag, { ...props, children });

/**
 * Act as a JSX fragment that returns its children unchanged.
 *
 * @returns The provided `children`, or `undefined` if no children were supplied.
 */
export function Fragment({
  children,
}: {
  children?: JSXChild;
}): JSXChild | undefined {
  return children;
}

/**
 * Convert a JSX node into its HTML string representation.
 *
 * @param node - The JSX node (element, text, fragment, component result, or promise thereof) to render
 * @returns The rendered HTML string for the provided node, or a Promise that resolves to that string
 */
export function renderToString(node: JSXChild): string | Promise<string> {
  const result = renderChild(node);
  if (result instanceof Promise) {
    return result.then((r) =>
      r instanceof SafeString ? r.value : escape(String(r)),
    );
  }
  return result instanceof SafeString ? result.value : escape(String(result));
}
