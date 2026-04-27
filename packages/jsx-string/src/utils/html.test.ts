import {
  renderAttributes,
  renderChild,
  renderStyle,
  RawString,
  raw,
} from "./html.js";
import { expect, describe, it } from "bun:test";

const resolve = (v: string | Promise<string>) => Promise.resolve(v);

describe("html utilities", () => {
  describe("raw utility", () => {
    it("should create a RawString instance", () => {
      const r = raw("<b>test</b>");
      expect(r).toBeInstanceOf(RawString);
      expect(r.value).toBe("<b>test</b>");
    });
  });

  describe("renderAttributes", () => {
    it("should handle class and className merging", () => {
      expect(renderAttributes({ class: "a", className: "b" })).toBe(
        ' class="a b"',
      );
    });

    it("should handle boolean attributes", () => {
      expect(renderAttributes({ disabled: true, checked: false })).toBe(
        " disabled",
      );
    });

    it("should handle style objects", () => {
      expect(
        renderAttributes({ style: { color: "red", marginTop: "10px" } }),
      ).toBe(' style="color:red;margin-top:10px"');
    });

    it("should block unsafe URLs", () => {
      expect(renderAttributes({ href: "javascript:alert(1)" })).toBe(
        ' href="#blocked"',
      );
    });

    it("should support string event handlers and block non-string values", () => {
      expect(
        renderAttributes({
          onClick: "alert('hello')",
          onHover: (() => {}) as any,
          id: "btn",
        }),
      ).toBe(' onclick="alert(\'hello\')" id="btn"');
    });

    it("should support custom event handler with template literals", () => {
      expect(
        renderAttributes({
          onclick: "alert(`Hello ${this.dataset.name}`)",
          "data-name": "World",
        }),
      ).toBe(
        ' onclick="alert(`Hello ${this.dataset.name}`)" data-name="World"',
      );
    });

    it("should filter unsafe CSS values", () => {
      expect(
        renderAttributes({
          style: {
            backgroundImage: "url(javascript:alert(1))",
            color: "red",
          },
        }),
      ).toBe(' style="color:red"');
    });

    it("should resolve promises inside style objects", async () => {
      await expect(
        renderAttributes({
          style: { color: Promise.resolve("red") as any },
        }),
      ).resolves.toBe(' style="color:red"');
    });

    it("should ignore internal props", () => {
      expect(renderAttributes({ key: "1", ref: "r", id: "ok" })).toBe(
        ' id="ok"',
      );
    });
  });

  describe("renderStyle", () => {
    it("should convert camelCase to kebab-case", () => {
      expect(renderStyle({ backgroundColor: "red", "--custom": "blue" })).toBe(
        "background-color:red;--custom:blue",
      );
    });

    it("should drop unsafe CSS values", () => {
      expect(
        renderStyle({
          backgroundImage: "url(javascript:alert(1))",
          color: "red",
        }),
      ).toBe("color:red");
    });

    it("should resolve promises in style values", async () => {
      await expect(
        renderStyle({ color: Promise.resolve("red") as any }),
      ).resolves.toBe("color:red");
    });
  });

  describe("renderChild", () => {
    it("should handle a mixed sync + async array", async () => {
      const mixed = [
        new RawString("<b>safe</b>"),
        Promise.resolve("raw & text"),
        Promise.resolve(new RawString("<i>also safe</i>")),
        "plain",
      ];
      const result = await renderChild(mixed);
      expect(result instanceof RawString).toBe(true);
      expect((result as RawString).value).toBe(
        "<b>safe</b>raw &amp; text<i>also safe</i>plain",
      );
    });
  });

  describe("regression — REGEX_CSS_URL lastIndex corruption", () => {
    const UNSAFE_DATA = "url('data:text/html,<h1>xss</h1>')";

    it("should block unsafe data on consecutive calls", async () => {
      // First call: exec() finds the match, lastIndex moves past the match.
      // isSafeUrl returns false => early return => lastIndex remains non-zero.
      await resolve(renderStyle({ backgroundImage: UNSAFE_DATA }));

      // Second call: REGEX_CSS_URL.exec() starts from the previous lastIndex.
      // If it exceeds the string length, it returns null immediately, potentially
      // accepting an unsafe value incorrectly if not handled.
      const result = await resolve(
        renderStyle({ backgroundImage: UNSAFE_DATA }),
      );

      expect(result).toBe("");
    });
  });
});
