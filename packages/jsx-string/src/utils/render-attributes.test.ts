import { renderAttributes, renderStyle } from "./render-attributes.js";
import { expect, describe, it, spyOn } from "bun:test";

const resolve = (v: string | Promise<string>) => Promise.resolve(v);

describe("renderAttributes", () => {
  it("should render class and className as separate attributes (no merge)", () => {
    expect(renderAttributes({ class: "a", className: "b" })).toBe(
      ' class="a" class="b"',
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
    ).toBe(' onclick="alert(`Hello ${this.dataset.name}`)" data-name="World"');
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

  it("should ignore internal props", () => {
    expect(renderAttributes({ key: "1", ref: "r", id: "ok" })).toBe(' id="ok"');
  });

  it("should ignore null and undefined values", () => {
    expect(renderAttributes({ id: "ok", foo: null, bar: undefined })).toBe(
      ' id="ok"',
    );
  });

  it("should pass through data-* and aria-* attributes verbatim", () => {
    expect(
      renderAttributes({ "data-test-id": "123", "aria-label": "test" }),
    ).toBe(' data-test-id="123" aria-label="test"');
  });

  it("should pass through unknown attributes verbatim regardless of casing", () => {
    expect(renderAttributes({ dataTestId: "123", ariaLabel: "test" })).toBe(
      ' dataTestId="123" ariaLabel="test"',
    );
  });

  it("should block function values on lowercase event handlers (regression)", () => {
    expect(
      renderAttributes({
        onclick: (() => {}) as any,
        onfocus: (() => {}) as any,
        ONCLICK: (() => {}) as any,
        id: "btn",
      }),
    ).toBe(' id="btn"');
  });

  it("should block non-string values on lowercase event handlers (regression)", () => {
    expect(
      renderAttributes({
        onclick: 42 as any,
        onmouseover: true as any,
        onkeydown: { handler: "x" } as any,
        id: "btn",
      }),
    ).toBe(' id="btn"');
  });

  it("should strip invisible Unicode chars from attribute names (regression)", () => {
    expect(renderAttributes({ "data​-id": "123" })).toBe(' data-id="123"');
    expect(renderAttributes({ "cla‎ss": "x" })).toBe(' class="x"');
    expect(renderAttributes({ "id\x00": "v" })).toBe(' id="v"');
  });

  it("should resolve a direct Promise in an attribute", async () => {
    const result = await renderAttributes({
      title: Promise.resolve("async title") as any,
    });
    expect(result).toBe(' title="async title"');
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

  it("should enforce URL safety on a Promise-valued URL attribute", async () => {
    const result = await renderAttributes({
      href: Promise.resolve("javascript:alert(1)") as any,
    });
    expect(result).toBe(' href="#blocked"');
  });

  it("should accept a Promise<CSSProperties> as style", async () => {
    const result = await renderAttributes({
      style: Promise.resolve({ color: "red", marginTop: "4px" }) as any,
    });
    expect(result).toBe(' style="color:red;margin-top:4px"');
  });

  it("should warn only once per attribute name for function event handlers", () => {
    const warnSpy = spyOn(console, "warn").mockImplementation(() => {});
    try {
      for (let i = 0; i < 3; i++) {
        expect(
          renderAttributes({ onPointerCancel: (() => {}) as any, id: "btn" }),
        ).toBe(' id="btn"');
      }
      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(String(warnSpy.mock.calls[0]?.[0])).toContain("onPointerCancel");
    } finally {
      warnSpy.mockRestore();
    }
  });
});

describe("regression — REGEX_CSS_URL lastIndex corruption", () => {
  const UNSAFE_DATA = "url('data:text/html,<h1>xss</h1>')";

  it("should block unsafe data on consecutive calls", async () => {
    await resolve(renderStyle({ backgroundImage: UNSAFE_DATA }));

    const result = await resolve(renderStyle({ backgroundImage: UNSAFE_DATA }));

    expect(result).toBe("");
  });
});

describe("renderStyle", () => {
  it("should convert camelCase to kebab-case", () => {
    expect(renderStyle({ backgroundColor: "red", "--custom": "blue" })).toBe(
      "background-color:red;--custom:blue",
    );
  });

  it("should convert multi-capital camelCase to kebab-case", () => {
    expect(
      renderStyle({
        borderTopColor: "red",
        borderTopLeftRadius: "4px",
        listStyleType: "disc",
        textDecorationLine: "underline",
      }),
    ).toBe(
      "border-top-color:red;border-top-left-radius:4px;list-style-type:disc;text-decoration-line:underline",
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
});
