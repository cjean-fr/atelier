import type { JSXChild } from "./core/types.js";
import {
  h,
  jsx,
  Fragment,
  renderToString,
  renderToStringAsync,
  isAsync,
  RawString,
} from "./index.js";
import { expect, describe, it } from "bun:test";

describe("integration", () => {
  describe("factories", () => {
    it("should support h() and jsx() factories", () => {
      expect(h("div", { id: "1" }, "test").toString()).toBe(
        '<div id="1">test</div>',
      );
      expect(jsx("span", { children: "ok" }).toString()).toBe(
        "<span>ok</span>",
      );
    });

    it("should support Classic JSX runtime (children as extra arguments)", () => {
      // @ts-ignore
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
      // @ts-ignore
      const element = jsx("div", { children: "Props Child" }, "Extra Child");
      expect(renderToString(element)).toBe("<div>Props Child</div>");
    });

    it("should handle Fragments", () => {
      const result = jsx(Fragment, {
        children: [jsx("b", {}), jsx("i", {})],
      });
      expect(renderToString(result)).toBe("<b></b><i></i>");
    });

    it("should handle nested Fragments", () => {
      const result = jsx(Fragment, {
        children: jsx(Fragment, {
          children: jsx(Fragment, {
            children: "deep",
          }),
        }),
      });
      expect(renderToString(result)).toBe("deep");
    });
  });

  describe("components", () => {
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

    it("should handle components returning Fragments without array leakage (commas)", () => {
      const List = () =>
        jsx(Fragment, {
          children: [
            jsx("li", { children: "1" }),
            jsx("li", { children: "2" }),
          ],
        });
      const App = () => jsx("ul", { children: jsx(List, {}) });

      expect(renderToString(jsx(App, {}))).toBe(
        "<ul><li>1</li><li>2</li></ul>",
      );

      // Crucially, the return value of jsx(List) should be a RawString, not an array
      const result = jsx(List, {});
      expect(Array.isArray(result)).toBe(false);
      expect(renderToString(result)).toBe("<li>1</li><li>2</li>");
    });
  });

  describe("async rendering", () => {
    it("should support async components", async () => {
      const AsyncComp = async () => {
        await new Promise((r) => setTimeout(r, 5));
        return jsx("div", { children: "Async" });
      };
      const html = await renderToStringAsync(jsx(AsyncComp, {}));
      expect(html).toBe("<div>Async</div>");
    });

    it("should handle async components returning Fragments", async () => {
      const AsyncList = async () => {
        await Promise.resolve();
        return jsx(Fragment, {
          children: [
            jsx("li", { children: "1" }),
            jsx("li", { children: "2" }),
          ],
        });
      };
      const result = jsx(AsyncList, {});
      expect(result).toBeInstanceOf(Promise);
      const html = await renderToStringAsync(result);
      expect(html).toBe("<li>1</li><li>2</li>");
    });

    it("should support nested promises", async () => {
      const element = jsx("div", {
        children: [Promise.resolve("A"), " ", Promise.resolve("B")],
      });
      expect(await renderToStringAsync(element)).toBe("<div>A B</div>");
    });
  });

  describe("edge cases", () => {
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

    it("should sanitize srcset attribute", () => {
      expect(
        renderToString(jsx("img", { srcset: "javascript:alert(1) 1x" })),
      ).toBe('<img srcset="#blocked">');
    });
  });

  describe("raw string top-level", () => {
    it("should return RawString.value unchanged (sync)", () => {
      const rawString = new RawString("<b>trusted</b>");
      expect(renderToString(rawString)).toBe("<b>trusted</b>");
    });

    it("should resolve and return RawString.value unchanged (async)", async () => {
      const rawString = new RawString("<i>async-trusted</i>");
      const result = await renderToStringAsync(Promise.resolve(rawString));
      expect(result).toBe("<i>async-trusted</i>");
    });
  });

  describe("hardening & normalization", () => {
    it("should normalize camelCase HTML attributes to lowercase", () => {
      expect(renderToString(jsx("div", { tabIndex: 1 }))).toBe(
        '<div tabindex="1"></div>',
      );
      expect(renderToString(jsx("input", { readOnly: true }))).toBe(
        "<input readonly>",
      );
      expect(renderToString(jsx("button", { autoFocus: true }))).toBe(
        "<button autofocus></button>",
      );
    });

    it("should preserve case-sensitive SVG attributes", () => {
      const svg = jsx("svg", {
        viewBox: "0 0 10 10",
        children: jsx("circle", { strokeWidth: "2" }),
      });
      expect(renderToString(svg)).toBe(
        '<svg viewBox="0 0 10 10"><circle strokeWidth="2"></circle></svg>',
      );
    });

    it("should preserve unknown camelCase attributes (except data-*/aria-*)", () => {
      // @ts-ignore
      expect(renderToString(jsx("div", { customOption: "foo" }))).toBe(
        '<div customOption="foo"></div>',
      );
      // @ts-ignore
      expect(renderToString(jsx("div", { dataTestId: "123" }))).toBe(
        '<div dataTestId="123"></div>',
      );
      // @ts-ignore
      expect(renderToString(jsx("div", { "data-testId": "123" }))).toBe(
        '<div data-test-id="123"></div>',
      );
    });
  });

  describe("api consistency", () => {
    it("should throw on async in renderToString", () => {
      const Async = async () => "foo";
      // @ts-ignore
      expect(() => renderToString(jsx(Async, {}))).toThrow(/asynchronous/);
    });

    it("should handle isAsync correctly", () => {
      expect(isAsync(Promise.resolve())).toBe(true);
      expect(isAsync("not-promise")).toBe(false);
    });

    it("should escape event handlers as strings to prevent XSS", () => {
      const html = renderToString(
        jsx("button", {
          onClick: "alert('XSS')",
          onmouseover: 'console.log("hover")',
        }),
      );
      expect(html).toContain("onclick=\"alert('XSS')\"");
      expect(html).toContain('onmouseover="console.log(&quot;hover&quot;)"');
    });
  });
});
