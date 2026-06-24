import { RawString, type RenderResult } from "./core/types.js";
import { renderAttribute } from "./utils/render-attributes.js";
import { renderChild } from "./utils/render-child.js";

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
 * An alias of {@link renderChild}: the precompile escape path and the dynamic
 * render path share one coercion core, so a child is escaped identically whether
 * it reaches the runtime through `jsxTemplate` or through `renderToString`.
 * Returns an escaped string, or a `Promise<string>` for async values —
 * `jsxTemplate` detects the Promise and awaits before concatenation. A nested
 * Promise inside a sub-array surfaces as a Promise here too (the array descent
 * returns one), so it is awaited rather than stringified to "[object Promise]".
 *
 * @example
 * jsxEscape("<script>alert(1)</script>")
 * // => "&lt;script&gt;alert(1)&lt;/script&gt;"
 *
 * @example
 * jsxEscape(null)
 * // => ""
 */
export const jsxEscape: (value: unknown) => string | Promise<string> =
  renderChild;

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
  for (let i = 0; i < values.length; i++) {
    if (values[i] instanceof Promise) {
      return Promise.all(values).then(
        (resolved) => new RawString(assemble(templates, resolved)),
      );
    }
  }
  return new RawString(assemble(templates, values));
}

/**
 * Concatenate static template slices with their already-coerced slot values.
 *
 * A slot is the output of `jsxAttr` / `jsxEscape` (a string) or of a nested
 * `jsx()` / `jsxTemplate` (a `RawString`); any Promise has already been awaited
 * by `jsxTemplate`. The JSXNode descent — escaping, array flattening, async —
 * lives solely in `renderChild`; this is just the join.
 */
function assemble(
  templates: ArrayLike<string>,
  values: ArrayLike<unknown>,
): string {
  let out = templates[0] ?? "";
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    out +=
      (typeof v === "string" ? v : (v as RawString).value) +
      (templates[i + 1] ?? "");
  }
  return out;
}
