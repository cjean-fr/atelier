import type { Component, JSXNode, HTMLAttributes } from "./core/types.js";
import { escapeContent } from "./utils/escape.js";
import {
  isRawString,
  raw,
  renderAttribute,
  renderChild,
  renderElement,
  RawString,
  type RenderResult,
} from "./utils/html.js";

export type { JSX } from "./core/types.js";

export function jsx<P extends {} = {}>(
  tag: string | Component<P>,
  props: P,
  ...childrenArgs: any[]
): RenderResult {
  const p = (props ?? {}) as P & { children?: any };

  const hasArgChildren = childrenArgs.length > 0 && p.children === undefined;
  const childProp = hasArgChildren
    ? childrenArgs.length === 1
      ? childrenArgs[0]
      : childrenArgs
    : p.children;

  if (typeof tag === "function") {
    const componentProps: P & { children?: any } = hasArgChildren
      ? { ...p, children: childProp }
      : p;
    const result = renderChild(tag(componentProps));
    if (result instanceof Promise || isRawString(result)) {
      return result as RenderResult;
    }
    return raw(escapeContent(String(result)));
  }

  return renderElement(tag, p as HTMLAttributes, childProp as JSXNode);
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

/**
 * Deno `jsx: "precompile"` runtime: serialize a single dynamic HTML attribute.
 *
 * Emitted by the compiler for each non-static attribute. Returns a string like
 * `name="value"` (or `name` for boolean `true`, or `""` when the attribute is
 * skipped). Applies the same security checks as the standard transform: URL
 * scheme blocking, attribute-name validation, event-handler filtering, safe
 * CSS values.
 *
 * `className` is rewritten to `class`. When a value is a Promise (e.g. from
 * an async source), returns `Promise<string>` so `jsxTemplate` can await it.
 */
export function jsxAttr(
  name: string,
  value: unknown,
): string | Promise<string> {
  return renderAttribute(name, value);
}

/**
 * Deno `jsx: "precompile"` runtime: prepare a dynamic child for embedding into
 * a template.
 *
 * Returns a value that `jsxTemplate` knows how to concatenate:
 * - `""` for nullish / boolean / empty string,
 * - the `RawString` itself (no re-escape),
 * - an escaped string for primitives,
 * - an array of escaped children (mirrors the JSX child-array shape),
 * - a `Promise` resolving to one of the above for async values — `jsxTemplate`
 *   detects it and awaits before concatenation.
 */
export function jsxEscape(value: unknown): unknown {
  if (value == null || value === false || value === true || value === "")
    return "";
  if (isRawString(value)) return value;
  if (value instanceof Promise) return value.then(jsxEscape);
  if (Array.isArray(value)) {
    let hasAsync = false;
    for (let i = 0; i < value.length; i++) {
      if (value[i] instanceof Promise) {
        hasAsync = true;
        break;
      }
    }
    if (!hasAsync) {
      const out: unknown[] = new Array(value.length);
      for (let i = 0; i < value.length; i++) {
        out[i] = jsxEscape(value[i]);
      }
      return out;
    }
    return Promise.all(value.map(jsxEscape));
  }
  return escapeContent(String(value));
}

/**
 * Deno `jsx: "precompile"` runtime: concatenate static template slices with
 * dynamic expressions (each already pre-rendered by `jsxAttr` / `jsxEscape`
 * or by a nested `jsx()` call).
 *
 * Expressions may include Promises (returned by `jsxAttr` for async attribute
 * values, by `jsxEscape` for async children, or by `jsx()` for async
 * components). If any are pending, returns `Promise<RawString>`; otherwise
 * returns a synchronous `RawString`.
 */
export function jsxTemplate(
  templates: ArrayLike<string>,
  ...exprs: unknown[]
): RenderResult {
  let hasAsync = false;
  for (let i = 0; i < exprs.length; i++) {
    if (exprs[i] instanceof Promise) {
      hasAsync = true;
      break;
    }
  }
  if (!hasAsync) return new RawString(joinTemplate(templates, exprs));
  return Promise.all(exprs).then(
    (resolved) => new RawString(joinTemplate(templates, resolved)),
  );
}

function joinTemplate(templates: ArrayLike<string>, exprs: unknown[]): string {
  let out = templates[0] ?? "";
  for (let i = 0; i < exprs.length; i++) {
    out += flattenExpr(exprs[i]) + (templates[i + 1] ?? "");
  }
  return out;
}

function flattenExpr(value: unknown): string {
  if (value == null || value === false || value === true) return "";
  if (isRawString(value)) return value.value;
  if (Array.isArray(value)) {
    let out = "";
    for (let i = 0; i < value.length; i++) out += flattenExpr(value[i]);
    return out;
  }
  return String(value);
}
