import type { JSXChild } from "./core/types.js";
import { h, jsx, Fragment, renderToString } from "./index.js";
import { expect, describe, it } from "bun:test";

describe("jsx-string (Integration)", () => {
  describe("Factories", () => {
    it("should support h() and jsx() factories", () => {
      expect(h("div", { id: "1" }, "test").toString()).toBe(
        '<div id="1">test</div>',
      );
      expect(jsx("span", { children: "ok" }).toString()).toBe(
        "<span>ok</span>",
      );
    });

    it("should handle Fragments", () => {
      const result = jsx(Fragment, {
        children: [jsx("b", {}), jsx("i", {})],
      });
      expect(renderToString(result)).toBe("<b></b><i></i>");
    });
  });

  describe("Components", () => {
    it("should render functional components", () => {
      const Button = ({ label }: { label: string }) =>
        jsx("button", { children: label });
      expect(renderToString(jsx(Button, { label: "Click" }))).toBe(
        "<button>Click</button>",
      );
    });

    it("should handle nested components with children", () => {
      const Box = ({ children }: { children?: JSXChild }) =>
        jsx("div", { class: "box", children });
      const App = () => jsx(Box, { children: jsx("p", { children: "Hello" }) });
      expect(renderToString(jsx(App, {}))).toBe(
        '<div class="box"><p>Hello</p></div>',
      );
    });
  });

  describe("Async Rendering", () => {
    it("should support async components", async () => {
      const AsyncComp = async () => {
        await new Promise((r) => setTimeout(r, 5));
        return jsx("div", { children: "Async" });
      };
      const html = await renderToString(jsx(AsyncComp, {}));
      expect(html).toBe("<div>Async</div>");
    });

    it("should support nested promises", async () => {
      const element = jsx("div", {
        children: [Promise.resolve("A"), " ", Promise.resolve("B")],
      });
      expect(await renderToString(element)).toBe("<div>A B</div>");
    });
  });

  describe("Edge Cases", () => {
    it("should handle null/undefined/boolean children", () => {
      expect(
        renderToString(
          jsx("div", { children: [null, undefined, false, true] }),
        ),
      ).toBe("<div></div>");
    });

    it("should handle dangerouslySetInnerHTML", () => {
      expect(
        jsx("div", {
          dangerouslySetInnerHTML: { __html: "<b></b>" },
        }).toString(),
      ).toBe("<div><b></b></div>");
    });

    it("should handle exotic types like Symbol or BigInt gracefully", () => {
      const sym = Symbol("test");
      const big = BigInt(123);
      expect(renderToString(jsx("div", { children: [sym, " ", big] }))).toBe(
        `<div>Symbol(test) 123</div>`,
      );
    });

    it("should skip null or undefined values in style objects", () => {
      expect(
        jsx("div", {
          style: {
            color: "red",
            marginTop: undefined,
            marginContent: null,
          } as any,
        }).toString(),
      ).toBe('<div style="color:red"></div>');
    });
  });
});
