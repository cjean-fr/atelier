import { RawString, type RenderResult } from "./core/types.js";
import { renderAttribute } from "./utils/render-attributes.js";
import { toRenderString } from "./utils/render-child.js";

/**
 * Serialize a single dynamic HTML attribute.
 *
 * Emitted by the precompile transform for each non-static attribute. Returns a
 * string like `name="value"` (or `name` for boolean `true`, or `""` when the
 * attribute is skipped). Applies the same security checks as the standard
 * transform: URL scheme blocking, attribute-name validation, event-handler
 * filtering, safe CSS values.
 *
 * `className` is rewritten to `class`. When a value is a Promise (e.g. from
 * an async source), returns `Promise<string>` so `jsxTemplate` can await it.
 *
 * @example
 * jsxAttr("href", "javascript:alert(1)")
 * // => 'href="#blocked"'
 *
 * @example
 * jsxAttr("class", "active")
 * // => 'class="active"'
 */
export function jsxAttr(
  name: string,
  value: unknown,
): string | Promise<string> {
  return renderAttribute(name, value);
}

/**
 * Prepare a dynamic child for embedding into a tagged template.
 *
 * Returns a value that `jsxTemplate` knows how to concatenate:
 * - `""` for nullish / boolean / empty string,
 * - the `RawString` itself (no re-escape),
 * - an escaped string for primitives,
 * - an array of escaped children (mirrors the JSX child-array shape),
 * - a `Promise` resolving to one of the above for async values — `jsxTemplate`
 *   detects it and awaits before concatenation.
 *
 * @example
 * jsxEscape("<script>alert(1)</script>")
 * // => "&lt;script&gt;alert(1)&lt;/script&gt;"
 *
 * @example
 * jsxEscape(null)
 * // => ""
 */
export function jsxEscape(value: unknown): unknown {
  if (value == null || value === false || value === true || value === "")
    return "";
  if (value instanceof RawString) return value;
  if (value instanceof Promise) return value.then(jsxEscape);

  if (Array.isArray(value)) {
    // Escape each element first, then decide sync vs async from the *results*.
    // A Promise nested inside a sub-array surfaces as a Promise here (the
    // recursive call returns one), so it is awaited instead of being stringified
    // to "[object Promise]" — which a top-level-only scan would miss.
    const out: unknown[] = new Array(value.length);
    let hasAsync = false;
    for (let i = 0; i < value.length; i++) {
      out[i] = jsxEscape(value[i]);
      if (out[i] instanceof Promise) hasAsync = true;
    }
    return hasAsync ? Promise.all(out) : out;
  }
  return toRenderString(value);
}

/**
 * Concatenate static template slices with dynamic expressions (each already
 * pre-rendered by `jsxAttr` / `jsxEscape` or by a nested `jsx()` call).
 *
 * Expressions may include Promises (returned by `jsxAttr` for async attribute
 * values, by `jsxEscape` for async children, or by `jsx()` for async
 * components). If any are pending, returns `Promise<RawString>`; otherwise
 * returns a synchronous `RawString`.
 *
 * @example
 * jsxTemplate`<div class="${jsxAttr("class", cls)}">${jsxEscape(child)}</div>`
 * // => RawString('<div class="...">...</div>')
 */
export function jsxTemplate(
  templates: ArrayLike<string>,
  ...values: unknown[]
): RenderResult {
  let out = templates[0] ?? "";
  for (let i = 0; i < values.length; i++) {
    const value = values[i];
    if (value instanceof Promise) {
      return Promise.all(values).then(
        (resolved) => new RawString(joinTemplate(templates, resolved)),
      );
    }
    out += flattenExpr(value) + (templates[i + 1] ?? "");
  }
  return new RawString(out);
}

function joinTemplate(templates: ArrayLike<string>, exprs: unknown[]): string {
  let out = templates[0] ?? "";
  for (let i = 0; i < exprs.length; i++) {
    out += flattenExpr(exprs[i]) + (templates[i + 1] ?? "");
  }
  return out;
}

function flattenExpr(value: unknown): string {
  if (typeof value === "string") return value;
  if (value == null || value === false || value === true) return "";
  if (value instanceof RawString) return value.value;
  if (Array.isArray(value)) {
    let out = "";
    for (let i = 0; i < value.length; i++) out += flattenExpr(value[i]);
    return out;
  }
  return toRenderString(value) as string;
}
