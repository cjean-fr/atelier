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

    it("should export scope API", () => {
      expect(typeof Main.withScope).toBe("function");
      expect(typeof Main.snapshot).toBe("function");
    });

    it("should export context API", () => {
      expect(typeof Main.context).toBe("function");
      expect(typeof Main.setContext).toBe("function");
      expect(typeof Main.useContext).toBe("function");
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
  });
});
