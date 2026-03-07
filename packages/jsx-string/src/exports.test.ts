import * as Main from "@cjean-fr/jsx-string";
import * as JSXRuntime from "@cjean-fr/jsx-string/jsx-runtime";
import { describe, it, expect } from "bun:test";

describe("Package Exports Integration", () => {
  describe("Main Entry Point (@cjean-fr/jsx-string)", () => {
    it("should export SafeString", () => {
      expect(Main.SafeString).toBeDefined();
      expect(new Main.SafeString("test").toString()).toBe("test");
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

  describe("JSX Runtime Entry Point (@cjean-fr/jsx-string/jsx-runtime)", () => {
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
