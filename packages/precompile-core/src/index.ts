export const RUNTIME_SOURCE = "@cjean-fr/jsx-string/jsx-runtime";

export function isLower(s: string): boolean {
  return s[0] !== undefined && s[0] === s[0].toLowerCase() && s[0] !== s[0].toUpperCase();
}

export function isLowercaseTag(name: string): boolean {
  return isLower(name);
}

export function normalizeText(text: string): string {
  return text
    .replace(/^[\r\n]+/, "")
    .replace(/[\r\n]+$/, "")
    .replace(/[\r\n]+/g, " ");
}

/**
 * Collapse the whitespace of a JSX text child the way the standard JSX
 * transform (Babel/TS/esbuild) does, so precompiled output matches what the
 * runtime path would render:
 *   - lines are split on newlines;
 *   - leading whitespace is stripped from every line but the first;
 *   - trailing whitespace is stripped from every line but the last;
 *   - blank lines are dropped, non-blank lines are joined with a single space;
 *   - tabs are treated as spaces.
 * A text node that is entirely whitespace spanning a newline collapses to "".
 */
export function collapseJsxWhitespace(text: string): string {
  const lines = text.split(/\r\n|\n|\r/);

  let lastNonEmptyLine = 0;
  for (let i = 0; i < lines.length; i++) {
    if (/[^ \t]/.test(lines[i] ?? "")) lastNonEmptyLine = i;
  }

  let out = "";
  for (let i = 0; i < lines.length; i++) {
    let line = (lines[i] ?? "").replace(/\t/g, " ");
    if (i !== 0) line = line.replace(/^ +/, "");
    if (i !== lines.length - 1) line = line.replace(/ +$/, "");
    if (line) {
      if (i !== lastNonEmptyLine) line += " ";
      out += line;
    }
  }
  return out;
}

export interface AttrBrief {
  kind: "attribute" | "spread";
  name?: string;
}

export function hasSpreadOrInnerHTML(attrs: Iterable<AttrBrief>): boolean {
  for (const a of attrs) {
    if (a.kind === "spread") return true;
    if (a.name === "dangerouslySetInnerHTML") return true;
  }
  return false;
}

/**
 * HTML5 void elements: they have no children and no closing tag.
 * Kept in sync with the runtime's own list so precompiled output renders
 * identically to the runtime renderer.
 * https://html.spec.whatwg.org/multipage/syntax.html#void-elements
 */
export const VOID_ELEMENTS = new Set<string>([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

export function isVoidElement(tag: string): boolean {
  return VOID_ELEMENTS.has(tag);
}

/**
 * Attributes whose value is a URL (or, for `srcset`, a list of URLs) and must
 * be sanitized against dangerous schemes (`javascript:`, `vbscript:`,
 * non-image `data:`). Kept in sync with the runtime's `URL_ATTRIBUTES`.
 */
export const URL_ATTRIBUTES = new Set<string>([
  "href",
  "src",
  "action",
  "formaction",
  "cite",
  "poster",
  "icon",
  "data",
  "xlink:href",
  "srcset",
]);

/**
 * True for attribute names whose value the runtime sanitizes for unsafe URL
 * schemes. The transform routes static literal values of these attributes
 * through `jsxAttr` so the same check applies at runtime instead of inlining
 * a potentially unsafe URL verbatim.
 */
export function isUrlAttribute(name: string): boolean {
  return URL_ATTRIBUTES.has(name.toLowerCase());
}

/**
 * camelCase JSX attribute names that map to a different HTML attribute name.
 * Mirror of the runtime's `ATTRIBUTE_NAME_MAP` (`jsx-string/src/utils/html.ts`)
 * — keep the two in sync. Every key contains an uppercase letter, so a name
 * with no uppercase is guaranteed not to need remapping.
 */
export const ATTRIBUTE_NAME_MAP = new Map<string, string>([
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

/**
 * Rewrite a JSX attribute name to its HTML form (`className` → `class`, …).
 * Names not in the map are returned unchanged. The transform applies this at
 * build time so static attributes stay inlined — same as Deno's precompile.
 */
export function remapAttrName(name: string): string {
  return ATTRIBUTE_NAME_MAP.get(name) ?? name;
}

const REGEX_EVENT_HANDLER = /^on[a-z]/i;

/** True for `on*` event-handler attribute names (e.g. `onClick`, `onclick`). */
export function isEventHandlerName(name: string): boolean {
  return REGEX_EVENT_HANDLER.test(name);
}

const REGEX_VALID_ATTR_NAME = /^[^\s"'>/=\p{C}]+$/u;

/**
 * True when `name` is a syntactically valid HTML attribute name (no
 * whitespace, quotes, brackets, `=`, `/`, or Unicode "Other" chars). Mirrors
 * the runtime's `isValidAttrName`. The transform only inlines a static
 * attribute when its name is valid AND needs no remapping.
 */
export function isValidAttrName(name: string): boolean {
  return REGEX_VALID_ATTR_NAME.test(name);
}

const REGEX_ATTR_TEST = /[&<>"]/;

/**
 * Escape `&`, `<`, `>`, `"` for a double-quoted HTML attribute value.
 *
 * Mirrors the runtime's `escapeAttr` exactly so that static attribute values
 * inlined at build time render identically to dynamic values routed through
 * `jsxAttr` at runtime. Single quotes are safe inside double-quoted attrs.
 */
export function escapeAttr(str: string): string {
  if (!REGEX_ATTR_TEST.test(str)) return str;
  let out = "";
  let last = 0;
  for (let i = 0; i < str.length; i++) {
    let rep: string;
    switch (str.charCodeAt(i)) {
      case 38: // &
        rep = "&amp;";
        break;
      case 60: // <
        rep = "&lt;";
        break;
      case 62: // >
        rep = "&gt;";
        break;
      case 34: // "
        rep = "&quot;";
        break;
      default:
        continue;
    }
    if (i !== last) out += str.slice(last, i);
    out += rep;
    last = i + 1;
  }
  return out + str.slice(last);
}
