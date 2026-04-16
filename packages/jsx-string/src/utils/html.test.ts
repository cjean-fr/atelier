import {
  renderAttributes,
  renderChild,
  renderStyle,
  SafeString,
} from "./html.js";
import { expect, describe, it } from "bun:test";

const resolve = (v: string | Promise<string>) => Promise.resolve(v);

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

    it("should NOT drop inline event handlers if they are SafeString", () => {
      expect(
        renderAttributes({
          onclick: new SafeString("alert(`Hello ${this.dataset.name}`)"),
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
});

describe("renderChild", () => {
  it("should handle a mixed sync + async array", async () => {
    // Covers the branch in renderChild where hasAsync=true and Promise.all is used
    const mixed = [
      new SafeString("<b>safe</b>"),
      Promise.resolve("raw & text"),
      Promise.resolve(new SafeString("<i>also safe</i>")),
      "plain",
    ];
    const result = await renderChild(mixed);
    expect(result instanceof SafeString).toBe(true);
    // SafeString values pass through verbatim; plain strings and resolved strings are escaped
    expect((result as SafeString).value).toBe(
      "<b>safe</b>raw &amp; text<i>also safe</i>plain",
    );
  });
});

describe("régression — REGEX_CSS_URL lastIndex corrompu", () => {
  // ✅ Passe REGEX_CSS_UNSAFE, bloqué uniquement par isSafeUrl
  const UNSAFE_DATA = "url('data:text/html,<h1>xss</h1>')";

  it("⚠️  2e appel consécutif — lastIndex corrompu rate le match", async () => {
    // 1er appel : exec() trouve le match, lastIndex avance après le match,
    // isSafeUrl retourne false => early return => lastIndex reste != 0
    await resolve(renderStyle({ backgroundImage: UNSAFE_DATA }));

    // 2e appel : REGEX_CSS_URL.exec() repart du lastIndex précédent,
    // dépasse la fin de la chaîne => retourne null immédiatement
    // => la valeur unsafe est acceptée à tort
    const result = await resolve(renderStyle({ backgroundImage: UNSAFE_DATA }));

    expect(result).toBe(""); // ❌ ÉCHOUE si on utilise regex globale
  });
});
