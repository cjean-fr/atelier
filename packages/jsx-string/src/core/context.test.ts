import { context, withContext, snapshot } from "./context.js";
import { expect, describe, it } from "bun:test";

const UserToken = context<{ name: string }>("test:user");
const PluginToken = context<{ items: string[] }>("test:plugin");

describe("context", () => {
  describe("token.get()", () => {
    it("throws when unbound (no scope at all)", () => {
      expect(() => UserToken.get()).toThrow(
        '[jsx-string] context "test:user" is not bound.',
      );
    });

    it("throws when unbound (scope active, other bindings present)", async () => {
      await withContext([PluginToken.with({ items: [] })], () => {
        expect(() => UserToken.get()).toThrow(
          '[jsx-string] context "test:user" is not bound.',
        );
      });
    });

    it("reads back what was bound", async () => {
      await withContext([UserToken.with({ name: "Alice" })], () => {
        expect(UserToken.get()).toEqual({ name: "Alice" });
      });
    });

    it("propagates through async continuations", async () => {
      await withContext([UserToken.with({ name: "Bob" })], async () => {
        await new Promise((r) => setTimeout(r, 5));
        expect(UserToken.get().name).toBe("Bob");
      });
    });

    it("bound object stays mutable within the scope", async () => {
      await withContext([UserToken.with({ name: "Alice" })], async () => {
        await Promise.resolve();
        UserToken.get().name = "Alice Updated";
        await Promise.resolve();
        expect(UserToken.get().name).toBe("Alice Updated");
      });
    });
  });

  describe("withContext", () => {
    it("isolates concurrent scopes", async () => {
      const results = await Promise.all([
        withContext([UserToken.with({ name: "A" })], async () => {
          await new Promise((r) => setTimeout(r, 10));
          return UserToken.get().name;
        }),
        withContext([UserToken.with({ name: "B" })], async () => {
          await Promise.resolve();
          return UserToken.get().name;
        }),
      ]);
      expect(results).toEqual(["A", "B"]);
    });

    it("returns the callback result", async () => {
      const result = await withContext([], () => 42);
      expect(result).toBe(42);
    });

    it("nested scopes inherit enclosing bindings", async () => {
      await withContext([UserToken.with({ name: "Parent" })], async () => {
        await withContext([PluginToken.with({ items: [] })], () => {
          expect(UserToken.get().name).toBe("Parent");
          expect(PluginToken.get().items).toEqual([]);
        });
      });
    });

    it("nested rebinding shadows without affecting the parent", async () => {
      await withContext([UserToken.with({ name: "Parent" })], async () => {
        await withContext([UserToken.with({ name: "Child" })], () => {
          expect(UserToken.get().name).toBe("Child");
        });
        expect(UserToken.get().name).toBe("Parent");
      });
    });

    it("multiple bindings install left to right (last wins)", async () => {
      await withContext(
        [UserToken.with({ name: "first" }), UserToken.with({ name: "last" })],
        () => {
          expect(UserToken.get().name).toBe("last");
        },
      );
    });
  });

  describe("snapshot (capture / replay)", () => {
    it("replays the bindings captured at snapshot time", async () => {
      let restore!: <T>(fn: () => T) => T;
      await withContext([UserToken.with({ name: "Registered" })], () => {
        restore = snapshot();
      });
      // Outside the scope: unbound…
      expect(() => UserToken.get()).toThrow("is not bound");
      // …but the replay sees the captured bindings.
      expect(restore(() => UserToken.get().name)).toBe("Registered");
    });

    it("replay is unaffected by later rebinding in the origin scope chain", async () => {
      let restore!: <T>(fn: () => T) => T;
      await withContext([UserToken.with({ name: "v1" })], async () => {
        restore = snapshot();
        await withContext([UserToken.with({ name: "v2" })], () => {
          expect(restore(() => UserToken.get().name)).toBe("v1");
        });
      });
    });

    it("replay flows through async continuations", async () => {
      let restore!: <T>(fn: () => T) => T;
      await withContext([UserToken.with({ name: "Async" })], () => {
        restore = snapshot();
      });
      const name = await restore(async () => {
        await new Promise((r) => setTimeout(r, 5));
        return UserToken.get().name;
      });
      expect(name).toBe("Async");
    });
  });

  describe("inter-plugin communication", () => {
    it("plugins share the same scope", async () => {
      await withContext(
        [UserToken.with({ name: "Alice" }), PluginToken.with({ items: [] })],
        () => {
          PluginToken.get().items.push(UserToken.get().name);
          expect(PluginToken.get().items).toEqual(["Alice"]);
        },
      );
    });
  });

  describe("context(key)", () => {
    it("same key returns the same token within one instance", () => {
      const a = context<string>("test:demo");
      const b = context<string>("test:demo");
      expect(a).toBe(b);
    });

    it("different keys return different tokens", () => {
      const a = context<string>("test:x");
      const b = context<string>("test:y");
      expect(a).not.toBe(b);
    });

    it("exposes its key for debugging", () => {
      expect(context<string>("test:keyed").key).toBe("test:keyed");
    });

    it("rejects empty or non-string keys", () => {
      expect(() => context<string>("")).toThrow(/non-empty string key/);
      // @ts-expect-error — intentionally wrong type at runtime
      expect(() => context<string>(123)).toThrow(/non-empty string key/);
      // @ts-expect-error — intentionally wrong type at runtime
      expect(() => context<string>()).toThrow(/non-empty string key/);
    });
  });
});
