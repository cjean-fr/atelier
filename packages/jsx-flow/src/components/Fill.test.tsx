import { Flow, debugStore, initFlow } from "../context.js";
import { Fill, TurboAdapter } from "../index.js";
import { renderToString, withScope, useContext } from "@cjean-fr/jsx-string";
import { describe, it, expect } from "bun:test";

describe("Fill", () => {
  it("registers content without rendering a placeholder", async () => {
    await withScope(async () => {
      initFlow({ adapter: TurboAdapter, mode: "streaming" });
      const html = await renderToString(
        <Fill target="toast-list" merge="append">
          {() => <li>Notification</li>}
        </Fill>,
      );
      expect(html).toBe("");
      const { pendingStore } = useContext(Flow);
      expect(debugStore(pendingStore).get("toast-list")?.merge).toBe("append");
    });
  });
});
