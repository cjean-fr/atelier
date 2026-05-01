import type {
  FunctionalComponent,
  JSXChild,
  StandardAttributes,
} from "./core/types.js";
import { escape } from "./utils/escape.js";
import {
  isRawString,
  raw,
  renderChild,
  renderElement,
  type RenderResult,
} from "./utils/html.js";

export { RawString, raw, isRawString } from "./utils/html.js";
export * from "./core/types.js";
export * from "./core/context.js";

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
    const result = renderChild(tag(finalProps));
    if (result instanceof Promise || isRawString(result)) {
      return result as RenderResult;
    }
    return raw(escape(String(result)));
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
 * Convert a JSX node into its HTML string representation synchronously.
 *
 * @param node - The JSX node to render
 * @returns The rendered HTML string
 * @throws Error if the node is asynchronous (contains promises or async components)
 */
export function renderToString(node: JSXChild): string {
  const result = renderChild(node);
  if (result instanceof Promise) {
    throw new Error(
      "renderToString encountered an asynchronous component or Promise. " +
        "Use await renderToStringAsync(node) instead.",
    );
  }
  return isRawString(result) ? result.toString() : escape(String(result));
}

/**
 * Convert a JSX node into its HTML string representation asynchronously.
 *
 * @param node - The JSX node to render
 * @returns A Promise that resolves to the rendered HTML string
 */
export async function renderToStringAsync(node: JSXChild): Promise<string> {
  const result = await renderChild(node);
  return isRawString(result) ? result.toString() : escape(String(result));
}

/**
 * Check if a value is a Promise.
 *
 * @param value - The value to check
 * @returns True if the value is a Promise
 */
export function isAsync(value: any): value is Promise<any> {
  return value instanceof Promise;
}
