import { describe, it, expect } from "bun:test";
import precompile, { type PluginConfig } from "./index.js";

describe("vite-plugin-precompile", () => {
  function callTransform(
    code: string,
    id: string,
    config?: PluginConfig,
    jsxImportSource?: string,
  ) {
    const plugin = precompile(config);
    const resolvedConfig = { esbuild: { jsxImportSource } };
    (plugin as any).configResolved?.(resolvedConfig);
    return (plugin as any).transform!(code, id);
  }

  it("should return a Vite plugin object", () => {
    const plugin = precompile();
    expect(plugin.name).toBe("@cjean-fr/vite-plugin-precompile");
    expect(plugin.enforce).toBe("pre");
    expect(typeof plugin.transform).toBe("function");
  });

  it("should skip non-JSX files", () => {
    const result = callTransform('console.log("hello");', "/src/test.ts");
    expect(result).toBeUndefined();
  });

  it("should skip node_modules", () => {
    const result = callTransform('<div>hello</div>', "/node_modules/foo/test.tsx");
    expect(result).toBeUndefined();
  });

  it("should skip files without JSX", () => {
    const result = callTransform('const x = "no JSX here";', "/src/app.tsx");
    expect(result).toBeUndefined();
  });

  it("should transform JSX with default runtimeSource", () => {
    const code = `const x = <div class="foo">{name}</div>;`;
    const result = callTransform(code, "/src/app.tsx");
    expect(result).not.toBeUndefined();
    expect(result!.code).toContain("@cjean-fr/jsx-string/jsx-runtime");
    expect(result!.code).toContain("jsxTemplate");
    expect(result!.code).toContain("jsxEscape(name)");
  });

  it("should use explicit runtimeSource when provided", () => {
    const code = `const x = <div>hello</div>;`;
    const result = callTransform(code, "/src/app.tsx", { runtimeSource: "custom/jsx-runtime" });
    expect(result).not.toBeUndefined();
    expect(result!.code).toContain("custom/jsx-runtime");
  });

  it("should use jsxImportSource from resolved esbuild config as fallback", () => {
    const code = `const x = <div>hello</div>;`;
    const result = callTransform(code, "/src/app.tsx", undefined, "preact");
    expect(result).not.toBeUndefined();
    expect(result!.code).toContain("preact/jsx-runtime");
  });

  it("should prefer explicit runtimeSource over jsxImportSource", () => {
    const code = `const x = <div>hello</div>;`;
    const result = callTransform(
      code,
      "/src/app.tsx",
      { runtimeSource: "custom/jsx-runtime" },
      "preact",
    );
    expect(result).not.toBeUndefined();
    expect(result!.code).toContain("custom/jsx-runtime");
    expect(result!.code).not.toContain("preact/jsx-runtime");
  });

  it("should transform JSX in .jsx files", () => {
    const code = `const x = <div>hello</div>;`;
    const result = callTransform(code, "/src/app.jsx");
    expect(result).not.toBeUndefined();
    expect(result!.code).toContain("jsxTemplate");
  });
});
