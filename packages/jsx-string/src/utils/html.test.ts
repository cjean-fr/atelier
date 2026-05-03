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

    it("should handle className alone", () => {
      expect(renderAttributes({ className: "only-class" })).toBe(
        ' class="only-class"',
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

    it("should handle style as raw string", () => {
      expect(renderAttributes({ style: "color: red; margin-top: 10px;" })).toBe(
        ' style="color: red; margin-top: 10px;"',
      );
    });

    it("should block unsafe URLs", () => {
      expect(renderAttributes({ href: "javascript:alert(1)" })).toBe(
        ' href="#blocked"',
      );
    });

    it("should allow safe data: image URLs", () => {
      expect(renderAttributes({ src: "data:image/png;base64,abc" })).toBe(
        ' src="data:image/png;base64,abc"',
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

    it("should allow safe url() in CSS", async () => {
      const result = await renderAttributes({
        style: { backgroundImage: "url(https://example.com/img.png)" },
      });
      expect(result).toContain("url(https://example.com/img.png)");
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

    it("should ignore null and undefined values", () => {
      expect(renderAttributes({ id: "ok", foo: null, bar: undefined })).toBe(
        ' id="ok"',
      );
    });

    it("should convert kebab-case data-* and aria-* attributes", () => {
      expect(
        renderAttributes({ "data-test-id": "123", "aria-label": "test" }),
      ).toBe(' data-test-id="123" aria-label="test"');
    });

    it("should preserve camelCase data-* attributes as-is", () => {
      expect(renderAttributes({ dataTestId: "123", ariaLabel: "test" })).toBe(
        ' dataTestId="123" ariaLabel="test"',
      );
    });

    it("should preserve kebab-case data-* attributes", () => {
      expect(renderAttributes({ "data-test-id": "123" })).toBe(
        ' data-test-id="123"',
      );
    });

    it("should resolve a direct Promise in an attribute", async () => {
      const result = await renderAttributes({
        title: Promise.resolve("async title") as any,
      });
      expect(result).toBe(' title="async title"');
    });

    it("should resolve promises in array attribute values", async () => {
      const result = await renderAttributes({
        // @ts-ignore
        "data-items": [Promise.resolve("a"), Promise.resolve("b")],
      });
      expect(result).toBe(' data-items="a,b"');
    });

    it("should handle mixed sync/async in same props object", async () => {
      const result = await renderAttributes({
        id: "static",
        title: Promise.resolve("async-title") as any,
        class: "static-class",
      });
      expect(result).toContain('id="static"');
      expect(result).toContain('class="static-class"');
      expect(result).toContain('title="async-title"');
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

    it("should handle a direct Promise child", async () => {
      const result = await renderChild(Promise.resolve("async text"));
      expect(result instanceof RawString).toBe(true);
      expect((result as RawString).value).toBe("async text");
    });

    it("should handle a direct RawString child", () => {
      const result = renderChild(raw("<b>raw</b>"));
      expect(result instanceof RawString).toBe(true);
      expect((result as RawString).value).toBe("<b>raw</b>");
    });

    it("should handle a plain string child", () => {
      const result = renderChild("hello");
      expect(typeof result).toBe("string");
      expect(result).toBe("hello");
    });

    it("should handle a number child", () => {
      const result = renderChild(42);
      expect(typeof result).toBe("string");
      expect(result).toBe("42");
    });

    it("should handle an empty array", () => {
      const result = renderChild([]);
      expect(result instanceof RawString).toBe(true);
      expect((result as RawString).value).toBe("");
    });

    it("should handle a fully synchronous array", () => {
      const result = renderChild(["a", "b", new RawString("<c>")]);
      expect(result instanceof RawString).toBe(true);
      expect((result as RawString).value).toBe("ab<c>");
    });

    it("should handle array with null/undefined/boolean values", () => {
      const result = renderChild(["a", null, undefined, false, true, "b"]);
      expect(result instanceof RawString).toBe(true);
      expect((result as RawString).value).toBe("ab");
    });

    it("should handle deeply nested promises in array", async () => {
      const result = await renderChild([
        Promise.resolve(Promise.resolve("deep")),
      ]);
      expect((result as RawString).value).toBe("deep");
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
