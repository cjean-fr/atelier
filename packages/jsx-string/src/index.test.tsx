// @jsxImportSource @cjean-fr/jsx-string
import type { JSXNode } from "./core/types.js";
import * as Main from "./index.js";
import { renderToString } from "./index.js";
import { describe, it, expect } from "bun:test";

describe("Main Entry Point API Contract", () => {
  it("should export core rendering, fragments and trust markers", () => {
    expect(typeof Main.renderToString).toBe("function");
    expect(Main.raw("test").toString()).toBe("test");
    expect(Main.Fragment).toBeDefined();
  });

  it("should export context and isolation APIs", () => {
    expect(typeof Main.withScope).toBe("function");
    expect(typeof Main.snapshot).toBe("function");
    expect(typeof Main.context).toBe("function");
    expect(typeof Main.setContext).toBe("function");
    expect(typeof Main.useContext).toBe("function");
  });

  it("should strictly encapsulate internal implementation details", () => {
    expect((Main as any).jsx).toBeUndefined();
    expect((Main as any).jsxs).toBeUndefined();
    expect((Main as any).RawString).toBeUndefined();
    expect((Main as any).isRawString).toBeUndefined();
  });
});

describe("Functional & Classless Components", () => {
  it("should render standard functional components", async () => {
    const Button = ({ label }: { label: string }) => <button>{label}</button>;
    expect(await renderToString(<Button label="Click" />)).toBe(
      "<button>Click</button>",
    );
  });

  it("should support deep nesting with sequential children rendering", async () => {
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

  it("should handle components returning Fragments without array leakage or trailing commas", async () => {
    const List = () => (
      <>
        <li>1</li>
        <li>2</li>
      </>
    );
    expect(
      await renderToString(
        <ul>
          <List />
        </ul>,
      ),
    ).toBe("<ul><li>1</li><li>2</li></ul>");
  });
});

describe("Asynchronous Rendering Pipeline", () => {
  it("should support async components with deferred resolution loops", async () => {
    const AsyncComp = async () => {
      await new Promise((r) => setTimeout(r, 2));
      return <div>Async</div>;
    };
    expect(await renderToString(<AsyncComp />)).toBe("<div>Async</div>");
  });

  it("should handle async components returning multi-node fragments", async () => {
    const AsyncList = async () => {
      await Promise.resolve();
      return (
        <>
          <li>1</li>
          <li>2</li>
        </>
      );
    };
    expect(await renderToString(<AsyncList />)).toBe("<li>1</li><li>2</li>");
  });

  it("should concurrent-resolve interleaved nested promises in the same text body", async () => {
    const element = (
      <div>
        {Promise.resolve("A")} {Promise.resolve("B")}
      </div>
    );
    expect(await renderToString(element)).toBe("<div>A B</div>");
  });
});

describe("Attribute Processing, Hardening & Sanitization", () => {
  it("should map legacy React properties to native lowercased HTML targets", async () => {
    expect(await renderToString(<label htmlFor="id">Label</label>)).toBe(
      '<label for="id">Label</label>',
    );
    expect(await renderToString(<div tabIndex={1} />)).toBe(
      '<div tabindex="1"></div>',
    );
    expect(await renderToString(<input readOnly />)).toBe("<input readonly>");
  });

  it("should sanitize dangerous URL schemas while preserving case-sensitive SVG namespaces", async () => {
    const svg = (
      <svg viewBox="0 0 10 10">
        <use xlinkHref="javascript:alert(1)" />
      </svg>
    );
    expect(await renderToString(svg)).toBe(
      '<svg viewBox="0 0 10 10"><use xlink:href="#blocked"></use></svg>',
    );
  });

  it("should allow verified and non-malicious data-URIs inside source descriptors", async () => {
    const img = <img srcSet="data:image/png;base64,abc 1x" />;
    expect(await renderToString(img)).toBe(
      '<img srcset="data:image/png;base64,abc 1x">',
    );
    expect(await renderToString(<img srcSet="javascript:alert(1) 1x" />)).toBe(
      '<img srcset="#blocked">',
    );
    expect(
      await renderToString(
        <img srcSet="https://example.com/img.png 1x, javascript:alert(1) 2x" />,
      ),
    ).toBe('<img srcset="#blocked">');
  });

  it("should drop invalid structural attributes like spaces in naming descriptors", async () => {
    // @ts-ignore
    expect(await renderToString(<div {...{ "data foo": "bar" }} />)).toBe(
      "<div></div>",
    );
  });

  it("should purge nullish entries out of complex object style specifications", async () => {
    const inlineStyle = {
      color: "red",
      marginTop: undefined,
      marginContent: null,
    };
    expect(await renderToString(<div style={inlineStyle as any} />)).toBe(
      '<div style="color:red"></div>',
    );
  });

  it("should treat empty, undefined or unprovided inner HTML directives gracefully", async () => {
    expect(
      await renderToString(
        <div dangerouslySetInnerHTML={{ __html: undefined as any }} />,
      ),
    ).toBe("<div></div>");
    expect(
      await renderToString(
        <div dangerouslySetInnerHTML={{ __html: "<b>html</b>" }} />,
      ),
    ).toBe("<div><b>html</b></div>");
  });

  it("should safely stringify abstract types like Symbol and BigInt", async () => {
    expect(
      await renderToString(
        <div>
          {Symbol("test")} {BigInt(123)}
        </div>,
      ),
    ).toBe("<div>Symbol(test) 123</div>");
  });
});
