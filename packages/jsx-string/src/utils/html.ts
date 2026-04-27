import type {
  CSSProperties,
  JSXChild,
  StandardAttributes,
} from "../core/types.js";
import {
  escape,
  isSafeUrl,
  isValidAttrName,
  sanitize,
  URL_ATTRIBUTES,
} from "./escape.js";
import { VOID_ELEMENTS } from "./void-elements.js";

const REGEX_CAMEL_TO_KEBAB = /[A-Z]/;
const REGEX_EVENT_HANDLER = /^on[a-z]/i;
const REGEX_CSS_UNSAFE = /expression\s*\(|javascript\s*:/i;
const INTERNAL_PROPS = new Set([
  "children",
  "dangerouslySetInnerHTML",
  "key",
  "ref",
]);
const ATTRIBUTE_NAME_MAP = new Map<string, string>([
  ["htmlFor", "for"],
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
]);

const hasPromise = (v: unknown): boolean => {
  if (v instanceof Promise) return true;
  if (Array.isArray(v)) {
    for (let i = 0; i < v.length; i++) {
      if (hasPromise(v[i])) return true;
    }
  }
  return false;
};

const hasNestedPromise = (v: unknown): boolean => {
  if (!v) return false;
  if (v instanceof Promise) return true;
  if (Array.isArray(v)) {
    for (let i = 0; i < v.length; i++) {
      if (hasNestedPromise(v[i])) return true;
    }
    return false;
  }
  if (typeof v === "object") {
    for (const value of Object.values(v as Record<string, unknown>)) {
      if (hasNestedPromise(value)) return true;
    }
  }
  return false;
};

const resolveNestedPromises = async (value: unknown): Promise<unknown> => {
  if (value instanceof Promise) return resolveNestedPromises(await value);
  if (Array.isArray(value)) {
    return Promise.all(value.map((item) => resolveNestedPromises(item)));
  }
  if (value && typeof value === "object") {
    const entries = await Promise.all(
      Object.entries(value as Record<string, unknown>).map(
        async ([key, item]) => [key, await resolveNestedPromises(item)],
      ),
    );
    return Object.fromEntries(entries);
  }
  return value;
};

const isSafeCssValue = (value: string): boolean => {
  const sanitized = sanitize(value);
  if (REGEX_CSS_UNSAFE.test(sanitized)) return false;

  for (const match of sanitized.matchAll(/url\(\s*(['"]?)(.*?)\1\s*\)/gi)) {
    if (!isSafeUrl(match[2]?.trim() ?? "")) return false;
  }

  return true;
};

export class RawString {
  readonly __isRawString = true;
  readonly value: string;
  constructor(value: string) {
    this.value = value;
  }
  toString(): string {
    return this.value;
  }
}

/**
 * Robust check for RawString instance, even across different versions or module resolutions.
 */
export function isRawString(value: any): value is RawString {
  return value instanceof RawString || (value && value.__isRawString === true);
}

/**
 * Creates a RawString from a value, which will be rendered without escaping.
 * Use with caution to avoid XSS vulnerabilities.
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
  props: StandardAttributes | null | undefined,
): string | Promise<string> {
  if (!props) return "";

  const keys = Object.keys(props);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = key ? (props as any)[key] : undefined;
    if (
      key &&
      (hasPromise(value) ||
        (key === "style" &&
          typeof value === "object" &&
          hasNestedPromise(value)))
    ) {
      return Promise.all(keys.map(async (k) => [k, await (props as any)[k]]))
        .then((entries) => resolveNestedPromises(Object.fromEntries(entries)))
        .then((resolved) =>
          renderAttributesSync(resolved as StandardAttributes),
        );
    }
  }

  return renderAttributesSync(props);
}

/**
 * Render HTML attributes from a props object into a single attribute string.
 *
 * Skips internal props (e.g., children, key, ref), omits null/undefined/false values, merges `class`/`className` values, serializes `style` objects, renders boolean `true` attributes without a value, and sanitizes attribute names and URL-valued attributes.
 *
 * @param tag - The element tag name
 * @param props - The props object to convert into HTML attributes
 * @returns A string containing the rendered HTML attributes (prefixed with a space for each attribute), or an empty string if no attributes are produced
 */
function renderAttributesSync(props: StandardAttributes): string {
  let attrs = "";
  const classes = new Set<string>();

  const keys = Object.keys(props);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (!key) continue;
    const value = (props as any)[key];
    if (INTERNAL_PROPS.has(key) || value === false || value == null) continue;

    if (key === "class" || key === "className") {
      if (typeof value === "string") {
        for (const c of value.split(/\s+/)) if (c) classes.add(c);
      }
      continue;
    }

    const mapped = ATTRIBUTE_NAME_MAP.get(key);
    let name: string;

    if (mapped) {
      name = mapped;
    } else if (key.startsWith("data-") || key.startsWith("aria-")) {
      name = sanitize(key).replace(REGEX_CAMEL_TO_KEBAB, "-$&").toLowerCase();
    } else {
      name = sanitize(key);
    }
    if (!isValidAttrName(name)) continue;
    if (REGEX_EVENT_HANDLER.test(name)) {
      if (typeof value === "function") {
        console.warn(
          `[jsx-string] Event handler "${name}" was passed a function. ` +
            `This is not supported in static HTML rendering. Use a string instead.`,
        );
        continue;
      }
      if (typeof value !== "string") continue;
      name = name.toLowerCase();
    }

    if (name === "style") {
      if (typeof value === "object") {
        const style = renderStyleSync(value as CSSProperties);
        if (!style) continue;
        attrs += ` style="${escape(style, "attr")}"`;
      } else {
        const style = String(value);
        if (!isSafeCssValue(style)) continue;
        if (!style) continue;
        attrs += ` style="${escape(style, "attr")}"`;
      }
    } else if (value === true) {
      attrs += ` ${name}`;
    } else {
      let str = String(value);
      if (URL_ATTRIBUTES.has(name) && !isSafeUrl(str)) str = "#blocked";
      attrs += ` ${name}="${escape(str, "attr")}"`;
    }
  }

  if (classes.size > 0) {
    attrs = ` class="${escape([...classes].join(" "), "attr")}"` + attrs;
  }

  return attrs;
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
export function renderStyle(style: CSSProperties): string | Promise<string> {
  if (hasNestedPromise(style)) {
    return Promise.resolve(resolveNestedPromises(style)).then((resolved) =>
      renderStyleSync(resolved as CSSProperties),
    );
  }

  return renderStyleSync(style);
}

function renderStyleSync(style: CSSProperties): string {
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

/**
 * Convert a JSX child (primitive, RawString, array, or Promise) into HTML-safe rendered content.
 *
 * @param child - The JSX child to render; may be null, boolean, a RawString, a Promise, an array of children, or any primitive value.
 * @returns A `string`, `RawString`, or `Promise<RawString>`: `string` for simple primitive values, `RawString` for synchronously rendered content, or `Promise<RawString>` when any nested child is asynchronous.
 */
export function renderChild(
  child: JSXChild,
): string | RawString | Promise<RawString> {
  if (child == null || child === true || child === false) return "";
  if (isRawString(child)) return child;
  if (child instanceof Promise)
    return child
      .then(renderChild)
      .then((r) => (isRawString(r) ? r : new RawString(escape(String(r)))));

  if (Array.isArray(child)) {
    const len = child.length;
    const rendered: (string | RawString | Promise<RawString>)[] = new Array(
      len,
    );
    let hasAsync = false;

    for (let i = 0; i < len; i++) {
      const r = renderChild(child[i]);
      rendered[i] = r;
      if (r instanceof Promise) hasAsync = true;
    }

    if (!hasAsync) {
      let out = "";
      for (let i = 0; i < len; i++) {
        const r = rendered[i] as string | RawString;
        out += isRawString(r) ? r.value : escape(String(r));
      }
      return new RawString(out);
    }

    return Promise.all(rendered).then((items) => {
      let out = "";
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        out += isRawString(item) ? item.value : escape(String(item));
      }
      return new RawString(out);
    });
  }

  return String(child);
}

/**
 * Render a JSX element into an HTML string.
 *
 * When `props.dangerouslySetInnerHTML` is provided, its `__html` is used as the element content;
 * otherwise the provided children are rendered. Attributes and children may be asynchronous; in that case
 * the function returns a Promise resolving to the same RawString result.
 *
 * @param tag - The element tag name
 * @param props - Element attributes and special props (e.g., `className`, `style`, `dangerouslySetInnerHTML`)
 * @param children - Child nodes to render inside the element
 * @returns A RawString containing the rendered element HTML
 */
export function renderElement(
  tag: string,
  props: StandardAttributes,
  children: JSXChild[],
): RenderResult {
  const attrsResult = renderAttributes(props);
  const contentResult = props.dangerouslySetInnerHTML
    ? new RawString(
        props.dangerouslySetInnerHTML.__html == null
          ? ""
          : String(props.dangerouslySetInnerHTML.__html),
      )
    : renderChild(children);

  if (attrsResult instanceof Promise || contentResult instanceof Promise) {
    return Promise.all([attrsResult, contentResult]).then(([attrs, content]) =>
      toRawElement(tag, attrs, content),
    );
  }

  return toRawElement(tag, attrsResult, contentResult);
}

/**
 * Create a RawString containing an HTML element built from a tag, pre-rendered attributes, and content.
 *
 * @param tag - The element tag name (e.g., "div", "img"); void elements will not receive a closing tag.
 * @param attrs - Pre-rendered attribute string (leading space if attributes are present), inserted into the opening tag.
 * @param content - Inner content for the element; a `RawString` value is used verbatim, otherwise the value is escaped.
 * @returns A RawString holding the final HTML for the element. For void elements the result is the opening tag only.
 */
function toRawElement(
  tag: string,
  attrs: string,
  content: string | RawString,
): RawString {
  if (VOID_ELEMENTS.has(tag)) return new RawString(`<${tag}${attrs}>`);
  const inner = isRawString(content) ? content.value : escape(String(content));
  return new RawString(`<${tag}${attrs}>${inner}</${tag}>`);
}
