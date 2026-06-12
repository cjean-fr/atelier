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
    expect(typeof Main.context).toBe("function");
    expect(typeof Main.withContext).toBe("function");
    expect(typeof Main.snapshot).toBe("function");
    expect((Main as any).withScope).toBeUndefined();
    expect((Main as any).setContext).toBeUndefined();
    expect((Main as any).useContext).toBeUndefined();
  });

  it("should strictly encapsulate internal implementation details", () => {
    expect((Main as any).jsx).toBeUndefined();
    expect((Main as any).jsxs).toBeUndefined();
    expect((Main as any).RawString).toBeUndefined();
    expect((Main as any).isRawString).toBeUndefined();
  });
});

describe("renderToString with context bindings", () => {
  const Theme = Main.context<"light" | "dark">("test:render-theme");
  const Who = Main.context<{ name: string }>("test:render-who");

  it("makes bindings visible to sync and async components via a factory", async () => {
    const Badge = () => <span class={Theme.get()}>{Who.get().name}</span>;
    const AsyncBadge = async () => {
      await Promise.resolve();
      return <em>{Who.get().name}</em>;
    };
    const html = await renderToString(
      () => (
        <div>
          <Badge />
          <AsyncBadge />
        </div>
      ),
      { context: [Theme.with("dark"), Who.with({ name: "Alice" })] },
    );
    expect(html).toBe(
      '<div><span class="dark">Alice</span><em>Alice</em></div>',
    );
  });

  it("accepts a factory without options", async () => {
    expect(await renderToString(() => <p>ok</p>)).toBe("<p>ok</p>");
  });

  it("isolates concurrent renders with different bindings", async () => {
    const Name = () => <i>{Who.get().name}</i>;
    const [a, b] = await Promise.all([
      renderToString(() => <Name />, { context: [Who.with({ name: "A" })] }),
      renderToString(() => <Name />, { context: [Who.with({ name: "B" })] }),
    ]);
    expect(a).toBe("<i>A</i>");
    expect(b).toBe("<i>B</i>");
  });

  it("nested renders inherit the enclosing bindings", async () => {
    const Inner = () => <b>{Theme.get()}</b>;
    const Outer = async () => {
      const inner = await renderToString(() => <Inner />, {
        context: [Who.with({ name: "unused" })],
      });
      return <div>{Main.raw(inner)}</div>;
    };
    const html = await renderToString(() => <Outer />, {
      context: [Theme.with("light")],
    });
    expect(html).toBe("<div><b>light</b></div>");
  });

  it("leaves no binding active after the render", async () => {
    await renderToString(() => <p>{Theme.get()}</p>, {
      context: [Theme.with("dark")],
    });
    expect(() => Theme.get()).toThrow("is not bound");
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
    // @ts-ignore — intentionally testing runtime camelCase→lowercase mapping (not valid JSX types)
    expect(await renderToString(<label htmlFor="id">Label</label>)).toBe(
      '<label for="id">Label</label>',
    );
    // @ts-ignore
    expect(await renderToString(<div tabIndex={1} />)).toBe(
      '<div tabindex="1"></div>',
    );
    // @ts-ignore
    expect(await renderToString(<input readOnly />)).toBe("<input readonly>");
  });

  it("should sanitize dangerous URL schemas while preserving case-sensitive SVG namespaces", async () => {
    const svg = (
      <svg viewBox="0 0 10 10">
        {/* @ts-ignore — xlinkHref is a runtime-mapped alias, not a typed prop */}
        <use xlinkHref="javascript:alert(1)" />
      </svg>
    );
    expect(await renderToString(svg)).toBe(
      '<svg viewBox="0 0 10 10"><use xlink:href="#blocked"></use></svg>',
    );
  });

  it("should allow verified and non-malicious data-URIs inside source descriptors", async () => {
    // @ts-ignore — srcSet is a runtime-mapped alias for srcset, not a typed prop
    const img = <img srcSet="data:image/png;base64,abc 1x" />;
    expect(await renderToString(img)).toBe(
      '<img srcset="data:image/png;base64,abc 1x">',
    );
    // @ts-ignore
    expect(await renderToString(<img srcSet="javascript:alert(1) 1x" />)).toBe(
      '<img srcset="#blocked">',
    );
    expect(
      await renderToString(
        // @ts-ignore
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

describe("Error propagation", () => {
  it("propagates a sync component throw through jsx()", () => {
    const Crash = () => {
      throw new Error("boom");
    };
    expect(() => renderToString(<Crash />)).toThrow("boom");
  });

  it("rejects renderToString when an async component rejects", async () => {
    const AsyncCrash = async () => {
      await Promise.resolve();
      throw new Error("async-boom");
    };
    await expect(renderToString(<AsyncCrash />)).rejects.toThrow("async-boom");
  });

  it("rejects renderToString when a Promise child rejects", async () => {
    await expect(
      renderToString(<div>{Promise.reject(new Error("child-boom"))}</div>),
    ).rejects.toThrow("child-boom");
  });
});

describe("__html Promise", () => {
  it("resolves a Promise __html into rendered HTML", async () => {
    const html = await renderToString(
      <div
        dangerouslySetInnerHTML={{ __html: Promise.resolve("<b>safe</b>") }}
      />,
    );
    expect(html).toBe("<div><b>safe</b></div>");
  });

  it("handles Promise __html that resolves to null", async () => {
    const html = await renderToString(
      <div
        dangerouslySetInnerHTML={{ __html: Promise.resolve(null) as any }}
      />,
    );
    expect(html).toBe("<div></div>");
  });

  it("rejects renderToString when Promise __html rejects", async () => {
    await expect(
      renderToString(
        <div
          dangerouslySetInnerHTML={{
            __html: Promise.reject(new Error("html-boom")),
          }}
        />,
      ),
    ).rejects.toThrow("html-boom");
  });
});

describe("class + className together", () => {
  it("merges both into a single class attribute, class first", async () => {
    const html = await renderToString(
      <div class="a" className="b">
        x
      </div>,
    );
    expect(html).toBe('<div class="a b">x</div>');
  });

  it("merges regardless of prop order", async () => {
    const html = await renderToString(
      <div className="b" class="a">
        x
      </div>,
    );
    expect(html).toBe('<div class="a b">x</div>');
  });

  it("uses the other spelling when one is nullish or false", async () => {
    expect(await renderToString(<div class={undefined} className="b" />)).toBe(
      '<div class="b"></div>',
    );
    expect(
      await renderToString(<div class="a" className={false as any} />),
    ).toBe('<div class="a"></div>');
  });

  it("merges async values", async () => {
    const html = await renderToString(
      <div class={Promise.resolve("a") as any} className="b" />,
    );
    expect(html).toBe('<div class="a b"></div>');
  });
});

describe("Iterable & Generator Children", () => {
  it("renders a sync generator", async () => {
    function* items() {
      yield <li>1</li>;
      yield <li>2</li>;
    }
    expect(await renderToString(<ul>{items()}</ul>)).toBe(
      "<ul><li>1</li><li>2</li></ul>",
    );
  });

  it("renders a Set", async () => {
    expect(await renderToString(<div>{new Set(["a", "b"])}</div>)).toBe(
      "<div>ab</div>",
    );
  });

  it("renders Map values()", async () => {
    const m = new Map([
      ["x", 1],
      ["y", 2],
    ]);
    expect(await renderToString(<div>{m.values()}</div>)).toBe("<div>12</div>");
  });

  it("escapes string items from an iterable", async () => {
    expect(await renderToString(<div>{new Set(["<b>"])}</div>)).toBe(
      "<div>&lt;b&gt;</div>",
    );
  });

  it("renders a generator yielding mixed primitives and elements", async () => {
    function* g() {
      yield "x";
      yield 1;
      yield <b>y</b>;
    }
    expect(await renderToString(<p>{g()}</p>)).toBe("<p>x1<b>y</b></p>");
  });

  it("renders an async generator (buffered)", async () => {
    async function* items() {
      yield <li>a</li>;
      await Promise.resolve();
      yield <li>b</li>;
    }
    expect(await renderToString(<ul>{items()}</ul>)).toBe(
      "<ul><li>a</li><li>b</li></ul>",
    );
  });
});
