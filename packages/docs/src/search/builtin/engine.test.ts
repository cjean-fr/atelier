import {
  rank,
  snippetAround,
  escapeHtml,
  escapeAttr,
  highlight,
  MAX_RESULTS,
  type SearchEntry,
} from "./engine.js";
import { describe, it, expect } from "bun:test";

const sample: SearchEntry[] = [
  {
    url: "/guide/installation",
    title: "Installation",
    text: "Install jsx-string via bun or npm. Configure tsconfig with jsxImportSource.",
  },
  {
    url: "/guide/quick-start",
    title: "Quick Start",
    text: "renderToString returns a Promise of HTML string. Components can be async functions.",
  },
  {
    url: "/api/context",
    title: "Context API",
    text: "Pass data without prop drilling. withScope plus setContext plus useContext.",
  },
  {
    url: "/",
    title: "Home",
    text: "jsx-string renders JSX into HTML strings. Zero dependencies.",
  },
];

describe("rank", () => {
  it("returns an empty array when the query is empty", () => {
    expect(rank(sample, "")).toEqual([]);
  });

  it("filters out entries with no title and no body match", () => {
    const r = rank(sample, "zzzzz");
    expect(r).toEqual([]);
  });

  it("returns title-matching entries first (higher score)", () => {
    // "context" appears in the /api/context title AND in its body, plus body-only in /api/context's text.
    const r = rank(sample, "context");
    expect(r.length).toBeGreaterThanOrEqual(1);
    // The title-matching entry must come first.
    expect(r[0]!.entry.url).toBe("/api/context");
    // If there are body-only matches, they must score strictly lower.
    for (const x of r.slice(1)) expect(x.score).toBeLessThan(r[0]!.score);
  });

  it("scores a title hit higher than a body-only hit", () => {
    const r = rank(sample, "quick");
    const ranked = r.find((x) => x.entry.url === "/guide/quick-start");
    const otherCount = r.filter(
      (x) => x.entry.url !== "/guide/quick-start",
    ).length;
    expect(ranked).toBeDefined();
    // Title contains "Quick" → at least 100 score. Body-only would be 10.
    expect(ranked!.score).toBeGreaterThanOrEqual(100);
    // Other entries that only match in body should score lower.
    for (const x of r) {
      if (x.entry.url !== "/guide/quick-start")
        expect(x.score).toBeLessThan(100);
    }
    // Sanity: did we have other matches at all?
    expect(otherCount).toBeGreaterThanOrEqual(0);
  });

  it("matches are case-insensitive (caller passes lowercased query, entries are lowercased internally)", () => {
    const r = rank(sample, "context");
    // Both /api/context (title hit) and bodies containing "context" should match.
    expect(r[0]!.entry.url).toBe("/api/context");
  });

  it("attaches a snippet around the first body match", () => {
    const r = rank(sample, "jsxImportSource".toLowerCase());
    expect(r[0]!.snippet.toLowerCase()).toContain("jsximportsource");
  });

  it("falls back to a title-only snippet when the match is in the title only", () => {
    const r = rank(
      [
        {
          url: "/x",
          title: "Unique Title Phrase",
          text: "Body text without the unique word.",
        },
      ],
      "unique",
    );
    expect(r).toHaveLength(1);
    // Title-only match: snippet should be the start of the body, no match in it.
    expect(r[0]!.snippet).toContain("Body text");
  });

  it("never returns more than MAX_RESULTS entries", () => {
    const many: SearchEntry[] = Array.from({ length: 50 }, (_, i) => ({
      url: `/p/${i}`,
      title: `Page ${i}`,
      text: `Document number ${i} mentions ranking.`,
    }));
    const r = rank(many, "ranking");
    expect(r.length).toBeLessThanOrEqual(MAX_RESULTS);
  });
});

describe("snippetAround", () => {
  it("returns a window centered on the match", () => {
    const text = "a".repeat(100) + "QUERY" + "b".repeat(100);
    const snippet = snippetAround(text, 100, 5);
    expect(snippet).toContain("QUERY");
    expect(snippet.startsWith("…")).toBe(true);
    expect(snippet.endsWith("…")).toBe(true);
  });

  it("omits the leading ellipsis when the match is at the start", () => {
    const text = "QUERY" + " " + "tail".repeat(50);
    const snippet = snippetAround(text, 0, 5);
    expect(snippet.startsWith("…")).toBe(false);
    expect(snippet.startsWith("QUERY")).toBe(true);
  });

  it("omits the trailing ellipsis when the match reaches the end", () => {
    const text = "head".repeat(50) + " QUERY";
    const snippet = snippetAround(text, text.length - 5, 5);
    expect(snippet.endsWith("…")).toBe(false);
    expect(snippet.endsWith("QUERY")).toBe(true);
  });
});

describe("escapeHtml", () => {
  it("escapes ampersand, angle brackets, and double quotes", () => {
    expect(escapeHtml('<a href="x" & b>')).toBe(
      "&lt;a href=&quot;x&quot; &amp; b&gt;",
    );
  });

  it("escapes ampersand first so existing entities are not double-broken", () => {
    expect(escapeHtml("&amp;")).toBe("&amp;amp;");
  });

  it("leaves plain text alone", () => {
    expect(escapeHtml("hello world")).toBe("hello world");
  });
});

describe("escapeAttr", () => {
  it("escapes ampersand and double quotes only", () => {
    expect(escapeAttr('a&b"c')).toBe("a&amp;b&quot;c");
  });
});

describe("highlight", () => {
  it("wraps a single occurrence of the query in <mark>", () => {
    const out = highlight("install jsx-string with bun", "jsx");
    expect(out).toContain("<mark");
    expect(out).toContain(">jsx</mark>");
  });

  it("wraps all occurrences (case-insensitive)", () => {
    const out = highlight("Install or install", "install");
    expect((out.match(/<mark/g) ?? []).length).toBe(2);
    // Captures preserve the source casing.
    expect(out).toContain(">Install</mark>");
    expect(out).toContain(">install</mark>");
  });

  it("escapes HTML in the original text", () => {
    const out = highlight("<script>alert(1)</script>", "alert");
    expect(out).not.toContain("<script>");
    expect(out).toContain("&lt;script&gt;");
  });

  it("escapes regex-significant characters in the query", () => {
    // Without escaping, "(" would be invalid regex; with it, we should find the literal.
    const out = highlight("see fn(x)", "fn(x)");
    expect(out).toContain(">fn(x)</mark>");
  });

  it("returns the escaped text unchanged when the query is empty", () => {
    const out = highlight("<b>hi</b>", "");
    expect(out).toBe("&lt;b&gt;hi&lt;/b&gt;");
  });

  it("is XSS-safe when the query contains HTML markup", () => {
    const out = highlight("plain text", "<img onerror=x>");
    // Nothing is matched (the search term doesn't appear); but the input shouldn't
    // be reflected unescaped anywhere either.
    expect(out).not.toContain("<img");
    expect(out).toBe("plain text");
  });
});
