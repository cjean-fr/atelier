import type { CSSProperties, JSXNode, HTMLAttributes } from "../core/types.js";
import {
  escapeContent,
  escapeAttr,
  isSafeUrl,
  isSafeSrcset,
  isValidAttrName,
  isValidTagName,
  sanitize,
  URL_ATTRIBUTES,
} from "./escape.js";
import { VOID_ELEMENTS } from "./void-elements.js";

const REGEX_CAMEL_TO_KEBAB = /[A-Z]/g;
const REGEX_EVENT_HANDLER = /^on[a-z]/i;
const REGEX_CSS_UNSAFE = /expression\s*\(|javascript\s*:/i;
const REGEX_HAS_UPPER = /[A-Z]/;
const INTERNAL_PROPS = new Set<string>([
  "children",
  "dangerouslySetInnerHTML",
  "key",
  "ref",
]);
const ATTRIBUTE_NAME_MAP = new Map<string, string>([
  ["htmlFor", "for"],
  ["className", "class"],
  ["acceptCharset", "accept-charset"],
  ["httpEquiv", "http-equiv"],
  ["xlinkHref", "xlink:href"],
  ["xmlnsXlink", "xmlns:xlink"],
  ["xmlLang", "xml:lang"],
  ["xmlBase", "xml:base"],
  ["xmlSpace", "xml:space"],
  ["tabIndex", "tabindex"],
  ["readOnly", "readonly"],
  ["maxLength", "maxlength"],
  ["minLength", "minlength"],
  ["autoFocus", "autofocus"],
  ["autoPlay", "autoplay"],
  ["autoComplete", "autocomplete"],
  ["encType", "enctype"],
  ["noValidate", "novalidate"],
  ["dateTime", "datetime"],
  ["srcSet", "srcset"],
]);

const isSafeCssValue = (value: string): boolean => {
  const sanitized = sanitize(value);
  if (REGEX_CSS_UNSAFE.test(sanitized)) return false;

  for (const match of sanitized.matchAll(/url\(\s*(['"]?)(.*?)\1\s*\)/gi)) {
    if (!isSafeUrl(match[2]?.trim() ?? "")) return false;
  }

  return true;
};

export class RawString {
  readonly value: string;
  constructor(value: string) {
    this.value = value;
  }
  toString(): string {
    return this.value;
  }
}

export function isRawString(value: unknown): value is RawString {
  return value instanceof RawString;
}

/**
 * Mark an HTML string as trusted: it will be rendered verbatim without HTML
 * escaping. Use this for HTML you generated yourself or from a source you
 * fully trust — typically a Markdown renderer's output or a templating helper.
 *
 * **Common mistake — `raw()` is *not* for rendering user text.** If you have
 * a string and just want it to appear on the page (with `<`, `>`, `&`
 * displayed as characters), embed it directly — the default behavior already
 * HTML-escapes for you:
 *
 * ```tsx
 * <p>{userText}</p>   // ✅ safe — `<`/`>`/`&` shown as text
 * <p>{raw(userText)}</p>  // ❌ XSS if userText contains <script>...
 * ```
 *
 * ⚠️ **For untrusted HTML that must render *as HTML*** (e.g. forum posts
 * that allow basic formatting), escaping alone is not enough — you need an
 * HTML *sanitizer* (a different tool: it strips dangerous tags/attrs
 * structurally, instead of encoding them). Use
 * [`DOMPurify`](https://github.com/cure53/DOMPurify) or
 * [`sanitize-html`](https://github.com/apostrophecms/sanitize-html) and pass
 * their output to `raw()`.
 *
 * @example
 * ```tsx
 * import { raw } from "@cjean-fr/jsx-string";
 *
 * // Trusted source: server-side Markdown renderer.
 * const html = await renderMarkdown(post.body);
 * return <article>{raw(html)}</article>;
 * ```
 */
export const raw = (value: string): RawString => new RawString(value);

export type RenderResult = RawString | Promise<RawString>;

/**
 * Convert a props object into an HTML attribute string.
 *
 * @param props - Attributes object to render; if `null` or `undefined` an empty string is produced
 * @returns The HTML attribute string
 */
export function renderAttributes(
  props: HTMLAttributes | null | undefined,
): string | Promise<string> {
  if (!props) return "";

  const keys = Object.keys(props);
  let out = "";
  let pending: Promise<string>[] | null = null;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]!;
    const r = renderAttribute(key, (props as any)[key]);
    if (typeof r === "string") {
      if (r) out += ` ${r}`;
    } else {
      (pending ??= []).push(r.then((s) => (s ? ` ${s}` : "")));
    }
  }

  return pending
    ? Promise.all(pending).then((parts) => out + parts.join(""))
    : out;
}

/**
 * Render a single HTML attribute into its serialized form (no leading space).
 *
 * Returns `""` if the attribute should be skipped (invalid name, null/false value,
 * unsafe event-handler function, empty/unsafe style). Returns `name` alone for
 * boolean `true`, otherwise `name="escaped value"`. URL attributes with
 * `javascript:` / `vbscript:` schemes are replaced with `#blocked`.
 *
 * Caller is responsible for adding any whitespace separator between attributes.
 * `className` is rewritten to `class`; multiple `class`/`className` props in the
 * same element render as separate attributes (no merge) — this matches Deno's
 * precompile transform where each attribute is rendered in isolation.
 */
function renderAttributeSync(name: string, value: unknown): string {
  if (INTERNAL_PROPS.has(name) || value === false || value == null) return "";

  // `isValidAttrName` rejects whitespace, quotes, brackets, `=`, `/`, AND
  // Unicode "Other" chars (controls, ZWSP, LRM, etc.) in one regex test —
  // the latter would otherwise leak verbatim into the output. Clean ASCII
  // names pass on the first try; only names that fail get re-sanitized so
  // hidden chars (`data​-id`) can still produce a usable `data-id`.
  let attrName = name;
  if (!isValidAttrName(attrName)) {
    attrName = sanitize(attrName);
    if (!isValidAttrName(attrName)) return "";
  }

  // Only camelCase attribute names ever need remapping (the map keys all have
  // an uppercase letter). Skip the Map lookup for the common lowercase case.
  const hasUpper = REGEX_HAS_UPPER.test(attrName);
  if (hasUpper) {
    attrName = ATTRIBUTE_NAME_MAP.get(attrName) ?? attrName;
  }
  // Event-handler check: REGEX_EVENT_HANDLER is case-insensitive and must run
  // regardless of casing — `onclick={fn}` is just as dangerous as
  // `onClick={fn}`. Cheap pre-filter: only names starting with 'o'/'O' can
  // possibly match, avoiding the regex test on every non-event attribute.
  const c0 = attrName.charCodeAt(0);
  if ((c0 === 79 || c0 === 111) && REGEX_EVENT_HANDLER.test(attrName)) {
    if (typeof value === "function") {
      console.warn(
        `[jsx-string] Event handler "${attrName}" was passed a function. ` +
          `This is not supported in static HTML rendering. Use a string instead.`,
      );
      return "";
    }
    if (typeof value !== "string") return "";
    if (hasUpper) attrName = attrName.toLowerCase();
  }

  if (attrName === "style") {
    let style: string;
    if (value !== null && typeof value === "object") {
      style = renderStyle(value as CSSProperties);
    } else {
      style = String(value);
      if (!isSafeCssValue(style)) return "";
    }
    if (!style) return "";
    return `style="${escapeAttr(style)}"`;
  }

  if (value === true) return attrName;

  let str = typeof value === "string" ? value : String(value);
  // URL_ATTRIBUTES is keyed lowercase. After remapping, mapped names are
  // already lowercase, so only re-lowercase when the original had uppercase
  // and survived without remapping (e.g. "HREF" written verbatim).
  const urlKey =
    hasUpper && REGEX_HAS_UPPER.test(attrName)
      ? attrName.toLowerCase()
      : attrName;
  if (urlKey === "srcset") {
    if (!isSafeSrcset(str)) str = "#blocked";
  } else if (URL_ATTRIBUTES.has(urlKey) && !isSafeUrl(str)) str = "#blocked";
  return `${attrName}="${escapeAttr(str)}"`;
}

export function renderAttribute(
  name: string,
  value: unknown,
): string | Promise<string> {
  if (value instanceof Promise) {
    return value.then((v) => renderAttribute(name, v));
  }
  return renderAttributeSync(name, value);
}

/**
 * Serialize a CSS properties object into an inline CSS declaration string.
 *
 * Converts camelCase property names to kebab-case, preserves CSS custom properties
 * (keys starting with `--`) as-is, and omits entries whose values are `null` or `undefined`.
 *
 * @param style - An object mapping CSS property names to values
 * @returns A semicolon-delimited CSS declaration string (e.g., `color:red;margin-top:1px`)
 */
export function renderStyle(style: CSSProperties): string {
  const parts: string[] = [];
  for (const [key, value] of Object.entries(style)) {
    if (value == null) continue;
    const prop = key.startsWith("--")
      ? key
      : key.replace(REGEX_CAMEL_TO_KEBAB, "-$&").toLowerCase();
    const str = String(value);
    if (!isSafeCssValue(str)) continue;
    parts.push(`${prop}:${str}`);
  }
  return parts.join(";");
}

function renderArrayAsync(
  arr: JSXNode[],
  startIndex: number,
  prefix: string,
  pending: Promise<string>,
): Promise<string> {
  const tail: (string | Promise<string>)[] = [pending];
  for (let i = startIndex + 1; i < arr.length; i++) {
    tail.push(renderChild(arr[i]));
  }
  return Promise.all(tail).then((parts) => {
    let out = prefix;
    for (let i = 0; i < parts.length; i++) out += parts[i];
    return out;
  });
}

/**
 * Convert a JSX child (primitive, RawString, array, or Promise) into rendered
 * HTML text. The returned string is always already HTML-safe (escaped where
 * needed, raw where trusted), so callers concatenate it directly without
 * further escaping. Async children produce a `Promise<string>`.
 */
export function renderChild(child: JSXNode): string | Promise<string> {
  if (child == null || child === true || child === false) return "";
  if (typeof child === "string") return escapeContent(child);
  if (child instanceof RawString) return child.value;
  if (Array.isArray(child)) {
    let out = "";
    for (let i = 0; i < child.length; i++) {
      const c = child[i];
      // Inline the two dominant cases (RawString from nested `jsx()` calls,
      // primitive strings from JSX text nodes) to avoid the per-item recursive
      // call overhead — the typical loop is a list of element-shaped children.
      if (c instanceof RawString) {
        out += c.value;
        continue;
      }
      if (typeof c === "string") {
        out += escapeContent(c);
        continue;
      }
      if (c == null || c === true || c === false) continue;
      const r = renderChild(c);
      if (typeof r === "string") out += r;
      else return renderArrayAsync(child, i, out, r);
    }
    return out;
  }
  if (child instanceof Promise) return child.then(renderChild);
  return escapeContent(String(child));
}

/**
 * Render a JSX element into an HTML-safe `RawString`.
 *
 * Returning a `RawString` (rather than a plain `string`) lets the result be
 * dropped back into another element's children without being re-escaped — the
 * single boundary that distinguishes "trusted, already-rendered HTML" from
 * "untrusted user text" in the rest of the pipeline.
 *
 * When `props.dangerouslySetInnerHTML` is provided, its `__html` is used as
 * the element content; otherwise the provided children are rendered.
 * Attributes and children may be asynchronous; in that case the function
 * returns a `Promise<RawString>`.
 */
// Cache of tag names already proven safe. Tag names come from a tiny vocabulary
// (HTML/SVG elements + a few user custom-elements) and are reused thousands of
// times per render, so a cache avoids re-running the validation regex.
const VALID_TAGS = new Set<string>();

export function renderElement(
  tag: string,
  props: HTMLAttributes,
  children: JSXNode,
): RawString | Promise<RawString> {
  if (!VALID_TAGS.has(tag)) {
    if (!isValidTagName(tag)) {
      console.warn(
        `[jsx-string] Invalid tag name "${tag}" was skipped. Tag names must start with a letter and contain only letters, digits, or hyphens.`,
      );
      return EMPTY_RAW;
    }
    VALID_TAGS.add(tag);
  }
  const attrs = renderAttributes(props);
  const content = props.dangerouslySetInnerHTML
    ? props.dangerouslySetInnerHTML.__html == null
      ? ""
      : String(props.dangerouslySetInnerHTML.__html)
    : renderChild(children);

  if (typeof attrs === "string" && typeof content === "string") {
    return new RawString(buildElement(tag, attrs, content));
  }
  return Promise.all([attrs, content]).then(
    ([a, c]) => new RawString(buildElement(tag, a, c)),
  );
}

const EMPTY_RAW = new RawString("");

function buildElement(tag: string, attrs: string, content: string): string {
  if (VOID_ELEMENTS.has(tag)) return `<${tag}${attrs}>`;
  return `<${tag}${attrs}>${content}</${tag}>`;
}
