import * as Main from "@cjean-fr/jsx-string";
import * as JSXRuntime from "@cjean-fr/jsx-string/jsx-runtime";
import { describe, it, expect } from "bun:test";

describe("package exports", () => {
  describe("main entry point", () => {
    it("should export renderToString", () => {
      expect(typeof Main.renderToString).toBe("function");
    });

    it("should export raw", () => {
      expect(Main.raw("test").toString()).toBe("test");
    });

    it("should export Fragment", () => {
      expect(Main.Fragment).toBeDefined();
    });

    it("should export the context API (token + plumbing)", () => {
      expect(typeof Main.context).toBe("function");
      expect(typeof Main.withContext).toBe("function");
      expect(typeof Main.snapshot).toBe("function");
      const token = Main.context<string>("test:exports");
      expect(typeof token.get).toBe("function");
      expect(typeof token.with).toBe("function");
      expect(token.key).toBe("test:exports");
    });

    it("should NOT export the removed scope API", () => {
      expect((Main as any).withScope).toBeUndefined();
      expect((Main as any).setContext).toBeUndefined();
      expect((Main as any).useContext).toBeUndefined();
    });

    it("should NOT export internal details", () => {
      expect((Main as any).jsx).toBeUndefined();
      expect((Main as any).jsxs).toBeUndefined();
      expect((Main as any).h).toBeUndefined();
      expect((Main as any).RawString).toBeUndefined();
      expect((Main as any).isRawString).toBeUndefined();
      expect((Main as any).useScope).toBeUndefined();
    });
  });

  describe("jsx-runtime entry point", () => {
    it("should export jsx, jsxs, Fragment", () => {
      expect(typeof JSXRuntime.jsx).toBe("function");
      expect(typeof JSXRuntime.jsxs).toBe("function");
      expect(JSXRuntime.Fragment).toBeDefined();
    });

    it("should export the Deno precompile runtime trio", () => {
      expect(typeof JSXRuntime.jsxTemplate).toBe("function");
      expect(typeof JSXRuntime.jsxAttr).toBe("function");
      expect(typeof JSXRuntime.jsxEscape).toBe("function");
    });
  });
});
