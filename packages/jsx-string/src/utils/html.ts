import type { CSSProperties, JSXNode, HTMLAttributes } from "../core/types.js";
import { RawString } from "../core/types.js";
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

export { RawString, raw, type RenderResult } from "../core/types.js";

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

  let out = "";
  let pending: Promise<string>[] | null = null;

  for (const key in props) {
    // Skip internal props (children/key/ref/dangerouslySetInnerHTML) up front:
    // jsx() always puts `children` in props, so otherwise every element pays a
    // renderAttribute call + Promise check just to get "" back.
    if (INTERNAL_PROPS.has(key)) continue;
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
/**
 * Name-derived attribute metadata. Everything in attribute serialization that
 * depends ONLY on the name — validation, camelCase→kebab remap, event-handler
 * detection, style/URL classification — is computed once per distinct name and
 * cached. The value-dependent work (escaping, URL/CSS safety) is never cached.
 *
 * `urlKind`: 0 = plain, 1 = URL attribute, 2 = srcset.
 * A cached `null` means "skip this attribute" (internal prop or invalid name).
 */
type AttrMeta = {
  name: string;
  isEvent: boolean;
  isStyle: boolean;
  urlKind: 0 | 1 | 2;
};

// Keyed by attribute name. Names come from a small, bounded vocabulary — the
// same assumption that lets VALID_TAGS cache tag validation.
const ATTR_META_CACHE = new Map<string, AttrMeta | null>();

function computeAttrMeta(name: string): AttrMeta | null {
  if (INTERNAL_PROPS.has(name)) return null;

  // `isValidAttrName` rejects whitespace, quotes, brackets, `=`, `/`, AND
  // Unicode "Other" chars (controls, ZWSP, LRM, etc.) in one regex test —
  // the latter would otherwise leak verbatim into the output. Clean ASCII
  // names pass on the first try; only names that fail get re-sanitized so
  // hidden chars (`data​-id`) can still produce a usable `data-id`.
  let attrName = name;
  if (!isValidAttrName(attrName)) {
    attrName = sanitize(attrName);
    if (!isValidAttrName(attrName)) return null;
  }

  // Only camelCase attribute names ever need remapping (the map keys all have
  // an uppercase letter). Skip the Map lookup for the common lowercase case.
  const hasUpper = REGEX_HAS_UPPER.test(attrName);
  if (hasUpper) {
    attrName = ATTRIBUTE_NAME_MAP.get(attrName) ?? attrName;
  }
  // Event-handler check: REGEX_EVENT_HANDLER is case-insensitive and must run
  // regardless of casing — `onclick` is just as dangerous as `onClick`. Cheap
  // pre-filter: only names starting with 'o'/'O' can possibly match. Event
  // names are emitted lowercased.
  const c0 = attrName.charCodeAt(0);
  const isEvent =
    (c0 === 79 || c0 === 111) && REGEX_EVENT_HANDLER.test(attrName);
  if (isEvent && hasUpper) attrName = attrName.toLowerCase();

  if (attrName === "style") {
    return { name: attrName, isEvent: false, isStyle: true, urlKind: 0 };
  }

  // URL_ATTRIBUTES is keyed lowercase. After remapping, mapped names are
  // already lowercase, so only re-lowercase when the name still has uppercase
  // (e.g. "HREF" written verbatim).
  const urlKey = REGEX_HAS_UPPER.test(attrName)
    ? attrName.toLowerCase()
    : attrName;
  const urlKind: 0 | 1 | 2 =
    urlKey === "srcset" ? 2 : URL_ATTRIBUTES.has(urlKey) ? 1 : 0;

  return { name: attrName, isEvent, isStyle: false, urlKind };
}

function getAttrMeta(name: string): AttrMeta | null {
  const cached = ATTR_META_CACHE.get(name);
  if (cached !== undefined) return cached;
  const meta = computeAttrMeta(name);
  ATTR_META_CACHE.set(name, meta);
  return meta;
}

export function renderAttributeSync(name: string, value: unknown): string {
  if (value === false || value == null) return "";

  const meta = getAttrMeta(name);
  if (meta === null) return "";
  const attrName = meta.name;

  if (meta.isEvent) {
    if (typeof value === "function") {
      console.warn(
        `[jsx-string] Event handler "${name}" was passed a function. ` +
          `This is not supported in static HTML rendering. Use a string instead.`,
      );
      return "";
    }
    if (typeof value !== "string") return "";
  }

  if (meta.isStyle) {
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
  if (meta.urlKind === 2) {
    if (!isSafeSrcset(str)) str = "#blocked";
  } else if (meta.urlKind === 1 && !isSafeUrl(str)) {
    str = "#blocked";
  }
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
  let out = "";
  for (const key in style) {
    const value = style[key];
    if (value == null) continue;
    const prop = key.startsWith("--")
      ? key
      : key.replace(REGEX_CAMEL_TO_KEBAB, "-$&").toLowerCase();
    const str = String(value);
    if (!isSafeCssValue(str)) continue;
    if (out.length > 0) out += ";";
    out += `${prop}:${str}`;
  }
  return out;
}

function renderArrayAsync(
  arr: JSXNode[],
  startIndex: number,
  prefix: string,
  pending: Promise<string>,
): Promise<string> {
  const remaining = arr.length - startIndex;
  const tail: (string | Promise<string>)[] = new Array(remaining);
  tail[0] = pending;
  for (let i = 1; i < remaining; i++) {
    tail[i] = renderChild(arr[startIndex + i]);
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
  if (typeof child === "number") return String(child);
  if (child instanceof RawString) return child.value;
  if (Array.isArray(child)) {
    let out = "";
    for (let i = 0; i < child.length; i++) {
      const c = child[i];
      if (c instanceof RawString) {
        out += c.value;
        continue;
      }
      if (typeof c === "string") {
        out += escapeContent(c);
        continue;
      }
      if (typeof c === "number") {
        out += c;
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
  // Iterables — placed after every hot-path check (string/number/RawString/
  // Array/Promise all return first), so common children never reach this.
  // Sync iterables (Set, Map values, generators) render like an array; async
  // iterables (async generators) are buffered, then concatenated. Streaming an
  // async source progressively is jsx-flow's job, not renderToString's.
  if (typeof (child as any)[Symbol.iterator] === "function")
    return renderChild(Array.from(child as Iterable<JSXNode>));
  if (typeof (child as any)[Symbol.asyncIterator] === "function")
    return renderAsyncIterable(child as AsyncIterable<JSXNode>);
  return escapeContent(String(child));
}

async function renderAsyncIterable(
  iterable: AsyncIterable<JSXNode>,
): Promise<string> {
  let out = "";
  for await (const item of iterable) out += await renderChild(item);
  return out;
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
