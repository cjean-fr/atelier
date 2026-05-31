import {
  context,
  setContext,
  useContext,
  withScope,
  snapshot,
} from "./context.js";
import { expect, describe, it } from "bun:test";

const UserToken = context<{ name: string }>("test:user");
const PluginToken = context<{ items: string[] }>("test:plugin");

describe("context", () => {
  describe("useContext / setContext", () => {
    it("throws outside withScope", () => {
      expect(() => useContext(UserToken)).toThrow(
        "[jsx-string] useContext() called outside of a withScope() scope.",
      );
      expect(() => setContext(UserToken, { name: "x" })).toThrow(
        "[jsx-string] setContext() called outside of a withScope() scope.",
      );
    });

    it("throws when context not found in scope", async () => {
      await withScope(() => {
        expect(() => useContext(UserToken)).toThrow(
          "[jsx-string] useContext() — context not found in current scope.",
        );
      });
    });

    it("reads back what was written", async () => {
      await withScope(() => {
        setContext(UserToken, { name: "Alice" });
        expect(useContext(UserToken)).toEqual({ name: "Alice" });
      });
    });

    it("propagates through async continuations", async () => {
      await withScope(async () => {
        setContext(UserToken, { name: "Bob" });
        await new Promise((r) => setTimeout(r, 5));
        expect(useContext(UserToken).name).toBe("Bob");
      });
    });

    it("mutations persist within same scope", async () => {
      await withScope(async () => {
        setContext(UserToken, { name: "Alice" });
        await Promise.resolve();
        useContext(UserToken).name = "Alice Updated";
        await Promise.resolve();
        expect(useContext(UserToken).name).toBe("Alice Updated");
      });
    });
  });

  describe("withScope", () => {
    it("isolates concurrent scopes", async () => {
      const results = await Promise.all([
        withScope(async () => {
          setContext(UserToken, { name: "A" });
          await new Promise((r) => setTimeout(r, 10));
          return useContext(UserToken).name;
        }),
        withScope(async () => {
          setContext(UserToken, { name: "B" });
          await Promise.resolve();
          return useContext(UserToken).name;
        }),
      ]);
      expect(results).toEqual(["A", "B"]);
    });

    it("returns callback result", async () => {
      const result = await withScope(() => 42);
      expect(result).toBe(42);
    });

    it("sub-scope is empty without seed", async () => {
      await withScope(async () => {
        setContext(UserToken, { name: "Parent" });
        await withScope(() => {
          expect(() => useContext(UserToken)).toThrow(
            "not found in current scope",
          );
        });
      });
    });
  });

  describe("snapshot / seed", () => {
    it("seed pre-fills sub-scope", async () => {
      await withScope(async () => {
        setContext(UserToken, { name: "Parent" });
        const seed = snapshot();

        await withScope(
          () => {
            expect(useContext(UserToken).name).toBe("Parent");
          },
          { seed },
        );
      });
    });

    it("child mutation does not affect parent", async () => {
      await withScope(async () => {
        setContext(UserToken, { name: "Parent" });
        const seed = snapshot();

        await withScope(
          () => {
            setContext(UserToken, { name: "Child" });
            expect(useContext(UserToken).name).toBe("Child");
          },
          { seed },
        );

        expect(useContext(UserToken).name).toBe("Parent");
      });
    });

    it("snapshot throws outside withScope", () => {
      expect(() => snapshot()).toThrow(
        "[jsx-string] snapshot() called outside of a withScope() scope.",
      );
    });
  });

  describe("inter-plugin communication", () => {
    it("plugins share same scope", async () => {
      await withScope(() => {
        setContext(UserToken, { name: "Alice" });
        setContext(PluginToken, { items: [] });

        useContext(PluginToken).items.push(useContext(UserToken).name);

        expect(useContext(PluginToken).items).toEqual(["Alice"]);
      });
    });
  });

  describe("context(key) — cross-instance sharing", () => {
    it("same key returns the same Symbol within one instance", () => {
      const a = context<string>("test:demo");
      const b = context<string>("test:demo");
      expect(a).toBe(b);
    });

    it("different keys return different Symbols", () => {
      const a = context<string>("test:x");
      const b = context<string>("test:y");
      expect(a).not.toBe(b);
    });

    it("key uses Symbol.for so it survives across instances", () => {
      const Shared = context<string>("test:shared");
      // Simulate a "second instance" by retrieving the same global symbol.
      const sameViaRegistry = Symbol.for("@cjean-fr/jsx-string.context.test:shared");
      expect(Shared).toBe(sameViaRegistry as unknown as typeof Shared);
    });

    it("rejects empty or non-string keys", () => {
      expect(() => context<string>("")).toThrow(/non-empty string key/);
      // @ts-expect-error — intentionally wrong type at runtime
      expect(() => context<string>(123)).toThrow(/non-empty string key/);
      // @ts-expect-error — intentionally wrong type at runtime
      expect(() => context<string>()).toThrow(/non-empty string key/);
    });

    it("works with setContext/useContext inside a scope", async () => {
      const Shared = context<{ value: number }>("test:in-scope");
      await withScope(() => {
        setContext(Shared, { value: 42 });
        expect(useContext(Shared).value).toBe(42);
      });
    });
  });

  describe("AsyncLocalStorage singleton", () => {
    it("storage is reachable via globalThis Symbol.for key", () => {
      const key = Symbol.for("@cjean-fr/jsx-string.storage");
      const g = globalThis as unknown as Record<symbol, unknown>;
      expect(g[key]).toBeDefined();
    });
  });
});
