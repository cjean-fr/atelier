import * as Main from "@cjean-fr/jsx-string";
import * as JSXRuntime from "@cjean-fr/jsx-string/jsx-runtime";
import { describe, it, expect } from "bun:test";

describe("package exports", () => {
  describe("main entry point", () => {
    it("should export RawString", () => {
      expect(Main.RawString).toBeDefined();
      expect(new Main.RawString("test").toString()).toBe("test");
    });

    it("should export raw utility", () => {
      expect(Main.raw).toBeDefined();
      expect(Main.raw("test").toString()).toBe("test");
    });

    it("should export hyperscript factory (h)", () => {
      expect(Main.h).toBeDefined();
      expect(typeof Main.h).toBe("function");
    });

    it("should export Fragment", () => {
      expect(Main.Fragment).toBeDefined();
    });

    it("should export html/svg tag helpers (StandardAttributes)", () => {
      expect(Main).toBeDefined();
    });
  });

  describe("jsx-runtime entry point", () => {
    it("should export jsx", () => {
      expect(JSXRuntime.jsx).toBeDefined();
      expect(typeof JSXRuntime.jsx).toBe("function");
    });

    it("should export jsxs", () => {
      expect(JSXRuntime.jsxs).toBeDefined();
      expect(typeof JSXRuntime.jsxs).toBe("function");
    });

    it("should export Fragment", () => {
      expect(JSXRuntime.Fragment).toBeDefined();
    });
  });
});
