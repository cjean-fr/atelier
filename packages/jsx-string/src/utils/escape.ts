// https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html

/**
 * OWASP Rule #2: Attribute Encode
 */
const ESC_CHAR_MAP: Map<string, string> = new Map([
  ["&", "&amp;"],
  ["<", "&lt;"],
  [">", "&gt;"],
  ['"', "&quot;"],
  ["'", "&#x27;"],
]);

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
]);

const REGEX_CONTENT = /[&<>]/g;
const REGEX_ATTR = /[&<>"]/g;
const REGEX_OTHER_UNICODE_CHARS = /\p{C}/gu;
const REGEX_VALID_ATTR_NAME = /^[^\s"'>/=]+$/u;
const REGEX_UNSAFE_PROTOCOLS = /^(?:java|vb)script:/i;
const REGEX_NON_IMAGE_DATA_URI = /^data:(?!image\/)/i;

/**
 * Strips all 'Other' Unicode characters (controls, invisible formatters, etc.).
 */
export const sanitize = (str: string): string => {
  return str.replace(REGEX_OTHER_UNICODE_CHARS, "");
};

/**
 * Escapes a string for HTML content or attributes.
 * Focused only on encoding characters that have special meaning in HTML.
 */
export const escape = (
  str: string,
  type: "content" | "attr" = "content",
): string => {
  const regex = type === "attr" ? REGEX_ATTR : REGEX_CONTENT;
  return str.replaceAll(regex, (char) => ESC_CHAR_MAP.get(char) ?? char);
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
