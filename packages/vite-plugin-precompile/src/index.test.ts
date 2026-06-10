import precompile, { type PluginConfig } from "./index.js";
import { describe, it, expect } from "bun:test";

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
    const result = callTransform(
      "<div>hello</div>",
      "/node_modules/foo/test.tsx",
    );
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
    const result = callTransform(code, "/src/app.tsx", {
      runtimeSource: "custom/jsx-runtime",
    });
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

  it("should warn when esbuild.jsxImportSource is missing", () => {
    const warned: string[] = [];
    const plugin = precompile();
    (plugin as any).configResolved.call(
      { warn: (m: string) => warned.push(m) },
      { esbuild: {} },
    );
    expect(warned.length).toBe(1);
    expect(warned[0]).toContain("esbuild.jsxImportSource is not set");
  });

  it("should merge esbuild.jsxImportSource when set but no runtimeSource", () => {
    const code = `<div/>`;
    const result = callTransform(code, "/src/a.tsx", undefined, "preact");
    expect(result!.code).toContain("preact/jsx-runtime");
  });

  it("should warn about runtimeSource/esbuild mismatch", () => {
    const warned: string[] = [];
    const plugin = precompile({ runtimeSource: "custom/jsx-runtime" });
    (plugin as any).configResolved.call(
      { warn: (m: string) => warned.push(m) },
      { esbuild: { jsxImportSource: "preact" } },
    );
    expect(warned.length).toBe(1);
    expect(warned[0]).toContain("disagree");
  });

  it("should pass through sourcemap from transform", () => {
    const result = callTransform("<div>{name}</div>", "/src/app.tsx");
    expect(result).not.toBeUndefined();
    expect(result!.map).toBeDefined();
    expect(result!.map!.sources).toContain("/src/app.tsx");
  });

  it("should not warn when runtimeSource and esbuild.jsxImportSource agree", () => {
    const warned: string[] = [];
    const plugin = precompile({ runtimeSource: "preact/jsx-runtime" });
    (plugin as any).configResolved.call(
      { warn: (m: string) => warned.push(m) },
      { esbuild: { jsxImportSource: "preact" } },
    );
    expect(warned).toEqual([]);
  });

  it("secure mode errors the build when the runtime cannot be loaded", async () => {
    const plugin = precompile({
      secure: true,
      runtimeSource: "totally-bogus-module-xyz",
    });
    (plugin as any).configResolved.call({}, { esbuild: {} });
    const ctx = {
      error(msg: string): never {
        throw new Error(msg);
      },
    };
    await expect((plugin as any).buildStart.call(ctx)).rejects.toThrow(
      /secure mode/,
    );
  });
});
