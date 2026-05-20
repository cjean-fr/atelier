// https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html

/**
 * OWASP Rule #2: Attribute Encode
 */
const ESC_CHAR_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/**
 * Attributes that expect a URL and should be sanitized.
 */
export const URL_ATTRIBUTES = new Set([
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
const REGEX_CONTENT_REPLACE = /[&<>]/g;
const REGEX_ATTR_TEST = /[&<>"]/;
const REGEX_ATTR_REPLACE = /[&<>"]/g;
const REGEX_OTHER_UNICODE_CHARS_TEST = /\p{C}/u;
const REGEX_OTHER_UNICODE_CHARS_REPLACE = /\p{C}/gu;
const REGEX_VALID_ATTR_NAME = /^[^\s"'>/=]+$/u;
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
 * Escapes a string for HTML content.
 * Focused only on encoding characters that have special meaning in HTML.
 */
export const escapeContent = (str: string): string => {
  if (!REGEX_CONTENT_TEST.test(str)) {
    return str;
  }
  return str.replaceAll(
    REGEX_CONTENT_REPLACE,
    (char) => ESC_CHAR_MAP[char] ?? char,
  );
};

/**
 * Escapes a string for HTML attributes.
 * Focused only on encoding characters that have special meaning in HTML.
 */
export const escapeAttr = (str: string): string => {
  if (!REGEX_ATTR_TEST.test(str)) {
    return str;
  }
  return str.replaceAll(
    REGEX_ATTR_REPLACE,
    (char) => ESC_CHAR_MAP[char] ?? char,
  );
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

export const isValidAttrName = (name: string): boolean => {
  return REGEX_VALID_ATTR_NAME.test(name);
};

export const isValidTagName = (name: string): boolean => {
  return REGEX_VALID_TAG_NAME.test(name);
};
