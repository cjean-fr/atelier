import {
  context,
  setContext,
  useContext,
  withScope,
  snapshot,
} from "./context.js";
import { expect, describe, it } from "bun:test";

const UserToken = context<{ name: string }>();
const PluginToken = context<{ items: string[] }>();

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
});
