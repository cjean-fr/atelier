import type { CSSProperties, JSXNode, HTMLAttributes } from "../core/types.js";
import {
  escape,
  isSafeUrl,
  isValidAttrName,
  isValidTagName,
  sanitize,
  URL_ATTRIBUTES,
} from "./escape.js";
import { VOID_ELEMENTS } from "./void-elements.js";

const REGEX_CAMEL_TO_KEBAB = /[A-Z]/g;
const REGEX_EVENT_HANDLER = /^on[a-z]/i;
const REGEX_CSS_UNSAFE = /expression\s*\(|javascript\s*:/i;
const INTERNAL_PROPS = new Set<string>([
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
  ["srcSet", "srcset"],
]);

const resolveNestedPromises = (value: unknown): unknown | Promise<unknown> => {
  if (value instanceof Promise) return value.then(resolveNestedPromises);
  if (Array.isArray(value)) {
    let hasAsync = false;
    const results = new Array(value.length);
    for (let i = 0; i < value.length; i++) {
      const r = resolveNestedPromises(value[i]);
      if (r instanceof Promise) hasAsync = true;
      results[i] = r;
    }
    if (!hasAsync) return value;
    return Promise.all(results);
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    let hasAsync = false;
    const resolved = new Array(entries.length) as [string, unknown][];
    for (let i = 0; i < entries.length; i++) {
      const [k, v] = entries[i]!;
      const r = resolveNestedPromises(v);
      if (r instanceof Promise) hasAsync = true;
      resolved[i] = [k, r];
    }
    if (!hasAsync) return value;
    return Promise.all(
      resolved.map(async ([k, v]) => [k, await v] as [string, unknown]),
    ).then(Object.fromEntries);
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
  props: HTMLAttributes | null | undefined,
): string | Promise<string> {
  if (!props) return "";

  const keys = Object.keys(props);
  const pending = new Map<string, Promise<unknown>>();

  // Single pass: detect AND collect promises
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (key === undefined) continue;
    const value = (props as any)[key];

    if (value instanceof Promise) {
      pending.set(key, value);
    } else if (Array.isArray(value)) {
      for (let j = 0; j < value.length; j++) {
        if (value[j] instanceof Promise) {
          pending.set(key, Promise.all(value.map((v) => Promise.resolve(v))));
          break;
        }
      }
    } else if (key === "style" && typeof value === "object") {
      const r = resolveNestedPromises(value);
      if (r instanceof Promise) pending.set(key, r);
    }
  }

  // Fast-path sync: no async work
  if (pending.size === 0) {
    return renderAttributesSync(props);
  }

  // Resolve only async values, keep sync ones as-is
  const asyncEntries = Array.from(pending.entries()).map(
    async ([key, promise]) => [key, await promise] as [string, unknown],
  );

  return Promise.all(asyncEntries).then((resolved) => {
    const resolvedProps = { ...props };
    for (const [key, value] of resolved) {
      resolvedProps[key] = value;
    }
    return renderAttributesSync(resolvedProps);
  });
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
function renderAttributesSync(props: HTMLAttributes): string {
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
      if (URL_ATTRIBUTES.has(name.toLowerCase()) && !isSafeUrl(str))
        str = "#blocked";
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
  const resolved = resolveNestedPromises(style);
  if (resolved instanceof Promise) {
    return resolved.then((r) => renderStyleSync(r as CSSProperties));
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
 * @returns A `string`, `RawString`, or `Promise<RawString>`.
 * **Callers must escape the `string` case** — a plain `string` return means an unescaped primitive
 * (e.g. `"hello"` or `"42"`). Use `isRawString(r) ? r.value : escape(String(r))` at every call-site.
 */
export function renderChild(
  child: JSXNode,
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
  props: HTMLAttributes,
  children: JSXNode[],
): RenderResult {
  if (!isValidTagName(tag)) {
    console.warn(
      `[jsx-string] Invalid tag name "${tag}" was skipped. Tag names must start with a letter and contain only letters, digits, or hyphens.`,
    );
    return new RawString("");
  }
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
