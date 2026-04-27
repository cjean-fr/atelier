import { withPostCss } from "./index";
import { raw } from "@cjean-fr/jsx-string";
import { describe, expect, it } from "bun:test";
import { type Plugin } from "postcss";

// A mock PostCSS plugin that adds a simple red color
const mockPlugin = (): Plugin => {
  return {
    postcssPlugin: "mock-plugin",
    Once(root) {
      root.append("body { color: red; }");
    },
  };
};

describe("integration", () => {
  it("injects a simple CSS rule via PostCSS plugin", async () => {
    const html = "<div>Hello</div>";
    const result = await withPostCss(html, { plugins: [mockPlugin()] });

    expect(result).toContain("<style>body { color: red; }</style>");
    expect(result).toContain("<div>Hello</div>");
    // Since there's no </head>, it should prepend the style
    expect(result.startsWith("<style>body { color: red; }</style>")).toBe(true);
  });

  it("injects style into <head> if present", async () => {
    const html =
      "<!DOCTYPE html><html><head><title>Test</title></head><body>Hello</body></html>";
    const result = await withPostCss(html, { plugins: [mockPlugin()] });

    expect(result).toContain(
      "<head><title>Test</title><style>body { color: red; }</style></head>",
    );
  });

  it("cache works correctly", async () => {
    const html = '<div id="cache-test"></div>';
    const result1 = await withPostCss(html, { plugins: [mockPlugin()] });
    const result2 = await withPostCss(html, { plugins: [mockPlugin()] });

    expect(result1).toBe(result2);

    // We just verify they return the exact same content when cached
    expect(result2).toContain("body { color: red; }");

    // Disable cache to ensure it re-processes
    const resultNoCache = await withPostCss(html, {
      plugins: [mockPlugin()],
      useCache: false,
    });
    expect(resultNoCache).toBe(result1);
  });

  it("compatible with raw() from jsx-string", async () => {
    const htmlObj = raw("<head></head><div>Raw</div>");
    const result = await withPostCss(htmlObj, { plugins: [mockPlugin()] });

    expect(result).toContain(
      "<head><style>body { color: red; }</style></head>",
    );
    expect(result).toContain("<div>Raw</div>");
  });

  it("handles PostCSS errors gracefully", async () => {
    const errorPlugin = () => ({
      postcssPlugin: "error-plugin",
      Once() {
        throw new Error("PostCSS failure");
      },
    });
    errorPlugin.postcss = true;

    await expect(
      withPostCss("<div></div>", { plugins: [errorPlugin()] }),
    ).rejects.toThrow("PostCSS failure");
  });

  it("handles empty HTML input", async () => {
    const result = await withPostCss("", { plugins: [mockPlugin()] });
    expect(result).toBe("<style>body { color: red; }</style>");
  });
});
