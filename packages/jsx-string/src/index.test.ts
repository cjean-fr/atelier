import type { JSXChild } from "./core/types.js";
import { h, jsx, Fragment, renderToString, SafeString } from "./index.js";
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

    it("should support Classic JSX runtime (children as extra arguments)", () => {
      // @ts-ignore - simulating classic runtime call jsx(tag, props, ...children)
      const element = jsx(
        "div",
        { id: "parent" },
        jsx("span", {}, "Child 1"),
        jsx("span", {}, "Child 2"),
      );

      expect(renderToString(element)).toBe(
        '<div id="parent"><span>Child 1</span><span>Child 2</span></div>',
      );
    });

    it("should prioritize props.children over extra arguments if both exist", () => {
      // @ts-ignore - simulating mixed usage
      const element = jsx("div", { children: "Props Child" }, "Extra Child");
      expect(renderToString(element)).toBe("<div>Props Child</div>");
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
    it("should map htmlFor to for", () => {
      expect(
        renderToString(jsx("label", { htmlFor: "input", children: "Name" })),
      ).toBe('<label for="input">Name</label>');
    });

    it("should preserve SVG case-sensitive attrs and map xlinkHref", () => {
      const element = jsx("svg", {
        viewBox: "0 0 10 10",
        children: jsx("use", { xlinkHref: "javascript:alert(1)" }),
      });
      expect(renderToString(element)).toBe(
        '<svg viewBox="0 0 10 10"><use xlink:href="#blocked"></use></svg>',
      );
    });

    it("should treat undefined dangerouslySetInnerHTML as empty", () => {
      expect(
        jsx("div", {
          dangerouslySetInnerHTML: { __html: undefined as any },
        }).toString(),
      ).toBe("<div></div>");
    });

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

  describe("SafeString top-level", () => {
    it("should return SafeString.value unchanged (sync)", () => {
      const safe = new SafeString("<b>trusted</b>");
      expect(renderToString(safe)).toBe("<b>trusted</b>");
    });

    it("should resolve and return SafeString.value unchanged (async)", async () => {
      const safe = new SafeString("<i>async-trusted</i>");
      const result = await renderToString(Promise.resolve(safe));
      expect(result).toBe("<i>async-trusted</i>");
    });
  });
});
