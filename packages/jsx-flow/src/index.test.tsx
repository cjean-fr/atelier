// @jsxImportSource @cjean-fr/jsx-string
import {
  initFlow,
  Deferred,
  Patch,
  Generator,
  streamFragments,
  TurboAdapter,
  HtmxAdapter,
  NativeAdapter,
  WebPlatformAdapter,
  EsiAdapter,
  Flow,
  renderToReadableStream,
  renderToStatic,
} from "./index.js";
import { withScope, renderToString, useContext } from "@cjean-fr/jsx-string";
import { describe, it, expect } from "bun:test";

describe("initFlow", () => {
  it("should initialize flow context", async () => {
    await withScope(async () => {
      initFlow({ adapter: TurboAdapter, mode: "streaming" });
      expect(() => useContext(Flow)).not.toThrow();
    });
  });

  it("should throw when used outside withScope", () => {
    expect(() =>
      initFlow({ adapter: TurboAdapter, mode: "streaming" }),
    ).toThrow();
  });
});

describe("Deferred", () => {
  it("should render with fallback in streaming mode", async () => {
    await withScope(async () => {
      initFlow({ adapter: TurboAdapter, mode: "streaming" });
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
    await withScope(async () => {
      initFlow({ adapter: TurboAdapter, mode: "streaming" });
      const html = await renderToString(
        <Deferred src="/api/fragment" fallback={<div>loading...</div>} />,
      );
      expect(html).toContain('src="/api/fragment"');
    });
  });

  it("should generate src in static mode", async () => {
    await withScope(async () => {
      initFlow({
        adapter: TurboAdapter,
        mode: "static",
        generatePath: (id) => `/f/${id}.html`,
      });
      const html = await renderToString(
        <Deferred fallback={<div>loading...</div>}>
          {() => <span>content</span>}
        </Deferred>,
      );
      expect(html).toContain('src="/f/fragment-1.html"');
    });
  });

  it("should register the fragment", async () => {
    await withScope(async () => {
      initFlow({ adapter: TurboAdapter, mode: "streaming" });
      await renderToString(
        <Deferred fallback={<div>loading...</div>}>
          {() => <span>content</span>}
        </Deferred>,
      );
      const { fragments } = useContext(Flow);
      expect(fragments.size).toBe(1);
    });
  });

  it("should default merge to replace", async () => {
    await withScope(async () => {
      initFlow({ adapter: TurboAdapter, mode: "streaming" });
      await renderToString(
        <Deferred fallback={<div>loading...</div>}>
          {() => <span>content</span>}
        </Deferred>,
      );
      const { fragments } = useContext(Flow);
      expect(fragments.get("fragment-1")?.merge).toBe("replace");
    });
  });

  it("should store explicit merge type", async () => {
    await withScope(async () => {
      initFlow({ adapter: TurboAdapter, mode: "streaming" });
      await renderToString(
        <Deferred merge="append" fallback={<ul />}>
          {() => <li>item</li>}
        </Deferred>,
      );
      const { fragments } = useContext(Flow);
      expect(fragments.get("fragment-1")?.merge).toBe("append");
    });
  });
});

describe("Patch", () => {
  it("should register a fragment without rendering a placeholder", async () => {
    await withScope(async () => {
      initFlow({ adapter: TurboAdapter, mode: "streaming" });
      const html = await renderToString(
        <Patch target="toast-list" merge="append">
          {() => <li>Notification</li>}
        </Patch>,
      );
      expect(html).toBe("");
      const { fragments } = useContext(Flow);
      expect(fragments.size).toBe(1);
      expect(fragments.get("toast-list")?.merge).toBe("append");
    });
  });

  it("should default merge to replace", async () => {
    await withScope(async () => {
      initFlow({ adapter: TurboAdapter, mode: "streaming" });
      await renderToString(
        <Patch target="some-target">{() => <span>content</span>}</Patch>,
      );
      const { fragments } = useContext(Flow);
      expect(fragments.get("some-target")?.merge).toBe("replace");
    });
  });

  it("should work in static mode", async () => {
    await withScope(async () => {
      initFlow({
        adapter: TurboAdapter,
        mode: "static",
        generatePath: (id) => `/f/${id}.html`,
      });
      await renderToString(
        <Patch target="some-target">{() => <span />}</Patch>,
      );
      const { fragments } = useContext(Flow);
      expect(fragments.size).toBe(1);
    });
  });
});

describe("patch()", () => {
  it("registers a fragment imperatively", async () => {
    await withScope(async () => {
      initFlow({ adapter: TurboAdapter, mode: "streaming" });
      const { patch, fragments } = useContext(Flow);
      patch("badge", () => <span>42</span>, "replace");
      expect(fragments.size).toBe(1);
      expect(fragments.get("badge")?.merge).toBe("replace");
    });
  });

  it("defaults merge to replace", async () => {
    await withScope(async () => {
      initFlow({ adapter: TurboAdapter, mode: "streaming" });
      const { patch, fragments } = useContext(Flow);
      patch("badge", () => <span>42</span>);
      expect(fragments.get("badge")?.merge).toBe("replace");
    });
  });

  it("rejects invalid ids", async () => {
    await withScope(async () => {
      initFlow({ adapter: TurboAdapter, mode: "streaming" });
      const { patch } = useContext(Flow);
      expect(() => patch("", () => <span />)).toThrow();
      expect(() => patch("has space", () => <span />)).toThrow();
    });
  });

  it("is last-wins on duplicate id", async () => {
    await withScope(async () => {
      initFlow({ adapter: TurboAdapter, mode: "streaming" });
      const { patch, fragments } = useContext(Flow);
      patch("id-1", () => <span>first</span>);
      patch("id-1", () => <span>second</span>, "append");
      expect(fragments.size).toBe(1);
      expect(fragments.get("id-1")?.merge).toBe("append");
    });
  });
});

describe("streamFragments", () => {
  it("should call callback for each fragment", async () => {
    const fragments = new Map();
    fragments.set("test-1", {
      factory: () => <div>Hello</div>,
      merge: "replace",
    });

    const results: [string, string][] = [];
    await streamFragments(fragments, TurboAdapter, (id, html) => {
      results.push([id, html]);
    });

    expect(results.length).toBe(1);
    expect(results[0]![1]).toContain("Hello");
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

    const results: [string, string][] = [];
    await streamFragments(fragments, TurboAdapter, (id, html) => {
      results.push([id, html]);
    });

    expect(results.length).toBe(1);
    expect(results[0]![0]).toBe("good");
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
    const stream = await renderToReadableStream(
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
    const stream = await renderToReadableStream(
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
    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toContain("</html>");
  });

  // A child <Deferred> is registered while its parent renders. The drain loop
  // in streamFragments must pick it up and stream it after its parent.
  it("streams a synchronously-nested <Deferred>", async () => {
    const stream = await renderToReadableStream(
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
    const stream = await renderToReadableStream(
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
      expect(written[0]!.html).toContain("turbo-stream");
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

    it("throws if called without a configured adapter", async () => {
      await expect(
        renderToStatic(async (ctx) => {
          await ctx.emitFragments(() => {});
        }),
      ).rejects.toThrow(/adapter/i);
    });
  });

  it("<Deferred> usage without adapter throws a clear error", async () => {
    await expect(
      renderToStatic(async (ctx) => {
        return ctx.renderPage(() => (
          <html>
            <body>
              <Deferred fallback={<span>…</span>}>
                {() => <span>real</span>}
              </Deferred>
            </body>
          </html>
        ));
      }),
    ).rejects.toThrow(/adapter/i);
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
});

describe("Generator", () => {
  const collect = async (stream: ReadableStream<string>): Promise<string> => {
    let out = "";
    for await (const chunk of stream) out += chunk;
    return out;
  };

  it("registers a stream effect (headless, append by default)", async () => {
    await withScope(async () => {
      initFlow({ adapter: TurboAdapter, mode: "streaming" });
      async function* g() {
        yield <li>x</li>;
      }
      const html = await renderToString(
        <Generator target="feed" source={() => g()} />,
      );
      expect(html).toBe("");
      const { streams } = useContext(Flow);
      expect(streams).toHaveLength(1);
      expect(streams[0]!.target).toBe("feed");
      expect(streams[0]!.merge).toBe("append");
    });
  });

  it("streams each yield of an async generator as an append patch", async () => {
    async function* rows() {
      yield <li>a</li>;
      yield <li>b</li>;
    }
    const stream = await renderToReadableStream(
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
    const stream = await renderToReadableStream(
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
    const stream = await renderToReadableStream(
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
    const stream = await renderToReadableStream(
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
