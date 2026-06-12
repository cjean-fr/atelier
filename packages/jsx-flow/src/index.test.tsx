import { createFlowContext } from "./context.js";
import {
  Deferred,
  Patch,
  Generator,
  TurboAdapter,
  HtmxAdapter,
  NativeAdapter,
  WebPlatformAdapter,
  EsiAdapter,
  Flow,
  renderToFlowEvents,
  renderToReadableStream,
  renderToStatic,
  flowResponse,
  UnpolyAdapter,
  type FlowEvent,
  type Config,
  type FlowContext,
} from "./index.js";
import { streamFlow } from "./streamFlow.js";
import { withContext, renderToString, context } from "@cjean-fr/jsx-string";
import { describe, it, expect } from "bun:test";

/**
 * Test-side equivalent of what the render entry points do: bind a fresh
 * FlowContext for the duration of `fn`.
 */
function withFlow<T>(
  config: Config,
  fn: (ctx: FlowContext) => T | Promise<T>,
): Promise<T> {
  const ctx = createFlowContext(config);
  return withContext([Flow.with(ctx)], () => fn(ctx));
}

const STREAMING: Config = { adapter: TurboAdapter, mode: "streaming" };

describe("createFlowContext", () => {
  it("builds a context readable through the Flow token once bound", async () => {
    await withFlow(STREAMING, (ctx) => {
      expect(Flow.get()).toBe(ctx);
    });
  });

  it("components throw a clear error when Flow is not bound", () => {
    // JSX evaluates eagerly: the component runs (and throws) at JSX
    // evaluation time, before any renderToString call.
    expect(() => (
      <Deferred fallback={<div>loading...</div>}>
        {() => <span>content</span>}
      </Deferred>
    )).toThrow(
      /<Deferred> must render inside renderToFlowEvents\(\) or renderToStatic\(\)/,
    );
  });
});

describe("Deferred", () => {
  it("should render with fallback in streaming mode", async () => {
    await withFlow(STREAMING, async () => {
      const html = await renderToString(
        <Deferred fallback={<div>loading...</div>}>
          {() => <span>content</span>}
        </Deferred>,
      );
      expect(html).toContain('id="fragment-1"');
      expect(html).toContain("loading...");
    });
  });

  it("should render external island with explicit src", async () => {
    await withFlow(STREAMING, async () => {
      const html = await renderToString(
        <Deferred src="/api/fragment" fallback={<div>loading...</div>} />,
      );
      expect(html).toContain('src="/api/fragment"');
    });
  });

  it("should generate src in static mode", async () => {
    await withFlow(
      {
        adapter: TurboAdapter,
        mode: "static",
        generatePath: (id) => `/f/${id}.html`,
      },
      async () => {
        const html = await renderToString(
          <Deferred fallback={<div>loading...</div>}>
            {() => <span>content</span>}
          </Deferred>,
        );
        expect(html).toContain('src="/f/fragment-1.html"');
      },
    );
  });

  it("should register the fragment", async () => {
    await withFlow(STREAMING, async (ctx) => {
      await renderToString(
        <Deferred fallback={<div>loading...</div>}>
          {() => <span>content</span>}
        </Deferred>,
      );
      expect(ctx.fragments.size).toBe(1);
    });
  });

  it("should default merge to replace", async () => {
    await withFlow(STREAMING, async (ctx) => {
      await renderToString(
        <Deferred fallback={<div>loading...</div>}>
          {() => <span>content</span>}
        </Deferred>,
      );
      expect(ctx.fragments.get("fragment-1")?.merge).toBe("replace");
    });
  });

  it("should store explicit merge type", async () => {
    await withFlow(STREAMING, async (ctx) => {
      await renderToString(
        <Deferred merge="append" fallback={<ul />}>
          {() => <li>item</li>}
        </Deferred>,
      );
      expect(ctx.fragments.get("fragment-1")?.merge).toBe("append");
    });
  });
});

describe("Patch", () => {
  it("should register a fragment without rendering a placeholder", async () => {
    await withFlow(STREAMING, async (ctx) => {
      const html = await renderToString(
        <Patch target="toast-list" merge="append">
          {() => <li>Notification</li>}
        </Patch>,
      );
      expect(html).toBe("");
      expect(ctx.fragments.size).toBe(1);
      expect(ctx.fragments.get("toast-list")?.merge).toBe("append");
    });
  });

  it("should default merge to replace", async () => {
    await withFlow(STREAMING, async (ctx) => {
      await renderToString(
        <Patch target="some-target">{() => <span>content</span>}</Patch>,
      );
      expect(ctx.fragments.get("some-target")?.merge).toBe("replace");
    });
  });

  it("should work in static mode", async () => {
    await withFlow(
      {
        adapter: TurboAdapter,
        mode: "static",
        generatePath: (id) => `/f/${id}.html`,
      },
      async (ctx) => {
        await renderToString(
          <Patch target="some-target">{() => <span />}</Patch>,
        );
        expect(ctx.fragments.size).toBe(1);
      },
    );
  });
});

describe("patch()", () => {
  it("registers a fragment imperatively", async () => {
    await withFlow(STREAMING, ({ patch, fragments }) => {
      patch("badge", () => <span>42</span>, "replace");
      expect(fragments.size).toBe(1);
      expect(fragments.get("badge")?.merge).toBe("replace");
    });
  });

  it("defaults merge to replace", async () => {
    await withFlow(STREAMING, ({ patch, fragments }) => {
      patch("badge", () => <span>42</span>);
      expect(fragments.get("badge")?.merge).toBe("replace");
    });
  });

  it("rejects invalid ids", async () => {
    await withFlow(STREAMING, ({ patch }) => {
      expect(() => patch("", () => <span />)).toThrow();
      expect(() => patch("has space", () => <span />)).toThrow();
    });
  });

  it("is last-wins on duplicate id", async () => {
    await withFlow(STREAMING, ({ patch, fragments }) => {
      patch("id-1", () => <span>first</span>);
      patch("id-1", () => <span>second</span>, "append");
      expect(fragments.size).toBe(1);
      expect(fragments.get("id-1")?.merge).toBe("append");
    });
  });
});

describe("streamFlow", () => {
  it("should emit a patch event for each fragment", async () => {
    const fragments = new Map();
    fragments.set("test-1", {
      factory: () => <div>Hello</div>,
      merge: "replace",
    });

    const results: FlowEvent[] = [];
    await streamFlow({ fragments, streams: [] }, async (ev) => {
      results.push(ev);
    });

    expect(results.length).toBe(1);
    expect(results[0]!.type).toBe("patch");
    if (results[0]!.type === "patch") {
      expect(results[0]!.html).toContain("Hello");
    }
  });

  it("should catch errors and continue other fragments", async () => {
    const fragments = new Map();
    fragments.set("good", { factory: () => <div>OK</div>, merge: "replace" });
    fragments.set("bad", {
      factory: () => {
        throw new Error("fail");
      },
      merge: "replace",
    });

    const results: FlowEvent[] = [];
    await streamFlow({ fragments, streams: [] }, async (ev) => {
      results.push(ev);
    });

    expect(results.length).toBe(1);
    expect(results[0]!.type).toBe("patch");
    if (results[0]!.type === "patch") {
      expect(results[0]!.id).toBe("good");
    }
  });

  it("emits a patch with error fallback when onError returns a node", async () => {
    const fragments = new Map();
    fragments.set("bad", {
      factory: () => {
        throw new Error("fail");
      },
      merge: "replace",
    });

    const results: FlowEvent[] = [];
    await streamFlow(
      { fragments, streams: [] },
      async (ev) => {
        results.push(ev);
      },
      {
        onError: () => <span>error-fallback</span>,
      },
    );

    expect(results.length).toBe(1);
    expect(results[0]!.type).toBe("patch");
    if (results[0]!.type === "patch") {
      expect(results[0]!.html).toContain("error-fallback");
    }
  });
});

describe("renderToFlowEvents", () => {
  async function collectEvents(
    stream: ReadableStream<FlowEvent>,
  ): Promise<FlowEvent[]> {
    const events: FlowEvent[] = [];
    for await (const ev of stream) events.push(ev);
    return events;
  }

  it("emits shell + close when there are no fragments", async () => {
    const stream = renderToFlowEvents(
      () => (
        <html>
          <body>
            <p>static</p>
          </body>
        </html>
      ),
      TurboAdapter,
    );
    const events = await collectEvents(stream);
    expect(events.length).toBe(2);
    expect(events[0]!.type).toBe("shell");
    expect(events[1]!.type).toBe("close");
  });

  it("emits shell, then patches, then close", async () => {
    const stream = renderToFlowEvents(
      () => (
        <html>
          <body>
            <Deferred fallback={<div>loading...</div>}>
              {() => <span>content</span>}
            </Deferred>
          </body>
        </html>
      ),
      TurboAdapter,
    );
    const events = await collectEvents(stream);
    expect(events.length).toBe(3);
    expect(events[0]!.type).toBe("shell");
    expect(events[1]!.type).toBe("patch");
    expect(events[2]!.type).toBe("close");
  });

  it("streams a synchronously-nested <Deferred>", async () => {
    const stream = renderToFlowEvents(
      () => (
        <html>
          <body>
            <Deferred fallback={<p>outer</p>}>
              {() => (
                <section>
                  OUTER
                  <Deferred fallback={<p>inner</p>}>
                    {() => <span>INNER-SYNC</span>}
                  </Deferred>
                </section>
              )}
            </Deferred>
          </body>
        </html>
      ),
      TurboAdapter,
    );
    const events = await collectEvents(stream);
    const patches = events.filter(
      (e): e is FlowEvent & { type: "patch" } => e.type === "patch",
    );
    expect(patches.length).toBe(2);
    expect(patches[0]!.id).toBe("fragment-1");
    expect(patches[1]!.id).toBe("fragment-2");
  });

  it("propagates external AbortSignal — stream closes after signal fires", async () => {
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
    expect(first.value?.html).toContain("hi");
    ac.abort();
    const next = await reader.read();
    expect(next.done).toBe(true);
    reader.releaseLock();
  });

  it("cancels generator mid-flight between patches", async () => {
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
            <Generator target="feed" source={() => items()} />
          </body>
        </html>
      ),
      TurboAdapter,
      { signal: ac.signal },
    );
    const reader = stream.getReader();
    await reader.read(); // shell
    const patch1 = await reader.read();
    expect(patch1.value?.type).toBe("patch");
    ac.abort();
    const after = await reader.read();
    expect(after.done).toBe(true);
    reader.releaseLock();
  });
});

describe("renderToReadableStream", () => {
  async function collectChunks(
    stream: ReadableStream<string>,
  ): Promise<string[]> {
    const chunks: string[] = [];
    for await (const chunk of stream) chunks.push(chunk);
    return chunks;
  }

  it("should send </html> after fragment chunks", async () => {
    const stream = renderToReadableStream(
      () => (
        <html>
          <body>
            <Deferred fallback={<div>loading...</div>}>
              {() => <span>content</span>}
            </Deferred>
          </body>
        </html>
      ),
      TurboAdapter,
    );
    const chunks = await collectChunks(stream);
    const htmlCloseIndex = chunks.findIndex((c) => c.includes("</html>"));
    const fragmentIndex = chunks.findIndex((c) => c.includes("turbo-stream"));
    expect(htmlCloseIndex).toBeGreaterThan(-1);
    expect(fragmentIndex).toBeGreaterThan(-1);
    expect(fragmentIndex).toBeLessThan(htmlCloseIndex);
  });

  it("should send a single chunk when there are no fragments", async () => {
    const stream = renderToReadableStream(
      () => (
        <html>
          <body>
            <p>static</p>
          </body>
        </html>
      ),
      TurboAdapter,
    );
    const chunks = await collectChunks(stream);
    expect(chunks).toHaveLength(2);
    expect(chunks.join("")).toContain("</html>");
  });

  // A child <Deferred> is registered while its parent renders. The drain loop
  // in streamFlow must pick it up and stream it after its parent.
  it("streams a synchronously-nested <Deferred>", async () => {
    const stream = renderToReadableStream(
      () => (
        <html>
          <body>
            <Deferred fallback={<p>outer</p>}>
              {() => (
                <section>
                  OUTER
                  <Deferred fallback={<p>inner</p>}>
                    {() => <span>INNER-SYNC</span>}
                  </Deferred>
                </section>
              )}
            </Deferred>
          </body>
        </html>
      ),
      TurboAdapter,
    );
    const chunks = await collectChunks(stream);
    expect(chunks.join("")).toContain("INNER-SYNC");

    // Parent fragment must be patched before its nested child.
    const parent = chunks.findIndex((c) => c.includes('target="fragment-1"'));
    const child = chunks.findIndex((c) => c.includes('target="fragment-2"'));
    expect(parent).toBeGreaterThan(-1);
    expect(child).toBeGreaterThan(-1);
    expect(parent).toBeLessThan(child);
  });

  // Regression: a child <Deferred> revealed only after an await inside an async
  // parent used to be dropped — the single-pass loop had already finished.
  it("streams a <Deferred> nested behind an await", async () => {
    const Inner = async () => {
      await Promise.resolve();
      return (
        <section>
          OUTER
          <Deferred fallback={<p>inner</p>}>
            {() => <span>INNER-ASYNC</span>}
          </Deferred>
        </section>
      );
    };
    const stream = renderToReadableStream(
      () => (
        <html>
          <body>
            <Deferred fallback={<p>outer</p>}>{() => <Inner />}</Deferred>
          </body>
        </html>
      ),
      TurboAdapter,
    );
    const chunks = await collectChunks(stream);
    expect(chunks.join("")).toContain("INNER-ASYNC");

    const parent = chunks.findIndex((c) => c.includes('target="fragment-1"'));
    const child = chunks.findIndex((c) => c.includes('target="fragment-2"'));
    expect(parent).toBeGreaterThan(-1);
    expect(child).toBeGreaterThan(-1);
    expect(parent).toBeLessThan(child);
  });
});

describe("renderToStatic", () => {
  it("works without any options for pure-static rendering", async () => {
    const result = await renderToStatic(async (ctx) => {
      const html = await ctx.renderPage(() => (
        <html>
          <body>
            <p>hi</p>
          </body>
        </html>
      ));
      return { html, count: ctx.fragments.size };
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
              <Deferred fallback={<span>…</span>}>
                {() => <span>real</span>}
              </Deferred>
            </body>
          </html>
        ));
        return { html, ids: [...ctx.fragments.keys()] };
      },
      { adapter: TurboAdapter },
    );
    expect(result.html).toContain('id="fragment-1"');
    expect(result.html).not.toContain("turbo-stream");
    expect(result.ids).toEqual(["fragment-1"]);
  });

  it("applies adapter.transformShell when the page has fragments", async () => {
    const result = await renderToStatic(
      async (ctx) =>
        ctx.renderPage(() => (
          <html>
            <head></head>
            <body>
              <Deferred fallback={<span>…</span>}>
                {() => <span>ok</span>}
              </Deferred>
            </body>
          </html>
        )),
      { adapter: NativeAdapter },
    );
    expect(result).toContain("MutationObserver");
  });

  describe("ctx.emitFragments", () => {
    it("renders fragments via the adapter and hands them to the callback", async () => {
      const written: Array<{ id: string; url: string; html: string }> = [];
      await renderToStatic(
        async (ctx) => {
          await ctx.renderPage(() => (
            <html>
              <body>
                <Deferred fallback={<span>…</span>}>
                  {() => <span>real</span>}
                </Deferred>
              </body>
            </html>
          ));
          await ctx.emitFragments((id, url, html) => {
            written.push({ id, url, html });
          });
        },
        { adapter: TurboAdapter },
      );
      expect(written).toHaveLength(1);
      expect(written[0]!.id).toBe("fragment-1");
      expect(written[0]!.url).toBe("/fragments/fragment-1.html");
      expect(written[0]!.html).toContain("<span>real</span>");
    });

    it("uses a custom generatePath when provided", async () => {
      const written: string[] = [];
      await renderToStatic(
        async (ctx) => {
          await ctx.renderPage(() => (
            <html>
              <body>
                <Deferred fallback={<span>…</span>}>
                  {() => <span>real</span>}
                </Deferred>
              </body>
            </html>
          ));
          await ctx.emitFragments((_id, url) => {
            written.push(url);
          });
        },
        { adapter: TurboAdapter, generatePath: (id) => `/f/${id}.html` },
      );
      expect(written).toEqual(["/f/fragment-1.html"]);
    });
  });

  it("<Deferred> without explicit adapter uses NativeAdapter by default", async () => {
    const written: string[] = [];
    await renderToStatic(async (ctx) => {
      await ctx.renderPage(() => (
        <html>
          <body>
            <Deferred fallback={<span>…</span>}>
              {() => <span>real</span>}
            </Deferred>
          </body>
        </html>
      ));
      await ctx.emitFragments((_id, _url, html) => {
        written.push(html);
      });
    });
    expect(written).toHaveLength(1);
    expect(written[0]).toContain("<span>real</span>");
  });
});

describe("adapters", () => {
  it("TurboAdapter should render placeholder with turbo-frame", async () => {
    const html = await renderToString(
      TurboAdapter.Placeholder({
        id: "test-id",
        src: "/src",
        children: "fallback",
      }),
    );
    expect(html).toContain("turbo-frame");
    expect(html).toContain('id="test-id"');
    expect(html).toContain('src="/src"');
  });

  it("TurboAdapter should render patch with turbo-stream action=replace", async () => {
    const html = await renderToString(
      TurboAdapter.Patch({
        id: "test-id",
        children: "content",
        merge: "replace",
      }),
    );
    expect(html).toContain("turbo-stream");
    expect(html).toContain('target="test-id"');
    expect(html).toContain('action="replace"');
  });

  it("TurboAdapter should render patch with turbo-stream action=append", async () => {
    const html = await renderToString(
      TurboAdapter.Patch({
        id: "test-id",
        children: "content",
        merge: "append",
      }),
    );
    expect(html).toContain('action="append"');
  });

  it("HtmxAdapter should render placeholder with hx-get", async () => {
    const html = await renderToString(
      HtmxAdapter.Placeholder({
        id: "test-id",
        src: "/src",
        children: "fallback",
      }),
    );
    expect(html).toContain("hx-get");
    expect(html).toContain('id="test-id"');
  });

  it("HtmxAdapter should render patch with hx-swap-oob=outerHTML for replace", async () => {
    const html = await renderToString(
      HtmxAdapter.Patch({
        id: "test-id",
        children: "content",
        merge: "replace",
      }),
    );
    expect(html).toContain('hx-swap-oob="outerHTML"');
  });

  it("HtmxAdapter should render patch with hx-swap-oob=beforebegin for before", async () => {
    const html = await renderToString(
      HtmxAdapter.Patch({
        id: "test-id",
        children: "content",
        merge: "before",
      }),
    );
    expect(html).toContain('hx-swap-oob="beforebegin"');
  });

  it("WebPlatformAdapter should render patch for replace", async () => {
    const html = await renderToString(
      WebPlatformAdapter.Patch({
        id: "test-id",
        children: "content",
        merge: "replace",
      }),
    );
    expect(html).toContain("template");
  });

  it("WebPlatformAdapter should throw for non-replace merge types", () => {
    expect(() =>
      WebPlatformAdapter.Patch({
        id: "test-id",
        children: "content",
        merge: "append",
      }),
    ).toThrow(/WebPlatformAdapter only supports "replace"/);
  });

  it("NativeAdapter should render patch with template for replace", async () => {
    const html = await renderToString(
      NativeAdapter.Patch({
        id: "test-id",
        children: "content",
        merge: "replace",
      }),
    );
    expect(html).toContain("template");
    expect(html).not.toContain("insertAdjacentHTML");
  });

  it("NativeAdapter should use insertAdjacentHTML for non-replace merge types", async () => {
    const html = await renderToString(
      NativeAdapter.Patch({
        id: "test-id",
        children: "content",
        merge: "append",
      }),
    );
    expect(html).toContain("insertAdjacentHTML");
    expect(html).toContain("beforeend");
    expect(html).toContain('id="patch-test-id"');
  });

  it("NativeAdapter.transformShell should inject the polyfill into <head>", () => {
    const shell = "<html><head></head><body></body></html>";
    const result = NativeAdapter.transformShell!(shell);
    expect(result).toContain("<script>");
    expect(result).toContain("MutationObserver");
    expect(result.indexOf("<script>")).toBeLessThan(result.indexOf("</head>"));
  });

  it("TurboAdapter.Frame should render turbo-frame for SSG lazy-load", async () => {
    const html = await renderToString(
      TurboAdapter.Frame({ id: "test-id", children: "content" }),
    );
    expect(html).toContain("<turbo-frame");
    expect(html).toContain('id="test-id"');
    expect(html).not.toContain("turbo-stream");
  });

  it("HtmxAdapter.Frame should render plain div for SSG lazy-load", async () => {
    const html = await renderToString(
      HtmxAdapter.Frame({ id: "test-id", children: "content" }),
    );
    expect(html).toContain('id="test-id"');
    expect(html).not.toContain("hx-swap-oob");
  });

  it("NativeAdapter.Frame should render template for SSG lazy-load", async () => {
    const html = await renderToString(
      NativeAdapter.Frame({ id: "test-id", children: "content" }),
    );
    expect(html).toContain("template");
    expect(html).toContain('for="test-id"');
  });

  it("EsiAdapter should render esi:include with src", async () => {
    const html = await renderToString(
      EsiAdapter.Placeholder({
        id: "test-id",
        src: "/fragments/test.html",
        children: "fallback",
      }),
    );
    expect(html).toContain("esi:include");
    expect(html).toContain('src="/fragments/test.html"');
    expect(html).not.toContain("fallback");
  });

  it("EsiAdapter should render fallback inline when no src", async () => {
    const html = await renderToString(
      EsiAdapter.Placeholder({
        id: "test-id",
        src: null,
        children: "fallback",
      }),
    );
    expect(html).toContain("fallback");
    expect(html).not.toContain("esi:include");
  });

  it("EsiAdapter should escape src attribute", async () => {
    const html = await renderToString(
      EsiAdapter.Placeholder({
        id: "test-id",
        src: "/f?a=1&b=2",
        children: "",
      }),
    );
    expect(html).toContain("&amp;");
    expect(html).not.toContain('"&"');
  });

  it("EsiAdapter should render esi:inline patch", async () => {
    const html = await renderToString(
      EsiAdapter.Patch({
        id: "test-id",
        children: "content",
        merge: "replace",
      }),
    );
    expect(html).toContain("esi:inline");
    expect(html).toContain('name="test-id"');
    expect(html).toContain('fetchable="yes"');
    expect(html).toContain("content");
  });

  it("EsiAdapter should throw for non-replace merge types", () => {
    expect(() =>
      EsiAdapter.Patch({ id: "test-id", children: "content", merge: "append" }),
    ).toThrow(/EsiAdapter only supports "replace"/);
  });

  it("EsiAdapter.Frame should render plain HTML for SSG", async () => {
    const html = await renderToString(
      EsiAdapter.Frame({ id: "test-id", children: "content" }),
    );
    expect(html).toBe("content");
    expect(html).not.toContain("esi:");
    expect(html).not.toContain("id=");
  });

  it("TurboAdapter.encode() wraps patches in turbo-stream", async () => {
    const stream = new ReadableStream<FlowEvent>({
      start(c) {
        c.enqueue({ type: "shell", html: "<html><body>" });
        c.enqueue({
          type: "patch",
          id: "x",
          html: "hello",
          merge: "replace",
        });
        c.enqueue({ type: "close", html: "</body></html>" });
        c.close();
      },
    });
    const out = stream.pipeThrough(TurboAdapter.encode());
    const chunks: string[] = [];
    for await (const c of out) chunks.push(c);
    const all = chunks.join("");
    expect(all).toContain("<turbo-stream");
    expect(all).toContain('target="x"');
    expect(all).toContain("hello");
  });

  it("HtmxAdapter.encode() wraps patches in hx-swap-oob divs", async () => {
    const stream = new ReadableStream<FlowEvent>({
      start(c) {
        c.enqueue({ type: "patch", id: "y", html: "hi", merge: "append" });
        c.close();
      },
    });
    const out = stream.pipeThrough(HtmxAdapter.encode());
    const chunks: string[] = [];
    for await (const c of out) chunks.push(c);
    expect(chunks.join("")).toContain('hx-swap-oob="beforeend"');
  });

  it("HtmxAdapter.negotiate reads HX-Target header", () => {
    const req = new Request("http://localhost", {
      headers: { "HX-Target": "my-id" },
    });
    const n = HtmxAdapter.negotiate!(req);
    expect(n.target).toBe("my-id");
    expect(new Headers(n.headers).get("Vary")).toContain("HX-Target");
  });

  it("UnpolyAdapter.negotiate: fragment request → patches-only, echo, Vary", () => {
    const req = new Request("http://localhost", {
      headers: { "X-Up-Target": ".content", "X-Up-Fail-Target": "form" },
    });
    const n = UnpolyAdapter.negotiate!(req);
    expect(n.mode).toBe("patches-only");
    expect(n.target).toBe(".content");
    expect(n.failTarget).toBe("form");
    const headers = new Headers(n.headers);
    expect(headers.get("X-Up-Target")).toBe(".content");
    expect(headers.get("X-Up-Fail-Target")).toBe("form");
    expect(headers.get("Vary")).toContain("X-Up-Target");
  });

  it("UnpolyAdapter.negotiate: plain navigation → full shell", () => {
    const n = UnpolyAdapter.negotiate!(new Request("http://localhost"));
    expect(n.mode).toBeUndefined();
    expect(n.target).toBeUndefined();
  });

  it("flowResponse keeps caller headers and lets negotiation headers win", async () => {
    const res = await flowResponse(
      new Request("http://localhost", { headers: { "HX-Target": "zone" } }),
      () => (
        <html>
          <body>
            <p>hi</p>
          </body>
        </html>
      ),
      HtmxAdapter,
      { headers: { "cache-control": "no-store" } },
    );
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(res.headers.get("content-type")).toContain("text/html");
    expect(res.headers.get("Vary")).toContain("HX-Target");
    expect(await res.text()).toContain("hi");
  });
});

describe("Generator", () => {
  const collect = async (stream: ReadableStream<string>): Promise<string> => {
    let out = "";
    for await (const chunk of stream) out += chunk;
    return out;
  };

  it("registers a stream effect (headless, append by default)", async () => {
    await withFlow(STREAMING, async (ctx) => {
      async function* g() {
        yield <li>x</li>;
      }
      const html = await renderToString(
        <Generator target="feed" source={() => g()} />,
      );
      expect(html).toBe("");
      expect(ctx.streams).toHaveLength(1);
      expect(ctx.streams[0]!.target).toBe("feed");
      expect(ctx.streams[0]!.merge).toBe("append");
    });
  });

  it("streams each yield of an async generator as an append patch", async () => {
    async function* rows() {
      yield <li>a</li>;
      yield <li>b</li>;
    }
    const stream = renderToReadableStream(
      () => (
        <html>
          <body>
            <ul id="feed" />
            <Generator target="feed" source={() => rows()} />
          </body>
        </html>
      ),
      TurboAdapter,
    );
    const html = await collect(stream);
    expect(html).toContain("<li>a</li>");
    expect(html).toContain("<li>b</li>");
    expect((html.match(/target="feed"/g) ?? []).length).toBe(2);
    expect(html).toContain('action="append"');
  });

  it("maps raw data items through `map`", async () => {
    function* data() {
      yield { n: 1 };
      yield { n: 2 };
    }
    const stream = renderToReadableStream(
      () => (
        <html>
          <body>
            <ol id="list" />
            <Generator
              target="list"
              source={() => data()}
              map={(d) => <li>{d.n}</li>}
            />
          </body>
        </html>
      ),
      TurboAdapter,
    );
    const html = await collect(stream);
    expect(html).toContain("<li>1</li>");
    expect(html).toContain("<li>2</li>");
  });

  it("streams a sync iterable source", async () => {
    const stream = renderToReadableStream(
      () => (
        <html>
          <body>
            <ul id="feed" />
            <Generator
              target="feed"
              source={() => ["x", "y"]}
              map={(t) => <li>{t}</li>}
            />
          </body>
        </html>
      ),
      TurboAdapter,
    );
    const html = await collect(stream);
    expect(html).toContain("<li>x</li>");
    expect(html).toContain("<li>y</li>");
  });

  it("streams even when no <Deferred> fragments are present", async () => {
    async function* rows() {
      yield <li>only</li>;
    }
    const stream = renderToReadableStream(
      () => (
        <html>
          <body>
            <ul id="feed" />
            <Generator target="feed" source={() => rows()} />
          </body>
        </html>
      ),
      TurboAdapter,
    );
    const html = await collect(stream);
    expect(html).toContain("<li>only</li>");
    expect(html).toContain("</html>");
  });
});

describe("B6 — Edge cases", () => {
  const collect = async (s: ReadableStream<string>): Promise<string> => {
    let out = "";
    for await (const c of s) out += c;
    return out;
  };

  it("Generator inside Deferred factory (regression: streams registered after first wave)", async () => {
    function* inner() {
      yield <li>streamed</li>;
    }
    const html = await collect(
      renderToReadableStream(
        () => (
          <html>
            <body>
              <Deferred fallback={<p>loading</p>}>
                {() => (
                  <div>
                    deferred
                    <Generator target="feed" source={() => inner()} />
                  </div>
                )}
              </Deferred>
            </body>
          </html>
        ),
        TurboAdapter,
      ),
    );
    expect(html).toContain("streamed");
    expect(html).toContain("deferred");
  });

  it("reader cancel stops an infinite generator", async () => {
    let count = 0;
    async function* inf() {
      while (true) {
        count++;
        yield <li>{count}</li>;
      }
    }
    const stream = renderToReadableStream(
      () => (
        <html>
          <body>
            <ul id="feed" />
            <Generator target="feed" source={() => inf()} />
          </body>
        </html>
      ),
      TurboAdapter,
    );
    const reader = stream.getReader();
    await reader.read(); // shell
    await reader.read(); // patch 1
    await reader.read(); // patch 2
    const before = count;
    await reader.cancel();
    await Bun.sleep(10);
    // Count may increase by 1 due to one extra iteration before signal check.
    // The key invariant: count does not keep growing (generator stopped).
    expect(count).toBeLessThanOrEqual(before + 1);
  });

  it("pre-aborted signal → no events, stream closes cleanly", async () => {
    const ac = new AbortController();
    ac.abort();
    const events: FlowEvent[] = [];
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
    for await (const ev of stream) events.push(ev);
    expect(events).toEqual([]);
  });

  it("backpressure: producer pauses while reading is paused, then completes", async () => {
    let produced = 0;
    function* many() {
      for (let i = 0; i < 100; i++) {
        produced++;
        yield <span>{i}</span>;
      }
    }
    const stream = renderToReadableStream(
      () => (
        <html>
          <body>
            <Generator target="out" source={() => many()} />
          </body>
        </html>
      ),
      TurboAdapter,
    );
    const reader = stream.getReader();
    // First 10 reads = 1 shell + 9 patches
    for (let i = 0; i < 10; i++) {
      const { done } = await reader.read();
      if (done) break;
    }
    // Paused: the producer must park on backpressure near the high-water
    // mark instead of running the generator to completion.
    await Bun.sleep(20);
    expect(produced).toBeLessThan(50);
    // Resume and count all remaining events
    let remaining = 0;
    while (true) {
      const { done } = await reader.read();
      if (done) break;
      remaining++;
    }
    // Total: 1 shell + 100 patches + 1 close = 102 events.
    // After reading 10 (1 shell + 9 patches), we have 91 patches + 1 close = 92 remaining.
    expect(remaining).toBe(92);
    expect(produced).toBe(100);
  });

  it("transformShell is applied exactly once on the streaming path", async () => {
    const html = await collect(
      renderToReadableStream(
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

  it("<Deferred src> rejects an invalid fragment id", async () => {
    await expect(
      collect(
        renderToReadableStream(
          () => (
            <html>
              <body>
                <Deferred
                  name={'x"><script>alert(1)</script>'}
                  src="/x"
                  fallback={<p>…</p>}
                />
              </body>
            </html>
          ),
          NativeAdapter,
        ),
      ),
    ).rejects.toThrow(/not a valid fragment id/);
  });

  it("factory throw with onError → error patch replaces fallback, good siblings still emit", async () => {
    const events: FlowEvent[] = [];
    const stream = renderToFlowEvents(
      () => (
        <html>
          <body>
            <Deferred fallback={<p>loading</p>}>
              {() => {
                throw new Error("crash");
              }}
            </Deferred>
            <Deferred fallback={<p>loading2</p>}>
              {() => <span>ok</span>}
            </Deferred>
          </body>
        </html>
      ),
      TurboAdapter,
      {
        onError: () => <div class="error">fallback</div>,
      },
    );
    for await (const ev of stream) events.push(ev);
    const patches = events.filter((e) => e.type === "patch");
    expect(patches.length).toBe(2);
    // Error patch should have the fallback
    const errorPatch = patches.find((p) => p.id === "fragment-1");
    expect(errorPatch?.html).toContain("error");
    expect(errorPatch?.html).toContain("fallback");
    // Good patch should have normal content
    const goodPatch = patches.find((p) => p.id === "fragment-2");
    expect(goodPatch?.html).toContain("ok");
  });

  it("generator throw mid-iteration → onError kind=stream", async () => {
    const errors: Array<{ kind: string }> = [];
    async function* g() {
      yield <span>first</span>;
      throw new Error("mid-crash");
    }
    await collect(
      renderToReadableStream(
        () => (
          <html>
            <body>
              <Generator target="out" source={() => g()} />
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
    expect(errors.length).toBe(1);
    expect(errors[0]!.kind).toBe("stream");
  });

  it("mixed Deferred + Generator: shell first, patches, close last", async () => {
    async function* g() {
      yield <li>g</li>;
    }
    const events: FlowEvent[] = [];
    const stream = renderToFlowEvents(
      () => (
        <html>
          <body>
            <Deferred fallback={<p>loading</p>}>
              {() => <span>d</span>}
            </Deferred>
            <Generator target="feed" source={() => g()} />
          </body>
        </html>
      ),
      TurboAdapter,
    );
    for await (const ev of stream) events.push(ev);
    expect(events[0]!.type).toBe("shell");
    expect(events[events.length - 1]!.type).toBe("close");
    const types = events.map((e) => e.type);
    const shellIdx = types.indexOf("shell");
    const closeIdx = types.lastIndexOf("close");
    const patchIdxs = types
      .map((t, i) => (t === "patch" ? i : -1))
      .filter((i) => i >= 0);
    for (const pi of patchIdxs) {
      expect(pi).toBeGreaterThan(shellIdx);
      expect(pi).toBeLessThan(closeIdx);
    }
  });

  it("empty source → no patches, stream closes cleanly", async () => {
    const html = await collect(
      renderToReadableStream(
        () => (
          <html>
            <body>
              <Generator target="feed" source={() => []} />
            </body>
          </html>
        ),
        TurboAdapter,
      ),
    );
    expect(html).not.toContain("turbo-stream");
    expect(html).toContain("</html>");
  });
});

describe("context bindings", () => {
  const Page = context<{ title: string }>("test:flow-page");

  const collect = async (s: ReadableStream<string>): Promise<string> => {
    let out = "";
    for await (const c of s) out += c;
    return out;
  };

  it("renderToReadableStream: bindings visible in shell, deferred factories and generator items", async () => {
    const Title = () => <h1>{Page.get().title}</h1>;
    function* items() {
      yield <li>{Page.get().title}</li>;
    }
    const html = await collect(
      renderToReadableStream(
        () => (
          <html>
            <body>
              <Title />
              <Deferred fallback={<p>…</p>}>
                {() => <span>deferred:{Page.get().title}</span>}
              </Deferred>
              <ul id="feed" />
              <Generator target="feed" source={() => items()} />
            </body>
          </html>
        ),
        TurboAdapter,
        { context: [Page.with({ title: "Bound" })] },
      ),
    );
    expect(html).toContain("<h1>Bound</h1>");
    expect(html).toContain("deferred:Bound");
    expect(html).toContain("<li>Bound</li>");
  });

  it("renderToStatic: per-page bindings via renderPage options", async () => {
    const htmls = await renderToStatic(async (ctx) => {
      const pages: string[] = [];
      for (const title of ["one", "two"]) {
        pages.push(
          await ctx.renderPage(
            () => (
              <html>
                <body>
                  <h1>{Page.get().title}</h1>
                </body>
              </html>
            ),
            { context: [Page.with({ title })] },
          ),
        );
      }
      return pages;
    });
    expect(htmls[0]).toContain("<h1>one</h1>");
    expect(htmls[1]).toContain("<h1>two</h1>");
  });

  it("renderToStatic: build-wide bindings via options.context", async () => {
    const html = await renderToStatic(
      (ctx) =>
        ctx.renderPage(() => (
          <html>
            <body>
              <h1>{Page.get().title}</h1>
            </body>
          </html>
        )),
      { context: [Page.with({ title: "global" })] },
    );
    expect(html).toContain("<h1>global</h1>");
  });

  // Effects run under the scope active at drain time, not at registration:
  // emitFragments after the page loop sees the build-wide bindings, and
  // per-page data reaches a factory through its closure.
  it("emitFragments renders fragments under the build scope, page data via closure", async () => {
    const written = new Map<string, string>();
    await renderToStatic(
      async (ctx) => {
        for (const title of ["first", "second"]) {
          await ctx.renderPage(
            () => (
              <html>
                <body>
                  <Deferred name={`frag-${title}`} fallback={<p>…</p>}>
                    {() => (
                      <span>
                        {Page.get().title}:{title}
                      </span>
                    )}
                  </Deferred>
                </body>
              </html>
            ),
            { context: [Page.with({ title })] },
          );
        }
        await ctx.emitFragments((id, _url, html) => {
          written.set(id, html);
        });
      },
      { adapter: TurboAdapter, context: [Page.with({ title: "build" })] },
    );
    expect(written.get("frag-first")).toContain("build:first");
    expect(written.get("frag-second")).toContain("build:second");
  });

  it("flowResponse threads bindings to the rendered page", async () => {
    const res = await flowResponse(
      new Request("http://localhost"),
      () => (
        <html>
          <body>
            <h1>{Page.get().title}</h1>
          </body>
        </html>
      ),
      TurboAdapter,
      { context: [Page.with({ title: "req" })] },
    );
    expect(await res.text()).toContain("<h1>req</h1>");
  });
});
