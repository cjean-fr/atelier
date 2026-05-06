import {
  withIslandsPlugin,
  Island,
  streamIslands,
  TurboAdapter,
  HtmxAdapter,
  useIslandsContext,
} from "./index.js";
import {
  withContext,
  renderToStringAsync,
  useContext,
} from "@cjean-fr/jsx-string";
import { describe, it, expect } from "bun:test";

// --- withIslandsPlugin + useIslandsPlugin ---

describe("withIslandsPlugin", () => {
  it("should initialize plugin context", async () => {
    await withContext(async () => {
      withIslandsPlugin({ adapter: TurboAdapter, mode: "streaming" });
      expect(() => useContext()).not.toThrow();
    });
  });

  it("should throw when used outside withContext", () => {
    expect(() =>
      withIslandsPlugin({ adapter: TurboAdapter, mode: "streaming" }),
    ).toThrow();
  });
});

// --- Island (branched via types) ---

describe("Island", () => {
  it("should render locale island with fallback in streaming mode", async () => {
    await withContext(async () => {
      withIslandsPlugin({ adapter: TurboAdapter, mode: "streaming" });
      const html = await renderToStringAsync(
        <Island fallback={<div>loading...</div>}>
          {() => <span>content</span>}
        </Island>,
      );
      expect(html).toContain('id="island-1"');
      expect(html).toContain("loading...");
    });
  });

  it("should render external island with explicit src", async () => {
    await withContext(async () => {
      withIslandsPlugin({ adapter: TurboAdapter, mode: "streaming" });
      const html = await renderToStringAsync(
        <Island src="/api/fragment" fallback={<div>loading...</div>} />,
      );
      expect(html).toContain('src="/api/fragment"');
    });
  });

  it("should generate src in static mode", async () => {
    await withContext(async () => {
      withIslandsPlugin({
        adapter: TurboAdapter,
        mode: "static",
        generatePath: (id) => `/f/${id}.html`,
      });
      const html = await renderToStringAsync(
        <Island fallback={<div>loading...</div>}>
          {() => <span>content</span>}
        </Island>,
      );
      expect(html).toContain('src="/f/island-1.html"');
    });
  });

  it("should collect factories for streaming", async () => {
    await withContext(async () => {
      withIslandsPlugin({ adapter: TurboAdapter, mode: "streaming" });
      await renderToStringAsync(
        <Island fallback={<div>loading...</div>}>
          {() => <span>content</span>}
        </Island>,
      );
      const { collected } = useIslandsContext();
      expect(collected.size).toBe(1);
    });
  });
});

// --- streamIslands ---

describe("streamIslands", () => {
  it("should call callback for each island", async () => {
    const islands = new Map();
    islands.set("test-1", () => <div>Hello</div>);

    const results: [string, string][] = [];
    await streamIslands(islands, TurboAdapter, (id, html) => {
      results.push([id, html]);
    });

    expect(results.length).toBe(1);
    expect(results[0]).toBeDefined();
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

    expect(results.length).toBe(1); // only "good" should succeed
    expect(results[0]).toBeDefined();
    expect(results[0]![0]).toBe("good");
  });
});

// --- Adapters ---

describe("adapters", () => {
  it("TurboAdapter should render placeholder with turbo-frame", async () => {
    const result = TurboAdapter.Placeholder({
      id: "test-id",
      src: "/src",
      children: "fallback",
    });
    const html = await renderToStringAsync(result);
    expect(html).toContain("turbo-frame");
    expect(html).toContain('id="test-id"');
    expect(html).toContain('src="/src"');
  });

  it("TurboAdapter should render fragment with turbo-stream", async () => {
    const result = TurboAdapter.Fragment({
      id: "test-id",
      children: "content",
    });
    const html = await renderToStringAsync(result);
    expect(html).toContain("turbo-stream");
    expect(html).toContain('target="test-id"');
  });

  it("HtmxAdapter should render placeholder with hx-get", async () => {
    const result = HtmxAdapter.Placeholder({
      id: "test-id",
      src: "/src",
      children: "fallback",
    });
    const html = await renderToStringAsync(result);
    expect(html).toContain("hx-get");
    expect(html).toContain('id="test-id"');
  });

  it("HtmxAdapter should render fragment with hx-swap-oob", async () => {
    const result = HtmxAdapter.Fragment({ id: "test-id", children: "content" });
    const html = await renderToStringAsync(result);
    expect(html).toContain('hx-swap-oob="true"');
    expect(html).toContain('id="test-id"');
  });
});
