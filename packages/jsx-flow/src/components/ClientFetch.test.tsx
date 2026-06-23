import { Flow, initFlow } from "../context.js";
import { ClientFetch, TurboAdapter } from "../index.js";
import { renderToString, withScope, useContext } from "@cjean-fr/jsx-string";
import { describe, it, expect } from "bun:test";

describe("ClientFetch", () => {
  it("renders a placeholder pointing at src, registers nothing", async () => {
    await withScope(async () => {
      initFlow({ adapter: TurboAdapter, mode: "streaming" });
      const html = await renderToString(<ClientFetch src="/api/fragment" />);
      expect(html).toContain('src="/api/fragment"');
      expect(useContext(Flow).pendingStore.size).toBe(0);
    });
  });

  it("accepts http(s)/relative URL literals and rejects everything else at compile time", () => {
    void (<ClientFetch src="/api/fragment" />);
    void (<ClientFetch src="https://example.com/f" />);
    void (<ClientFetch src="./rel?x=1#h" />);

    // @ts-expect-error - javascript: scheme
    void (<ClientFetch src="javascript:alert(1)" />);
    // @ts-expect-error - any data: (ClientFetch loads HTML, not inline data)
    void (<ClientFetch src="data:image/png;base64,abc" />);
    // @ts-expect-error - mailto: is not fetchable HTML
    void (<ClientFetch src="mailto:a@b.com" />);
  });

  it("still accepts a dynamic string src (checked at runtime, not compile time)", async () => {
    await withScope(async () => {
      initFlow({ adapter: TurboAdapter, mode: "streaming" });
      const dynamic: string = "/api/" + Math.random().toString(36).slice(2);
      const html = await renderToString(<ClientFetch src={dynamic} />);
      expect(html).toContain(dynamic);
    });
  });

  it("rejects template literal types for bad schemes at compile time", () => {
    const payload = "alert(1)" as const;
    const hidden = "javascript:" as const;
    // @ts-expect-error - template literal with bad scheme is caught
    void (<ClientFetch src={`${hidden}${payload}`} />);
  });

  it("throws at runtime for invalid dynamic strings", async () => {
    await withScope(async () => {
      initFlow({ adapter: TurboAdapter, mode: "streaming" });
      expect(() => (
        <ClientFetch src={"javascript:alert(1)" as string} />
      )).toThrow(/forbidden scheme/);
    });
  });
});
