import { WebPlatformAdapter } from "../adapters/index.js";
import { renderToString } from "@cjean-fr/jsx-string";
import { describe, it, expect } from "bun:test";

describe("WebPlatformAdapter", () => {
  it("is replace-only, non-replace merges produce a template", async () => {
    expect(WebPlatformAdapter.capabilities).toEqual({
      streaming: true,
      merges: ["replace"],
    });
    const patch = await renderToString(
      WebPlatformAdapter.Patch({ id: "x", children: "c", merge: "append" }),
    );
    expect(patch).toContain("template");
  });
});
