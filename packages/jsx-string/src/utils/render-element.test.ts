import { RawString } from "../core/types.js";
import { renderElement } from "./render-element.js";
import { expect, describe, it, spyOn } from "bun:test";

describe("renderElement — tag name validation", () => {
  it("should render valid HTML tags", () => {
    expect((renderElement("div", {}, []) as RawString).value).toBe(
      "<div></div>",
    );
  });

  it("should render custom elements with hyphens", () => {
    expect((renderElement("my-component", {}, []) as RawString).value).toBe(
      "<my-component></my-component>",
    );
  });

  it("should block tag names with spaces", () => {
    expect(
      (renderElement('div class="injected"', {}, []) as RawString).value,
    ).toBe("");
  });

  it("should block tag names starting with a digit", () => {
    expect((renderElement("1div", {}, []) as RawString).value).toBe("");
  });

  it("should block tag names with angle brackets", () => {
    expect((renderElement("<script>", {}, []) as RawString).value).toBe("");
  });

  it("should warn only once per invalid tag name", () => {
    const warnSpy = spyOn(console, "warn").mockImplementation(() => {});
    try {
      for (let i = 0; i < 3; i++) {
        expect((renderElement("7bad", {}, []) as RawString).value).toBe("");
      }
      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(String(warnSpy.mock.calls[0]?.[0])).toContain("7bad");
    } finally {
      warnSpy.mockRestore();
    }
  });

  it("should supports nested renderElement", () => {
    expect(
      (renderElement("div", {}, [renderElement("span", {}, [])]) as RawString)
        .value,
    ).toBe("<div><span></span></div>");
  });
});

describe("renderElement — dangerouslySetInnerHTML with Promise __html", () => {
  it("renders resolved Promise __html", async () => {
    const result = await renderElement(
      "div",
      { dangerouslySetInnerHTML: { __html: Promise.resolve("<b>ok</b>") } },
      [],
    );
    expect(result.value).toBe("<div><b>ok</b></div>");
  });

  it("renders empty for Promise __html resolving to null", async () => {
    const result = await renderElement(
      "div",
      { dangerouslySetInnerHTML: { __html: Promise.resolve(null) } },
      [],
    );
    expect(result.value).toBe("<div></div>");
  });

  it("rejects when Promise __html rejects", async () => {
    await expect(
      renderElement(
        "div",
        {
          dangerouslySetInnerHTML: {
            __html: Promise.reject(new Error("fail")),
          },
        },
        [],
      ),
    ).rejects.toThrow("fail");
  });
});
