// @jsxImportSource @cjean-fr/jsx-string
import {
  initFlow,
  Island,
  Patch,
  streamFragments,
  TurboAdapter,
  HtmxAdapter,
  NativeAdapter,
  WebPlatformAdapter,
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

describe("Island", () => {
  it("should render with fallback in streaming mode", async () => {
    await withScope(async () => {
      initFlow({ adapter: TurboAdapter, mode: "streaming" });
      const html = await renderToString(
        <Island fallback={<div>loading...</div>}>
          {() => <span>content</span>}
        </Island>,
      );
      expect(html).toContain('id="fragment-1"');
      expect(html).toContain("loading...");
    });
  });

  it("should render external island with explicit src", async () => {
    await withScope(async () => {
      initFlow({ adapter: TurboAdapter, mode: "streaming" });
      const html = await renderToString(
        <Island src="/api/fragment" fallback={<div>loading...</div>} />,
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
        <Island fallback={<div>loading...</div>}>
          {() => <span>content</span>}
        </Island>,
      );
      expect(html).toContain('src="/f/fragment-1.html"');
    });
  });

  it("should enqueue into the fragment channel", async () => {
    await withScope(async () => {
      initFlow({ adapter: TurboAdapter, mode: "streaming" });
      await renderToString(
        <Island fallback={<div>loading...</div>}>
          {() => <span>content</span>}
        </Island>,
      );
      const { channels } = useContext(Flow);
      expect(channels.fragment.size).toBe(1);
      expect(channels.head.size).toBe(0);
    });
  });

  it("should default merge to replace", async () => {
    await withScope(async () => {
      initFlow({ adapter: TurboAdapter, mode: "streaming" });
      await renderToString(
        <Island fallback={<div>loading...</div>}>
          {() => <span>content</span>}
        </Island>,
      );
      const { channels } = useContext(Flow);
      expect(channels.fragment.get("fragment-1")?.merge).toBe("replace");
    });
  });

  it("should store explicit merge type", async () => {
    await withScope(async () => {
      initFlow({ adapter: TurboAdapter, mode: "streaming" });
      await renderToString(
        <Island merge="append" fallback={<ul />}>
          {() => <li>item</li>}
        </Island>,
      );
      const { channels } = useContext(Flow);
      expect(channels.fragment.get("fragment-1")?.merge).toBe("append");
    });
  });
});

describe("Patch", () => {
  it("should enqueue into the fragment channel without a placeholder", async () => {
    await withScope(async () => {
      initFlow({ adapter: TurboAdapter, mode: "streaming" });
      const html = await renderToString(
        <Patch target="toast-list" merge="append">
          {() => <li>Notification</li>}
        </Patch>,
      );
      expect(html).toBe("");
      const { channels } = useContext(Flow);
      expect(channels.fragment.size).toBe(1);
      expect(channels.fragment.get("toast-list")?.merge).toBe("append");
    });
  });

  it("should default merge to replace", async () => {
    await withScope(async () => {
      initFlow({ adapter: TurboAdapter, mode: "streaming" });
      await renderToString(
        <Patch target="some-target">{() => <span>content</span>}</Patch>,
      );
      const { channels } = useContext(Flow);
      expect(channels.fragment.get("some-target")?.merge).toBe("replace");
    });
  });

  it("should work in static mode", async () => {
    await withScope(async () => {
      initFlow({ adapter: TurboAdapter, mode: "static", generatePath: (id) => `/f/${id}.html` });
      await renderToString(<Patch target="some-target">{() => <span />}</Patch>);
      const { channels } = useContext(Flow);
      expect(channels.fragment.size).toBe(1);
    });
  });
});

describe("enqueue", () => {
  it("should enqueue into the fragment channel imperatively", async () => {
    await withScope(async () => {
      initFlow({ adapter: TurboAdapter, mode: "streaming" });
      const { enqueue, channels } = useContext(Flow);
      enqueue("fragment", "badge", () => <span>42</span>, "replace");
      expect(channels.fragment.size).toBe(1);
      expect(channels.fragment.get("badge")?.merge).toBe("replace");
    });
  });

  it("should enqueue into the head channel imperatively", async () => {
    await withScope(async () => {
      initFlow({ adapter: TurboAdapter, mode: "streaming" });
      const { enqueue, channels } = useContext(Flow);
      enqueue("head", "og-title", () => <meta property="og:title" content="Hello" />);
      expect(channels.head.size).toBe(1);
      expect(channels.fragment.size).toBe(0);
    });
  });

  it("should accept colons and other non-DOM characters in head keys", async () => {
    await withScope(async () => {
      initFlow({ adapter: TurboAdapter, mode: "streaming" });
      const { enqueue, channels } = useContext(Flow);
      // "og:title" would fail assertFragmentId — valid as a head key
      expect(() => enqueue("head", "og:title", () => <meta property="og:title" content="x" />)).not.toThrow();
      expect(channels.head.size).toBe(1);
    });
  });

  it("should reject empty head keys", async () => {
    await withScope(async () => {
      initFlow({ adapter: TurboAdapter, mode: "streaming" });
      const { enqueue } = useContext(Flow);
      expect(() => enqueue("head", "", () => <meta />)).toThrow(/must not be empty/);
    });
  });

  it("should default fragment merge to replace", async () => {
    await withScope(async () => {
      initFlow({ adapter: TurboAdapter, mode: "streaming" });
      const { enqueue, channels } = useContext(Flow);
      enqueue("fragment", "badge", () => <span>42</span>);
      expect(channels.fragment.get("badge")?.merge).toBe("replace");
    });
  });
});

describe("head channel", () => {
  async function collectChunks(stream: ReadableStream<string>): Promise<string[]> {
    const chunks: string[] = [];
    for await (const chunk of stream) chunks.push(chunk);
    return chunks;
  }

  it("should inject head effects before </head> in the shell", async () => {
    const stream = await renderToReadableStream(
      () => {
        const { enqueue } = useContext(Flow);
        enqueue("head", "meta-title", () => <meta name="description" content="Hello" />);
        return (
          <html>
            <head><title>Test</title></head>
            <body><p>static</p></body>
          </html>
        );
      },
      TurboAdapter,
    );
    const chunks = await collectChunks(stream);
    const html = chunks.join("");
    expect(html).toContain('<meta name="description"');
    // head effect should land before </head>
    expect(html.indexOf('<meta name="description"')).toBeLessThan(html.indexOf("</head>"));
  });

  it("should flush head channel even when no fragment channel entries", async () => {
    const stream = await renderToReadableStream(
      () => {
        const { enqueue } = useContext(Flow);
        enqueue("head", "og", () => <meta property="og:title" content="Test" />);
        return <html><head></head><body></body></html>;
      },
      TurboAdapter,
    );
    const chunks = await collectChunks(stream);
    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toContain('property="og:title"');
  });
});

describe("renderPage (head channel in static mode)", () => {
  it("should inject head effects before </head>", async () => {
    const result = await renderToStatic(async (ctx) => {
      ctx.enqueue("head", "og-title", () => <meta property="og:title" content="Hello" />);
      return ctx.renderPage(() => <html><head><title>Test</title></head><body /></html>);
    }, TurboAdapter, (id) => `/f/${id}.html`);
    expect(result).toContain('property="og:title"');
    expect(result.indexOf('property="og:title"')).toBeLessThan(result.indexOf("</head>"));
  });

  it("should accept head keys with colons like og:title", async () => {
    const result = await renderToStatic(async (ctx) => {
      ctx.enqueue("head", "og:title", () => <meta property="og:title" content="x" />);
      return ctx.renderPage(() => <html><head></head><body /></html>);
    }, TurboAdapter, (id) => `/f/${id}.html`);
    expect(result).toContain('property="og:title"');
  });

  it("should return html unchanged when head channel is empty", async () => {
    const result = await renderToStatic(async (ctx) => {
      return ctx.renderPage(() => <html><head></head><body /></html>);
    }, TurboAdapter, (id) => `/f/${id}.html`);
    expect(result).toContain("<head></head>");
  });

  it("should skip failing head factories and continue", async () => {
    const result = await renderToStatic(async (ctx) => {
      ctx.enqueue("head", "good", () => <meta name="ok" content="yes" />);
      ctx.enqueue("head", "bad", () => { throw new Error("fail"); });
      return ctx.renderPage(() => <html><head></head><body /></html>);
    }, TurboAdapter, (id) => `/f/${id}.html`);
    expect(result).toContain('name="ok"');
  });
});

describe("streamFragments", () => {
  it("should call callback for each fragment", async () => {
    const fragments = new Map();
    fragments.set("test-1", { factory: () => <div>Hello</div>, merge: "replace" });

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
      factory: () => { throw new Error("fail"); },
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
  async function collectChunks(stream: ReadableStream<string>): Promise<string[]> {
    const chunks: string[] = [];
    for await (const chunk of stream) chunks.push(chunk);
    return chunks;
  }

  it("should send </html> before fragment chunks", async () => {
    const stream = await renderToReadableStream(
      () => (
        <html>
          <body>
            <Island fallback={<div>loading...</div>}>
              {() => <span>content</span>}
            </Island>
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
          <body><p>static</p></body>
        </html>
      ),
      TurboAdapter,
    );
    const chunks = await collectChunks(stream);
    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toContain("</html>");
  });
});

describe("adapters", () => {
  it("TurboAdapter should render placeholder with turbo-frame", async () => {
    const html = await renderToString(
      TurboAdapter.Placeholder({ id: "test-id", src: "/src", children: "fallback" }),
    );
    expect(html).toContain("turbo-frame");
    expect(html).toContain('id="test-id"');
    expect(html).toContain('src="/src"');
  });

  it("TurboAdapter should render patch with turbo-stream action=replace", async () => {
    const html = await renderToString(
      TurboAdapter.Patch({ id: "test-id", children: "content", merge: "replace" }),
    );
    expect(html).toContain("turbo-stream");
    expect(html).toContain('target="test-id"');
    expect(html).toContain('action="replace"');
  });

  it("TurboAdapter should render patch with turbo-stream action=append", async () => {
    const html = await renderToString(
      TurboAdapter.Patch({ id: "test-id", children: "content", merge: "append" }),
    );
    expect(html).toContain('action="append"');
  });

  it("HtmxAdapter should render placeholder with hx-get", async () => {
    const html = await renderToString(
      HtmxAdapter.Placeholder({ id: "test-id", src: "/src", children: "fallback" }),
    );
    expect(html).toContain("hx-get");
    expect(html).toContain('id="test-id"');
  });

  it("HtmxAdapter should render patch with hx-swap-oob=outerHTML for replace", async () => {
    const html = await renderToString(
      HtmxAdapter.Patch({ id: "test-id", children: "content", merge: "replace" }),
    );
    expect(html).toContain('hx-swap-oob="outerHTML"');
  });

  it("HtmxAdapter should render patch with hx-swap-oob=beforebegin for before", async () => {
    const html = await renderToString(
      HtmxAdapter.Patch({ id: "test-id", children: "content", merge: "before" }),
    );
    expect(html).toContain('hx-swap-oob="beforebegin"');
  });

  it("WebPlatformAdapter should render patch for replace", async () => {
    const html = await renderToString(
      WebPlatformAdapter.Patch({ id: "test-id", children: "content", merge: "replace" }),
    );
    expect(html).toContain("template");
  });

  it("WebPlatformAdapter should throw for non-replace merge types", () => {
    expect(() =>
      WebPlatformAdapter.Patch({ id: "test-id", children: "content", merge: "append" }),
    ).toThrow(/WebPlatformAdapter only supports "replace"/);
  });

  it("NativeAdapter should render patch with template for replace", async () => {
    const html = await renderToString(
      NativeAdapter.Patch({ id: "test-id", children: "content", merge: "replace" }),
    );
    expect(html).toContain("template");
    expect(html).not.toContain("insertAdjacentHTML");
  });

  it("NativeAdapter should use insertAdjacentHTML for non-replace merge types", async () => {
    const html = await renderToString(
      NativeAdapter.Patch({ id: "test-id", children: "content", merge: "append" }),
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
});
