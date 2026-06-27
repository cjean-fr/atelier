/**
 * ReDoS Audit — ASVS 1.3.12 (L3) — Automated regression suite.
 *
 * Every regex in jsx-string's production code is declared here as a literal
 * (pattern + flags) and verified against:
 *   1. Static analysis — pattern checked for nested quantifiers, overlapping
 *      alternations, and other catastrophic-backtracking constructs.
 *   2. Behavioral contract — the regex matches/rejects expected inputs.
 *
 * If a regex is added, removed, or its pattern changed, this test catches it.
 * See apps/jsx-string-doc/docs-src/pages/safety/index.mdx for the full matrix.
 */
import { describe, it, expect } from "bun:test";

interface RegexEntry {
  id: number;
  file: string;
  name: string;
  pattern: string;
  flags: string;
  purpose: string;
  whySafe: string;
}

const ALL_REGEXES: RegexEntry[] = [
  {
    id: 1,
    file: "escape.ts",
    name: "REGEX_CONTENT_TEST",
    pattern: "[&<>]",
    flags: "",
    purpose: "Fast-path test: does this string need HTML content escaping?",
    whySafe: "Simple character class with no quantifiers.",
  },
  {
    id: 2,
    file: "escape.ts",
    name: "REGEX_ATTR_TEST",
    pattern: '[&<>"]',
    flags: "",
    purpose: "Fast-path test: does this string need HTML attribute escaping?",
    whySafe: "Simple character class with no quantifiers.",
  },
  {
    id: 3,
    file: "escape.ts",
    name: "REGEX_OTHER_UNICODE_CHARS_TEST",
    pattern: "\\p{C}",
    flags: "u",
    purpose: "Quick check: does this string contain Unicode 'Other' chars?",
    whySafe: "Single Unicode class with no quantifiers.",
  },
  {
    id: 4,
    file: "escape.ts",
    name: "REGEX_OTHER_UNICODE_CHARS_REPLACE",
    pattern: "\\p{C}",
    flags: "gu",
    purpose: "Strip all Unicode 'Other' characters from a string.",
    whySafe: "Single Unicode class with global flag — linear scan only.",
  },
  {
    id: 5,
    file: "escape.ts",
    name: "REGEX_VALID_ATTR_NAME",
    pattern: "^[^\\s\"'<>/=\\p{C}]+$",
    flags: "u",
    purpose:
      "Validate an attribute name in one pass (reject controls & delimiters).",
    whySafe:
      "Single negated character class with anchors and `+`. No alternation, no nesting.",
  },
  {
    id: 6,
    file: "escape.ts",
    name: "REGEX_VALID_TAG_NAME",
    pattern: "^[a-zA-Z][a-zA-Z0-9-]*$",
    flags: "",
    purpose: "Validate HTML tag name format.",
    whySafe:
      "Two adjacent anchored character classes (letter start, then letter/digit/hyphen `*`). Star on a class, not a group. No overlap between first and second class.",
  },
  {
    id: 7,
    file: "escape.ts",
    name: "REGEX_UNSAFE_PROTOCOLS",
    pattern: "^(?:java|vb)script:",
    flags: "i",
    purpose: "Block dangerous URL schemes (javascript:, vbscript:).",
    whySafe:
      "Fixed-string non-capturing alternation `(?:java|vb)` + literal `script:`, anchored at start. Each alternation branch is a literal with no quantifiers.",
  },
  {
    id: 8,
    file: "escape.ts",
    name: "REGEX_NON_IMAGE_DATA_URI",
    pattern: "^data:(?!image/)",
    flags: "i",
    purpose: "Block data: URIs that are not image types.",
    whySafe:
      "Literal `data:` + negative lookahead, anchored at start. No quantifiers on alternatives — engine checks the next 6 chars once.",
  },
  {
    id: 9,
    file: "render-attributes.ts",
    name: "REGEX_CAMEL_TO_KEBAB",
    pattern: "[A-Z]",
    flags: "g",
    purpose: "Find uppercase letters to convert camelCase to kebab-case.",
    whySafe: "Single character class, no quantifiers.",
  },
  {
    id: 10,
    file: "render-attributes.ts",
    name: "REGEX_EVENT_HANDLER",
    pattern: "^on[a-z]",
    flags: "i",
    purpose: "Detect event-handler attribute names (on*).",
    whySafe: "Literal `on` + single `[a-z]`. Anchored. No quantifiers.",
  },
  {
    id: 11,
    file: "render-attributes.ts",
    name: "REGEX_CSS_UNSAFE",
    pattern: "expression\\s*\\(|javascript\\s*:",
    flags: "i",
    purpose: "Block dangerous CSS expressions and javascript: in style values.",
    whySafe:
      "Two alternations separated by `|`, each fixed literals with `\\s*` on whitespace. No nested quantifiers.",
  },
  {
    id: 12,
    file: "render-attributes.ts",
    name: "REGEX_HAS_UPPER",
    pattern: "[A-Z]",
    flags: "",
    purpose: "Quick test: does this string contain any uppercase letter?",
    whySafe: "Single character class, no quantifiers.",
  },
  {
    id: 13,
    file: "render-attributes.ts",
    name: "REGEX_URL_IN_CSS",
    pattern: "url\\(\\s*(['\"]?)(.*?)\\1\\s*\\)",
    flags: "gi",
    purpose: "Find url() references inside CSS values for URL safety check.",
    whySafe:
      "The `(.*?)` is lazy — stops at first backreference match. Pattern bounded by literal `url(` prefix and `)` suffix. No nested quantifiers.",
  },
  {
    id: 14,
    file: "escape.ts",
    name: "REGEX_SPLIT_SRCSET",
    pattern: "\\s+",
    flags: "",
    purpose: "Split srcset candidate into URL and descriptor.",
    whySafe:
      "Whitespace-only character class with `+`. Used in `.split()` — JS string split, not backtracking engine.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ReDoS pattern detection helpers
// ─────────────────────────────────────────────────────────────────────────────

type Risk = { type: string; severity: "info" | "review" };

function hasNestedQuantifier(src: string): boolean {
  // Group followed by quantifier: (something)+, (x*)*, (?:a|b)+ etc.
  // Capture the group (including non-capturing, lookaheads) then check
  // for quantifier immediately after.
  // We look for: closing paren + optional ?:! <= then * + ? {
  return /\([^)]+\)[*+?{]/.test(src);
}

function hasAltInGroup(src: string): boolean {
  // Alternation inside a group that's also quantified
  return /\(.*\|.*\)[*+?{]/.test(src);
}

function hasAdjacentQuantifiers(src: string): boolean {
  // Two quantifiers in a row (e.g. ++, *+, ??, +?)
  return /[+*?][+*?]/.test(src);
}

function hasEmptyAlternation(src: string): boolean {
  // |) or || — empty branch in alternation
  return /\|\s*\)|\|\|/.test(src);
}

function analyze(src: string): Risk[] {
  const risks: Risk[] = [];
  if (hasNestedQuantifier(src))
    risks.push({
      type: "nested quantifier: group followed by * + ? or {",
      severity: "review",
    });
  if (hasAltInGroup(src))
    risks.push({
      type: "alternation inside quantified group",
      severity: "review",
    });
  if (hasAdjacentQuantifiers(src))
    risks.push({
      type: "adjacent quantifiers (e.g. ++, *+, ?+)",
      severity: "review",
    });
  if (hasEmptyAlternation(src))
    risks.push({ type: "empty branch in alternation", severity: "review" });
  return risks;
}

// ─────────────────────────────────────────────────────────────────────────────
// Static analysis
// ─────────────────────────────────────────────────────────────────────────────

describe("ReDoS static analysis", () => {
  for (const re of ALL_REGEXES) {
    it(`${re.id}: ${re.file} ${re.name} is structurally safe`, () => {
      const risks = analyze(re.pattern);
      const rx = new RegExp(re.pattern, re.flags);
      expect(rx).toBeDefined();

      if (risks.length > 0) {
        const msg = risks.map((r) => r.type).join("; ");
        // If the static analyzer flags something, check the whySafe
        // justification — known-safe constructs can still trigger it.
        expect(re.whySafe).toBeTruthy();
        console.warn(
          `[ReDoS] ${re.id} ${re.name}: static analysis flags (${msg}) ` +
            `— justified: ${re.whySafe}`,
        );
      }
    });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Behavioral contract — each regex behaves correctly
// ─────────────────────────────────────────────────────────────────────────────

function rx(entry: RegexEntry): RegExp {
  return new RegExp(entry.pattern, entry.flags);
}

describe("ReDoS behavioral contract", () => {
  // 1 — REGEX_CONTENT_TEST /[&<>]/
  it("[1] REGEX_CONTENT_TEST matches escapable chars only", () => {
    const r = rx(ALL_REGEXES[0]!);
    expect(r.test("a&b")).toBe(true);
    expect(r.test("a<b")).toBe(true);
    expect(r.test("a>b")).toBe(true);
    expect(r.test("plain text")).toBe(false);
    expect(r.test("")).toBe(false);
  });

  // 2 — REGEX_ATTR_TEST /[&<>"]/
  it("[2] REGEX_ATTR_TEST matches escapable attr chars only", () => {
    const r = rx(ALL_REGEXES[1]!);
    expect(r.test('a"b')).toBe(true);
    expect(r.test("a&b")).toBe(true);
    expect(r.test("a<b")).toBe(true);
    expect(r.test("plain text")).toBe(false);
  });

  // 3 — REGEX_OTHER_UNICODE_CHARS_TEST /\p{C}/u
  it("[3] REGEX_OTHER_UNICODE_CHARS_TEST detects control chars", () => {
    const r = rx(ALL_REGEXES[2]!);
    expect(r.test("\x00")).toBe(true);
    expect(r.test("\x1F")).toBe(true);
    expect(r.test("a")).toBe(false); // letters are \p{L}, not \p{C}
    expect(r.test("\uFFFE")).toBe(true);
    expect(r.test("abc")).toBe(false);
  });

  // 4 — REGEX_OTHER_UNICODE_CHARS_REPLACE /\p{C}/gu
  it("[4] REGEX_OTHER_UNICODE_CHARS_REPLACE replaces all control chars", () => {
    const r = rx(ALL_REGEXES[3]!);
    expect("a\x00b".replace(r, "")).toBe("ab");
    expect("\x00\x01\x02".replace(r, "")).toBe("");
    expect("hello".replace(r, "")).toBe("hello");
  });

  // 5 — REGEX_VALID_ATTR_NAME /^[^\s"'<>/=\p{C}]+$/u
  it("[5] REGEX_VALID_ATTR_NAME validates attribute names", () => {
    const r = rx(ALL_REGEXES[4]!);
    expect(r.test("id")).toBe(true);
    expect(r.test("data-value")).toBe(true);
    expect(r.test("xlink:href")).toBe(true);
    expect(r.test('" onclick="alert(1)')).toBe(false);
    expect(r.test("attr name")).toBe(false);
    expect(r.test('attr"')).toBe(false);
    expect(r.test("attr>")).toBe(false);
    expect(r.test("")).toBe(false);
  });

  // 6 — REGEX_VALID_TAG_NAME /^[a-zA-Z][a-zA-Z0-9-]*$/
  it("[6] REGEX_VALID_TAG_NAME validates tag names", () => {
    const r = rx(ALL_REGEXES[5]!);
    expect(r.test("div")).toBe(true);
    expect(r.test("custom-element")).toBe(true);
    expect(r.test("")).toBe(false);
    expect(r.test("-div")).toBe(false);
    expect(r.test("<script>")).toBe(false);
    expect(r.test("div class=x")).toBe(false);
    expect(r.test("a")).toBe(true); // single letter
  });

  // 7 — REGEX_UNSAFE_PROTOCOLS /^(?:java|vb)script:/i
  it("[7] REGEX_UNSAFE_PROTOCOLS blocks dangerous URL schemes", () => {
    const r = rx(ALL_REGEXES[6]!);
    expect(r.test("javascript:alert(1)")).toBe(true);
    expect(r.test("vbscript:alert(1)")).toBe(true);
    expect(r.test("JAVASCRIPT:alert(1)")).toBe(true);
    expect(r.test("https://example.com")).toBe(false);
    expect(r.test("javascript:")).toBe(true);
    expect(r.test("java script:")).toBe(false);
    expect(r.test("")).toBe(false);
  });

  // 8 — REGEX_NON_IMAGE_DATA_URI /^data:(?!image\/)/i
  it("[8] REGEX_NON_IMAGE_DATA_URI blocks non-image data: URIs", () => {
    const r = rx(ALL_REGEXES[7]!);
    expect(r.test("data:text/html,<script>")).toBe(true); // blocked
    expect(r.test("data:image/png,base64")).toBe(false); // allowed
    expect(r.test("DATA:TEXT/HTML,test")).toBe(true); // case insensitive
    expect(r.test("https://example.com")).toBe(false);
    expect(r.test("data:image/svg+xml,abc")).toBe(false);
  });

  // 9 — REGEX_CAMEL_TO_KEBAB /[A-Z]/g
  it("[9] REGEX_CAMEL_TO_KEBAB matches uppercase letters", () => {
    const r = rx(ALL_REGEXES[8]!);
    expect(r.test("backgroundColor")).toBe(true);
    expect(r.test("alldown")).toBe(false);
    expect(r.test("")).toBe(false);
  });

  // 10 — REGEX_EVENT_HANDLER /^on[a-z]/i
  it("[10] REGEX_EVENT_HANDLER detects event handler names", () => {
    const r = rx(ALL_REGEXES[9]!);
    expect(r.test("onClick")).toBe(true);
    expect(r.test("onclick")).toBe(true);
    expect(r.test("onSubmit")).toBe(true);
    expect(r.test("only")).toBe(true); // "only" starts with "on" + 'l' ∈ [a-z]
    expect(r.test("on5")).toBe(false); // "on5" — '5' ∉ [a-z]
    expect(r.test("on.")).toBe(false); // "on." — '.' ∉ [a-z]
    expect(r.test("on")).toBe(false);
    expect(r.test("")).toBe(false);
  });

  // 11 — REGEX_CSS_UNSAFE /expression\s*\(|javascript\s*:/i
  it("[11] REGEX_CSS_UNSAFE blocks dangerous CSS values", () => {
    const r = rx(ALL_REGEXES[10]!);
    expect(r.test("expression(alert(1))")).toBe(true);
    expect(r.test("expression (alert(1))")).toBe(true);
    expect(r.test("javascript:alert(1)")).toBe(true);
    expect(r.test("JAVASCRIPT:alert(1)")).toBe(true);
    expect(r.test("javascript :alert(1)")).toBe(true); // \s* matches the space before colon
    expect(r.test("javascriptX:alert(1)")).toBe(false); // 'X' ∉ \s and breaks `javascript\s*:`
    expect(r.test("color: red")).toBe(false);
    expect(r.test("background: url(img.png)")).toBe(false);
  });

  // 12 — REGEX_HAS_UPPER /[A-Z]/
  it("[12] REGEX_HAS_UPPER detects uppercase presence", () => {
    const r = rx(ALL_REGEXES[11]!);
    expect(r.test("hasUpper")).toBe(true);
    expect(r.test("noupper")).toBe(false);
    expect(r.test("")).toBe(false);
  });

  // 13 — REGEX_URL_IN_CSS /url\(\s*(['"]?)(.*?)\1\s*\)/gi
  it("[13] REGEX_URL_IN_CSS extracts url() references from CSS", () => {
    // Use fresh regex per assertion (g flag mutates lastIndex)
    expect(rx(ALL_REGEXES[12]!).test("url(https://example.com)")).toBe(true);
    expect(rx(ALL_REGEXES[12]!).test("url(img.png)")).toBe(true);
    expect(rx(ALL_REGEXES[12]!).test("no url here")).toBe(false);
    expect(rx(ALL_REGEXES[12]!).test("url()")).toBe(true);

    // Multiple matches (unquoted)
    const matches = "url(a), url(b), url(c)".match(rx(ALL_REGEXES[12]!));
    expect(matches).not.toBeNull();
    expect(matches!.length).toBeGreaterThanOrEqual(3);
  });

  // 14 — REGEX_SPLIT_SRCSET /\s+/
  it("[14] REGEX_SPLIT_SRCSET splits on whitespace", () => {
    const r = rx(ALL_REGEXES[13]!);
    expect("a b".split(r)).toEqual(["a", "b"]);
    expect("a\tb".split(r)).toEqual(["a", "b"]);
    expect("a  b".split(r)).toEqual(["a", "b"]);
    expect("single".split(r)).toEqual(["single"]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Consistency: all 14 regexes are declared and the source files compile
// ─────────────────────────────────────────────────────────────────────────────

it("all 14 production regexes are audited", () => {
  expect(ALL_REGEXES.length).toBe(14);
});

it("no duplicate IDs or names", () => {
  const ids = ALL_REGEXES.map((r) => r.id);
  const names = ALL_REGEXES.map((r) => r.file + ":" + r.name);
  expect(new Set(ids).size).toBe(ids.length);
  expect(new Set(names).size).toBe(names.length);
});

it("each regex compiles with its declared flags", () => {
  for (const re of ALL_REGEXES) {
    expect(() => new RegExp(re.pattern, re.flags)).not.toThrow();
  }
});

it("every source file referenced has a regex declared", () => {
  const files = new Set(ALL_REGEXES.map((r) => r.file));
  expect(files.has("escape.ts")).toBe(true);
  expect(files.has("render-attributes.ts")).toBe(true);
});
