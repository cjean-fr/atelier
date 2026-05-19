import type { Component, JSXNode, HTMLAttributes } from "./core/types.js";
import { escape } from "./utils/escape.js";
import {
  isRawString,
  raw,
  renderChild,
  renderElement,
  type RenderResult,
} from "./utils/html.js";

export type { JSX } from "./core/types.js";

export function jsx<P extends {} = {}>(
  tag: string | Component<P>,
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
    finalProps as HTMLAttributes,
    children as JSXNode[],
  );
}

export const jsxs: typeof jsx = jsx;
export const jsxDEV: typeof jsx = jsx;

export function Fragment({
  children,
}: {
  children?: JSXNode;
}): JSXNode | undefined {
  return children;
}
