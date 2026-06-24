import { serve, negotiateHtmx, negotiateUnpoly, Fill, Defer } from "./index.js";
import { NativeAdapter, HtmxAdapter } from "./index.js";
import { describe, it, expect } from "bun:test";

describe("HTTP negotiation (decoupled from the adapter)", () => {
  it("negotiateHtmx reads HX-Target and sets Vary", () => {
    const n = negotiateHtmx(
      new Request("http://localhost", { headers: { "HX-Target": "my-id" } }),
    );
    expect(n.target).toBe("my-id");
    expect(new Headers(n.headers).get("Vary")).toContain("HX-Target");
  });

  it("negotiateUnpoly: echoes target/failTarget + Vary, does NOT force a mode", () => {
    const n = negotiateUnpoly(
      new Request("http://localhost", {
        headers: { "X-Up-Target": ".content", "X-Up-Fail-Target": "form" },
      }),
    );
    expect(n.mode).toBeUndefined();
    expect(n.target).toBe(".content");
    expect(n.failTarget).toBe("form");
    const headers = new Headers(n.headers);
    expect(headers.get("X-Up-Target")).toBe(".content");
    expect(headers.get("Vary")).toContain("X-Up-Target");
  });

  it("negotiateUnpoly: plain navigation → no target", () => {
    const n = negotiateUnpoly(new Request("http://localhost"));
    expect(n.target).toBeUndefined();
    expect(n.failTarget).toBeUndefined();
  });

  it("serve runs an opt-in negotiate fn; negotiation headers win", async () => {
    const res = await serve(
      new Request("http://localhost", { headers: { "HX-Target": "zone" } }),
      () => (
        <html>
          <body>
            <p>hi</p>
          </body>
        </html>
      ),
      HtmxAdapter,
      { negotiate: negotiateHtmx, headers: { "cache-control": "no-store" } },
    );
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(res.headers.get("content-type")).toContain("text/html");
    expect(res.headers.get("Vary")).toContain("HX-Target");
    expect(await res.text()).toContain("hi");
  });

  it("serve unions a caller's Vary with the negotiator's instead of overwriting it", async () => {
    const res = await serve(
      new Request("http://localhost", { headers: { "HX-Target": "zone" } }),
      () => (
        <html>
          <body>
            <p>hi</p>
          </body>
        </html>
      ),
      HtmxAdapter,
      { negotiate: negotiateHtmx, headers: { Vary: "Cookie" } },
    );
    const vary = res.headers.get("Vary") ?? "";
    expect(vary).toContain("Cookie");
    expect(vary).toContain("HX-Target");
  });

  it("serve passes negotiation hints to the page", async () => {
    const res = await serve(
      new Request("http://localhost", { headers: { "HX-Target": "content" } }),
      (n) => (
        <html>
          <body>{n.target === "content" ? <p>fragment</p> : <p>full</p>}</body>
        </html>
      ),
      NativeAdapter,
      { negotiate: negotiateHtmx },
    );
    expect(await res.text()).toContain("fragment");
  });

  it("Unpoly + Native + explicit fragment mode: shell suppressed, fragment emitted", async () => {
    const res = await serve(
      new Request("http://localhost", {
        headers: { "X-Up-Target": "content" },
      }),
      () => (
        <html>
          <body>
            <Fill target="content">{() => <p>patched</p>}</Fill>
          </body>
        </html>
      ),
      NativeAdapter,
      { negotiate: negotiateUnpoly, mode: "fragment" },
    );
    const body = await res.text();
    expect(body).toContain("patched");
    expect(body).not.toContain("<html>");
    expect(res.headers.get("Vary")).toContain("X-Up-Target");
  });

  it("serve defaults to NativeAdapter", async () => {
    const res = await serve(new Request("http://localhost"), () => (
      <html>
        <head></head>
        <body>
          <p>hi</p>
          <Defer>{() => <span>x</span>}</Defer>
        </body>
      </html>
    ));
    expect(await res.text()).toContain("MutationObserver");
  });
});
