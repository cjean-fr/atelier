/**
 * Benchmark: jsx-string vs react-dom/server vs preact-render-to-string
 *
 * Measures end-to-end rendering: tree construction + HTML serialization.
 *
 * jsx-string evaluates eagerly during JSX construction (no reconciliation pass),
 * while React and Preact build a virtual DOM first then serialize separately.
 * Both approaches are measured in their natural usage pattern.
 *
 * Run: bun run bench (requires `bun run build` in packages/jsx-string first)
 */

import { bench, group, run } from "mitata";

// jsx-string
import { jsx } from "@cjean-fr/jsx-string/jsx-runtime";
import { renderToString } from "@cjean-fr/jsx-string";

// React
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

// Preact
import { h } from "preact";
import { render as preactRender } from "preact-render-to-string";

// Hono — JSX elements expose .toString() directly
import { jsx as honoJsx } from "hono/jsx";

const N = 50;

// ---------------------------------------------------------------------------
// Tree builders — each produces an equivalent structure for its renderer
// ---------------------------------------------------------------------------

function jsxStringTree() {
  const items = Array.from({ length: N }, (_, i) =>
    jsx("li", { class: "item", id: `item-${i}` }, `Item ${i}: description text`),
  );
  return jsx(
    "div",
    { class: "app" },
    jsx(
      "header",
      { class: "header" },
      jsx("h1", {}, "Benchmark"),
      jsx(
        "nav",
        {},
        jsx("a", { href: "/" }, "Home"),
        jsx("a", { href: "/about" }, "About"),
        jsx("a", { href: "/blog" }, "Blog"),
      ),
    ),
    jsx("main", {}, jsx("ul", { class: "list" }, ...items)),
    jsx("footer", {}, "© 2024"),
  );
}

function reactTree() {
  const items = Array.from({ length: N }, (_, i) =>
    createElement(
      "li",
      { className: "item", id: `item-${i}` },
      `Item ${i}: description text`,
    ),
  );
  return createElement(
    "div",
    { className: "app" },
    createElement(
      "header",
      { className: "header" },
      createElement("h1", null, "Benchmark"),
      createElement(
        "nav",
        null,
        createElement("a", { href: "/" }, "Home"),
        createElement("a", { href: "/about" }, "About"),
        createElement("a", { href: "/blog" }, "Blog"),
      ),
    ),
    createElement("main", null, createElement("ul", { className: "list" }, ...items)),
    createElement("footer", null, "© 2024"),
  );
}

function preactTree() {
  const items = Array.from({ length: N }, (_, i) =>
    h("li", { class: "item", id: `item-${i}` }, `Item ${i}: description text`),
  );
  return h(
    "div",
    { class: "app" },
    h(
      "header",
      { class: "header" },
      h("h1", null, "Benchmark"),
      h(
        "nav",
        null,
        h("a", { href: "/" }, "Home"),
        h("a", { href: "/about" }, "About"),
        h("a", { href: "/blog" }, "Blog"),
      ),
    ),
    h("main", null, h("ul", { class: "list" }, ...items)),
    h("footer", null, "© 2024"),
  );
}

function honoTree() {
  const items = Array.from({ length: N }, (_, i) =>
    honoJsx("li", { class: "item", id: `item-${i}` }, `Item ${i}: description text`),
  );
  return honoJsx(
    "div",
    { class: "app" },
    honoJsx(
      "header",
      { class: "header" },
      honoJsx("h1", {}, "Benchmark"),
      honoJsx(
        "nav",
        {},
        honoJsx("a", { href: "/" }, "Home"),
        honoJsx("a", { href: "/about" }, "About"),
        honoJsx("a", { href: "/blog" }, "Blog"),
      ),
    ),
    honoJsx("main", {}, honoJsx("ul", { class: "list" }, ...items)),
    honoJsx("footer", {}, "© 2024"),
  );
}

// ---------------------------------------------------------------------------
// Async benchmark — jsx-string only (React/Preact don't support async components)
// ---------------------------------------------------------------------------

async function jsxStringAsyncTree() {
  const AsyncItem = async ({ i }: { i: number }) => {
    await Promise.resolve(); // simulates a micro-task (e.g. cache lookup)
    return jsx("li", { class: "item" }, `Item ${i}`);
  };
  const items = Array.from({ length: 10 }, (_, i) => jsx(AsyncItem, { i }));
  return jsx("ul", { class: "list" }, ...items);
}

// ---------------------------------------------------------------------------
// Suites
// ---------------------------------------------------------------------------

group(`sync — ${N}-item list`, () => {
  bench("jsx-string", async () => {
    await renderToString(jsxStringTree());
  });
  bench("react (renderToStaticMarkup)", () => {
    renderToStaticMarkup(reactTree());
  });
  bench("preact (render)", () => {
    preactRender(preactTree());
  });
  bench("hono/jsx (toString)", () => {
    String(honoTree());
  });
});

group("async — 10 concurrent async components (jsx-string only)", () => {
  bench("jsx-string", async () => {
    await renderToString(await jsxStringAsyncTree());
  });
});

await run();
