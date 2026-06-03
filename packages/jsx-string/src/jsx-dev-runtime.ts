import type { Component, RenderResult } from "./core/types.js";
import { jsx } from "./jsx-runtime.js";

export {
  jsxs,
  Fragment,
  jsxAttr,
  jsxEscape,
  jsxTemplate,
} from "./jsx-runtime.js";
export type { JSX } from "./core/types.js";

export function jsxDEV<P extends {} = {}>(
  tag: string | Component<P>,
  props: P,
  _key?: unknown,
  _isStaticChildren?: boolean,
  _source?: { fileName?: string; lineNumber?: number; columnNumber?: number },
  _self?: unknown,
): RenderResult {
  return jsx(tag, props);
}
