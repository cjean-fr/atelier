import { escape, isSafeUrl, isValidAttrName, sanitize } from "./escape.js";
import { describe, it, expect } from "bun:test";

describe("escape utilities", () => {
  describe("escape", () => {
    it("should escape for HTML content and attributes", () => {
      // Content
      expect(escape("<b>\"Hello\" & 'World'</b>", "content")).toBe(
        "&lt;b&gt;\"Hello\" &amp; 'World'&lt;/b&gt;",
      );
      // Attributes
      const attr = escape("\"><script>'", "attr");
      expect(attr).toBe("&quot;&gt;&lt;script&gt;'");
      // Untouched
      expect(escape("Hello 123")).toBe("Hello 123");
    });
  });

  describe("isSafeUrl", () => {
    it("should allow safe URLs and data-images", () => {
      expect(isSafeUrl("https://example.com")).toBe(true);
      expect(isSafeUrl("/path")).toBe(true);
      expect(isSafeUrl("data:image/png;base64,abc")).toBe(true);
      expect(isSafeUrl("")).toBe(true);
    });

    it("should block dangerous protocols and bypasses", () => {
      expect(isSafeUrl("javascript:alert(1)")).toBe(false);
      expect(isSafeUrl("  JAVASCRIPT:alert(1)")).toBe(false);
      expect(isSafeUrl("java\0script:alert(1)")).toBe(false);
      expect(isSafeUrl("data:text/html,hack")).toBe(false);
      expect(isSafeUrl("java\tscript:alert(1)")).toBe(false);
      expect(isSafeUrl("java\nscript:alert(1)")).toBe(false);
    });
  });

  describe("sanitize", () => {
    it("should remove all invisible Unicode characters", () => {
      expect(sanitize("a\0b\u0001c\u200Bd")).toBe("abcd");
    });
  });

  describe("isValidAttrName", () => {
    it("should allow standard, framework and special symbols", () => {
      const valid = [
        "class",
        "data-f",
        "@click",
        "[prop]",
        "(evt)",
        "x:y",
        "a.b",
        "_",
        "$",
      ];
      valid.forEach((name) => expect(isValidAttrName(name)).toBe(true));
    });

    it("should block structural separators", () => {
      const invalid = ["a b", "a=", 'a"', "a'", "a>", "a/"];
      invalid.forEach((name) => expect(isValidAttrName(name)).toBe(false));
    });
  });
});
