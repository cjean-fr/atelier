// @jsxImportSource @cjean-fr/jsx-string
import type { JSXNode } from "./core/types.js";
import { renderToString, raw } from "./index.js";
import { jsx, Fragment } from "./jsx-runtime.js";
import { expect, describe, it } from "bun:test";

describe("integration", () => {
  describe("factories", () => {
    it("should support jsx() factory", () => {
      expect(jsx("span", { children: "ok" }).toString()).toBe(
        "<span>ok</span>",
      );
    });

    it("should support Classic JSX runtime (children as extra arguments)", async () => {
      // @ts-ignore
      const element = jsx(
        "div",
        { id: "parent" },
        jsx("span", {}, "Child 1"),
        jsx("span", {}, "Child 2"),
      );

      expect(await renderToString(element)).toBe(
        '<div id="parent"><span>Child 1</span><span>Child 2</span></div>',
      );
    });

    it("should prioritize props.children over extra arguments if both exist", async () => {
      // @ts-ignore
      const element = jsx("div", { children: "Props Child" }, "Extra Child");
      expect(await renderToString(element)).toBe("<div>Props Child</div>");
    });

    it("should handle Fragments", async () => {
      const result = jsx(Fragment, {
        children: [jsx("b", {}), jsx("i", {})],
      });
      expect(await renderToString(result)).toBe("<b></b><i></i>");
    });

    it("should handle nested Fragments", async () => {
      const result = (
        <>
          <>
            <>deep</>
          </>
        </>
      );
      expect(await renderToString(result)).toBe("deep");
    });
  });

  describe("components", () => {
    it("should render functional components", async () => {
      const Button = ({ label }: { label: string }) => <button>{label}</button>;
      expect(await renderToString(<Button label="Click" />)).toBe(
        "<button>Click</button>",
      );
    });

    it("should handle nested components with children", async () => {
      const Box = ({ children }: { children?: JSXNode }) => (
        <div class="box">{children}</div>
      );
      const App = () => (
        <Box>
          <p>Hello</p>
        </Box>
      );
      expect(await renderToString(<App />)).toBe(
        '<div class="box"><p>Hello</p></div>',
      );
    });

    it("should handle components returning Fragments without array leakage (commas)", async () => {
      const List = () => (
        <>
          <li>1</li>
          <li>2</li>
        </>
      );
      const App = () => (
        <ul>
          <List />
        </ul>
      );

      expect(await renderToString(jsx(App, {}))).toBe(
        "<ul><li>1</li><li>2</li></ul>",
      );

      // Crucially, the return value of jsx(List) should be a RawString, not an array
      const result = jsx(List, {});
      expect(Array.isArray(result)).toBe(false);
      expect(await renderToString(result)).toBe("<li>1</li><li>2</li>");
    });
  });

  describe("async rendering", () => {
    it("should support async components", async () => {
      const AsyncComp = async () => {
        await new Promise((r) => setTimeout(r, 5));
        return <div>Async</div>;
      };
      const html = await renderToString(<AsyncComp />);
      expect(html).toBe("<div>Async</div>");
    });

    it("should handle async components returning Fragments", async () => {
      const AsyncList = async () => {
        await Promise.resolve();
        return (
          <>
            <li>1</li>
            <li>2</li>
          </>
        );
      };
      const result = <AsyncList />;
      expect(result).toBeInstanceOf(Promise);
      const html = await renderToString(result);
      expect(html).toBe("<li>1</li><li>2</li>");
    });

    it("should support nested promises", async () => {
      const element = (
        <div>
          {Promise.resolve("A")} {Promise.resolve("B")}
        </div>
      );
      expect(await renderToString(element)).toBe("<div>A B</div>");
    });
  });

  describe("edge cases", () => {
    it("should map htmlFor to for", async () => {
      expect(await renderToString(<label htmlFor="input">Name</label>)).toBe(
        '<label for="input">Name</label>',
      );
    });

    it("should preserve SVG case-sensitive attrs and map xlinkHref", async () => {
      const element = (
        <svg viewBox="0 0 10 10">
          <use xlinkHref="javascript:alert(1)" />
        </svg>
      );
      expect(await renderToString(element)).toBe(
        '<svg viewBox="0 0 10 10"><use xlink:href="#blocked"></use></svg>',
      );
    });

    it("should treat undefined dangerouslySetInnerHTML as empty", async () => {
      expect(
        await renderToString(
          <div dangerouslySetInnerHTML={{ __html: undefined as any }}></div>,
        ),
      ).toBe("<div></div>");
    });

    it("should handle null/undefined/boolean children", async () => {
      expect(
        await renderToString(
          <div children={[null, undefined, false, true]}></div>,
        ),
      ).toBe("<div></div>");
    });

    it("should handle dangerouslySetInnerHTML", async () => {
      expect(
        await renderToString(
          <div dangerouslySetInnerHTML={{ __html: "<b></b>" }}></div>,
        ),
      ).toBe("<div><b></b></div>");
    });

    it("should handle exotic types like Symbol or BigInt gracefully", async () => {
      const sym = Symbol("test");
      const big = BigInt(123);
      expect(await renderToString(<div children={[sym, " ", big]} />)).toBe(
        `<div>Symbol(test) 123</div>`,
      );
    });

    it("should skip null or undefined values in style objects", async () => {
      expect(
        await renderToString(
          <div
            style={
              {
                color: "red",
                marginTop: undefined,
                marginContent: null,
              } as any
            }
          ></div>,
        ),
      ).toBe('<div style="color:red"></div>');
    });

    it("should sanitize srcset attribute", async () => {
      expect(
        await renderToString(<img srcSet="javascript:alert(1) 1x" />),
      ).toBe('<img srcset="#blocked">');
    });
  });

  describe("raw string top-level", () => {
    it("should return raw() value unchanged", async () => {
      expect(await renderToString(raw("<b>trusted</b>"))).toBe(
        "<b>trusted</b>",
      );
    });
  });

  describe("hardening & normalization", () => {
    it("should normalize camelCase HTML attributes to lowercase", async () => {
      expect(await renderToString(<div tabIndex={1} />)).toBe(
        '<div tabindex="1"></div>',
      );
      expect(await renderToString(<input readOnly={true} />)).toBe(
        "<input readonly>",
      );
      expect(await renderToString(<button autoFocus={true} />)).toBe(
        "<button autofocus></button>",
      );
    });

    it("should preserve case-sensitive SVG attributes", async () => {
      const svg = (
        <svg viewBox="0 0 10 10">
          <circle strokeWidth="2" />
        </svg>
      );
      expect(await renderToString(svg)).toBe(
        '<svg viewBox="0 0 10 10"><circle strokeWidth="2"></circle></svg>',
      );
    });

    it("should preserve unknown attributes verbatim regardless of casing", async () => {
      // @ts-ignore
      expect(await renderToString(<div customOption="foo" />)).toBe(
        '<div customOption="foo"></div>',
      );
      // @ts-ignore
      expect(await renderToString(<div dataTestId="123" />)).toBe(
        '<div dataTestId="123"></div>',
      );
      // @ts-ignore
      expect(await renderToString(<div data-test-id="123" />)).toBe(
        '<div data-test-id="123"></div>',
      );
    });
  });

  describe("api consistency", () => {
    it("should escape event handlers to ensure valid HTML attribute syntax", async () => {
      const html = await renderToString(
        jsx("button", {
          onClick: "alert('Hello world')",
          onmouseover: 'console.log("hover")',
        }),
      );
      expect(html).toContain("onclick=\"alert('Hello world')\"");
      expect(html).toContain('onmouseover="console.log(&quot;hover&quot;)"');
    });
  });

  describe("integration edge cases", () => {
    it("should handle renderToString with a direct Promise child", async () => {
      const html = await renderToString(
        jsx("div", { children: Promise.resolve("async child") }),
      );
      expect(html).toBe("<div>async child</div>");
    });

    it("should handle Fragment with undefined children", async () => {
      const result = jsx(Fragment, { children: undefined });
      expect(await renderToString(result as any)).toBe("");
    });

    it("should handle component returning a plain string", async () => {
      const StrComp = () => "just a string";
      expect(await renderToString(jsx(StrComp, {}))).toBe("just a string");
    });

    it("should handle component returning null", async () => {
      const NullComp = () => null;
      expect(await renderToString(jsx(NullComp, {}))).toBe("");
    });

    it("should handle jsx() with multiple children arguments", async () => {
      // @ts-ignore
      const result = jsx("div", {}, "a", "b", "c");
      expect(await renderToString(result)).toBe("<div>abc</div>");
    });

    it("should handle dangerouslySetInnerHTML with null", async () => {
      expect(
        await renderToString(
          jsx("div", {
            dangerouslySetInnerHTML: null as any,
          }),
        ),
      ).toBe("<div></div>");
    });

    it("should sanitize attribute names with spaces", async () => {
      // @ts-ignore
      expect(await renderToString(jsx("div", { "data foo": "bar" }))).toBe(
        "<div></div>",
      );
    });

    it("should allow srcset with data: image", async () => {
      expect(
        await renderToString(
          jsx("img", { srcset: "data:image/png;base64,abc 1x" }),
        ),
      ).toBe('<img srcset="data:image/png;base64,abc 1x">');
    });
  });
});
