import { initFlow, Flow, debugStore } from "./context.js";
import { createPendingStore } from "./context.js";
import type { PendingStore, FlowConfig } from "./context.js";
import {
  Defer,
  Fill,
  Slot,
  ClientFetch,
  TurboAdapter,
  HtmxAdapter,
  NativeAdapter,
  WebPlatformAdapter,
  EsiAdapter,
  renderStream,
  renderToStatic,
  serve,
  negotiateHtmx,
  negotiateUnpoly,
  createAdapter,
  composeShell,
  injectIntoHead,
} from "./index.js";
import { renderToFlowEvents, renderShell, orchestrateFlow } from "./render.js";
import { streamFlow } from "./streamFlow.js";
import type { FlowEvent } from "./types.js";
import { withScope, renderToString, useContext } from "@cjean-fr/jsx-string";
import { describe, it, expect } from "bun:test";

const collect = async (s: ReadableStream<string>): Promise<string> => {
  let out = "";
  for await (const c of s) out += c;
  return out;
};
const collectEvents = async (
  s: ReadableStream<FlowEvent>,
): Promise<FlowEvent[]> => {
  const events: FlowEvent[] = [];
  for await (const ev of s) events.push(ev);
  return events;
};

type FragmentEvent = FlowEvent & { type: "fragment" };

describe("initFlow", () => {
  it("initializes the flow context", async () => {
    await withScope(async () => {
      initFlow({ adapter: TurboAdapter, mode: "streaming" });
      expect(() => useContext(Flow)).not.toThrow();
    });
  });

  it("throws when used outside withScope", () => {
    expect(() =>
      initFlow({ adapter: TurboAdapter, mode: "streaming" }),
    ).toThrow();
  });
});

describe("Defer", () => {
  it("renders a placeholder and registers content (streaming mode)", async () => {
    await withScope(async () => {
      initFlow({ adapter: TurboAdapter, mode: "streaming" });
      const html = await renderToString(
        <Defer>{() => <span>content</span>}</Defer>,
      );
      expect(html).toContain('id="fragment-1"');
      const { pendingStore } = useContext(Flow);
      expect(pendingStore.size).toBe(1);
      expect(debugStore(pendingStore).get("fragment-1")?.merge).toBe("replace");
    });
  });

  it("accepts a node child — no thunk needed", async () => {
    await withScope(async () => {
      initFlow({ adapter: TurboAdapter, mode: "streaming" });
      const html = await renderToString(
        <Defer>
          <span>inline</span>
        </Defer>,
      );
      expect(html).toContain('id="fragment-1"');
      const { pendingStore } = useContext(Flow);
      expect(pendingStore.size).toBe(1);
    });
  });

  it("honours an explicit name", async () => {
    await withScope(async () => {
      initFlow({ adapter: TurboAdapter, mode: "streaming" });
      await renderToString(<Defer name="cart">{() => <span>x</span>}</Defer>);
      expect(debugStore(useContext(Flow).pendingStore).has("cart")).toBe(true);
    });
  });

  it("stores an explicit merge type", async () => {
    await withScope(async () => {
      initFlow({ adapter: TurboAdapter, mode: "streaming" });
      await renderToString(
        <Defer name="list" merge="append">
          {() => <li>item</li>}
        </Defer>,
      );
      expect(debugStore(useContext(Flow).pendingStore).get("list")?.merge).toBe(
        "append",
      );
    });
  });

  it("generates a src in static mode", async () => {
    await withScope(async () => {
      initFlow({
        adapter: TurboAdapter,
        mode: "static",
        generatePath: (id) => `/f/${id}.html`,
      });
      const html = await renderToString(
        <Defer>{() => <span>content</span>}</Defer>,
      );
      expect(html).toContain('src="/f/fragment-1.html"');
    });
  });
});

describe("ClientFetch", () => {
  it("renders a placeholder pointing at src, registers nothing", async () => {
    await withScope(async () => {
      initFlow({ adapter: TurboAdapter, mode: "streaming" });
      const html = await renderToString(<ClientFetch src="/api/fragment" />);
      expect(html).toContain('src="/api/fragment"');
      expect(useContext(Flow).pendingStore.size).toBe(0);
    });
  });
});

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

describe("Slot", () => {
  it("renders a placeholder with no registration when children are absent", async () => {
    await withScope(async () => {
      initFlow({ adapter: TurboAdapter, mode: "streaming" });
      const html = await renderToString(<Slot name="sidebar" />);
      expect(html).toContain('id="sidebar"');
      expect(useContext(Flow).pendingStore.size).toBe(0);
    });
  });

  it("registers content and renders a placeholder when children are present", async () => {
    await withScope(async () => {
      initFlow({ adapter: TurboAdapter, mode: "streaming" });
      const html = await renderToString(
        <Slot name="main">{() => <span>content</span>}</Slot>,
      );
      expect(html).toContain('id="main"');
      const { pendingStore } = useContext(Flow);
      expect(pendingStore.size).toBe(1);
      expect(debugStore(pendingStore).get("main")).toBeDefined();
    });
  });
});

describe("context.defer()", () => {
  it("registers, validates ids, and is last-wins on duplicate id", async () => {
    await withScope(async () => {
      initFlow({ adapter: TurboAdapter, mode: "streaming" });
      const { defer, pendingStore } = useContext(Flow);
      defer("badge", { content: () => <span>42</span>, merge: "replace" });
      expect(debugStore(pendingStore).get("badge")?.merge).toBe("replace");
      defer("badge", { content: () => <span>43</span>, merge: "append" });
      expect(pendingStore.size).toBe(1);
      expect(debugStore(pendingStore).get("badge")?.merge).toBe("append");
      expect(() =>
        defer("has space", { content: () => <span />, merge: "replace" }),
      ).toThrow(/valid fragment id/);
    });
  });

  it("rejects a merge the adapter cannot express (capabilities)", async () => {
    await withScope(async () => {
      initFlow({
        adapter: EsiAdapter,
        mode: "static",
        generatePath: (id) => `/f/${id}.html`,
      });
      expect(() =>
        useContext(Flow).defer("x", {
          content: () => <span />,
          merge: "append",
        }),
      ).toThrow(/not supported/);
    });
  });
});

describe("streamFlow", () => {
  const drain = async (
    store: PendingStore,
    opts?: Parameters<typeof streamFlow>[2],
  ) => {
    const results: FlowEvent[] = [];
    await streamFlow(
      { pendingStore: store },
      async (ev) => void results.push(ev),
      opts,
    );
    return results;
  };

  const cfg: FlowConfig = { adapter: TurboAdapter, mode: "streaming" };

  it("emits a fragment for a one-shot node entry", async () => {
    const store = createPendingStore(cfg);
    store.defer("t1", { content: <div>Hello</div>, merge: "replace" });
    const results = await drain(store);
    expect(results).toHaveLength(1);
    expect(results[0]!.type).toBe("fragment");
    if (results[0]!.type === "fragment")
      expect(results[0]!.html).toContain("Hello");
  });

  it("streams each item of an async-iterable entry", async () => {
    async function* rows() {
      yield <li>a</li>;
      yield <li>b</li>;
    }
    const store = createPendingStore(cfg);
    store.defer("feed", { content: rows(), merge: "append" });
    const results = await drain(store);
    const fragments = results.filter((e) => e.type === "fragment");
    expect(fragments).toHaveLength(2);
  });

  it("catches a factory throw and continues other entries", async () => {
    const store = createPendingStore(cfg);
    store.defer("good", { content: () => <div>OK</div>, merge: "replace" });
    store.defer("bad", {
      content: () => {
        throw new Error("fail");
      },
      merge: "replace",
    });
    const results = await drain(store);
    expect(results).toHaveLength(1);
    if (results[0]!.type === "fragment") expect(results[0]!.id).toBe("good");
  });

  it("emits an error fallback fragment when onError returns a node", async () => {
    const store = createPendingStore(cfg);
    store.defer("bad", {
      content: () => {
        throw new Error("fail");
      },
      merge: "replace",
    });
    const results = await drain(store, {
      onError: () => <span>error-fallback</span>,
    });
    expect(results).toHaveLength(1);
    if (results[0]!.type === "fragment")
      expect(results[0]!.html).toContain("error-fallback");
  });

  it("a per-entry onError overrides the global one", async () => {
    const store = createPendingStore(cfg);
    store.defer("bad", {
      content: () => {
        throw new Error("fail");
      },
      merge: "replace",
      onError: () => <span>local</span>,
    });
    const results = await drain(store, {
      onError: () => <span>global</span>,
    });
    if (results[0]!.type === "fragment")
      expect(results[0]!.html).toContain("local");
  });

  it("aborts a factory that exceeds its timeout and routes to onError", async () => {
    const slow = async (signal: AbortSignal) => {
      await new Promise<void>((resolve, reject) => {
        const t = setTimeout(resolve, 1000);
        signal.addEventListener(
          "abort",
          () => {
            clearTimeout(t);
            reject(signal.reason);
          },
          { once: true },
        );
      });
      return <div>too late</div>;
    };
    const store = createPendingStore(cfg);
    store.defer("slow", { content: slow, merge: "replace", timeout: 10 });
    const results = await drain(store, {
      onError: (err) => <span>{(err as Error).message}</span>,
    });
    if (results[0]!.type === "fragment") {
      expect(results[0]!.html).toContain('Defer "slow" timed out after 10ms');
      expect(results[0]!.html).not.toContain("too late");
    }
  });

  it("applies defaultTimeout when a factory sets no timeout of its own", async () => {
    const content = (signal: AbortSignal) =>
      new Promise((_, reject) =>
        signal.addEventListener("abort", () => reject(signal.reason), {
          once: true,
        }),
      ) as unknown as ReturnType<() => any>;
    const store = createPendingStore(cfg);
    store.defer("slow", { content, merge: "replace" });
    const results = await drain(store, {
      defaultTimeout: 10,
      onError: (err) => <span>{(err as Error).message}</span>,
    });
    if (results[0]!.type === "fragment")
      expect(results[0]!.html).toContain("timed out after 10ms");
  });
});

describe("renderToFlowEvents", () => {
  it("emits shell + close when there is nothing deferred", async () => {
    const events = await collectEvents(
      renderToFlowEvents(
        () => (
          <html>
            <body>
              <p>static</p>
            </body>
          </html>
        ),
        TurboAdapter,
      ),
    );
    expect(events.map((e) => e.type)).toEqual(["shell", "close"]);
  });

  it("emits shell, then fragment, then close", async () => {
    const events = await collectEvents(
      renderToFlowEvents(
        () => (
          <html>
            <body>
              <Defer>{() => <span>content</span>}</Defer>
            </body>
          </html>
        ),
        TurboAdapter,
      ),
    );
    expect(events.map((e) => e.type)).toEqual(["shell", "fragment", "close"]);
  });

  it("streams a synchronously-nested Defer after its parent", async () => {
    const events = await collectEvents(
      renderToFlowEvents(
        () => (
          <html>
            <body>
              <Defer>
                {() => (
                  <section>
                    OUTER
                    <Defer>{() => <span>INNER-SYNC</span>}</Defer>
                  </section>
                )}
              </Defer>
            </body>
          </html>
        ),
        TurboAdapter,
      ),
    );
    const fragments = events.filter(
      (e): e is FragmentEvent => e.type === "fragment",
    );
    expect(fragments.map((p) => p.id)).toEqual(["fragment-1", "fragment-2"]);
  });

  it("propagates an external AbortSignal — stream closes after it fires", async () => {
    const ac = new AbortController();
    const stream = renderToFlowEvents(
      () => (
        <html>
          <body>
            <p>hi</p>
          </body>
        </html>
      ),
      TurboAdapter,
      { signal: ac.signal },
    );
    const reader = stream.getReader();
    const first = await reader.read();
    expect(first.value?.type).toBe("shell");
    ac.abort();
    expect((await reader.read()).done).toBe(true);
    reader.releaseLock();
  });

  it("cancels a stream mid-flight between fragments", async () => {
    const ac = new AbortController();
    async function* items() {
      yield <li>a</li>;
      await Bun.sleep(50);
      yield <li>b</li>;
    }
    const stream = renderToFlowEvents(
      () => (
        <html>
          <body>
            <ul id="feed" />
            <Fill target="feed" merge="append">
              {items()}
            </Fill>
          </body>
        </html>
      ),
      TurboAdapter,
      { signal: ac.signal },
    );
    const reader = stream.getReader();
    await reader.read(); // shell
    expect((await reader.read()).value?.type).toBe("fragment");
    ac.abort();
    expect((await reader.read()).done).toBe(true);
    reader.releaseLock();
  });
});

describe("renderShell", () => {
  it("strips </body></html> and returns them as closingTag", async () => {
    const { shellBody, closingTag } = await renderShell(
      () => (
        <html>
          <body>
            <p>hi</p>
          </body>
        </html>
      ),
      {},
    );
    expect(shellBody).not.toContain("</body>");
    expect(shellBody).not.toContain("</html>");
    expect(closingTag).toMatch(/<\/body>\s*<\/html>\s*$/i);
  });

  it("returns an empty closingTag when there are no closing tags", async () => {
    const { shellBody, closingTag } = await renderShell(
      () => <p>no wrapping</p>,
      {},
    );
    expect(shellBody).toContain("<p>no wrapping</p>");
    expect(closingTag).toBe("");
  });

  it("applies adapter.transformShell to the shell body", async () => {
    const { shellBody } = await renderShell(
      () => (
        <html>
          <body />
        </html>
      ),
      { transformShell: (s: string) => s + "<!-- transformed -->" },
    );
    expect(shellBody).toContain("<!-- transformed -->");
  });
});

describe("orchestrateFlow", () => {
  it("emits shell, then runs streamFlow, then emits close in full mode", async () => {
    const events: FlowEvent[] = [];
    const emit = async (ev: FlowEvent) => void events.push(ev);
    const ac = new AbortController();
    await orchestrateFlow(
      emit,
      ac.signal,
      () => (
        <html>
          <body>
            <p>hi</p>
          </body>
        </html>
      ),
      TurboAdapter,
      {},
    );
    expect(events.map((e) => e.type)).toEqual(["shell", "close"]);
  });

  it("skips shell and close in fragment mode", async () => {
    const events: FlowEvent[] = [];
    const emit = async (ev: FlowEvent) => void events.push(ev);
    const ac = new AbortController();
    await orchestrateFlow(
      emit,
      ac.signal,
      () => (
        <html>
          <body>
            <p>hi</p>
          </body>
        </html>
      ),
      TurboAdapter,
      { mode: "fragment" },
    );
    expect(events).toEqual([]);
  });

  it("emits nothing when the signal is already aborted", async () => {
    const events: FlowEvent[] = [];
    const emit = async (ev: FlowEvent) => void events.push(ev);
    const ac = new AbortController();
    ac.abort();
    await orchestrateFlow(
      emit,
      ac.signal,
      () => (
        <html>
          <body>
            <p>hi</p>
          </body>
        </html>
      ),
      TurboAdapter,
      {},
    );
    expect(events).toEqual([]);
  });
});

describe("renderStream", () => {
  it("defaults to NativeAdapter when no adapter is passed", async () => {
    const html = await collect(
      renderStream(() => (
        <html>
          <head></head>
          <body>
            <Defer>{() => <span>x</span>}</Defer>
          </body>
        </html>
      )),
    );
    expect(html).toContain("MutationObserver");
    expect(html).toContain("</html>");
  });

  it("sends </html> after fragment chunks", async () => {
    const chunks = (
      await collect(
        renderStream(
          () => (
            <html>
              <body>
                <Defer>{() => <span>content</span>}</Defer>
              </body>
            </html>
          ),
          TurboAdapter,
        ),
      )
    ).toString();
    expect(chunks.indexOf("turbo-stream")).toBeLessThan(
      chunks.indexOf("</html>"),
    );
  });

  it("streams a Defer nested behind an await", async () => {
    const Inner = async () => {
      await Promise.resolve();
      return (
        <section>
          OUTER
          <Defer>{() => <span>INNER-ASYNC</span>}</Defer>
        </section>
      );
    };
    const html = await collect(
      renderStream(
        () => (
          <html>
            <body>
              <Defer>{() => <Inner />}</Defer>
            </body>
          </html>
        ),
        TurboAdapter,
      ),
    );
    expect(html).toContain("INNER-ASYNC");
    const parent = html.indexOf('target="fragment-1"');
    const child = html.indexOf('target="fragment-2"');
    expect(parent).toBeGreaterThan(-1);
    expect(parent).toBeLessThan(child);
  });
});

describe("Defer — streaming sequences (async-iterable child)", () => {
  it("streams each yield as an append fragment", async () => {
    async function* rows() {
      yield <li>a</li>;
      yield <li>b</li>;
    }
    const html = await collect(
      renderStream(
        () => (
          <html>
            <body>
              <ul id="feed" />
              <Fill target="feed" merge="append">
                {rows()}
              </Fill>
            </body>
          </html>
        ),
        TurboAdapter,
      ),
    );
    expect(html).toContain("<li>a</li>");
    expect(html).toContain("<li>b</li>");
    expect((html.match(/target="feed"/g) ?? []).length).toBe(2);
    expect(html).toContain('action="append"');
  });

  it("streams even with no other deferred content present", async () => {
    async function* rows() {
      yield <li>only</li>;
    }
    const html = await collect(
      renderStream(
        () => (
          <html>
            <body>
              <ul id="feed" />
              <Fill target="feed" merge="append">
                {rows()}
              </Fill>
            </body>
          </html>
        ),
        TurboAdapter,
      ),
    );
    expect(html).toContain("<li>only</li>");
    expect(html).toContain("</html>");
  });

  it("a streaming Defer registered inside a one-shot Defer factory is picked up", async () => {
    async function* inner() {
      yield <li>streamed</li>;
    }
    const html = await collect(
      renderStream(
        () => (
          <html>
            <body>
              <Defer>
                {() => (
                  <div>
                    deferred
                    <Fill target="feed" merge="append">
                      {inner()}
                    </Fill>
                  </div>
                )}
              </Defer>
            </body>
          </html>
        ),
        TurboAdapter,
      ),
    );
    expect(html).toContain("streamed");
    expect(html).toContain("deferred");
  });
});

describe("renderToStatic", () => {
  it("works without options for pure-static rendering", async () => {
    const result = await renderToStatic(async (ctx) => {
      const html = await ctx.renderPage(() => (
        <html>
          <body>
            <p>hi</p>
          </body>
        </html>
      ));
      return { html, count: ctx.pendingStore.size };
    });
    expect(result.html).toContain("<p>hi</p>");
    expect(result.count).toBe(0);
  });

  it("collects fragments without flushing them", async () => {
    const result = await renderToStatic(
      async (ctx) => {
        const html = await ctx.renderPage(() => (
          <html>
            <body>
              <Defer>{() => <span>real</span>}</Defer>
            </body>
          </html>
        ));
        return { html, ids: [...debugStore(ctx.pendingStore).keys()] };
      },
      { adapter: TurboAdapter },
    );
    expect(result.html).toContain('id="fragment-1"');
    expect(result.html).not.toContain("turbo-stream");
    expect(result.ids).toEqual(["fragment-1"]);
  });

  it("applies adapter.transformShell to the rendered page", async () => {
    const result = await renderToStatic(
      async (ctx) =>
        ctx.renderPage(() => (
          <html>
            <head></head>
            <body />
          </html>
        )),
      { adapter: NativeAdapter },
    );
    expect(result).toContain("MutationObserver");
  });

  describe("ctx.emitFragments", () => {
    it("wraps each fragment in adapter.Frame and hands it to the callback", async () => {
      const written: Array<{ id: string; url: string; html: string }> = [];
      await renderToStatic(
        async (ctx) => {
          await ctx.renderPage(() => (
            <html>
              <body>
                <Defer>{() => <span>real</span>}</Defer>
              </body>
            </html>
          ));
          await ctx.emitFragments(
            (id, url, html) => void written.push({ id, url, html }),
          );
        },
        { adapter: TurboAdapter },
      );
      expect(written).toHaveLength(1);
      expect(written[0]!.id).toBe("fragment-1");
      expect(written[0]!.url).toBe("/fragments/fragment-1.html");
      expect(written[0]!.html).toContain("<turbo-frame");
      expect(written[0]!.html).toContain("<span>real</span>");
    });

    it("uses a custom generatePath", async () => {
      const urls: string[] = [];
      await renderToStatic(
        async (ctx) => {
          await ctx.renderPage(() => (
            <html>
              <body>
                <Defer>{() => <span>real</span>}</Defer>
              </body>
            </html>
          ));
          await ctx.emitFragments((_id, url) => void urls.push(url));
        },
        { adapter: TurboAdapter, generatePath: (id) => `/f/${id}.html` },
      );
      expect(urls).toEqual(["/f/fragment-1.html"]);
    });

    it("throws without a configured adapter", async () => {
      await expect(
        renderToStatic(async (ctx) => {
          await ctx.emitFragments(() => {});
        }),
      ).rejects.toThrow(/adapter/i);
    });
  });

  it("ESI: placeholders become esi:include, fragments materialize as-is", async () => {
    const files: Record<string, string> = {};
    await renderToStatic(
      async (ctx) => {
        const page = await ctx.renderPage(() => (
          <html>
            <body>
              <Defer>{() => <span>real</span>}</Defer>
            </body>
          </html>
        ));
        files["index"] = page;
        await ctx.emitFragments((_id, url, html) => void (files[url] = html));
      },
      { adapter: EsiAdapter, generatePath: (id) => `/esi/${id}.html` },
    );
    expect(files["index"]).toContain("esi:include");
    expect(files["index"]).toContain('src="/esi/fragment-1.html"');
    expect(files["/esi/fragment-1.html"]).toContain("<span>real</span>");
  });

  it("<Defer> with content but no adapter throws a clear error", async () => {
    await expect(
      renderToStatic(async (ctx) =>
        ctx.renderPage(() => (
          <html>
            <body>
              <Defer>{() => <span>real</span>}</Defer>
            </body>
          </html>
        )),
      ),
    ).rejects.toThrow(/adapter/i);
  });
});

describe("adapters", () => {
  it("TurboAdapter placeholder → turbo-frame; patch → turbo-stream", async () => {
    const ph = await renderToString(
      TurboAdapter.Placeholder({ id: "x", src: "/s", children: "fb" }),
    );
    expect(ph).toContain("turbo-frame");
    expect(ph).toContain('src="/s"');
    const patch = await renderToString(
      TurboAdapter.Patch({ id: "x", children: "c", merge: "append" }),
    );
    expect(patch).toContain('action="append"');
    expect(patch).toContain('target="x"');
  });

  it("HtmxAdapter patch uses hx-swap-oob mapped from merge", async () => {
    expect(
      await renderToString(
        HtmxAdapter.Patch({ id: "x", children: "c", merge: "replace" }),
      ),
    ).toContain('hx-swap-oob="outerHTML"');
    expect(
      await renderToString(
        HtmxAdapter.Patch({ id: "x", children: "c", merge: "before" }),
      ),
    ).toContain('hx-swap-oob="beforebegin"');
  });

  it("NativeAdapter: replace → template; non-replace → insertAdjacentHTML", async () => {
    const repl = await renderToString(
      NativeAdapter.Patch({ id: "x", children: "c", merge: "replace" }),
    );
    expect(repl).toContain("template");
    expect(repl).not.toContain("insertAdjacentHTML");
    const app = await renderToString(
      NativeAdapter.Patch({ id: "x", children: "c", merge: "append" }),
    );
    expect(app).toContain("insertAdjacentHTML");
    expect(app).toContain("beforeend");
  });

  it("NativeAdapter.transformShell injects the polyfill into <head>", () => {
    const result = NativeAdapter.transformShell!(
      "<html><head></head><body></body></html>",
    );
    expect(result).toContain("MutationObserver");
    expect(result.indexOf("<script>")).toBeLessThan(result.indexOf("</head>"));
  });

  it("WebPlatformAdapter is replace-only, non-replace merges produce a template", async () => {
    expect(WebPlatformAdapter.capabilities).toEqual({
      streaming: true,
      merges: ["replace"],
    });
    const patch = await renderToString(
      WebPlatformAdapter.Patch({ id: "x", children: "c", merge: "append" }),
    );
    expect(patch).toContain("template");
  });

  it("EsiAdapter declares no streaming and replace-only merges", () => {
    expect(EsiAdapter.capabilities).toEqual({
      streaming: false,
      merges: ["replace"],
    });
  });

  it("EsiAdapter renders esi:include / esi:inline and escapes src", async () => {
    expect(
      await renderToString(
        EsiAdapter.Placeholder({ id: "x", src: "/f?a=1&b=2", children: "" }),
      ),
    ).toContain("&amp;");
    expect(
      await renderToString(
        EsiAdapter.Patch({ id: "x", children: "c", merge: "replace" }),
      ),
    ).toContain("esi:inline");
  });

  it("EsiAdapter.encode() throws — ESI is CDN-level, not a live stream", () => {
    expect(() => EsiAdapter.encode()).toThrow(/not supported/);
  });

  it("Frame variants: turbo-frame / div / template", async () => {
    expect(
      await renderToString(TurboAdapter.Frame({ id: "x", children: "c" })),
    ).toContain("<turbo-frame");
    expect(
      await renderToString(NativeAdapter.Frame({ id: "x", children: "c" })),
    ).toContain("template");
  });

  it("createAdapter defaults capabilities to full streaming + all merges", () => {
    const a = createAdapter({
      Placeholder: () => null,
      Patch: () => null,
      Frame: () => null,
    });
    expect(a.capabilities.streaming).toBe(true);
    expect(a.capabilities.merges).toContain("append");
  });
});

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
        </body>
      </html>
    ));
    expect(await res.text()).toContain("MutationObserver");
  });
});

describe("edge cases", () => {
  it("reader cancel stops an infinite generator", async () => {
    let count = 0;
    async function* inf() {
      while (true) {
        count++;
        yield <li>{count}</li>;
      }
    }
    const stream = renderStream(
      () => (
        <html>
          <body>
            <ul id="feed" />
            <Fill target="feed" merge="append">
              {inf()}
            </Fill>
          </body>
        </html>
      ),
      TurboAdapter,
    );
    const reader = stream.getReader();
    await reader.read(); // shell
    await reader.read(); // fragment 1
    await reader.read(); // fragment 2
    const before = count;
    await reader.cancel();
    await Bun.sleep(10);
    expect(count).toBeLessThanOrEqual(before + 1);
  });

  it("pre-aborted signal → no events, stream closes cleanly", async () => {
    const ac = new AbortController();
    ac.abort();
    const events = await collectEvents(
      renderToFlowEvents(
        () => (
          <html>
            <body>
              <p>hi</p>
            </body>
          </html>
        ),
        TurboAdapter,
        { signal: ac.signal },
      ),
    );
    expect(events).toEqual([]);
  });

  it("backpressure: producer parks while reading is paused, then completes", async () => {
    let produced = 0;
    async function* many() {
      for (let i = 0; i < 100; i++) {
        produced++;
        yield <span>{i}</span>;
      }
    }
    const stream = renderStream(
      () => (
        <html>
          <body>
            <div id="out" />
            <Fill target="out" merge="append">
              {many()}
            </Fill>
          </body>
        </html>
      ),
      TurboAdapter,
    );
    const reader = stream.getReader();
    for (let i = 0; i < 10; i++) if ((await reader.read()).done) break;
    await Bun.sleep(20);
    expect(produced).toBeLessThan(50);
    let remaining = 0;
    while (!(await reader.read()).done) remaining++;
    expect(remaining).toBe(92);
    expect(produced).toBe(100);
  });

  it("transformShell is applied exactly once on the streaming path", async () => {
    const html = await collect(
      renderStream(
        () => (
          <html>
            <head></head>
            <body>
              <p>hi</p>
            </body>
          </html>
        ),
        NativeAdapter,
      ),
    );
    expect((html.match(/MutationObserver/g) ?? []).length).toBe(1);
  });

  it("Defer rejects an invalid fragment id", async () => {
    await expect(
      collect(
        renderStream(
          () => (
            <html>
              <body>
                <Slot name={'x"><script>alert(1)</script>'} />
              </body>
            </html>
          ),
          NativeAdapter,
        ),
      ),
    ).rejects.toThrow(/not a valid fragment id/);
  });

  it("factory throw with onError → error fragment, good siblings still emit", async () => {
    const events = await collectEvents(
      renderToFlowEvents(
        () => (
          <html>
            <body>
              <Defer>
                {() => {
                  throw new Error("crash");
                }}
              </Defer>
              <Defer>{() => <span>ok</span>}</Defer>
            </body>
          </html>
        ),
        TurboAdapter,
        { onError: () => <div>err-fallback</div> },
      ),
    );
    const fragments = events.filter(
      (e): e is FragmentEvent => e.type === "fragment",
    );
    expect(fragments.find((p) => p.id === "fragment-1")?.html).toContain(
      "err-fallback",
    );
    expect(fragments.find((p) => p.id === "fragment-2")?.html).toContain("ok");
  });

  it("stream throw mid-iteration → onError kind=stream", async () => {
    const errors: Array<{ kind: string }> = [];
    async function* g() {
      yield <span>first</span>;
      throw new Error("mid-crash");
    }
    await collect(
      renderStream(
        () => (
          <html>
            <body>
              <div id="out" />
              <Fill target="out" merge="append">
                {g()}
              </Fill>
            </body>
          </html>
        ),
        TurboAdapter,
        {
          onError(_err, info) {
            errors.push(info);
            return <span>recovered</span>;
          },
        },
      ),
    );
    expect(errors).toHaveLength(1);
    expect(errors[0]!.kind).toBe("stream");
  });

  it("mixed one-shot + stream: shell first, fragments between, close last", async () => {
    async function* g() {
      yield <li>g</li>;
    }
    const events = await collectEvents(
      renderToFlowEvents(
        () => (
          <html>
            <body>
              <Defer>{() => <span>d</span>}</Defer>
              <Fill target="feed" merge="append">
                {g()}
              </Fill>
            </body>
          </html>
        ),
        TurboAdapter,
      ),
    );
    expect(events[0]!.type).toBe("shell");
    expect(events.at(-1)!.type).toBe("close");
    const types = events.map((e) => e.type);
    const shellIdx = types.indexOf("shell");
    const closeIdx = types.lastIndexOf("close");
    types.forEach((t, i) => {
      if (t === "fragment") {
        expect(i).toBeGreaterThan(shellIdx);
        expect(i).toBeLessThan(closeIdx);
      }
    });
  });
});

describe("composeShell", () => {
  it("applies transforms left-to-right", () => {
    const t = composeShell(
      (s) => s + "[a]",
      (s) => s + "[b]",
    );
    expect(t("x")).toBe("x[a][b]");
  });

  it("skips falsy entries (e.g. an adapter with no transformShell)", () => {
    const t = composeShell(
      undefined,
      TurboAdapter.transformShell,
      (s) => injectIntoHead(s, "<title>ok</title>"),
      null,
      false,
    );
    expect(t("<head></head>")).toBe("<head><title>ok</title></head>");
  });

  it("composes into an adapter and runs once in the streamed shell", async () => {
    const metadata = () => (s: string) =>
      injectIntoHead(s, "<title>Home</title>");
    const adapter = createAdapter({
      ...NativeAdapter,
      transformShell: composeShell(NativeAdapter.transformShell, metadata()),
    });
    const html = await collect(
      renderStream(
        () => (
          <html>
            <head></head>
            <body>
              <Defer>{() => <span>d</span>}</Defer>
            </body>
          </html>
        ),
        adapter,
      ),
    );
    expect(html).toContain("<title>Home</title>");
    expect(html).toContain("MutationObserver");
    expect(html.match(/<title>Home<\/title>/g)).toHaveLength(1);
  });
});
