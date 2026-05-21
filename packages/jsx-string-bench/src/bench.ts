/**
 * Benchmarks: jsx-string vs preact-render-to-string vs react-dom/server.
 *
 * The two main suites (`text` and `stack`) are ports of preact's official
 * benchmark scenarios — same shape, same content, comparable across runners.
 * The `async` suite is jsx-string-only (React/Preact don't render async
 * components) and exercises the concurrent Promise resolution path.
 *
 * Run: `bun run bench` (requires `bun run build` in packages/jsx-string first).
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

// Hono
import { jsx as honoJsx } from "hono/jsx";

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

group("async — 10 concurrent async components (jsx-string only)", () => {
  bench("jsx-string", async () => {
    await renderToString(await jsxStringAsyncTree());
  });
});

// ---------------------------------------------------------------------------
// Ports of preact-render-to-string's official benchmarks
// https://github.com/preactjs/preact-render-to-string/tree/main/benchmarks
//
// Two scenarios are runtime-neutral (no hooks / lifecycle / mock data):
//   - text:  1000 instances of a text-heavy 2-span block (wide tree)
//   - stack: 10 instances of a 1000-deep recursive PassThrough (deep tree)
// ---------------------------------------------------------------------------

const BAVARIA_1 =
  "Bavaria ipsum dolor sit amet gwiss Charivari Auffisteign koa. Umma pfenningguat vui huift vui back mas Landla Bradwurschtsemmal, Fingahaggln. Wolpern ja, wo samma denn wea nia ausgähd, kummt nia hoam baddscher i moan oiwei! Kloan pfenningguat is Charivari Bussal, hallelujah sog i, luja. Liberalitas Bavariae hod Schorsch om auf'n Gipfe gwiss naa. Und ja, wo samma denn Ohrwaschl hoggd auffi Spotzerl Diandldrahn, oba? Is sog i und glei wirds no fui lustiga Biaschlegl ma nimma ned woar gscheckate, pfenningguat! Gstanzl dei Schorsch Radi i mog di fei hea Reiwadatschi fensdaln dei glei a Hoiwe. Bitt umananda ghupft wia gsprunga Gschicht kimmt, oamoi obandeln. Sog i helfgod amoi hallelujah sog i, luja i hob di narrisch gean, Brodzeid. Wolln a Maß und no a Maß Gaudi obandln eana boarischer hallelujah sog i, luja Maßkruag greaßt eich nachad, Schmankal.";
const BAVARIA_2 =
  "Dei um Godds wujn naa Watschnbaam Obazda Trachtnhuat, Vergeltsgott Schneid Schbozal. Om auf'n Gipfe Ramasuri um Godds wujn eana. Wos sammawiedaguad sei Weißwiaschd da, hog di hi is des liab des umananda Brezn Sauakraud Diandldrahn. Vo de weida pfundig Kirwa de Sonn Hetschapfah Watschnpladdla auf gehds beim Schichtl Meidromml auffi lem und lem lossn! Watschnpladdla wolln measi obandeln griasd eich midnand Oachkatzlschwoaf is ma Wuascht sammawiedaguad aasgem. A so a Schmarn Weibaleid naa, des basd scho. Abfieseln helfgod Sauwedda middn ded schoo. A bissal wos gehd ollaweil Sauwedda is Servas wiavui wo hi o'ha, a liabs Deandl pfiad de nix. Maßkruag etza so spernzaln. Weiznglasl Bradwurschtsemmal da, Schdeckalfisch: Mei Musi bitt des wiad a Mordsgaudi kumm geh Biakriagal Greichats obacht?";

const TEXT_REPEATS = 1000;
const STACK_REPEATS = 10;
const STACK_DEPTH = 1000;

// --- Text bench (1000× Bavaria) ---

const bavariaJsxString = () =>
  jsx(
    "div",
    {},
    jsx(
      "span",
      { class: "foo", "data-testid": "foo" },
      BAVARIA_1,
    ),
    jsx(
      "span",
      { class: "bar", "data-testid": "bar" },
      BAVARIA_2,
    ),
  );
const bavariaReact = () =>
  createElement(
    "div",
    null,
    createElement(
      "span",
      { className: "foo", "data-testid": "foo" },
      BAVARIA_1,
    ),
    createElement(
      "span",
      { className: "bar", "data-testid": "bar" },
      BAVARIA_2,
    ),
  );
const bavariaPreact = () =>
  h(
    "div",
    null,
    h(
      "span",
      { class: "foo", "data-testid": "foo" },
      BAVARIA_1,
    ),
    h(
      "span",
      { class: "bar", "data-testid": "bar" },
      BAVARIA_2,
    ),
  );
const bavariaHono = () =>
  honoJsx(
    "div",
    {},
    honoJsx(
      "span",
      { class: "foo", "data-testid": "foo" },
      BAVARIA_1,
    ),
    honoJsx(
      "span",
      { class: "bar", "data-testid": "bar" },
      BAVARIA_2,
    ),
  );

function textAppJsxString() {
  const children = new Array(TEXT_REPEATS);
  for (let i = 0; i < TEXT_REPEATS; i++) children[i] = bavariaJsxString();
  return jsx("div", {}, children);
}
function textAppReact() {
  const children = new Array(TEXT_REPEATS);
  for (let i = 0; i < TEXT_REPEATS; i++) children[i] = bavariaReact();
  return createElement("div", null, children);
}
function textAppPreact() {
  const children = new Array(TEXT_REPEATS);
  for (let i = 0; i < TEXT_REPEATS; i++) children[i] = bavariaPreact();
  return h("div", null, children);
}
function textAppHono() {
  const children = new Array(TEXT_REPEATS);
  for (let i = 0; i < TEXT_REPEATS; i++) children[i] = bavariaHono();
  return honoJsx("div", {}, children);
}

// --- Stack bench (10× 1000-deep recursive PassThrough) ---

function stackJsxString(depth: number): any {
  if (depth <= 0) {
    return jsx(
      "div",
      {},
      jsx("span", { class: "foo", "data-testid": "stack" }, "deep stack"),
    );
  }
  return jsx("div", {}, stackJsxString(depth - 1));
}
function stackReact(depth: number): any {
  if (depth <= 0) {
    return createElement(
      "div",
      null,
      createElement(
        "span",
        { className: "foo", "data-testid": "stack" },
        "deep stack",
      ),
    );
  }
  return createElement("div", null, stackReact(depth - 1));
}
function stackPreact(depth: number): any {
  if (depth <= 0) {
    return h(
      "div",
      null,
      h("span", { class: "foo", "data-testid": "stack" }, "deep stack"),
    );
  }
  return h("div", null, stackPreact(depth - 1));
}
function stackHono(depth: number): any {
  if (depth <= 0) {
    return honoJsx(
      "div",
      {},
      honoJsx("span", { class: "foo", "data-testid": "stack" }, "deep stack"),
    );
  }
  return honoJsx("div", {}, stackHono(depth - 1));
}

function stackAppJsxString() {
  const children = new Array(STACK_REPEATS);
  for (let i = 0; i < STACK_REPEATS; i++)
    children[i] = stackJsxString(STACK_DEPTH);
  return jsx("div", {}, children);
}
function stackAppReact() {
  const children = new Array(STACK_REPEATS);
  for (let i = 0; i < STACK_REPEATS; i++) children[i] = stackReact(STACK_DEPTH);
  return createElement("div", null, children);
}
function stackAppPreact() {
  const children = new Array(STACK_REPEATS);
  for (let i = 0; i < STACK_REPEATS; i++)
    children[i] = stackPreact(STACK_DEPTH);
  return h("div", null, children);
}
function stackAppHono() {
  const children = new Array(STACK_REPEATS);
  for (let i = 0; i < STACK_REPEATS; i++)
    children[i] = stackHono(STACK_DEPTH);
  return honoJsx("div", {}, children);
}

group(`text — ${TEXT_REPEATS}× Bavaria block (preact bench port)`, () => {
  bench("jsx-string", async () => {
    await renderToString(textAppJsxString());
  });
  bench("react (renderToStaticMarkup)", () => {
    renderToStaticMarkup(textAppReact());
  });
  bench("preact (render)", () => {
    preactRender(textAppPreact());
  });
  bench("hono/jsx (toString)", () => {
    String(textAppHono());
  });
});

group(
  `stack — ${STACK_REPEATS}× ${STACK_DEPTH}-deep tree (preact bench port)`,
  () => {
    bench("jsx-string", async () => {
      await renderToString(stackAppJsxString());
    });
    bench("react (renderToStaticMarkup)", () => {
      renderToStaticMarkup(stackAppReact());
    });
    bench("preact (render)", () => {
      preactRender(stackAppPreact());
    });
    bench("hono/jsx (toString)", () => {
      String(stackAppHono());
    });
  },
);

await run();
