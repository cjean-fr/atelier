import { renderAttributes, renderStyle } from "./html.js";
import { expect, describe, it } from "bun:test";

describe("HTML Utilities", () => {
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

    it("should drop inline event handlers", () => {
      expect(renderAttributes({ onClick: "alert(1)", id: "x" } as any)).toBe(
        ' id="x"',
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
});
