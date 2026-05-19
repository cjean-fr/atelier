// @jsxImportSource @cjean-fr/jsx-string
import {
  initIslands,
  Island,
  streamIslands,
  TurboAdapter,
  HtmxAdapter,
  Islands,
} from "./index.js";
import { withScope, renderToString, useContext } from "@cjean-fr/jsx-string";
import { describe, it, expect } from "bun:test";

describe("initIslands", () => {
  it("should initialize plugin context", async () => {
    await withScope(async () => {
      initIslands({ adapter: TurboAdapter, mode: "streaming" });
      expect(() => useContext(Islands)).not.toThrow();
    });
  });

  it("should throw when used outside withScope", () => {
    expect(() =>
      initIslands({ adapter: TurboAdapter, mode: "streaming" }),
    ).toThrow();
  });
});

describe("Island", () => {
  it("should render locale island with fallback in streaming mode", async () => {
    await withScope(async () => {
      initIslands({ adapter: TurboAdapter, mode: "streaming" });
      const html = await renderToString(
        <Island fallback={<div>loading...</div>}>
          {() => <span>content</span>}
        </Island>,
      );
      expect(html).toContain('id="island-1"');
      expect(html).toContain("loading...");
    });
  });

  it("should render external island with explicit src", async () => {
    await withScope(async () => {
      initIslands({ adapter: TurboAdapter, mode: "streaming" });
      const html = await renderToString(
        <Island src="/api/fragment" fallback={<div>loading...</div>} />,
      );
      expect(html).toContain('src="/api/fragment"');
    });
  });

  it("should generate src in static mode", async () => {
    await withScope(async () => {
      initIslands({
        adapter: TurboAdapter,
        mode: "static",
        generatePath: (id) => `/f/${id}.html`,
      });
      const html = await renderToString(
        <Island fallback={<div>loading...</div>}>
          {() => <span>content</span>}
        </Island>,
      );
      expect(html).toContain('src="/f/island-1.html"');
    });
  });

  it("should collect factories for streaming", async () => {
    await withScope(async () => {
      initIslands({ adapter: TurboAdapter, mode: "streaming" });
      await renderToString(
        <Island fallback={<div>loading...</div>}>
          {() => <span>content</span>}
        </Island>,
      );
      const { collected } = useContext(Islands);
      expect(collected.size).toBe(1);
    });
  });
});

describe("streamIslands", () => {
  it("should call callback for each island", async () => {
    const islands = new Map();
    islands.set("test-1", () => <div>Hello</div>);

    const results: [string, string][] = [];
    await streamIslands(islands, TurboAdapter, (id, html) => {
      results.push([id, html]);
    });

    expect(results.length).toBe(1);
    expect(results[0]![1]).toContain("Hello");
  });

  it("should catch errors and continue other islands", async () => {
    const islands = new Map();
    islands.set("good", () => <div>OK</div>);
    islands.set("bad", () => {
      throw new Error("fail");
    });

    const results: [string, string][] = [];
    await streamIslands(islands, TurboAdapter, (id, html) => {
      results.push([id, html]);
    });

    expect(results.length).toBe(1);
    expect(results[0]![0]).toBe("good");
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

  it("TurboAdapter should render fragment with turbo-stream", async () => {
    const html = await renderToString(
      TurboAdapter.Fragment({ id: "test-id", children: "content" }),
    );
    expect(html).toContain("turbo-stream");
    expect(html).toContain('target="test-id"');
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

  it("HtmxAdapter should render fragment with hx-swap-oob", async () => {
    const html = await renderToString(
      HtmxAdapter.Fragment({ id: "test-id", children: "content" }),
    );
    expect(html).toContain('hx-swap-oob="true"');
    expect(html).toContain('id="test-id"');
  });
});
