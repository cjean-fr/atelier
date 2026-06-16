import type { CSSProperties, HTMLAttributes } from "../core/types.js";
import {
  escapeAttr,
  isSafeUrl,
  isSafeSrcset,
  isValidAttrName,
  sanitize,
  URL_ATTRIBUTES,
} from "./escape.js";

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
export const ATTRIBUTE_NAME_MAP: Map<string, string> = new Map([
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
const WARNED_EVENT_HANDLERS = new Set<string>();

function computeAttrMeta(name: string): AttrMeta | null {
  if (INTERNAL_PROPS.has(name)) return null;

  let attrName = name;
  if (!isValidAttrName(attrName)) {
    attrName = sanitize(attrName);
    if (!isValidAttrName(attrName)) return null;
  }

  const hasUpper = REGEX_HAS_UPPER.test(attrName);
  if (hasUpper) {
    attrName = ATTRIBUTE_NAME_MAP.get(attrName) ?? attrName;
  }
  const c0 = attrName.charCodeAt(0);
  const isEvent =
    (c0 === 79 || c0 === 111) && REGEX_EVENT_HANDLER.test(attrName);
  if (isEvent && hasUpper) attrName = attrName.toLowerCase();

  if (attrName === "style") {
    return { name: attrName, isEvent: false, isStyle: true, urlKind: 0 };
  }

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
export function renderAttributeSync(name: string, value: unknown): string {
  if (value === false || value == null) return "";

  const meta = getAttrMeta(name);
  if (meta === null) return "";
  const attrName = meta.name;

  if (meta.isEvent) {
    if (typeof value === "function") {
      if (!WARNED_EVENT_HANDLERS.has(name)) {
        WARNED_EVENT_HANDLERS.add(name);
        console.warn(
          `[jsx-string] Event handler "${name}" was passed a function. ` +
            `This is not supported in static HTML rendering. Use a string instead.`,
        );
      }
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
