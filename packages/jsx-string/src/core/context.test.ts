import { withContext, useContext, ContextVariable } from "./context.js";
import { expect, describe, it } from "bun:test";

describe("context", () => {
  describe("useContext", () => {
    it("should throw when called outside of withContext", () => {
      expect(() => useContext()).toThrow(
        "[jsx-string] useContext() called outside of a withContext() scope.",
      );
    });

    it("should return the context when inside withContext", async () => {
      await withContext((ctx) => {
        expect(useContext()).toBe(ctx);
      });
    });

    it("should return context in nested async calls", async () => {
      await withContext(async (ctx) => {
        await new Promise((r) => setTimeout(r, 1));
        expect(useContext()).toBe(ctx);
        await Promise.resolve();
        expect(useContext()).toBe(ctx);
      });
    });
  });

  describe("withContext", () => {
    it("should create an isolated context for each call", async () => {
      const contexts: unknown[] = [];
      await Promise.all([
        withContext((ctx) => {
          contexts.push(ctx);
        }),
        withContext((ctx) => {
          contexts.push(ctx);
        }),
      ]);
      expect(contexts[0]).not.toBe(contexts[1]);
    });

    it("should persist mutations within the same scope", async () => {
      await withContext(async (ctx) => {
        (ctx as any).testValue = "hello";
        await Promise.resolve();
        expect((useContext() as any).testValue).toBe("hello");
      });
    });

    it("should not leak mutations between concurrent scopes", async () => {
      const results = await Promise.all([
        withContext(async (ctx) => {
          (ctx as any).id = "A";
          await new Promise((r) => setTimeout(r, 10));
          return (useContext() as any).id;
        }),
        withContext(async (ctx) => {
          (ctx as any).id = "B";
          await Promise.resolve();
          return (useContext() as any).id;
        }),
      ]);
      expect(results[0]).toBe("A");
      expect(results[1]).toBe("B");
    });

    it("should return the result of the callback", async () => {
      const result = await withContext(() => "done");
      expect(result).toBe("done");
    });

    it("should return the result of an async callback", async () => {
      const result = await withContext(async () => {
        await Promise.resolve();
        return 42;
      });
      expect(result).toBe(42);
    });
  });

  describe("ContextVariable", () => {
    it("should return undefined when no value has been set", () => {
      const cv = new ContextVariable();
      expect(cv.get()).toBeUndefined();
    });

    it("should return the value inside run", async () => {
      const cv = new ContextVariable();
      await cv.run({ foo: "bar" }, async () => {
        expect(cv.get()).toEqual({ foo: "bar" });
      });
    });

    it("should isolate values between concurrent runs", async () => {
      const cv = new ContextVariable<{ id: string }>();
      const results = await Promise.all([
        cv.run({ id: "X" }, async () => {
          await new Promise((r) => setTimeout(r, 5));
          return cv.get()?.id;
        }),
        cv.run({ id: "Y" }, async () => {
          await Promise.resolve();
          return cv.get()?.id;
        }),
      ]);
      expect(results[0]).toBe("X");
      expect(results[1]).toBe("Y");
    });

    it("should return the result of run", async () => {
      const cv = new ContextVariable();
      const result = await cv.run(null as any, () => 123);
      expect(result).toBe(123);
    });
  });

  describe("module augmentation", () => {
    it("should allow adding custom properties to Context via plugin pattern", async () => {
      // Simulates what jsx-string-island does: ctx.islands, ctx.adapter, etc.
      await withContext(async (ctx) => {
        (ctx as any).customPluginData = { enabled: true };
        await Promise.resolve();
        expect((useContext() as any).customPluginData).toEqual({
          enabled: true,
        });
      });
    });
  });
});
