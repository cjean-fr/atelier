// https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html

/**
 * Attributes that expect a URL and should be sanitized.
 */
export const URL_ATTRIBUTES: Set<string> = new Set([
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

const REGEX_CONTENT_TEST = /[&<>]/;
const REGEX_ATTR_TEST = /[&<>"]/;
const REGEX_OTHER_UNICODE_CHARS_TEST = /\p{C}/u;
const REGEX_OTHER_UNICODE_CHARS_REPLACE = /\p{C}/gu;
// Reject whitespace, quotes, angle brackets, `=`, `/`, AND any Unicode "Other"
// codepoint (controls, formatters, surrogates, etc.) in one pass. This lets
// `renderAttributeSync`'s hot path validate with a single regex test for
// clean ASCII names — only names that fail need the slower `sanitize` retry.
const REGEX_VALID_ATTR_NAME = /^[^\s"'<>/=\p{C}]+$/u;
const REGEX_VALID_TAG_NAME = /^[a-zA-Z][a-zA-Z0-9-]*$/;
const REGEX_UNSAFE_PROTOCOLS = /^(?:java|vb)script:/i;
const REGEX_NON_IMAGE_DATA_URI = /^data:(?!image\/)/i;

/**
 * Strips all 'Other' Unicode characters (controls, invisible formatters, etc.).
 */
export const sanitize = (str: string): string => {
  if (!REGEX_OTHER_UNICODE_CHARS_TEST.test(str)) {
    return str;
  }
  return str.replace(REGEX_OTHER_UNICODE_CHARS_REPLACE, "");
};

/**
 * Escape `&`, `<`, `>` for HTML text content.
 *
 * Two-stage strategy: an upfront `regex.test` (highly optimized native scan)
 * short-circuits for strings with no escapable char — the common case for
 * benign user text. Only when an escape is required do we walk the string
 * with `charCodeAt` + `slice`, which is still faster than `replaceAll` with
 * a callback (no per-match function dispatch).
 */
export const escapeContent = (str: string): string => {
  if (!REGEX_CONTENT_TEST.test(str)) return str;
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
      default:
        continue;
    }
    if (i !== last) out += str.slice(last, i);
    out += rep;
    last = i + 1;
  }
  return out + str.slice(last);
};

/**
 * Escape `&`, `<`, `>`, `"` for HTML attribute values (which we always wrap in
 * double quotes). Single quotes don't need escaping in double-quoted attrs.
 * Same two-stage strategy as {@link escapeContent}.
 */
export const escapeAttr = (str: string): string => {
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
};

/**
 * OWASP Rule #5: URL Sanitize
 * Blocks dangerous protocols like javascript:, vbscript:, and non-image data URIs.
 * Handles null bytes and common obfuscation attempts by sanitizing first.
 */
export const isSafeUrl = (url: string): boolean => {
  const sanitized = sanitize(url).trim();

  if (!sanitized) return true;
  if (REGEX_UNSAFE_PROTOCOLS.test(sanitized)) return false;
  if (REGEX_NON_IMAGE_DATA_URI.test(sanitized)) return false;

  return true;
};

/**
 * `srcset` is a comma-separated list of image candidates, not a single URL.
 * Block if any candidate URL uses a dangerous scheme.
 */
export const isSafeSrcset = (srcset: string): boolean => {
  const sanitized = sanitize(srcset).trim();
  if (!sanitized) return true;

  for (const candidate of sanitized.split(",")) {
    const url = candidate.trimStart().split(/\s+/, 1)[0] ?? "";
    if (!isSafeUrl(url)) return false;
  }

  return true;
};

export const isValidAttrName = (name: string): boolean => {
  return REGEX_VALID_ATTR_NAME.test(name);
};

export const isValidTagName = (name: string): boolean => {
  return REGEX_VALID_TAG_NAME.test(name);
};
