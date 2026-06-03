This file is a merged representation of the entire codebase, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
.claude/
  settings.local.json
.github/
  workflows/
    ci.yml
    release.yml
apps/
  jsx-string-bench/
    src/
      bench.ts
    package.json
    tsconfig.json
  jsx-string-doc/
    docs-src/
      examples/
        api/
          context/
            basic.tsx
            concurrent.tsx
            per-request.tsx
            signatures.ts
            snapshot.tsx
          renderToString/
            async-tree.tsx
            basic.tsx
            concurrent.tsx
            jsx-node.ts
            signature.ts
            with-component.tsx
        guide/
          installation/
            deno.json
            tsconfig-with-react.json
            tsconfig.json
          quick-start/
            async-component.tsx
            component.tsx
            escaping.tsx
            fragment.tsx
            hello-world.tsx
          security/
            one-rule.tsx
        home/
          hello.tsx
        jsx-flow/
          adapters.ts
          deferred-src.tsx
          deferred-static.tsx
          deferred-stream.tsx
          patch.tsx
          pure-static.tsx
      pages/
        api/
          context.mdx
          renderToString.mdx
        guide/
          installation.mdx
          quick-start.mdx
          security.mdx
        jsx-flow/
          overview.mdx
          static.mdx
          streaming.mdx
        index.tsx
        markdown-test.md
      styles/
        main.css
      build.ts
      client.ts
    .gitignore
    docs.config.ts
    package.json
    tsconfig.json
    vite.config.ts
packages/
  build-core/
    src/
      cli/
        build.ts
        dev.ts
        index.ts
        loadConfig.ts
      search/
        builtin/
          adapter.ts
          client.ts
          engine.test.ts
          engine.ts
          extract.test.ts
          extract.ts
        index.ts
      build.ts
      editUrl.ts
      git.ts
      index.ts
      markdown.test.ts
      markdown.ts
      routing.ts
      sitemap.ts
      toc.ts
      types.ts
      vite.ts
    package.json
    README.md
    tsconfig.json
    vite.config.ts
  docs/
    bin/
      docs.mjs
    src/
      cli/
        index.ts
        init.ts
      components/
        Aside.tsx
        CodeBlock.tsx
        CodeExample.tsx
        Layout.tsx
        Nav.tsx
        NavToggle.tsx
        PageFooter.tsx
        SearchDialog.tsx
        TableOfContents.tsx
        Tabs.tsx
        ThemeToggle.tsx
      nav/
        client.ts
      tabs/
        client.ts
      theme/
        client.ts
        main.css
        prose.css
        shiki.css
        tokens.css
      toc/
        client.ts
      build.ts
      client.ts
      config.ts
      context.ts
      index.ts
      mdx-components.ts
      renderHook.tsx
      sidebar.ts
      toc.ts
      types.ts
      vite.ts
    package.json
    README.md
    tsconfig.json
    vite.config.ts
  eslint-plugin-jsx-string/
    src/
      rules/
        no-context.test.ts
        no-context.ts
        no-javascript-urls.test.ts
        no-javascript-urls.ts
        no-react-hooks.test.ts
        no-react-hooks.ts
        no-react-imports.test.ts
        no-react-imports.ts
        no-refs.test.ts
        no-refs.ts
        no-unsafe-event-handlers.test.ts
        no-unsafe-event-handlers.ts
      index.ts
    .gitignore
    CHANGELOG.md
    LICENSE
    package.json
    README.md
    tsconfig.json
  i18n-tiny/
    skills/
      i18n-tiny/
        SKILL.md
    src/
      index.test.ts
      index.ts
    CHANGELOG.md
    LICENSE
    package.json
    README.md
    tsconfig.json
  jsonresume-theme-cjean/
    bin/
      jsonresume-theme-cjean.js
    src/
      components/
        Banner.tsx
        DateTime.tsx
        Education.tsx
        FloatingButton.tsx
        Footer.tsx
        Header.tsx
        Icons.tsx
        Layout.tsx
        Links.tsx
        Period.tsx
        ProfilePageJsonLd.tsx
        Section.tsx
        SEO.tsx
        Skills.tsx
        StructuredData.tsx
        WorkExperience.tsx
      lib/
        google.ts
        gravatar.ts
        i18n.ts
        image.ts
        trianglify.ts
        wsrv.ts
      styles/
        tailwind.input.css
      index.tsx
      schema.ts
    .gitignore
    CHANGELOG.md
    eslint.config.ts
    LICENSE
    package.json
    README.md
    tsconfig.json
    vite.config.js
  jsx-flow/
    examples/
      ssg.tsx
      streaming.tsx
    src/
      components/
        Deferred.tsx
        Patch.tsx
        Slot.tsx
      adapters.tsx
      context.ts
      fragmentId.ts
      index.test.tsx
      index.ts
      render.ts
      streamFragments.tsx
      utils.ts
    package.json
    README.md
    tsconfig.json
  jsx-string/
    .claude/
      settings.local.json
    examples/
      async-component.tsx
      concurrent.tsx
      context.tsx
      hello.tsx
      server.tsx
    skills/
      jsx-string/
        evals/
          evals.json
        SKILL.md
    src/
      core/
        context.test.ts
        context.ts
        types.test-d.ts
        types.ts
      utils/
        escape.test.ts
        escape.ts
        html.test.ts
        html.ts
        void-elements.ts
      exports.test.ts
      index.test.tsx
      index.ts
      jsx-dev-runtime.ts
      jsx-runtime.test.ts
      jsx-runtime.ts
    CHANGELOG.md
    LICENSE
    package.json
    README.md
    tsconfig.json
  jsx-vite/
    src/
      index.test.tsx
      index.tsx
    package.json
    README.md
    tsconfig.json
  typescript-config/
    base.json
.gitignore
.prettierignore
LICENSE
package.json
prettier.config.js
README.md
turbo.json
```

# Files

## File: .claude/settings.local.json
````json
{
  "permissions": {
    "allow": [
      "Bash(rtk ls *)",
      "Bash(rtk read *)",
      "Bash(rtk tree *)",
      "Bash(bun test *)",
      "Bash(bun run *)",
      "Bash(node --experimental-strip-types src/bench.ts)",
      "Bash(node *)",
      "Bash(rtk git *)",
      "Bash(deno check *)",
      "Bash(rtk wc *)",
      "Bash(bun --conditions development /tmp/layout-test.tsx)",
      "Bash(bun --conditions development _layout-test.tsx)",
      "Bash(rtk find *)",
      "Bash(grep -v \":0$\")",
      "Bash(bun -e 'const idx = JSON.parse\\(await Bun.stdin.text\\(\\)\\); console.log\\(`entries: ${idx.length}`\\); for \\(const e of idx\\) console.log\\(`  ${e.url} → \"${e.title}\" \\(${e.text.length} chars\\)`\\)')",
      "Bash(bun -e 'const idx = JSON.parse\\(await Bun.stdin.text\\(\\)\\); for \\(const e of idx\\) console.log\\(`  ${e.url} → \"${e.title}\"`\\)')",
      "Bash(bun *)",
      "Read(//home/christophe/Workspace/**)",
      "Bash(rm -rf dist)",
      "Bash(rtk curl *)",
      "Bash(cp /tmp/dev-render-test2.mjs /home/christophe/Workspace/atelier/packages/jsx-string-doc/test-render.mjs)",
      "Bash(rm test-render.mjs)",
      "Bash(rm -rf /tmp/docs-init-test)",
      "Bash(mkdir -p /tmp/docs-init-test)",
      "Bash(cd /)",
      "Bash(mkdir /tmp/docs-init-test)",
      "Read(//home/christophe/apps/**)",
      "Bash(bunx vite *)"
    ]
  }
}
````

## File: packages/jsx-string/.claude/settings.local.json
````json
{
  "permissions": {
    "allow": ["Bash(rtk git *)", "Bash(rtk ls *)"]
  }
}
````

## File: packages/jsx-string/src/jsx-dev-runtime.ts
````typescript
import type { Component, RenderResult } from "./core/types.js";
import { jsx } from "./jsx-runtime.js";

export {
  jsxs,
  Fragment,
  jsxAttr,
  jsxEscape,
  jsxTemplate,
} from "./jsx-runtime.js";
export type { JSX } from "./core/types.js";

export function jsxDEV<P extends {} = {}>(
  tag: string | Component<P>,
  props: P,
  _key?: unknown,
  _isStaticChildren?: boolean,
  _source?: { fileName?: string; lineNumber?: number; columnNumber?: number },
  _self?: unknown,
): RenderResult {
  return jsx(tag, props);
}
````

## File: prettier.config.js
````javascript
/** @type {import("prettier").Config} */
const config = {
  plugins: [
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  importOrderParserPlugins: ["typescript", "jsx"],
};

export default config;
````

## File: apps/jsx-string-bench/src/bench.ts
````typescript
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
    return jsx("li", { class: "item", children: `Item ${i}` });
  };
  const items = Array.from({ length: 10 }, (_, i) => jsx(AsyncItem, { i }));
  return jsx("ul", { class: "list", children: items });
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
  jsx("div", {
    children: [
      jsx("span", {
        class: "foo",
        "data-testid": "foo",
        children: BAVARIA_1,
      }),
      jsx("span", {
        class: "bar",
        "data-testid": "bar",
        children: BAVARIA_2,
      }),
    ],
  });
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
  return jsx("div", { children });
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
    return jsx("div", {
      children: jsx("span", {
        class: "foo",
        "data-testid": "stack",
        children: "deep stack",
      }),
    });
  }
  return jsx("div", { children: stackJsxString(depth - 1) });
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
  return jsx("div", { children });
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
````

## File: apps/jsx-string-bench/package.json
````json
{
  "name": "@cjean-fr/jsx-string-bench",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "bench": "bun run src/bench.ts"
  },
  "dependencies": {
    "@cjean-fr/jsx-string": "workspace:*"
  },
  "devDependencies": {
    "@types/bun": "catalog:",
    "@types/react": "catalog:",
    "@types/react-dom": "^19",
    "hono": "^4",
    "mitata": "^1",
    "preact": "^10",
    "preact-render-to-string": "^6",
    "react": "^19",
    "react-dom": "^19",
    "typescript": "catalog:"
  }
}
````

## File: apps/jsx-string-bench/tsconfig.json
````json
{
  "extends": "../typescript-config/base.json",
  "compilerOptions": {
    "skipLibCheck": true,
    "types": ["bun", "react", "react-dom"]
  },
  "include": ["src"]
}
````

## File: apps/jsx-string-doc/docs-src/examples/api/context/basic.tsx
````typescript
import { context, setContext, useContext, withScope, renderToString } from "@cjean-fr/jsx-string";

// 1. Define a typed context key (module-level singleton)
const themeCtx = context<"light" | "dark">("my-app:theme");

// 2. A component that reads from context
function ThemedBox({ children }: { children: JSXNode }) {
  const theme = useContext(themeCtx);
  return (
    <div class={theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}>
      {children}
    </div>
  );
}

// 3. Render inside a scope that provides the value
const html = await withScope(async () => {
  setContext(themeCtx, "dark");
  return renderToString(<ThemedBox>Hello</ThemedBox>);
});
````

## File: apps/jsx-string-doc/docs-src/examples/api/context/concurrent.tsx
````typescript
// Each withScope call is completely isolated
const [lightHtml, darkHtml] = await Promise.all([
  withScope(async () => {
    setContext(themeCtx, "light");
    return renderToString(<Page />);
  }),
  withScope(async () => {
    setContext(themeCtx, "dark");
    return renderToString(<Page />);
  }),
]);
````

## File: apps/jsx-string-doc/docs-src/examples/api/context/per-request.tsx
````typescript
// Per-request context injection in an HTTP server
const requestCtx = context<{ userId: string; locale: string }>("my-app:request");

async function handleRequest(req: Request): Promise<Response> {
  const session = await getSession(req);

  const html = await withScope(async () => {
    setContext(requestCtx, {
      userId: session.userId,
      locale: req.headers.get("Accept-Language") ?? "en",
    });
    return renderToString(<App />);
  });

  return new Response("<!DOCTYPE html>\n" + html, {
    headers: { "Content-Type": "text/html" },
  });
}
````

## File: apps/jsx-string-doc/docs-src/examples/api/context/signatures.ts
````typescript
import {
  context,
  setContext,
  useContext,
  withScope,
  snapshot,
} from "@cjean-fr/jsx-string";

// Create a typed context key — `key` must be a non-empty namespaced string
// (e.g. "@org/pkg:purpose"). Same key → same Symbol across module instances.
function context<T>(key: string): Context<T>;

// Provide a value inside a withScope
function setContext<T>(ctx: Context<T>, value: T): void;

// Read a value set by setContext
function useContext<T>(ctx: Context<T>): T;

// Create an isolated async scope
async function withScope<T>(
  fn: () => T | Promise<T>,
  options?: { seed?: Map<Context<unknown>, unknown> },
): Promise<T>;

// Capture current scope values for passing to child scopes
function snapshot(): Map<Context<unknown>, unknown>;
````

## File: apps/jsx-string-doc/docs-src/examples/api/context/snapshot.tsx
````typescript
// Capture current context values and pass them to a child scope
const seed = snapshot();

const childHtml = await withScope(
  async () => {
    // Inherits all values from the parent scope
    const theme = useContext(themeCtx); // still works
    return renderToString(<ChildPage />);
  },
  { seed },
);
````

## File: apps/jsx-string-doc/docs-src/examples/api/renderToString/async-tree.tsx
````typescript
const Feed = async () => {
  const posts = await db.posts.findAll({ limit: 10 });
  return (
    <ul>
      {posts.map((p) => (
        <li key={p.id}><a href={"/posts/" + p.slug}>{p.title}</a></li>
      ))}
    </ul>
  );
};

// renderToString awaits the entire tree, including nested async components
const html = await renderToString(<Feed />);
````

## File: apps/jsx-string-doc/docs-src/examples/api/renderToString/basic.tsx
````typescript
const html = await renderToString(<h1>Hello</h1>);
// → "<h1>Hello</h1>"
````

## File: apps/jsx-string-doc/docs-src/examples/api/renderToString/concurrent.tsx
````typescript
// Safe to call concurrently — scopes are fully isolated
const [pageA, pageB] = await Promise.all([
  renderToString(<PageA />),
  renderToString(<PageB />),
]);
````

## File: apps/jsx-string-doc/docs-src/examples/api/renderToString/jsx-node.ts
````typescript
type JSXNode =
  | string
  | number
  | boolean
  | null
  | undefined
  | JSXElement       // any object with toString()
  | Promise<JSXNode>
  | JSXNode[];
````

## File: apps/jsx-string-doc/docs-src/examples/api/renderToString/signature.ts
````typescript
import { renderToString } from "@cjean-fr/jsx-string";

async function renderToString(node: JSXNode): Promise<string>;
````

## File: apps/jsx-string-doc/docs-src/examples/api/renderToString/with-component.tsx
````typescript
const Page = ({ title }: { title: string }) => (
  <html>
    <head><title>{title}</title></head>
    <body><h1>{title}</h1></body>
  </html>
);

const html = await renderToString(<Page title="My Site" />);
````

## File: apps/jsx-string-doc/docs-src/examples/guide/installation/deno.json
````json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "npm:@cjean-fr/jsx-string"
  },
  "imports": {
    "@cjean-fr/jsx-string": "npm:@cjean-fr/jsx-string"
  }
}
````

## File: apps/jsx-string-doc/docs-src/examples/guide/installation/tsconfig-with-react.json
````json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@cjean-fr/jsx-string"
  },
  "devDependencies": {
    "@types/react": "^19"
  }
}
````

## File: apps/jsx-string-doc/docs-src/examples/guide/installation/tsconfig.json
````json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@cjean-fr/jsx-string"
  }
}
````

## File: apps/jsx-string-doc/docs-src/examples/guide/quick-start/async-component.tsx
````typescript
async function UserCard({ id }: { id: string }) {
  const user = await db.users.findById(id);
  return (
    <div class="card">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}

const html = await renderToString(<UserCard id="42" />);
````

## File: apps/jsx-string-doc/docs-src/examples/guide/quick-start/component.tsx
````typescript
function Greeting({ name }: { name: string }) {
  return <p>Hello, <strong>{name}</strong>!</p>;
}

const html = await renderToString(<Greeting name="Alice" />);
// → "<p>Hello, <strong>Alice</strong>!</p>"
````

## File: apps/jsx-string-doc/docs-src/examples/guide/quick-start/escaping.tsx
````typescript
import { raw } from "@cjean-fr/jsx-string";

// User input is HTML-escaped automatically
const userInput = '<script>alert("xss")</script>';
const html = await renderToString(<p>{userInput}</p>);
// → '<p>&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;</p>'

// Use raw() only for trusted HTML you generated yourself
const trustedHtml = await markdownRenderer.render(post.body);
const html2 = await renderToString(<article>{raw(trustedHtml)}</article>);
````

## File: apps/jsx-string-doc/docs-src/examples/guide/quick-start/fragment.tsx
````typescript
import { Fragment } from "@cjean-fr/jsx-string";

// Long form
const items = <Fragment><li>One</li><li>Two</li></Fragment>;

// Shorthand (requires jsxImportSource in tsconfig)
const items2 = <><li>One</li><li>Two</li></>;
````

## File: apps/jsx-string-doc/docs-src/examples/guide/quick-start/hello-world.tsx
````typescript
import { renderToString } from "@cjean-fr/jsx-string";

const html = await renderToString(<h1>Hello, world!</h1>);
console.log(html); // "<h1>Hello, world!</h1>"
````

## File: apps/jsx-string-doc/docs-src/examples/guide/security/one-rule.tsx
````typescript
// @jsxImportSource @cjean-fr/jsx-string
import { renderToString, raw } from "@cjean-fr/jsx-string";

const userInput = '<script>alert("XSS")</script>';

// ❌ NEVER do this with untrusted input
const unsafe = await renderToString(<div>{raw(userInput)}</div>);
// Output: <div><script>alert("XSS")</script></div>  -- XSS vulnerability!

// ✅ This is safe (default behavior - always escaped)
const safe = await renderToString(<div>{userInput}</div>);
// Output: <div>&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;</div>

// ✅ raw() is safe with trusted sources (markdown, templates, your code)
const trustedHtml = "<strong>Hello</strong>";
const result = await renderToString(<p>{raw(trustedHtml)}</p>);
// Output: <p><strong>Hello</strong></p>
````

## File: apps/jsx-string-doc/docs-src/examples/home/hello.tsx
````typescript
import { renderToString } from "@cjean-fr/jsx-string";

const App = ({ name }: { name: string }) => <h1>Hello, {name}!</h1>;

const html = await renderToString(<App name="world" />);
// → "<h1>Hello, world!</h1>"

export { html };
````

## File: apps/jsx-string-doc/docs-src/examples/jsx-flow/adapters.ts
````typescript
import {
  TurboAdapter,       // Turbo Streams — <turbo-frame> / <turbo-stream>
  HtmxAdapter,        // HTMX — hx-get / hx-swap-oob
  NativeAdapter,      // <template for> + inline polyfill, all merge types
  WebPlatformAdapter, // WICG declarative partial updates, replace only
  EsiAdapter,         // CDN edge composition via esi:include
} from "@cjean-fr/jsx-flow";
````

## File: apps/jsx-string-doc/docs-src/examples/jsx-flow/deferred-src.tsx
````typescript
import { Deferred } from "@cjean-fr/jsx-flow";

// The browser fetches /fragments/comments.html after the shell lands.
// No server-push needed — works with any static file server.
function Page() {
  return (
    <Deferred src="/fragments/comments.html" fallback={<p>Loading…</p>} />
  );
}
````

## File: apps/jsx-string-doc/docs-src/examples/jsx-flow/deferred-static.tsx
````typescript
import { renderToStatic, NativeAdapter } from "@cjean-fr/jsx-flow";

// Pages use <Deferred>: emit fragment files after rendering all pages.
await renderToStatic(
  async (ctx) => {
    for (const page of pages) {
      const html = await ctx.renderPage(() => <page.Component />);
      await Bun.write(page.out, "<!DOCTYPE html>\n" + html);
    }

    // Writes one .html file per deferred fragment.
    await ctx.emitFragments(async (_id, url, html) => {
      await Bun.write("./dist" + url, html);
    });
  },
  { adapter: NativeAdapter },
);
````

## File: apps/jsx-string-doc/docs-src/examples/jsx-flow/deferred-stream.tsx
````typescript
import { Deferred, renderToReadableStream, TurboAdapter } from "@cjean-fr/jsx-flow";

async function Comments() {
  const items = await fetchComments();
  return <ul>{items.map((c) => <li>{c.text}</li>)}</ul>;
}

function Page() {
  return (
    <html>
      <body>
        <h1>My page</h1>
        <Deferred fallback={<p>Loading comments…</p>}>
          {() => <Comments />}
        </Deferred>
      </body>
    </html>
  );
}

// The shell is sent immediately; <Comments /> streams in after it resolves.
const stream = await renderToReadableStream(() => <Page />, TurboAdapter);
````

## File: apps/jsx-string-doc/docs-src/examples/jsx-flow/patch.tsx
````typescript
import { Patch, renderToReadableStream, TurboAdapter } from "@cjean-fr/jsx-flow";

// Patches an existing DOM element — renders nothing in the shell.
function LiveBadge() {
  return (
    <Patch target="nav-count">
      {() => <span>42</span>}
    </Patch>
  );
}

// Merge types: "replace" (default) | "append" | "prepend" | "before" | "after"
function AppendLog() {
  return (
    <Patch target="log-list" merge="append">
      {() => <li>New entry</li>}
    </Patch>
  );
}
````

## File: apps/jsx-string-doc/docs-src/examples/jsx-flow/pure-static.tsx
````typescript
import { renderToStatic } from "@cjean-fr/jsx-flow";

// Pure-static: no <Deferred>, no adapter needed.
await renderToStatic(async (ctx) => {
  for (const page of pages) {
    const html = await ctx.renderPage(() => <page.Component />);
    await Bun.write(page.out, "<!DOCTYPE html>\n" + html);
  }
});
````

## File: apps/jsx-string-doc/docs-src/pages/api/context.mdx
````markdown
---
title: Context API
sidebar:
  label: Context
  group: API
  order: 2
---

# Context API

Pass data through a component tree without prop-drilling. Built on
`AsyncLocalStorage` — concurrent renders are fully isolated.

## API signatures

<CodeExample src="api/context/signatures.ts" />

## Basic example

Create a context key once at module level, provide a value with `setContext`
inside a `withScope`, and read it anywhere in the tree with `useContext`.

<CodeExample src="api/context/basic.tsx" />

## Concurrent renders

Each `withScope` call creates an isolated `AsyncLocalStorage` store. Concurrent
renders never interfere with each other.

<CodeExample src="api/context/concurrent.tsx" />

## snapshot()

Capture all current context values and pass them as a `seed` to a new scope.
Useful for spawning child renders that inherit the parent's context.

<CodeExample src="api/context/snapshot.tsx" />

## Per-request context

A common pattern for HTTP servers: inject request-specific data into the
context at the top level.

<CodeExample src="api/context/per-request.tsx" />

<div class="mt-10 flex justify-start">
  <a
    href="/api/renderToString"
    class="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
  >
    ← renderToString
  </a>
</div>
````

## File: apps/jsx-string-doc/docs-src/pages/api/renderToString.mdx
````markdown
---
title: renderToString
sidebar:
  group: API
  order: 1
---

# renderToString

Renders a JSX tree into an HTML string. Always returns a `Promise<string>`.

## Signature

<CodeExample src="api/renderToString/signature.ts" />

## Basic usage

<CodeExample src="api/renderToString/basic.tsx" />

## With a page component

<CodeExample src="api/renderToString/with-component.tsx" />

## Async components

Any component in the tree can be async. `renderToString` awaits the entire
resolved tree before returning.

<CodeExample src="api/renderToString/async-tree.tsx" />

## Concurrent renders

Multiple concurrent calls to `renderToString` are safe even when components use
`context()` and `setContext()` inside a `withScope()`.

<CodeExample src="api/renderToString/concurrent.tsx" />

## JSXNode type

The argument is typed as `JSXNode`, which covers all values a JSX expression
can produce:

<CodeExample src="api/renderToString/jsx-node.ts" />

<div class="mt-10 flex justify-between">
  <a
    href="/guide/quick-start"
    class="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
  >
    ← Quick Start
  </a>
  <a
    href="/api/context"
    class="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
  >
    Context API →
  </a>
</div>
````

## File: apps/jsx-string-doc/docs-src/pages/guide/installation.mdx
````markdown
---
title: Installation
sidebar:
  group: Guide
  order: 1
---

# Installation

jsx-string has zero runtime dependencies. Install it and configure TypeScript —
that's all.

## Package manager

<Tabs syncKey="pkg-manager" tabs={[
  { label: 'npm', content: <CodeBlock code="npm install @cjean-fr/jsx-string" language="bash" /> },
  { label: 'bun', content: <CodeBlock code="bun add @cjean-fr/jsx-string" language="bash" /> },
]} />

## TypeScript configuration

Set `jsxImportSource` in your `tsconfig.json` so that JSX files don't need any
explicit import:

<CodeExample src="guide/installation/tsconfig.json" />

## Optional: @types/react

Installing `@types/react` gives you per-element attribute autocomplete (e.g.
`src` on `<img>`, `href` on `<a>`). It is not required — jsx-string works
without it.

<CodeExample src="guide/installation/tsconfig-with-react.json" />

## Deno

Configure `deno.json`:

<CodeExample src="guide/installation/deno.json" />

## ESLint plugin

The ESLint plugin catches common mistakes — unsafe `raw()` calls, event
handlers that will be silently dropped, and attributes incompatible with static
rendering.

<Tabs syncKey="pkg-manager" tabs={[
  { label: 'npm', content: <CodeBlock code="npm install -D @cjean-fr/eslint-plugin-jsx-string" language="bash" /> },
  { label: 'bun', content: <CodeBlock code="bun add -D @cjean-fr/eslint-plugin-jsx-string" language="bash" /> },
]} />

<div class="mt-10 flex justify-end">
  <a
    href="/guide/quick-start"
    class="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
  >
    Quick Start →
  </a>
</div>
````

## File: apps/jsx-string-doc/docs-src/pages/guide/quick-start.mdx
````markdown
---
title: Quick Start
sidebar:
  group: Guide
  order: 2
---

# Quick Start

Everything you need to start rendering JSX to HTML strings.

## Hello world

`renderToString` always returns a `Promise<string>`, even for synchronous
trees.

<CodeExample src="guide/quick-start/hello-world.tsx" />

## Components

Components are plain functions. Props are typed. Children are passed via the
`children` prop or as JSX children.

<CodeExample src="guide/quick-start/component.tsx" />

## Async components

Any component can be an async function. Data fetching happens naturally.

<CodeExample src="guide/quick-start/async-component.tsx" />

## Security: escaping and raw HTML

All string values embedded in JSX are HTML-escaped. Use `raw()` only for
trusted HTML.

<CodeExample src="guide/quick-start/escaping.tsx" />

## Fragments

<CodeExample src="guide/quick-start/fragment.tsx" />

<div class="mt-10 flex justify-between">
  <a
    href="/guide/installation"
    class="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
  >
    ← Installation
  </a>
  <a
    href="/api/renderToString"
    class="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
  >
    renderToString API →
  </a>
</div>
````

## File: apps/jsx-string-doc/docs-src/pages/guide/security.mdx
````markdown
---
title: Security
sidebar:
  group: Guide
  order: 3
---

# Security

Safe by default. One rule to remember.

## ✅ Everything is escaped

Text content, attributes, URLs — all HTML-escaped automatically. No
configuration needed.

## ⚠️ One rule

**Never use `raw()` with untrusted input.**

<CodeExample src="guide/security/one-rule.tsx" />

## When is `raw()` safe?

Markdown renderers (`marked`, `remark`). Template engines (`EJS`,
`Handlebars`). Your own hardcoded HTML.

<div class="mt-10 flex justify-between">
  <a
    href="/guide/quick-start"
    class="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
  >
    ← Quick Start
  </a>
  <a
    href="/api/renderToString"
    class="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
  >
    API →
  </a>
</div>
````

## File: apps/jsx-string-doc/docs-src/pages/jsx-flow/overview.mdx
````markdown
---
title: Overview
sidebar:
  group: jsx-flow
  order: 1
---

# jsx-flow

Deferred rendering and document orchestration for `@cjean-fr/jsx-string`.

## What it does

jsx-flow adds one primitive: `<Deferred>`. It renders a placeholder in the HTML
shell; the real content arrives later — either streamed inline in the same HTTP
response, or emitted as standalone fragment files for static generation.

No client-side hydration. No JavaScript framework. Just HTML arriving in chunks.

## Install

<Tabs syncKey="pkg-manager" tabs={[
  { label: 'bun', content: <CodeBlock code="bun add @cjean-fr/jsx-flow" language="bash" /> },
  { label: 'npm', content: <CodeBlock code="npm install @cjean-fr/jsx-flow" language="bash" /> },
]} />

## Two rendering modes

<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-8">
  <div class="rounded-xl border border-gray-200 dark:border-gray-800 p-5">
    <h3 class="text-base font-semibold mb-2">Streaming</h3>
    <p class="text-sm text-gray-600 dark:text-gray-400">
      Fragments arrive in the same HTTP response after the shell.{" "}
      <code class="text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded font-mono">renderToReadableStream</code>
    </p>
  </div>
  <div class="rounded-xl border border-gray-200 dark:border-gray-800 p-5">
    <h3 class="text-base font-semibold mb-2">Static generation</h3>
    <p class="text-sm text-gray-600 dark:text-gray-400">
      Fragments are written as separate HTML files. The browser fetches them on
      load.{" "}
      <code class="text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded font-mono">renderToStatic</code>
    </p>
  </div>
</div>

## Adapters

An adapter defines how placeholders and patches are encoded as HTML. jsx-flow
ships five built-in adapters:

<CodeExample src="jsx-flow/adapters.ts" />

<div class="mt-10 flex justify-end">
  <a
    href="/jsx-flow/streaming"
    class="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
  >
    Streaming →
  </a>
</div>
````

## File: apps/jsx-string-doc/docs-src/pages/jsx-flow/static.mdx
````markdown
---
title: Static generation
sidebar:
  group: jsx-flow
  order: 3
---

# Static generation

Build HTML files at compile time. `renderToStatic` gives you a context to
render all your pages, then emit fragment files if any page uses `<Deferred>`.

## Pure static

No `<Deferred>` in your pages? Call `renderToStatic` without options.
`ctx.renderPage` applies any adapter shell transforms and returns the HTML
string.

<CodeExample src="jsx-flow/pure-static.tsx" />

## With deferred fragments

Pass an adapter and call `ctx.emitFragments` after rendering all pages. Each
deferred fragment is rendered and passed to your callback with its id, its URL
(from `generatePath`, default: `/fragments/{id}.html`), and its HTML.

<CodeExample src="jsx-flow/deferred-static.tsx" />

<div class="mt-10 flex justify-start">
  <a
    href="/jsx-flow/streaming"
    class="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
  >
    ← Streaming
  </a>
</div>
````

## File: apps/jsx-string-doc/docs-src/pages/jsx-flow/streaming.mdx
````markdown
---
title: Streaming
sidebar:
  group: jsx-flow
  order: 2
---

# Streaming

Send the HTML shell immediately and stream deferred fragments inline in the
same HTTP response.

## renderToReadableStream

Returns a `ReadableStream<string>`. The shell chunk is emitted first; fragment
chunks follow as they resolve.

<CodeExample src="jsx-flow/deferred-stream.tsx" />

## `<Deferred>` — server push

Pass a **factory function** as children — JSX evaluates eagerly, so the thunk
defers rendering to streaming time. The `fallback` prop is rendered in the
shell while the fragment resolves.

## `<Deferred src>` — client fetch

Provide a `src` URL instead of children. The adapter injects a fetch or
`hx-get` — the browser loads the fragment after the shell lands. No server-push
required.

<CodeExample src="jsx-flow/deferred-src.tsx" />

## `<Patch>`

Target an existing DOM element by id — renders nothing in the shell. Useful for
updating counters, banners, or any element that already exists on the page.
Supports the same `merge` types as `<Deferred>`: `"replace"` (default),
`"append"`, `"prepend"`, `"before"`, `"after"`.

<CodeExample src="jsx-flow/patch.tsx" />

<div class="mt-10 flex justify-between">
  <a
    href="/jsx-flow/overview"
    class="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
  >
    ← Overview
  </a>
  <a
    href="/jsx-flow/static"
    class="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
  >
    Static generation →
  </a>
</div>
````

## File: apps/jsx-string-doc/docs-src/pages/index.tsx
````typescript
import { CodeExample, type PageMeta } from '@cjean-fr/docs';

export const meta: PageMeta = {
  title: 'Home',
};

export default function HomePage() {
  return (
    <div class="max-w-2xl">
      <div class="mb-8">
        <h1 class="text-4xl font-bold tracking-tight mb-3">jsx-string</h1>
        <p class="text-xl text-gray-600 dark:text-gray-400">
          The small, safe way to render JSX into HTML strings.
        </p>
      </div>

      <div class="flex gap-3 flex-wrap mb-10">
        <span class="inline-flex items-center rounded-full bg-green-50 dark:bg-green-950 px-3 py-1 text-sm font-medium text-green-700 dark:text-green-300 ring-1 ring-green-600/20">
          Zero dependencies
        </span>
        <span class="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-950 px-3 py-1 text-sm font-medium text-blue-700 dark:text-blue-300 ring-1 ring-blue-600/20">
          Fully typed
        </span>
        <span class="inline-flex items-center rounded-full bg-purple-50 dark:bg-purple-950 px-3 py-1 text-sm font-medium text-purple-700 dark:text-purple-300 ring-1 ring-purple-600/20">
          XSS-safe by default
        </span>
        <span class="inline-flex items-center rounded-full bg-orange-50 dark:bg-orange-950 px-3 py-1 text-sm font-medium text-orange-700 dark:text-orange-300 ring-1 ring-orange-600/20">
          Async-first
        </span>
      </div>

      <CodeExample src="home/hello.tsx" />

      <div class="mt-10 flex gap-4">
        <a
          href="/guide/installation"
          class="inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Get started
        </a>
        <a
          href="/api/renderToString"
          class="inline-flex items-center rounded-lg bg-white dark:bg-gray-800 px-5 py-2.5 text-sm font-semibold text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          API reference
        </a>
      </div>

      <div class="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div class="rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <h2 class="text-base font-semibold mb-2">Server-side rendering</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Generate HTML on the server — no browser required. Perfect for static site generators, email templates, and API responses.
          </p>
        </div>
        <div class="rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <h2 class="text-base font-semibold mb-2">Security model</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            All content is HTML-escaped by default. Dangerous URLs are blocked. Event handler functions are silently dropped.
          </p>
        </div>
        <div class="rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <h2 class="text-base font-semibold mb-2">Async components</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Components can be async functions. Fetch data, query databases, and await Promises — renderToString handles all of it.
          </p>
        </div>
        <div class="rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <h2 class="text-base font-semibold mb-2">Scoped context</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Pass data through the tree without prop-drilling using the context API. Concurrent renders are fully isolated.
          </p>
        </div>
      </div>
    </div>
  );
}
````

## File: apps/jsx-string-doc/docs-src/pages/markdown-test.md
````markdown
---
title: Markdown Test
description: A page written in Markdown to validate the .md pipeline.
sidebar:
  group: Guide
  order: 99
---

# Markdown Test

This page is written in **Markdown**, not JSX. It demonstrates that
`@cjean-fr/docs` can mix `.tsx` and `.md` pages in the same site.

## Lists

- Item one
- Item two with `inline code`
- Item three with a [link](/guide/installation)

## Code

```ts
function greet(name: string): string {
  return `Hello, ${name}!`;
}
```

## Raw HTML

<div style="padding: 1rem; border: 1px solid #ccc;">
  Raw HTML is allowed inline.
</div>
````

## File: apps/jsx-string-doc/docs-src/build.ts
````typescript
import { build } from '@cjean-fr/docs';
import config from '../docs.config.js';

const result = await build(config);
console.log(`Built ${result.pages.length} pages.`);
if (result.searchBuilt) console.log('  ✓ search index');
````

## File: apps/jsx-string-doc/docs-src/client.ts
````typescript
import './styles/main.css';
import '@cjean-fr/docs/client';
````

## File: apps/jsx-string-doc/.gitignore
````
node_modules/
docs/
dist/
.vite/
````

## File: apps/jsx-string-doc/docs.config.ts
````typescript
import { defineConfig } from '@cjean-fr/docs';

export default defineConfig({
  title: 'jsx-string',
  tagline: 'Documentation',
  description: 'The small, safe way to render JSX into HTML strings.',

  pages: 'docs-src/pages',
  examples: 'docs-src/examples',
  clientEntry: 'docs-src/client.ts',
  out: 'dist',
  base: '/assets/',
  viteManifest: 'dist/assets/.vite/manifest.json',

  sidebar: ['Guide', 'API', 'jsx-flow'],
});
````

## File: apps/jsx-string-doc/tsconfig.json
````json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "jsxImportSource": "@cjean-fr/jsx-string",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "types": ["vite/client", "bun"]
  },
  "include": ["docs-src", "vite.config.ts", "vite-plugin-jsx-docs.ts"],
  "exclude": ["docs-src/examples"]
}
````

## File: packages/build-core/src/cli/loadConfig.ts
````typescript
import { existsSync } from "node:fs";
import path from "node:path";

const CANDIDATES = ["docs.config.ts", "docs.config.js", "docs.config.mjs"];

/**
 * Find and load the user's `docs.config.{ts,js,mjs}` from `cwd`. TS files
 * are transpiled via Vite's loader (`loadConfigFromFile`) — Vite is a
 * peer dep so no extra runtime is required.
 *
 * Returns the loaded config as `unknown` — caller (distro) types it.
 */
export async function loadDocsConfig(
  cwd: string,
): Promise<{ config: unknown; configPath: string }> {
  const found = CANDIDATES.map((f) => path.join(cwd, f)).find(existsSync);
  if (!found) {
    throw new Error(
      `[@cjean-fr/build-core] No docs.config.{ts,js,mjs} found in ${cwd}.`,
    );
  }

  const { loadConfigFromFile } = await import("vite");
  const loaded = await loadConfigFromFile(
    { command: "build", mode: "production" },
    found,
    cwd,
    "silent",
  );
  if (!loaded) {
    throw new Error(`[@cjean-fr/build-core] Failed to load ${found}.`);
  }

  return { config: loaded.config, configPath: loaded.path };
}
````

## File: packages/build-core/src/search/builtin/adapter.ts
````typescript
/**
 * Builtin search adapter — substring + title-priority ranking, JSON index,
 * tiny client. The default for `defineConfig({ search })`.
 */
import type {
  SearchAdapter,
  SearchBuildInput,
  SearchServeInput,
} from "../../types.js";
import { indexEntry } from "./extract.js";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

export interface BuiltinSearchOptions {
  /** URL path served at dev time and built as a file. Default: `/search-index.json`. */
  url?: string;
}

const DEFAULT_URL = "/search-index.json";

/** Factory returning the builtin SearchAdapter. */
export function builtin(options: BuiltinSearchOptions = {}): SearchAdapter {
  const url = options.url ?? DEFAULT_URL;

  return {
    name: "builtin",

    clientEntry: "@cjean-fr/build-core/search/builtin/client",

    async build({ pages, outDir }: SearchBuildInput): Promise<void> {
      const index = pages.map(({ url: pageUrl, html }) =>
        indexEntry(pageUrl, html),
      );
      const outPath = path.join(outDir, urlToFilePath(url));
      await mkdir(path.dirname(outPath), { recursive: true });
      await writeFile(outPath, JSON.stringify(index), "utf-8");
    },

    async serve({
      url: requestUrl,
      pages,
    }: SearchServeInput): Promise<Response | null> {
      if (requestUrl.pathname !== url) return null;
      const list = await pages();
      const index = list.map(({ url: pageUrl, html }) =>
        indexEntry(pageUrl, html),
      );
      return new Response(JSON.stringify(index), {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store",
        },
      });
    },
  };
}

function urlToFilePath(url: string): string {
  // "/search-index.json" → "search-index.json"
  return url.replace(/^\//, "");
}
````

## File: packages/build-core/src/search/builtin/client.ts
````typescript
/**
 * Client-side search: lazy-loads /search-index.json on first open, runs a
 * substring match with title-priority ranking, renders results with a
 * keyboard-navigable list. Progressive enhancement — works on top of the
 * static markup emitted by <SearchDialog />.
 *
 * Pure logic (ranking, snippet extraction, escaping, highlighting) lives in
 * ./searchEngine — DOM-free and unit-tested.
 */
import { rank, highlight, escapeAttr, type SearchEntry } from "./engine.js";

// Self-contained: inject the selection highlight so it works regardless of
// which theme CSS the consumer imports.
{
  const s = document.createElement("style");
  s.textContent =
    ".docs-search-active{border-left-color:#3b82f6;background:#eff6ff}" +
    ".dark .docs-search-active{border-left-color:#60a5fa;background:rgba(23,37,84,.6)}";
  document.head.appendChild(s);
}

const trigger = document.getElementById("search-trigger");
const dialogEl = document.getElementById("search-dialog");
const inputEl = document.getElementById("search-input");
const statusEl = document.getElementById("search-status");
const resultsEl = document.getElementById("search-results");

if (
  trigger instanceof HTMLButtonElement &&
  dialogEl instanceof HTMLDialogElement &&
  inputEl instanceof HTMLInputElement &&
  statusEl instanceof HTMLElement &&
  resultsEl instanceof HTMLUListElement
) {
  install({
    trigger,
    dialog: dialogEl,
    input: inputEl,
    status: statusEl,
    results: resultsEl,
  });
}

interface Refs {
  trigger: HTMLButtonElement;
  dialog: HTMLDialogElement;
  input: HTMLInputElement;
  status: HTMLElement;
  results: HTMLUListElement;
}

function install(refs: Refs): void {
  const { trigger, dialog, input, status, results } = refs;
  let index: SearchEntry[] | null = null;
  let indexPromise: Promise<SearchEntry[]> | null = null;
  let activeIndex = -1;

  const open = () => {
    if (!dialog.open) dialog.showModal();
    void ensureIndex();
    // Focus only if the input is already enabled; otherwise ensureIndex()
    // will focus once the index has loaded and re-enabled it.
    if (!input.disabled) input.focus();
  };

  const close = () => {
    if (dialog.open) dialog.close();
  };

  async function ensureIndex(): Promise<SearchEntry[]> {
    if (index) return index;
    if (!indexPromise) {
      indexPromise = fetch("/search-index.json")
        .then((r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json() as Promise<SearchEntry[]>;
        })
        .then((data) => {
          index = data;
          input.disabled = false;
          input.placeholder = "Search documentation…";
          status.textContent = "Type to search.";
          // If the dialog is already open, focus the input now that it's usable.
          if (dialog.open) input.focus();
          return data;
        })
        .catch((err) => {
          status.textContent = "Could not load search index.";
          throw err;
        });
    }
    return indexPromise;
  }

  function render(query: string) {
    if (!index) return;
    const q = query.trim().toLowerCase();
    if (!q) {
      results.classList.add("hidden");
      status.classList.remove("hidden");
      status.textContent = "Type to search.";
      activeIndex = -1;
      return;
    }
    const ranked = rank(index, q);
    if (ranked.length === 0) {
      results.classList.add("hidden");
      status.classList.remove("hidden");
      status.textContent = "No matches.";
      activeIndex = -1;
      return;
    }
    status.classList.add("hidden");
    results.classList.remove("hidden");
    results.innerHTML = ranked
      .map(
        (r, i) => `
          <li
            role="option"
            aria-selected="${i === 0}"
            data-idx="${i}"
            data-url="${escapeAttr(r.entry.url)}"
            class="border-l-2 border-transparent transition-colors${i === 0 ? " docs-search-active" : ""}"
          >
            <a href="${escapeAttr(r.entry.url)}" class="block px-4 py-2.5">
              <div class="text-sm font-semibold text-gray-900 dark:text-gray-100">${highlight(r.entry.title, q)}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">${highlight(r.snippet, q)}</div>
            </a>
          </li>`,
      )
      .join("");
    activeIndex = 0;
    syncActive();
  }

  function syncActive() {
    const items = results.querySelectorAll<HTMLLIElement>('li[role="option"]');
    items.forEach((li, i) => {
      const selected = i === activeIndex;
      li.setAttribute("aria-selected", selected ? "true" : "false");
      li.classList.toggle("docs-search-active", selected);
      if (selected) li.scrollIntoView({ block: "nearest" });
    });
  }

  function move(delta: number) {
    const items = results.querySelectorAll<HTMLLIElement>('li[role="option"]');
    if (items.length === 0) return;
    activeIndex = (activeIndex + delta + items.length) % items.length;
    syncActive();
  }

  function activate() {
    const items = results.querySelectorAll<HTMLLIElement>('li[role="option"]');
    const current = items[activeIndex];
    if (!current) return;
    current.querySelector("a")?.click();
  }

  // Open via Ctrl/Cmd + K
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      open();
    }
  });

  // Open via the trigger button
  trigger.addEventListener("click", open);

  // Type to search
  input.addEventListener("input", () => {
    if (!index) return;
    render(input.value);
  });

  // Mouse hover syncs the active index so keyboard and mouse stay aligned.
  results.addEventListener("mousemove", (e) => {
    const li = (e.target as HTMLElement).closest<HTMLLIElement>(
      'li[role="option"]',
    );
    if (!li) return;
    const idx = Number(li.dataset["idx"]);
    if (!Number.isNaN(idx) && idx !== activeIndex) {
      activeIndex = idx;
      syncActive();
    }
  });

  // Keyboard navigation inside the input
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      move(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      move(-1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      activate();
    }
  });

  // Click outside dialog content (on the backdrop) closes it.
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) close();
  });

  // Reset state when the dialog closes.
  dialog.addEventListener("close", () => {
    input.value = "";
    results.innerHTML = "";
    results.classList.add("hidden");
    status.classList.remove("hidden");
    status.textContent = index ? "Type to search." : "Loading…";
    activeIndex = -1;
  });
}
````

## File: packages/build-core/src/search/builtin/engine.test.ts
````typescript
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
````

## File: packages/build-core/src/search/builtin/engine.ts
````typescript
/**
 * Pure search engine logic: ranking, snippets, and HTML helpers.
 *
 * Kept DOM-free so it's trivially testable and easy to lift into a future
 * shared "doc-site-builder" package. The DOM wiring lives in `search.ts`.
 */

export interface SearchEntry {
  url: string;
  title: string;
  text: string;
}

export interface RankedResult {
  entry: SearchEntry;
  score: number;
  snippet: string;
}

/** Maximum number of results returned by `rank()`. */
export const MAX_RESULTS = 10;

/** Half-width (in chars) of the context window built around the first match. */
const SNIPPET_RADIUS = 40;

/** Snippet fallback length when the match is in the title only. */
const TITLE_ONLY_FALLBACK_LEN = 120;

const TITLE_HIT_SCORE = 100;
const TEXT_HIT_SCORE = 10;

/**
 * Filter and rank `entries` against a lowercased query.
 *
 * - Match is case-insensitive substring (caller is expected to pass `q` already
 *   lowercased — the entry title/text are lowercased internally).
 * - Title hits weigh 10× body hits, so a page whose name matches always wins.
 * - Results are trimmed to {@link MAX_RESULTS}.
 *
 * Returns an empty array when `q` is empty or no entry matches.
 */
export function rank(entries: SearchEntry[], q: string): RankedResult[] {
  if (!q) return [];
  const out: RankedResult[] = [];
  for (const entry of entries) {
    const titleLc = entry.title.toLowerCase();
    const textLc = entry.text.toLowerCase();
    const titleHit = titleLc.includes(q);
    const textHit = textLc.indexOf(q);
    if (!titleHit && textHit === -1) continue;
    const score =
      (titleHit ? TITLE_HIT_SCORE : 0) + (textHit !== -1 ? TEXT_HIT_SCORE : 0);
    out.push({
      entry,
      score,
      snippet:
        textHit !== -1
          ? snippetAround(entry.text, textHit, q.length)
          : entry.text.slice(0, TITLE_ONLY_FALLBACK_LEN),
    });
  }
  out.sort((a, b) => b.score - a.score);
  return out.slice(0, MAX_RESULTS);
}

/**
 * Extract a {@link SNIPPET_RADIUS}-wide window of `text` around the match
 * starting at `at` (a byte offset returned by `String.indexOf`). The snippet
 * is prefixed/suffixed with an ellipsis when it is not flush with either end
 * of the source.
 */
export function snippetAround(text: string, at: number, len: number): string {
  const start = Math.max(0, at - SNIPPET_RADIUS);
  const end = Math.min(text.length, at + len + SNIPPET_RADIUS);
  const prefix = start > 0 ? "…" : "";
  const suffix = end < text.length ? "…" : "";
  return prefix + text.slice(start, end) + suffix;
}

/** HTML-escape a string for safe interpolation into element content. */
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** HTML-escape a string for safe interpolation into attribute values. */
export function escapeAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

/**
 * HTML-escape `text`, then wrap every case-insensitive occurrence of `query`
 * in a styled `<mark>`. `query` is also escaped and regex-quoted so the
 * function is XSS-safe for arbitrary user input.
 */
export function highlight(text: string, query: string): string {
  const escapedText = escapeHtml(text);
  if (!query) return escapedText;
  const pattern = escapeHtml(query).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (!pattern) return escapedText;
  const regex = new RegExp(`(${pattern})`, "gi");
  return escapedText.replace(
    regex,
    '<mark class="bg-yellow-200 dark:bg-yellow-700/60 text-gray-900 dark:text-gray-50 rounded px-0.5 font-semibold">$1</mark>',
  );
}
````

## File: packages/build-core/src/search/builtin/extract.test.ts
````typescript
import { indexEntry } from "./extract.js";
import { describe, it, expect } from "bun:test";

describe("indexEntry — text extraction", () => {
  it("indexes <main> content only when present", () => {
    const html = `
      <html><body>
        <nav>Home Guide API</nav>
        <aside>On this page</aside>
        <main><h1>Title</h1><p>Body content here.</p></main>
        <footer>edit on github</footer>
      </body></html>
    `;
    const entry = indexEntry("/page", html);
    expect(entry.text).toContain("Body content here");
    expect(entry.text).not.toContain("Home Guide API");
    expect(entry.text).not.toContain("On this page");
    expect(entry.text).not.toContain("edit on github");
  });

  it("falls back to full document when <main> is absent", () => {
    const html = `<html><body><h1>Hello</h1><p>Plain body.</p></body></html>`;
    const entry = indexEntry("/page", html);
    expect(entry.text).toContain("Hello");
    expect(entry.text).toContain("Plain body");
  });

  it("strips <nav> and <aside> even inside <main>", () => {
    const html = `
      <main>
        <nav>chrome</nav>
        <aside>toc</aside>
        <p>real content</p>
      </main>
    `;
    const entry = indexEntry("/page", html);
    expect(entry.text).toContain("real content");
    expect(entry.text).not.toContain("chrome");
    expect(entry.text).not.toContain("toc");
  });
});
````

## File: packages/build-core/src/search/builtin/extract.ts
````typescript
/**
 * Build-time extraction of search index entries from rendered HTML.
 * Shared between the static build and the dev plugin so dev and prod search
 * behave identically.
 */
import type { SearchEntry } from "./engine.js";

/**
 * Extract a search index entry from a fully rendered HTML document.
 */
export function indexEntry(url: string, html: string): SearchEntry {
  return {
    url,
    title: extractTitle(html),
    text: stripText(html),
  };
}

function extractTitle(html: string): string {
  // Prefer the <title> tag; fall back to first <h1>.
  const t = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (t) return decodeEntities(t[1]!.trim()).split(" — ")[0]!.trim();

  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1) return decodeEntities(stripTags(h1[1]!)).trim();

  return "";
}

function stripText(html: string): string {
  // Prefer the page's <main> element when present — every other region
  // (sidebar, header, footer, TOC <aside>) is shared chrome that pollutes
  // the index with false positives. Fall back to the whole document for
  // layouts that don't use <main>.
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  const body = main ? main[1]! : html;
  const noHead = body.replace(/<head\b[^>]*>[\s\S]*?<\/head>/gi, " ");
  const noScripts = noHead.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ");
  const noStyles = noScripts.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ");
  const noNav = noStyles.replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi, " ");
  const noAside = noNav.replace(/<aside\b[^>]*>[\s\S]*?<\/aside>/gi, " ");
  const stripped = stripTags(noAside);
  return decodeEntities(stripped).replace(/\s+/g, " ").trim();
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, " ");
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}
````

## File: packages/build-core/src/search/index.ts
````typescript
/**
 * Public entry of the search subsystem.
 *
 * Re-exports the `SearchAdapter` interface and ships factories for the
 * bundled adapters. Pagefind ships in Phase 3.
 */

export type {
  SearchAdapter,
  SearchBuildInput,
  SearchServeInput,
} from "../types.js";

export { builtin, type BuiltinSearchOptions } from "./builtin/adapter.js";
````

## File: packages/build-core/src/editUrl.ts
````typescript
/**
 * Substitute `{slug}` in `config.editUrl` with the page's source path
 * relative to the project root.
 */
import path from "node:path";

export function resolveEditUrl(
  template: string | null,
  pageFile: string,
  projectRoot: string = process.cwd(),
): string | null {
  if (!template) return null;
  const rel = path.relative(projectRoot, pageFile).replace(/\\/g, "/");
  return template.replace(/\{slug\}/g, rel);
}
````

## File: packages/build-core/src/git.ts
````typescript
/**
 * Get the ISO 8601 timestamp of the last git commit touching `file`, or
 * `null` if git is unavailable, the file is untracked, or any error occurs.
 *
 * Cached by absolute path so repeat calls within one build are free. Call
 * `preloadLastModified(files)` before a batch to populate the cache with a
 * single `git log` invocation instead of one process per file.
 */
import { execFile } from "node:child_process";
import { stat } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const cache = new Map<string, string | null>();

export async function getLastModified(file: string): Promise<string | null> {
  const abs = path.resolve(file);
  if (cache.has(abs)) return cache.get(abs)!;

  let result: string | null = null;
  try {
    const { stdout } = await execFileAsync("git", [
      "log",
      "-1",
      "--format=%cI",
      "--",
      abs,
    ]);
    const trimmed = stdout.trim();
    result = trimmed || (await fsMtime(abs));
  } catch {
    result = await fsMtime(abs);
  }
  cache.set(abs, result);
  return result;
}

/**
 * Populate the cache for a batch of files with a single `git log` call.
 *
 * Walks history once with `--name-only` and records, for each file, the
 * timestamp of the first (most recent) commit it appears in. Files absent
 * from history fall back to filesystem mtime, mirroring `getLastModified`'s
 * single-file behavior.
 */
export async function preloadLastModified(files: string[]): Promise<void> {
  if (files.length === 0) return;
  const abs = files.map((f) => path.resolve(f));
  const wanted = new Set(abs.filter((a) => !cache.has(a)));
  if (wanted.size === 0) return;

  try {
    // Sentinel-prefixed timestamp lines, then plain file paths, then blank
    // line between commits. Most recent commit comes first, so the first
    // time a path appears wins.
    const SENTINEL = "__COMMIT__";
    const { stdout } = await execFileAsync(
      "git",
      ["log", `--format=${SENTINEL}%cI`, "--name-only", "--", ...wanted],
      { maxBuffer: 64 * 1024 * 1024 },
    );
    const repoRoot = (
      await execFileAsync("git", ["rev-parse", "--show-toplevel"])
    ).stdout.trim();
    let currentIso: string | null = null;
    for (const line of stdout.split("\n")) {
      if (line.startsWith(SENTINEL)) {
        currentIso = line.slice(SENTINEL.length);
        continue;
      }
      if (!line || !currentIso) continue;
      const resolved = path.resolve(repoRoot, line);
      if (wanted.has(resolved) && !cache.has(resolved)) {
        cache.set(resolved, currentIso);
      }
    }
  } catch {
    // git unavailable — leave cache empty, getLastModified will fsMtime per file
  }

  for (const a of wanted) {
    if (!cache.has(a)) cache.set(a, await fsMtime(a));
  }
}

async function fsMtime(file: string): Promise<string | null> {
  try {
    const s = await stat(file);
    return s.mtime.toISOString();
  } catch {
    return null;
  }
}
````

## File: packages/build-core/src/markdown.test.ts
````typescript
import { processMarkdown } from "./markdown.js";
import { describe, it, expect } from "bun:test";
import { writeFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

async function withTempMd(
  content: string,
  fn: (file: string) => Promise<void>,
) {
  const dir = await mkdtemp(path.join(tmpdir(), "md-test-"));
  const file = path.join(dir, "page.md");
  await writeFile(file, content, "utf-8");
  try {
    await fn(file);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

describe("processMarkdown", () => {
  it("extracts YAML frontmatter into meta", async () => {
    await withTempMd(
      `---
title: Hello
draft: true
---

Body content.`,
      async (file) => {
        const { meta } = await processMarkdown(file);
        expect(meta["title"]).toBe("Hello");
        expect(meta["draft"]).toBe(true);
      },
    );
  });

  it("renders body to HTML", async () => {
    await withTempMd(
      `---
title: x
---

# Heading

A **bold** word.`,
      async (file) => {
        const { html } = await processMarkdown(file);
        expect(html).toContain("<h1>Heading</h1>");
        expect(html).toContain("<strong>bold</strong>");
      },
    );
  });

  it("accepts custom remark plugins via [plugin, opts] tuple", async () => {
    const remarkSetTitle =
      () =>
      (tree: { type: string; children: { type: string; value: string }[] }) => {
        tree.children.unshift({ type: "text", value: "PREFIX:" });
      };
    await withTempMd(
      `---
title: x
---

body`,
      async (file) => {
        const { html } = await processMarkdown(file, {
          remarkPlugins: [remarkSetTitle as never],
        });
        expect(html).toContain("PREFIX:");
      },
    );
  });

  it("allows raw HTML inline (allowDangerousHtml)", async () => {
    await withTempMd(
      `---
title: x
---

<div class="custom">raw</div>`,
      async (file) => {
        const { html } = await processMarkdown(file);
        expect(html).toContain('<div class="custom">raw</div>');
      },
    );
  });
});
````

## File: packages/build-core/src/markdown.ts
````typescript
/**
 * Markdown processing via unified (remark + rehype).
 *
 * Used by `discoverPages` to load `.md` files alongside `.tsx` ones. The
 * frontmatter (YAML) becomes the page's `meta`; the body is rendered to
 * HTML through a configurable pipeline.
 *
 * Users plug their own remark/rehype plugins through the docs/blog config:
 *
 *     defineConfig({
 *       markdown: {
 *         remarkPlugins: [remarkGfm, remarkFrontmatter],
 *         rehypePlugins: [rehypeSlug, [rehypeShiki, { theme: "github-dark" }]],
 *       },
 *     });
 */
import grayMatter from "gray-matter";
import { readFile } from "node:fs/promises";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified, type Plugin, type Preset } from "unified";

/**
 * A unified-style plugin entry: a plugin function, or a tuple of
 * `[plugin, options]`. Same shape Astro / Next / Docusaurus accept.
 */
export type PluggableEntry = Plugin | Preset | [Plugin | Preset, ...unknown[]];

export interface MarkdownOptions {
  /** Extra remark plugins inserted before `remark-rehype`. */
  remarkPlugins?: ReadonlyArray<PluggableEntry>;
  /** Extra rehype plugins inserted before `rehype-stringify`. */
  rehypePlugins?: ReadonlyArray<PluggableEntry>;
}

export interface MarkdownResult {
  /** Rendered HTML — wrap with `raw(...)` before injecting in JSX. */
  html: string;
  /** Parsed frontmatter as a record. The caller validates the shape. */
  meta: Record<string, unknown>;
}

/**
 * Read a `.md` file, parse its YAML frontmatter and render its body to HTML.
 */
export async function processMarkdown(
  file: string,
  options: MarkdownOptions = {},
): Promise<MarkdownResult> {
  const raw = await readFile(file, "utf-8");
  const { data: meta, content } = grayMatter(raw);

  // Unified's typing forbids dynamic plugin lists at chain level — cast
  // through any once we leave the strongly-typed chain. Plugins are
  // user-supplied and validated at runtime by unified itself.
  // deno-lint-ignore no-explicit-any
  let processor: any = unified().use(remarkParse);
  for (const entry of options.remarkPlugins ?? []) {
    processor = applyPlugin(processor, entry);
  }
  processor = processor.use(remarkRehype, { allowDangerousHtml: true });
  for (const entry of options.rehypePlugins ?? []) {
    processor = applyPlugin(processor, entry);
  }
  processor = processor.use(rehypeStringify, { allowDangerousHtml: true });

  const result = await processor.process(content);
  return { html: String(result), meta };
}

function applyPlugin(processor: any, entry: PluggableEntry): any {
  if (Array.isArray(entry)) {
    const [plugin, ...opts] = entry;
    return processor.use(plugin, ...opts);
  }
  return processor.use(entry);
}
````

## File: packages/build-core/src/sitemap.ts
````typescript
/**
 * Sitemap + RSS generation. Both opt-in via `config.site` (the public origin
 * URL) — without it, neither file is produced (URLs need an origin).
 */
import type { PageMeta } from "./types.js";

export interface SitemapInput {
  pages: ReadonlyArray<{
    url: string;
    meta: PageMeta;
    lastUpdated: string | null;
  }>;
  /** Public origin (e.g. `"https://docs.example.com"`). Required. */
  site: string;
}

/** Generate a minimal sitemap.xml string. */
export function generateSitemap(input: SitemapInput): string {
  const { site, pages } = input;
  const origin = site.replace(/\/+$/, "");
  const entries = pages
    .filter((p) => !p.meta.draft)
    .map((p) => {
      const loc = origin + p.url;
      const lastmod = p.lastUpdated
        ? `<lastmod>${escapeXml(p.lastUpdated)}</lastmod>`
        : "";
      return `  <url><loc>${escapeXml(loc)}</loc>${lastmod}</url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
}

export interface RssInput {
  pages: ReadonlyArray<{
    url: string;
    meta: PageMeta;
    lastUpdated: string | null;
  }>;
  /** Public origin (e.g. `"https://docs.example.com"`). Required. */
  site: string;
  /** Channel title. Defaults to `"Documentation"`. */
  title?: string;
  /** Channel description. */
  description?: string;
  /** Optional language code (e.g. `"en-US"`). */
  language?: string;
}

/** Generate a minimal RSS 2.0 feed string. */
export function generateRss(input: RssInput): string {
  const {
    site,
    pages,
    title = "Documentation",
    description = "",
    language,
  } = input;
  const origin = site.replace(/\/+$/, "");
  const sorted = [...pages]
    .filter((p) => !p.meta.draft)
    .sort((a, b) => {
      const da = a.meta.publishedAt ?? a.lastUpdated ?? "";
      const db = b.meta.publishedAt ?? b.lastUpdated ?? "";
      return db.localeCompare(da);
    });

  const items = sorted
    .map((p) => {
      const link = origin + p.url;
      const pubDate = p.meta.publishedAt ?? p.lastUpdated;
      const dateLine = pubDate
        ? `      <pubDate>${escapeXml(new Date(pubDate).toUTCString())}</pubDate>`
        : "";
      const descLine = p.meta.description
        ? `      <description>${escapeXml(p.meta.description)}</description>`
        : "";
      return `    <item>
      <title>${escapeXml(p.meta.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
${dateLine}
${descLine}
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${escapeXml(origin)}</link>
    <description>${escapeXml(description)}</description>${language ? `\n    <language>${escapeXml(language)}</language>` : ""}
    <atom:link href="${escapeXml(origin + "/feed.xml")}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
````

## File: packages/build-core/package.json
````json
{
  "name": "@cjean-fr/build-core",
  "version": "0.1.0",
  "description": "Kernel for static-site builders on top of @cjean-fr/jsx-string. Shared by docs and blog distros.",
  "author": "Christophe Jean",
  "license": "MIT",
  "homepage": "https://github.com/cjean-fr/atelier/tree/main/packages/build-core#readme",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/cjean-fr/atelier.git",
    "directory": "packages/build-core"
  },
  "bugs": {
    "url": "https://github.com/cjean-fr/atelier/issues"
  },
  "keywords": [
    "static-site",
    "ssg",
    "build",
    "jsx",
    "vite",
    "kernel"
  ],
  "type": "module",
  "types": "./dist/index.d.ts",
  "engines": {
    "node": ">=24.0.0"
  },
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    },
    "./search": {
      "types": "./dist/search/index.d.ts",
      "default": "./dist/search/index.js"
    },
    "./search/builtin/client": {
      "default": "./dist/search/builtin/client.js"
    },
    "./vite": {
      "types": "./dist/vite.d.ts",
      "default": "./dist/vite.js"
    },
    "./cli": {
      "types": "./dist/cli/index.d.ts",
      "default": "./dist/cli/index.js"
    }
  },
  "publishConfig": {
    "access": "public"
  },
  "scripts": {
    "build": "vite build",
    "check": "tsc --noEmit",
    "format": "prettier --write \"**/*.{ts,tsx,json,md}\"",
    "test": "bun test"
  },
  "dependencies": {
    "@cjean-fr/jsx-string": "workspace:*",
    "@cjean-fr/jsx-flow": "workspace:*",
    "@cjean-fr/jsx-vite": "workspace:*",
    "gray-matter": "^4",
    "rehype-stringify": "^10",
    "remark-parse": "^11",
    "remark-rehype": "^11",
    "unified": "^11"
  },
  "devDependencies": {
    "@types/react": "catalog:",
    "@types/bun": "catalog:",
    "typescript": "catalog:",
    "vite": "catalog:",
    "vite-plugin-dts": "catalog:"
  },
  "peerDependencies": {
    "vite": "^8"
  },
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ]
}
````

## File: packages/build-core/README.md
````markdown
# @cjean-fr/build-core

> 🚧 Early development — version 0.1.0.

Kernel for static-site builders on top of [@cjean-fr/jsx-string](../jsx-string).
Shared by [@cjean-fr/docs](../../apps/docs) (documentation sites) and the
future `@cjean-fr/blog`.

You usually don't install this directly — pick a distro (`@cjean-fr/docs`,
`@cjean-fr/blog`) instead. Use this package only if you're building your
own distro.

## What it provides

- **Filesystem routing** — `discoverPages(config)` walks a pages directory,
  imports each module, normalizes `meta` + URL.
- **Sitemap + RSS** — `generateSitemap()`, `generateRss()` from page metadata.
- **Last modified** — `getLastModified(file)` / `preloadLastModified(files)` —
  batched `git log` lookup.
- **TOC injection** — `injectToc(html)` finds `<h2>`/`<h3>` and emits a
  table-of-contents fragment.
- **Search adapter contract** — `SearchAdapter` interface + bundled `builtin()`
  factory (substring index, JSON storage, tiny client).
- **Edit URL resolution** — `resolveEditUrl(template, file)`.

## What it does NOT provide

- A Layout, components, or theme — distros own that.
- A CLI binary — distros expose `docs build`, `blog build`, etc.
- A Vite plugin — currently lives in `@cjean-fr/docs`; extraction planned
  when the second distro emerges.

## License

MIT © Christophe Jean
````

## File: packages/build-core/tsconfig.json
````json
{
  "extends": "../typescript-config/base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src",
    "jsx": "react-jsx",
    "jsxImportSource": "@cjean-fr/jsx-string",
    "types": ["bun"]
  },
  "include": ["src/**/*"]
}
````

## File: packages/build-core/vite.config.ts
````typescript
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "@cjean-fr/jsx-string",
  },
  build: {
    target: "esnext",
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      entry: {
        index: path.resolve(__dirname, "src/index.ts"),
        vite: path.resolve(__dirname, "src/vite.ts"),
        "cli/index": path.resolve(__dirname, "src/cli/index.ts"),
        "search/index": path.resolve(__dirname, "src/search/index.ts"),
        "search/builtin/client": path.resolve(
          __dirname,
          "src/search/builtin/client.ts",
        ),
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        "@cjean-fr/jsx-string",
        "@cjean-fr/jsx-string/jsx-runtime",
        "@cjean-fr/jsx-flow",
        "@cjean-fr/jsx-vite",
        "vite",
        "gray-matter",
        "unified",
        "remark-parse",
        "remark-rehype",
        "rehype-stringify",
        /^node:/,
      ],
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "shared/[name]-[hash].js",
      },
    },
  },
  plugins: [
    dts({
      include: ["src/**/*"],
      entryRoot: "src",
    }),
  ],
});
````

## File: packages/docs/src/theme/main.css
````css
/*
 * @cjean-fr/docs — Tailwind 4 preset (source, compiled by the consumer).
 *
 * One-stop import for projects using Tailwind 4. Bundles the four things
 * the docs UI needs to function correctly:
 *
 *   1. `dark:` variant wired to the `.dark` class on <html> (so the
 *      built-in ThemeToggle button can switch modes — the Tailwind 4
 *      default reads `prefers-color-scheme` only).
 *   2. Theme tokens (CSS variables consumed by built-in components).
 *   3. Shiki multi-theme rules (lets code blocks react to dark/light).
 *   4. `@source` directives scanning the published JS bundles that carry
 *      class names — the rendered components (`index.js`), the runtime
 *      (`client.js`) and shared chunks — so the consumer's Tailwind
 *      generates the utility classes the built-in templates reference.
 *      The plugin/CLI bundles (`vite.js`, `cli/index.js`) hold no classes
 *      and are deliberately left out.
 *
 * This file ships as source: the consumer's `@tailwindcss/vite` compiles
 * it. Class names survive compilation, so `@source` points at the shipped
 * `dist/**` JS — no need to ship the component source.
 *
 * Usage:
 *
 *   @import "tailwindcss";
 *   @import "@cjean-fr/docs/main.css";
 */

@custom-variant dark (&:where(.dark, .dark *));

@import "./tokens.css";
@import "./shiki.css";
/* Prose + search-highlight rules. Layered as components so consumer
 * utilities still win over them. */
@import "./prose.css" layer(components);

@source "../../dist/index.js";
@source "../../dist/client.js";
@source "../../dist/shared/**/*.js";
````

## File: packages/docs/src/theme/prose.css
````css
/**
 * Markdown prose + search highlight — plain, token-driven CSS.
 *
 * Single source of truth for the `.docs-prose` / `.docs-search-active`
 * content classes the docs UI emits. Imported by `main.css` into
 * `@layer components`.
 *
 * Plain CSS (no `@apply`) — markdown content styling driven by the theme
 * tokens. Dark mode is keyed on the `.dark` class on <html>.
 */

.docs-prose {
  max-width: 42rem;
}
.docs-prose h1 {
  font-size: 1.875rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  margin-bottom: 0.5rem;
}
.docs-prose h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 2.5rem;
  margin-bottom: 0.75rem;
}
.docs-prose h3 {
  font-size: 1.125rem;
  font-weight: 500;
  margin-top: 2rem;
  margin-bottom: 0.5rem;
}
.docs-prose p {
  color: #4b5563;
  margin-bottom: 1rem;
  line-height: 1.625;
}
.docs-prose ul {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}
.docs-prose ol {
  list-style-type: decimal;
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}
.docs-prose li {
  color: #4b5563;
  margin-bottom: 0.25rem;
}
.docs-prose a {
  color: #2563eb;
  text-decoration: underline;
  text-underline-offset: 2px;
}
.docs-prose a:hover {
  color: #3b82f6;
}
.docs-prose strong {
  font-weight: 600;
}
.docs-prose em {
  font-style: italic;
}
/* Inline code only — `:not(.docs-code-block code)` keeps these prose rules
 * off the Shiki output rendered by <CodeBlock> / <CodeExample>, which owns
 * its own styling (see shiki.css). */
.docs-prose code:not(.docs-code-block code) {
  font-size: 0.875rem;
  background: #f3f4f6;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-family: var(--docs-font-mono);
}
/* Plain Markdown fences (```), not <CodeBlock>'s Shiki <pre>. */
.docs-prose pre:not(.docs-code-block pre) {
  margin-block: 1rem;
  overflow-x: auto;
  border-radius: 0.5rem;
  border: 1px solid var(--docs-code-border);
  padding: 1rem;
  font-size: 0.875rem;
  font-family: var(--docs-font-mono);
  line-height: 1.625;
  background: var(--docs-code-bg);
  color: var(--docs-code-text);
}
.docs-prose pre:not(.docs-code-block pre) code {
  background: transparent;
  padding: 0;
  border-radius: 0;
}
.docs-prose blockquote {
  border-left: 4px solid #e5e7eb;
  padding-left: 1rem;
  margin-block: 1rem;
  font-style: italic;
}
.docs-prose blockquote p {
  margin-bottom: 0;
}
.docs-prose hr {
  border-color: #e5e7eb;
  margin-block: 2rem;
}

.dark .docs-prose p,
.dark .docs-prose li {
  color: #9ca3af;
}
.dark .docs-prose a {
  color: #60a5fa;
}
.dark .docs-prose a:hover {
  color: #3b82f6;
}
.dark .docs-prose code:not(.docs-code-block code) {
  background: #1f2937;
}
.dark .docs-prose blockquote {
  border-left-color: #374151;
}
.dark .docs-prose hr {
  border-color: #1f2937;
}

/* Search result keyboard selection */
.docs-search-active {
  border-left-color: #3b82f6;
  background: #eff6ff;
}
.dark .docs-search-active {
  border-left-color: #60a5fa;
  background: #172554;
}
````

## File: packages/docs/src/mdx-components.ts
````typescript
/**
 * MDX component provider.
 *
 * Wired through the MDX plugin's `providerImportSource` option so `.mdx`
 * pages can use the built-in docs components (`<CodeExample>`, `<CodeBlock>`,
 * `<Tabs>`, `<Aside>`) without importing them in every file.
 *
 * MDX calls `useMDXComponents(props.components)` when building each page's
 * component map; we merge the built-ins under any runtime-provided overrides.
 * It's a plain object merge — no React context involved. Page-level `import`s
 * still take precedence, since those resolve via lexical scope, not this map.
 */
import { Aside } from "./components/Aside.js";
import { CodeBlock } from "./components/CodeBlock.js";
import { CodeExample } from "./components/CodeExample.js";
import { Tabs } from "./components/Tabs.js";

const base = { Aside, CodeBlock, CodeExample, Tabs };

export function useMDXComponents(
  components?: Readonly<Record<string, unknown>>,
): Record<string, unknown> {
  return { ...base, ...components };
}
````

## File: packages/eslint-plugin-jsx-string/src/rules/no-context.test.ts
````typescript
import { noContext } from "./no-context";
import * as parser from "@typescript-eslint/parser";
import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester({
  languageOptions: {
    parser,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
});

ruleTester.run("no-context", noContext, {
  valid: [
    "const Foo = createSomethingElse();",
    "const Foo = React.createSomethingElse();",
    "const ToastProvider = {}; <ToastProvider.Provider />;",
  ],
  invalid: [
    {
      code: "const Foo = createContext(); <Foo.Provider />;",
      errors: [{ messageId: "noContext" }, { messageId: "noContext" }],
    },
    {
      code: "const Foo = React.createContext(); <Foo.Provider />;",
      errors: [{ messageId: "noContext" }, { messageId: "noContext" }],
    },
    {
      code: "createContext();",
      errors: [{ messageId: "noContext" }],
    },
    {
      code: "React.createContext();",
      errors: [{ messageId: "noContext" }],
    },
  ],
});
````

## File: packages/eslint-plugin-jsx-string/src/rules/no-javascript-urls.test.ts
````typescript
import { noJavascriptUrls } from "./no-javascript-urls";
import * as parser from "@typescript-eslint/parser";
import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester({
  languageOptions: {
    parser,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
});

ruleTester.run("no-javascript-urls", noJavascriptUrls, {
  valid: [
    '<a href="/home">Home</a>',
    '<a href="https://example.com">Example</a>',
  ],
  invalid: [
    {
      code: '<a href="javascript:alert(1)">Click me</a>',
      errors: [{ messageId: "noJavascriptUrl" }],
    },
    {
      code: '<a href="JAVASCRIPT:void(0)">Click me</a>',
      errors: [{ messageId: "noJavascriptUrl" }],
    },
  ],
});
````

## File: packages/eslint-plugin-jsx-string/src/rules/no-react-hooks.test.ts
````typescript
import { noReactHooks } from "./no-react-hooks";
import * as parser from "@typescript-eslint/parser";
import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester({
  languageOptions: {
    parser,
  },
});

ruleTester.run("no-react-hooks", noReactHooks, {
  valid: ["const data = fetchData();", "function MyComp() { return null; }"],
  invalid: [
    {
      code: "const [state, setState] = useState(0);",
      errors: [{ messageId: "useState" }],
    },
    {
      code: "useEffect(() => {}, []);",
      errors: [{ messageId: "useEffect" }],
    },

    {
      code: "const ref = useRef();",
      errors: [{ messageId: "noHook", data: { name: "useRef" } }],
    },
  ],
});
````

## File: packages/eslint-plugin-jsx-string/src/rules/no-react-imports.test.ts
````typescript
import { noReactImports } from "./no-react-imports";
import * as parser from "@typescript-eslint/parser";
import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester({
  languageOptions: {
    parser,
  },
});

ruleTester.run("no-react-imports", noReactImports, {
  valid: [
    'import { renderToString } from "@cjean-fr/jsx-string";',
    'import fs from "fs";',
  ],
  invalid: [
    {
      code: 'import React from "react";',
      errors: [{ messageId: "noReactImport" }],
    },
    {
      code: 'import { useState } from "react";',
      errors: [{ messageId: "noReactImport" }],
    },
    {
      code: 'import ReactDOM from "react-dom";',
      errors: [{ messageId: "noReactImport" }],
    },
  ],
});
````

## File: packages/eslint-plugin-jsx-string/src/rules/no-unsafe-event-handlers.test.ts
````typescript
import { noUnsafeEventHandlers } from "./no-unsafe-event-handlers";
import * as parser from "@typescript-eslint/parser";
import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester({
  languageOptions: {
    parser,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
});

ruleTester.run("no-unsafe-event-handlers", noUnsafeEventHandlers, {
  valid: [
    '<button class="btn">Click me</button>',
    '<div data-onclick="none"></div>',
  ],
  invalid: [
    {
      code: "<button onClick={() => {}}>Click me</button>",
      errors: [{ messageId: "unsafeHandler" }],
    },
    {
      code: '<div onMouseOver="alert(1)"></div>',
      errors: [{ messageId: "unsafeHandler" }],
    },
  ],
});
````

## File: packages/eslint-plugin-jsx-string/.gitignore
````
node_modules
dist
.turbo
*.log
````

## File: packages/eslint-plugin-jsx-string/CHANGELOG.md
````markdown
# Changelog

## 0.1.0

### Added

- **Initial Release**: Basic rules to ensure compatibility with `@cjean-fr/jsx-string`.
  - `no-react-imports`: Disallow React and React-DOM imports.
  - `no-react-hooks`: Disallow React hooks usage.
  - `no-unsafe-event-handlers`: Warn about event handlers.
  - `no-javascript-urls`: Disallow `javascript:` URLs.
  - `no-context`: Disallow React Context usage.
  - `no-refs`: Disallow React refs usage.
- **Recommended Config**: Pre-configured rule set for easy setup.
````

## File: packages/eslint-plugin-jsx-string/LICENSE
````
MIT License

Copyright (c) 2026 Christophe Jean

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
````

## File: packages/eslint-plugin-jsx-string/tsconfig.json
````json
{
  "extends": "../typescript-config/base.json",
  "compilerOptions": {
    "module": "ESNext",
    "noEmit": false,
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
````

## File: packages/i18n-tiny/CHANGELOG.md
````markdown
# @cjean-fr/i18n-tiny

## 1.1.0

### Minor Changes

- add SKILL for AI agents
````

## File: packages/i18n-tiny/LICENSE
````
MIT License

Copyright (c) 2026 Christophe Jean

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
````

## File: packages/i18n-tiny/tsconfig.json
````json
{
  "extends": "../typescript-config/base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
````

## File: packages/jsx-flow/examples/streaming.tsx
````typescript
// @jsxImportSource @cjean-fr/jsx-string
/**
 * Demo: streaming SSR with the Native Declarative Partial Updates adapter
 *
 * Run: bun examples/streaming.tsx
 *
 * Open http://localhost:3080 — the shell loads instantly, then the slow
 * sections stream in as <template for="id"> elements that the browser
 * applies to the <?start name="id"> regions.
 *
 * Native in Chrome 130+. The MutationObserver polyfill below covers
 * other modern browsers.
 */
import { Island, renderToReadableStream, NativeAdapter } from "../src/index.js";

// Slow async components

async function SlowStats() {
  await Bun.sleep(800);
  return (
    <div class="stats">
      <strong>1 234</strong> users · <strong>56</strong> online
    </div>
  );
}

async function SlowFeed() {
  await Bun.sleep(1200);
  return (
    <ul>
      <li>Article published — 2 min ago</li>
      <li>New signup — 5 min ago</li>
      <li>Deploy succeeded — 12 min ago</li>
    </ul>
  );
}

// Shell

function Shell() {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>jsx-flow · streaming demo</title>
        {/* NativeAdapter injects its minimal polyfill automatically via transformShell. */}
        <style>{`
          body { font-family: sans-serif; max-width: 640px; margin: 2rem auto; padding: 0 1rem; }
          .placeholder { color: #aaa; font-style: italic; }
          .stats, ul { border: 1px solid #e5e7eb; border-radius: 8px; padding: 1rem; }
        `}</style>
      </head>
      <body>
        <h1>Dashboard</h1>

        <h2>Stats</h2>
        <Island fallback={<p class="placeholder">Loading stats…</p>}>
          {() => <SlowStats />}
        </Island>

        <h2>Activity feed</h2>
        <Island fallback={<p class="placeholder">Loading feed…</p>}>
          {() => <SlowFeed />}
        </Island>
      </body>
    </html>
  );
}

Bun.serve({
  port: 3080,
  async fetch() {
    const stream = await renderToReadableStream(() => <Shell />, NativeAdapter);
    return new Response(stream.pipeThrough(new TextEncoderStream()), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  },
});

console.log("Streaming demo → http://localhost:3080");
````

## File: packages/jsx-flow/src/components/Slot.tsx
````typescript
import { Flow } from "../context.js";
import { assertFragmentId } from "../fragmentId.js";
import { useContext, type JSXNode } from "@cjean-fr/jsx-string";

export interface SlotProps {
  /** DOM id for this slot — targeted by <Patch target={name}>. */
  name: string;
  /** Rendered in the shell until the slot is filled. Default: empty. */
  fallback?: JSXNode;
}

/**
 * Declares a named placeholder in the HTML shell without registering any
 * content. Unlike <Deferred>, Slot carries no factory — fill it later
 * with <Patch target={name}> or ctx.patch(name, factory).
 *
 * @example
 * // Shell
 * <Slot name="sidebar-widget" fallback={<Spinner />} />
 *
 * // Elsewhere in the same render (or in a separate streaming pass)
 * <Patch target="sidebar-widget">{() => <Widget />}</Patch>
 */
export function Slot({ name, fallback = null }: SlotProps): any {
  assertFragmentId(name, "Slot");
  const { config } = useContext(Flow);
  return config.adapter.Placeholder({
    id: name,
    src: null,
    children: fallback,
  });
}
````

## File: packages/jsx-flow/src/fragmentId.ts
````typescript
const FRAGMENT_ID = /^[a-zA-Z][a-zA-Z0-9_-]*$/;

// Validates that an id is safe for use as a DOM id, a CSS selector, and in
// raw HTML attributes like <?start name="id"> that bypass jsx-string escaping.
export function assertFragmentId(id: string, context: string): void {
  if (!FRAGMENT_ID.test(id)) {
    throw new Error(
      `${context}: "${id}" is not a valid fragment id. Use letters, digits, hyphens and underscores only, starting with a letter.`,
    );
  }
}
````

## File: packages/jsx-flow/src/streamFragments.tsx
````typescript
import type { PatchAdapter } from "./adapters.js";
import type { FragmentEffect } from "./context.js";
import { renderToString } from "@cjean-fr/jsx-string";

export async function streamFragments(
  fragments: Map<string, FragmentEffect>,
  adapter: PatchAdapter,
  callback: (id: string, html: string) => void | Promise<void>,
): Promise<void> {
  const pendings = [];
  for (const [id, entry] of fragments) {
    const run = async (): Promise<void> => {
      try {
        const html = await renderToString(
          adapter.Patch({ id, children: entry.factory(), merge: entry.merge }),
        );
        await callback(id, html);
      } catch (error) {
        console.error("Error rendering fragment", { id, error });
      }
    };
    pendings.push(run());
  }
  await Promise.allSettled(pendings);
}
````

## File: packages/jsx-flow/src/utils.ts
````typescript
/** Injects `content` immediately before the first `</head>` tag, or prepends if absent. */
export function injectIntoHead(html: string, content: string): string {
  return html.includes("</head>")
    ? html.replace("</head>", `${content}</head>`)
    : `${content}${html}`;
}
````

## File: packages/jsx-flow/tsconfig.json
````json
{
  "extends": "../../packages/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src",
    "jsx": "react-jsx",
    "jsxImportSource": "@cjean-fr/jsx-string"
  },
  "include": ["src/**/*"]
}
````

## File: packages/jsx-string/skills/jsx-string/evals/evals.json
````json
{
  "skill_name": "jsx-string",
  "evals": [
    {
      "id": 1,
      "prompt": "Create a complete production-ready email template for a user onboarding sequence. It should have: proper email HTML structure with preview text, branded header, personalized greeting using the user's name, HTML content area for rich content, a call-to-action button, and an unsubscribe link in the footer. Include proper inline styles for email client compatibility.",
      "expected_output": "A complete email template with all sections, proper email HTML structure, preview text for email clients, and responsive inline styles",
      "files": [],
      "expectations": [
        "Has email HTML structure (doctype, head, body)",
        "Includes preview text (hidden div)",
        "Has branded header with logo/title",
        "Personalized greeting with userName prop",
        "CTA button with proper styling",
        "Unsubscribe link in footer",
        "All using inline table-based layouts for email compatibility"
      ]
    },
    {
      "id": 2,
      "prompt": "Build a reusable Page layout component for a static site generator. It must include: SEO meta tags (title, description, og:image, canonical), a navigation bar that accepts menu items as props, a footer with social links, proper semantic HTML structure, and full TypeScript types. Then show how to use it with sample content.",
      "expected_output": "A reusable layout component with SEO, navigation, footer, and example usage showing how to compose pages",
      "files": [],
      "expectations": [
        "SEO component with all meta tags",
        "NavBar accepting array of {label, href} items",
        "Footer with links array prop",
        "TypeScript interfaces for all props",
        "Page layout using Fragment or composition",
        "Example usage demonstrating content composition"
      ]
    },
    {
      "id": 3,
      "prompt": "Create a secure form component with proper accessibility. Include: a FormField component that handles label, input type, error states with aria-invalid and role='alert', proper HTML structure, and inline error messages. Show how to compose multiple fields into a login form. Also demonstrate that XSS attempts in form values are safely escaped.",
      "expected_output": "Accessible form components with proper error handling and XSS demonstration",
      "files": [],
      "expectations": [
        "FormField with label, input, error props",
        "Accessibility attributes (htmlFor, aria-invalid, role='alert')",
        "Error state styling",
        "Composed form with multiple fields",
        "Demonstrates XSS escaping in values",
        "Shows escaped output for malicious input"
      ]
    },
    {
      "id": 4,
      "prompt": "Build a data table component with async data loading. The table should: fetch data asynchronously, render rows with async cell content, handle loading states, use proper HTML table semantics, and support nested async components. Show how this pattern enables server-side data fetching during rendering.",
      "expected_output": "Async data table with proper promise handling and table structure",
      "files": [],
      "expectations": [
        "Async component with fetch/await",
        "Proper table HTML structure (thead, tbody, tr, td)",
        "Row components as async functions",
        "Demonstrates nested async patterns",
        "Shows how async enables SSR data fetching"
      ]
    }
  ]
}
````

## File: packages/jsx-string/LICENSE
````
MIT License

Copyright (c) 2026 Christophe Jean

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
````

## File: packages/jsx-vite/tsconfig.json
````json
{
  "extends": "../../packages/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src",
    "jsx": "react-jsx",
    "jsxImportSource": "@cjean-fr/jsx-string"
  },
  "include": ["src/**/*"]
}
````

## File: packages/typescript-config/base.json
````json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "target": "ESNext",
    "lib": ["ESNext", "DOM"],
    "module": "preserve",
    "moduleDetection": "force",
    "allowJs": true,

    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "rewriteRelativeImportExtensions": true,
    "verbatimModuleSyntax": true,
    "isolatedModules": true,

    "noEmit": true,

    "skipLibCheck": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "forceConsistentCasingInFileNames": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noPropertyAccessFromIndexSignature": true,
    "erasableSyntaxOnly": true,

    "types": ["bun"]
  }
}
````

## File: .prettierignore
````
**/dist
**/node_modules
bun.lock
````

## File: LICENSE
````
MIT License

Copyright (c) 2026 Christophe Jean

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
````

## File: apps/jsx-string-doc/docs-src/styles/main.css
````css
@import "tailwindcss";
@import "@cjean-fr/docs/main.css";
````

## File: apps/jsx-string-doc/package.json
````json
{
  "name": "jsx-string-doc",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "node ./node_modules/@cjean-fr/docs/bin/docs.mjs dev",
    "build": "node ./node_modules/@cjean-fr/docs/bin/docs.mjs build",
    "preview": "vite preview --outDir dist",
    "test": "bun test docs-src"
  },
  "dependencies": {
    "@cjean-fr/jsx-string": "workspace:*",
    "@cjean-fr/jsx-flow": "workspace:*",
    "@cjean-fr/jsx-vite": "workspace:*",
    "@cjean-fr/docs": "workspace:*"
  },
  "devDependencies": {
    "@mdx-js/rollup": "^3.1.1",
    "@tailwindcss/vite": "catalog:",
    "@types/node": "catalog:",
    "remark-frontmatter": "^5.0.0",
    "remark-gfm": "^4.0.1",
    "remark-mdx-frontmatter": "^5.2.0",
    "tailwindcss": "catalog:",
    "typescript": "catalog:",
    "vite": "catalog:"
  }
}
````

## File: apps/jsx-string-doc/vite.config.ts
````typescript
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@mdx-js/rollup';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import remarkGfm from 'remark-gfm';

// The `@cjean-fr/docs` plugin is registered by the CLI (`docs dev` /
// `docs build`). Only project-specific plugins live here.
export default defineConfig({
  plugins: [
    // `.mdx` pages compile to jsx-string components — frontmatter is exposed
    // as the `meta` export the page loader reads.
    mdx({
      jsxImportSource: '@cjean-fr/jsx-string',
      // Built-in docs components are auto-provided — pages use <CodeExample>,
      // <Tabs>, etc. without importing them.
      providerImportSource: '@cjean-fr/docs/mdx-components',
      remarkPlugins: [
        remarkFrontmatter,
        [remarkMdxFrontmatter, { name: 'meta' }],
        remarkGfm,
      ],
    }),
    tailwindcss(),
  ],
  appType: 'custom',
  publicDir: 'public',
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: '@cjean-fr/jsx-string',
  },
  build: {
    outDir: 'dist/assets',
    assetsDir: '',
    manifest: true,
    rollupOptions: {
      input: 'docs-src/client.ts',
      output: {
        entryFileNames: '[name]-[hash].js',
        assetFileNames: '[name]-[hash][extname]',
      },
    },
  },
});
````

## File: packages/build-core/src/cli/build.ts
````typescript
import { buildSite, type BuildConfig, type RenderPageHook } from "../build.js";
import type { RenderTocHook } from "../toc.js";
import { loadDocsConfig } from "./loadConfig.js";
import path from "node:path";

/**
 * Orchestrate a full production build: `vite build` for client assets,
 * then the docs render pipeline driven by the distro's `renderPage` hook.
 *
 * A short-lived Vite dev server in middleware mode provides `ssrLoadModule`
 * for page discovery — lets the CLI run under plain `node` (npx) without
 * requiring a TS runtime.
 */
export async function runBuild<C extends BuildConfig>(
  cwd: string,
  hooks: { renderPage: RenderPageHook<C>; renderToc: RenderTocHook },
): Promise<void> {
  const { config, configPath } = await loadDocsConfig(cwd);
  console.log(
    `[@cjean-fr/build-core] using config ${path.relative(cwd, configPath)}`,
  );

  const vite = await import("vite");
  await vite.build({ root: cwd });

  const server = await vite.createServer({
    root: cwd,
    server: { middlewareMode: true },
    appType: "custom",
    logLevel: "silent",
  });
  try {
    const result = await buildSite(config as C, {
      renderPage: hooks.renderPage,
      renderToc: hooks.renderToc,
      loadPage: (file) => server.ssrLoadModule(file),
    });
    console.log(`Built ${result.pages.length} pages.`);
    if (result.searchBuilt) console.log("  ✓ search index");
    if (result.sitemapBuilt) console.log("  ✓ sitemap.xml");
    if (result.rssBuilt) console.log("  ✓ feed.xml");
  } finally {
    await server.close();
  }
}
````

## File: packages/build-core/src/cli/dev.ts
````typescript
import type { BuildConfig, RenderPageHook } from "../build.js";
import type { RenderTocHook } from "../toc.js";
import { createSitePlugin } from "../vite.js";
import type { Plugin } from "vite";

/**
 * Start a Vite dev server with the site plugin pre-registered.
 *
 * The user's `vite.config.ts` is honored for other plugins (Tailwind, etc.).
 * The distro provides its renderPage hook so the plugin knows how to wrap
 * pages in its Layout.
 */
export async function runDev<C extends BuildConfig>(
  cwd: string,
  hooks: { renderPage: RenderPageHook<C>; renderToc: RenderTocHook },
  options?: { port?: number },
): Promise<void> {
  const vite = await import("vite");
  const plugin = createSitePlugin<C>({
    renderPage: hooks.renderPage,
    renderToc: hooks.renderToc,
  });
  const server = await vite.createServer({
    root: cwd,
    server: options?.port ? { port: options.port } : undefined,
    plugins: [plugin as Plugin],
    appType: "custom",
  });
  await server.listen();
  server.printUrls();
}
````

## File: packages/build-core/src/cli/index.ts
````typescript
import type { BuildConfig, RenderPageHook } from "../build.js";
import type { RenderTocHook } from "../toc.js";
import { runBuild } from "./build.js";
import { runDev } from "./dev.js";

/**
 * Distro-supplied extension point. Each distro provides its `renderPage`
 * hook and may register extra commands (typically `init`) on top of the
 * core `build` and `dev`.
 */
export interface CliHooks<C extends BuildConfig> {
  renderPage: RenderPageHook<C>;
  /** TOC markup renderer (build and dev both need it). */
  renderToc: RenderTocHook;
  /** Extra commands (e.g. `init`). Keys are command names. */
  extraCommands?: Record<string, (argv: string[]) => Promise<void>>;
  /** Override the help banner. */
  usage?: string;
}

const DEFAULT_USAGE = `Usage:
  <bin> dev [--port N]   Start the dev server with HMR.
  <bin> build            Build the documentation site (vite build + render).
  <bin> --help           Show this message.
`;

/**
 * Generic CLI dispatcher. Distros call this from their bin entry, passing
 * their `renderPage` hook and any extra commands.
 *
 * @example
 * // apps/docs/bin/docs.mjs
 * import { run } from "@cjean-fr/build-core/cli";
 * import { renderPage } from "../dist/render-hook.js";
 * import { runInit } from "../dist/cli/init.js";
 * await run(process.argv.slice(2), {
 *   renderPage,
 *   extraCommands: { init: (argv) => runInit(process.cwd(), parseInitFlags(argv)) },
 * });
 */
export async function run<C extends BuildConfig>(
  argv: string[],
  hooks: CliHooks<C>,
): Promise<void> {
  const cmd = argv[0];
  const extras = hooks.extraCommands ?? {};

  switch (cmd) {
    case "build":
      await runBuild(process.cwd(), {
        renderPage: hooks.renderPage,
        renderToc: hooks.renderToc,
      });
      return;
    case "dev": {
      const port = parsePortFlag(argv.slice(1));
      await runDev(
        process.cwd(),
        { renderPage: hooks.renderPage, renderToc: hooks.renderToc },
        port !== undefined ? { port } : undefined,
      );
      return;
    }
    case undefined:
    case "-h":
    case "--help":
      process.stdout.write(hooks.usage ?? DEFAULT_USAGE);
      return;
    default:
      if (extras[cmd]) {
        await extras[cmd]!(argv.slice(1));
        return;
      }
      process.stderr.write(
        `Unknown command: ${cmd}\n\n${hooks.usage ?? DEFAULT_USAGE}`,
      );
      process.exitCode = 1;
  }
}

function parsePortFlag(rest: string[]): number | undefined {
  const i = rest.indexOf("--port");
  if (i === -1) return undefined;
  const raw = rest[i + 1];
  const n = raw ? Number(raw) : NaN;
  if (!Number.isInteger(n) || n <= 0 || n > 65535) {
    throw new Error(`--port expects an integer 1-65535, got "${raw}"`);
  }
  return n;
}
````

## File: packages/build-core/src/build.ts
````typescript
/**
 * Generic build orchestrator — discovers pages, renders each one via a
 * distro-provided `renderPage` hook, writes HTML, then runs the search
 * adapter, sitemap and RSS.
 *
 * Distros (docs, blog) build on top by supplying:
 *   - a config object (any shape extending BuildConfig)
 *   - a `renderPage(page, ctx)` hook that wraps the page in a Layout,
 *     populates distro context, returns the inner HTML string.
 */
import { resolveEditUrl } from "./editUrl.js";
import { getLastModified, preloadLastModified } from "./git.js";
import type { MarkdownOptions } from "./markdown.js";
import { discoverPages, type DiscoverOptions } from "./routing.js";
import { generateRss, generateSitemap } from "./sitemap.js";
import { injectToc, type RenderTocHook } from "./toc.js";
import type { CoreConfig, Page, PageMeta, SearchAdapter } from "./types.js";
import { renderToStatic } from "@cjean-fr/jsx-flow";
import type { StaticContext } from "@cjean-fr/jsx-flow";
import { loadViteManifest, setVite } from "@cjean-fr/jsx-vite";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

/** Build-time config — extends CoreConfig with the shared site fields. */
export interface BuildConfig extends CoreConfig {
  /** Site title (used as RSS feed title fallback). */
  title?: string;
  /** Site description (used as RSS feed description fallback). */
  description?: string;
  /** Public path prefix for assets (passed to Vite manifest). Default: `"/"`. */
  base?: string;
  /** Path to the Vite manifest, relative to project root. */
  viteManifest?: string;
  /** Edit-on-Git URL template with `{slug}` placeholder. */
  editUrl?: string | null;
  /** Public origin URL (e.g. `"https://docs.example.com"`). Enables sitemap+RSS. */
  site?: string | null;
  /** Generate sitemap.xml. Default: `true` when `site` is set. */
  sitemap?: boolean;
  /** Generate feed.xml. Default: `false`. */
  rss?: false | { title?: string; description?: string; language?: string };
  /** Search adapter — pass an adapter, or `false` to disable. */
  search?: SearchAdapter | false;
  /** Markdown pipeline plugins forwarded to `processMarkdown`. */
  markdown?: MarkdownOptions;
}

export interface BuildResult {
  pages: ReadonlyArray<{ url: string; outPath: string }>;
  searchBuilt: boolean;
  sitemapBuilt: boolean;
  rssBuilt: boolean;
}

/** Context passed to the distro's `renderPage` hook. */
export interface RenderPageContext<C = unknown> {
  /** The `renderToStatic` context, exposing `ctx.renderPage(() => node)`. */
  ctx: StaticContext;
  /** All discovered pages (post-routing). Useful for sidebar / navigation. */
  allPages: readonly Page[];
  /** ISO 8601 last-modified for the page (from meta.updatedAt or git). */
  lastUpdated: string | null;
  /** Resolved edit URL for this page, or null when not configured. */
  editUrl: string | null;
  /** The original config object the distro passed in. */
  config: C;
}

/**
 * Hook signature distros implement.
 *
 * Returns the inner HTML string for the page — without `<!DOCTYPE>` (the
 * orchestrator prepends it) and without TOC injection (the orchestrator
 * calls `injectToc` after).
 */
export type RenderPageHook<C = unknown> = (
  page: Page,
  context: RenderPageContext<C>,
) => Promise<string>;

export interface BuildOptions<C = unknown> extends DiscoverOptions {
  /** The distro's renderPage implementation. */
  renderPage: RenderPageHook<C>;
  /** The distro's TOC markup renderer (build-core stays presentation-free). */
  renderToc: RenderTocHook;
}

/**
 * Run a full production build.
 *
 * Requires `vite build` to have already run (manifest must exist on disk).
 */
export async function buildSite<C extends BuildConfig>(
  config: C,
  options: BuildOptions<C>,
): Promise<BuildResult> {
  // 1. Load Vite manifest (must exist — vite build runs first).
  const manifestPath = path.resolve(
    config.viteManifest ?? "dist/assets/.vite/manifest.json",
  );
  const manifest = await loadViteManifest(manifestPath);
  if (!manifest) {
    throw new Error(
      `[@cjean-fr/build-core] Vite manifest not found at ${manifestPath}. ` +
        `Run \`vite build\` before \`buildSite()\`.`,
    );
  }

  // 2. Discover pages (.tsx + .md).
  const allPages = await discoverPages(config, {
    loadPage: options.loadPage,
    markdown: config.markdown ?? options.markdown,
  });
  const buildable =
    process.env.NODE_ENV === "production"
      ? allPages.filter((p) => !p.meta.draft)
      : allPages;

  // 3. Batch git lookups in one process.
  await preloadLastModified(buildable.map((p) => p.file));

  // 4. Render every page in a shared renderToStatic scope.
  const written: Array<{ url: string; outPath: string }> = [];
  const rendered: Array<{ url: string; html: string; meta: PageMeta }> = [];
  const pageMetas: Array<{
    url: string;
    meta: PageMeta;
    lastUpdated: string | null;
  }> = [];

  await renderToStatic(async (ctx) => {
    setVite(manifest, { base: config.base ?? "/" });

    for (const page of buildable) {
      const lastUpdated =
        page.meta.updatedAt ?? (await getLastModified(page.file));
      const editUrl = resolveEditUrl(config.editUrl ?? null, page.file);

      const inner = await options.renderPage(page, {
        ctx,
        allPages: buildable,
        lastUpdated,
        editUrl,
        config,
      });
      const html = injectToc(inner, options.renderToc);
      const fullHtml = "<!DOCTYPE html>\n" + html;
      await mkdir(path.dirname(page.outPath), { recursive: true });
      await writeFile(page.outPath, fullHtml, "utf-8");

      written.push({ url: page.url, outPath: page.outPath });
      rendered.push({ url: page.url, html: fullHtml, meta: page.meta });
      pageMetas.push({ url: page.url, meta: page.meta, lastUpdated });
    }
  });

  // 5. Search adapter.
  let searchBuilt = false;
  if (config.search) {
    await config.search.build({ pages: rendered, outDir: config.out });
    searchBuilt = true;
  }

  // 6. Sitemap + RSS (require `site`).
  let sitemapBuilt = false;
  let rssBuilt = false;
  if (config.site) {
    if (config.sitemap !== false) {
      const xml = generateSitemap({ pages: pageMetas, site: config.site });
      await writeFile(path.join(config.out, "sitemap.xml"), xml, "utf-8");
      sitemapBuilt = true;
    }
    if (config.rss) {
      const rss = typeof config.rss === "object" ? config.rss : {};
      const xml = generateRss({
        pages: pageMetas,
        site: config.site,
        title: rss.title ?? config.title ?? "",
        description: rss.description ?? config.description,
        language: rss.language,
      });
      await writeFile(path.join(config.out, "feed.xml"), xml, "utf-8");
      rssBuilt = true;
    }
  }

  return { pages: written, searchBuilt, sitemapBuilt, rssBuilt };
}
````

## File: packages/build-core/src/index.ts
````typescript
/**
 * @cjean-fr/build-core — kernel for static-site builders on top of
 * @cjean-fr/jsx-string.
 *
 * Shared by `@cjean-fr/docs` (and future `@cjean-fr/blog`) distros. Provides
 * filesystem routing, git-based last-modified, sitemap/RSS, TOC injection,
 * edit-URL resolution, and the SearchAdapter contract.
 *
 * Distros build their opinionated UI (Layouts, components, themes) on top.
 *
 * @module
 */

// Routing
export { discoverPages, type DiscoverOptions } from "./routing.js";

// Page meta & types
export type {
  PageMeta,
  Page,
  CoreConfig,
  SearchAdapter,
  SearchBuildInput,
  SearchServeInput,
} from "./types.js";

// Git-based last modified
export { getLastModified, preloadLastModified } from "./git.js";

// Edit URL
export { resolveEditUrl } from "./editUrl.js";

// Sitemap + RSS
export {
  generateSitemap,
  generateRss,
  type SitemapInput,
  type RssInput,
} from "./sitemap.js";

// TOC injection
export {
  injectToc,
  slugify,
  type TocEntry,
  type RenderTocHook,
} from "./toc.js";

// Markdown processing
export {
  processMarkdown,
  type MarkdownOptions,
  type MarkdownResult,
  type PluggableEntry,
} from "./markdown.js";

// Build orchestrator
export {
  buildSite,
  type BuildConfig,
  type BuildOptions,
  type BuildResult,
  type RenderPageContext,
  type RenderPageHook,
} from "./build.js";
````

## File: packages/build-core/src/routing.ts
````typescript
/**
 * Filesystem-based page discovery.
 *
 * Walks `config.pages`, imports every `.tsx` / `.mdx` and processes every
 * `.md`, producing a normalized `Page[]` ready to be rendered.
 *
 * - `.tsx` / `.mdx` files: the default export is the component, `meta` export
 *   is the page metadata. (`.mdx` is compiled to a jsx-string component by the
 *   loader — e.g. the `@mdx-js/rollup` plugin in the user's Vite config —
 *   with frontmatter surfaced as the `meta` export.)
 * - `.md` files: YAML frontmatter is the meta, the body is rendered to HTML
 *   via the configured unified pipeline and wrapped in a tiny component
 *   that emits `raw(html)`.
 *
 * Build and dev share one code path: the build walks every file through
 * `loadPageFile`; the dev server resolves a single URL with `findPageFile`
 * and loads it through the same `loadPageFile`. No duplicated discovery.
 */
import { processMarkdown, type MarkdownOptions } from "./markdown.js";
import type { CoreConfig, Page, PageMeta } from "./types.js";
import { raw } from "@cjean-fr/jsx-string";
import { existsSync } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

/** Recognized page file extensions, in resolution-priority order. */
export const PAGE_EXTENSIONS = [".tsx", ".mdx", ".md"] as const;

export interface DiscoverOptions {
  /**
   * Module loader for a `.tsx` / `.mdx` page file. Defaults to Node's native
   * dynamic `import()` — fine when the runtime understands TS (Bun, ts-node,
   * …). The CLI overrides this with `viteDevServer.ssrLoadModule` so plain
   * `node`/`npx` can load `.tsx` / `.mdx` files without an extra runtime.
   */
  loadPage?: (file: string) => Promise<Record<string, unknown>>;

  /** Pipeline options forwarded to `processMarkdown`. */
  markdown?: MarkdownOptions;
}

type PageLoader = NonNullable<DiscoverOptions["loadPage"]>;

const defaultLoad: PageLoader = (file) =>
  import(/* @vite-ignore */ pathToFileURL(file).href);

/**
 * Recursively discover all pages under `config.pages` and return a normalized
 * list. Drafts are kept by default — the caller (build) decides whether to
 * skip them.
 */
export async function discoverPages(
  config: CoreConfig,
  options: DiscoverOptions = {},
): Promise<Page[]> {
  const pagesDir = path.resolve(config.pages);
  const found = await walk(pagesDir);
  const pages: Page[] = [];
  for (const file of found) {
    pages.push(await loadPageFile(file, config, options));
  }
  // Stable ordering: by URL, so the order of build output is deterministic.
  pages.sort((a, b) => a.url.localeCompare(b.url));
  return pages;
}

/**
 * Load a single page file into a normalized `Page`. Dispatches on extension:
 * `.md` runs the markdown pipeline; `.tsx` / `.mdx` are imported as modules.
 * Shared by `discoverPages` (build, every file) and the dev server (one file
 * per request) so the two never drift.
 */
export async function loadPageFile(
  file: string,
  config: CoreConfig,
  options: DiscoverOptions = {},
): Promise<Page> {
  const pagesDir = path.resolve(config.pages);
  const rel = path.relative(pagesDir, file).replace(/\\/g, "/");
  return file.endsWith(".md")
    ? loadMarkdownPage(file, rel, config, options.markdown)
    : loadModulePage(file, rel, config, options.loadPage ?? defaultLoad);
}

/**
 * Resolve the page file backing a URL (dev server on-demand lookup). Tries
 * `<route><ext>` then `<route>/index<ext>` for each known extension; returns
 * the first that exists, or `null`.
 */
export function findPageFile(config: CoreConfig, url: string): string | null {
  const pagesDir = path.resolve(config.pages);
  let route = url.replace(/^\//, "") || "index";
  if (route.endsWith(".html")) route = route.slice(0, -".html".length);
  if (route.endsWith("/")) route = route + "index";
  for (const base of [route, `${route}/index`]) {
    for (const ext of PAGE_EXTENSIONS) {
      const candidate = path.join(pagesDir, base + ext);
      if (existsSync(candidate)) return candidate;
    }
  }
  return null;
}

async function loadModulePage(
  file: string,
  rel: string,
  config: CoreConfig,
  load: PageLoader,
): Promise<Page> {
  const route = rel.replace(/\.(tsx|mdx)$/, "");
  const mod = await load(file);
  const Component = mod["default"];
  if (typeof Component !== "function") {
    throw new Error(
      `[@cjean-fr/build-core] ${rel} has no default export, or the default export is not a function.`,
    );
  }
  const meta = normalizeMeta(mod["meta"], rel);
  const url = meta.slug ?? routeToUrl(route);
  return {
    url,
    file,
    outPath: path.join(config.out, urlToOutPath(url)),
    format: file.endsWith(".mdx") ? "mdx" : "tsx",
    meta,
    Component: Component as Page["Component"],
  };
}

async function loadMarkdownPage(
  file: string,
  rel: string,
  config: CoreConfig,
  mdOptions: MarkdownOptions | undefined,
): Promise<Page> {
  const route = rel.replace(/\.md$/, "");
  const { html, meta: rawMeta } = await processMarkdown(file, mdOptions);
  const meta = normalizeMeta(rawMeta, rel);
  const url = meta.slug ?? routeToUrl(route);
  const rendered = raw(html);
  return {
    url,
    file,
    outPath: path.join(config.out, urlToOutPath(url)),
    format: "md",
    meta,
    Component: () => rendered,
  };
}

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  if (!existsSync(dir)) return out;
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walk(fullPath)));
    } else if (
      entry.isFile() &&
      PAGE_EXTENSIONS.some((ext) => entry.name.endsWith(ext))
    ) {
      out.push(fullPath);
    }
  }
  return out;
}

function normalizeMeta(raw: unknown, file: string): PageMeta {
  if (raw == null) {
    throw new Error(
      `[@cjean-fr/build-core] ${file} is missing the required \`meta\` (TSX) or frontmatter (Markdown). ` +
        `Add at least \`title: "…"\`.`,
    );
  }
  if (typeof raw !== "object") {
    throw new Error(
      `[@cjean-fr/build-core] ${file}: \`meta\` must be an object.`,
    );
  }
  const meta = raw as PageMeta;
  if (typeof meta.title !== "string" || meta.title.length === 0) {
    throw new Error(
      `[@cjean-fr/build-core] ${file}: \`title\` is required and must be a non-empty string.`,
    );
  }
  return meta;
}

/**
 * Convert a filesystem route to a URL.
 * - `index` → `/`
 * - `guide/installation` → `/guide/installation`
 * - `guide/index` → `/guide` (directory index)
 */
export function routeToUrl(route: string): string {
  if (route === "index") return "/";
  if (route.endsWith("/index")) return "/" + route.slice(0, -"/index".length);
  return "/" + route;
}

/** Map a URL back to an output file path under `config.out`. */
function urlToOutPath(url: string): string {
  if (url === "/") return "index.html";
  return url.replace(/^\//, "") + ".html";
}
````

## File: packages/build-core/src/toc.ts
````typescript
/**
 * Auto Table of Contents from `<h2>` / `<h3>` headings.
 *
 * Post-render mechanics only — no presentation. This module finds headings,
 * assigns slugified IDs to those missing one, collects the entries, and
 * replaces the `<TableOfContents />` placeholder with markup the distro
 * supplies via the `renderToc` hook. Headings keep their original IDs when
 * present.
 *
 * The placeholder uses `<aside data-toc-placeholder></aside>` — the stable
 * selector emitted by the distro's `<TableOfContents />`. Build and dev both
 * call `injectToc()`.
 */

export interface TocEntry {
  /** Heading level: 2 or 3. */
  level: 2 | 3;
  /** Slug (used as `id` attribute and href anchor). */
  id: string;
  /** Plain-text heading content (HTML tags stripped). */
  text: string;
}

/**
 * Distro-supplied renderer turning the collected entries into TOC markup.
 * build-core stays presentation-free; the distro owns the classes/HTML.
 */
export type RenderTocHook = (entries: readonly TocEntry[]) => string;

const PLACEHOLDER = /<aside data-toc-placeholder><\/aside>/;

/** Slugify a heading text into an HTML id (lowercase, alphanumeric + dashes). */
export function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/<[^>]+>/g, "") // strip any inline tags
      .replace(/&[a-z]+;/g, " ") // decode entities loosely
      .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "section"
  );
}

/**
 * Post-process rendered HTML:
 * 1. Find every `<h2>` / `<h3>` and assign a slugified `id` if missing.
 * 2. Collect a TOC.
 * 3. Replace the `<TableOfContents />` placeholder with the markup returned by
 *    `renderToc(entries)`. Returns HTML unchanged when no placeholder is found
 *    or there are no headings.
 */
export function injectToc(html: string, renderToc: RenderTocHook): string {
  // Track ids already used so we don't emit duplicates.
  const used = new Set<string>();
  // Pre-scan existing ids so user-set IDs aren't accidentally reused.
  for (const match of html.matchAll(/<h[23][^>]*\bid="([^"]+)"/g)) {
    used.add(match[1]!);
  }

  const entries: TocEntry[] = [];

  const withIds = html.replace(
    /<h([23])(\b[^>]*)>([\s\S]*?)<\/h\1>/g,
    (_match, levelStr: string, attrs: string, inner: string) => {
      const level = (levelStr === "2" ? 2 : 3) as 2 | 3;
      const text = stripTags(inner).trim();
      if (!text) return _match;

      const existingId = attrs.match(/\bid="([^"]+)"/)?.[1];
      let id: string;
      let nextAttrs = attrs;
      if (existingId) {
        id = existingId;
      } else {
        id = unique(slugify(text), used);
        used.add(id);
        nextAttrs = `${attrs} id="${id}"`;
      }
      entries.push({ level, id, text });
      return `<h${levelStr}${nextAttrs}>${inner}</h${levelStr}>`;
    },
  );

  if (!PLACEHOLDER.test(withIds)) return withIds;

  const tocHtml = entries.length === 0 ? "" : renderToc(entries);
  return withIds.replace(PLACEHOLDER, tocHtml);
}

function unique(base: string, used: Set<string>): string {
  if (!used.has(base)) return base;
  let i = 2;
  while (used.has(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, "");
}
````

## File: packages/build-core/src/types.ts
````typescript
/**
 * Kernel-level types shared by all distros (docs, blog, …).
 *
 * Each distro extends these (via `interface extends PageMeta`) with its own
 * fields — `sidebar` and `layout` for docs, `tags`/`author`/`coverImage` for
 * blog, etc. The kernel never reads distro-specific fields.
 */
import type { JSXNode } from "@cjean-fr/jsx-string";

// ─────────────────────────────────────────────────────────────────────────────
// Page metadata — base shape every page must provide
// ─────────────────────────────────────────────────────────────────────────────

export interface PageMeta {
  /** Required. Used as `<title>`, default h1, default sidebar label. */
  title: string;

  /** Used as `<meta name="description">` and SEO. */
  description?: string;

  /** Override the URL. Defaults to the file path under `pages/`. */
  slug?: string;

  /** Excluded from production build; still visible in dev. */
  draft?: boolean;

  /** ISO 8601 publication date (used by sitemap / RSS). */
  publishedAt?: string;

  /** ISO 8601 last-update date (used by `<lastmod>` and `Last updated:`). */
  updatedAt?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Routing / build orchestration
// ─────────────────────────────────────────────────────────────────────────────

/** Minimal config the kernel needs — distros wrap this with their own fields. */
export interface CoreConfig {
  /** Directory containing page files (relative to project root). */
  pages: string;
  /** Output directory for built HTML files. */
  out: string;
}

/** Source format a page was authored in. */
export type PageFormat = "tsx" | "mdx" | "md";

/** A discovered page (post-routing). */
export interface Page {
  /** Canonical URL (e.g. `/guide/installation`). */
  url: string;
  /** Page file path on disk (absolute). */
  file: string;
  /** Disk output path (absolute, .html). */
  outPath: string;
  /**
   * Source format. `"md"` / `"mdx"` are markdown-authored (distros typically
   * wrap them in a prose container); `"tsx"` is a hand-authored component.
   */
  format: PageFormat;
  /** Imported meta from the file. */
  meta: PageMeta;
  /** The default export from the file. */
  Component: (props: object) => JSXNode;
}

// ─────────────────────────────────────────────────────────────────────────────
// Search adapter contract
// ─────────────────────────────────────────────────────────────────────────────

export interface SearchAdapter {
  /** Adapter identifier — appears in dev logs and as a cache key. */
  name: string;

  /**
   * Build-time hook. Receives the rendered pages and the output directory
   * where the adapter writes whatever artifacts its client runtime needs.
   */
  build(input: SearchBuildInput): Promise<void>;

  /**
   * Optional dev-server hook. Returns a Response for paths the adapter owns,
   * `null` otherwise.
   */
  serve?(input: SearchServeInput): Promise<Response | null>;

  /**
   * Module specifier of the ESM client script that wires the search trigger
   * to this adapter at runtime. Resolved by Vite — relative or package import.
   */
  clientEntry: string;

  /** Optional extra `<head>` tags (preload hints, external runtimes). */
  headTags?(): JSXNode;
}

export interface SearchBuildInput {
  pages: ReadonlyArray<{
    url: string;
    html: string;
    meta: PageMeta;
  }>;
  outDir: string;
}

export interface SearchServeInput {
  url: URL;
  /** Returns the same pages snapshot as `build()` would receive. */
  pages: () => Promise<SearchBuildInput["pages"]>;
}
````

## File: packages/build-core/src/vite.ts
````typescript
/**
 * Generic Vite dev plugin — intercepts HTTP requests, finds the matching
 * page file (`.tsx` / `.mdx` / `.md`), loads it via `ssrLoadModule`, and
 * renders it through the distro-provided `renderPage` hook.
 *
 * Page discovery/loading is shared with the production build: this plugin
 * resolves a URL with `findPageFile` and loads it with `loadPageFile`, and
 * lists all pages with `discoverPages` — the same functions the build uses.
 *
 * Distros (docs, blog) wrap this with their own factory that supplies the
 * hook (setting up Layout, context, sidebar, etc.).
 */
import type { BuildConfig, RenderPageHook } from "./build.js";
import { resolveEditUrl } from "./editUrl.js";
import {
  discoverPages,
  findPageFile,
  loadPageFile,
  type DiscoverOptions,
} from "./routing.js";
import { injectToc, type RenderTocHook } from "./toc.js";
import type { PageMeta } from "./types.js";
import { renderToStatic } from "@cjean-fr/jsx-flow";
import { setVite } from "@cjean-fr/jsx-vite";
import path from "node:path";
import type { Plugin, ViteDevServer } from "vite";

export interface VitePluginOptions<C extends BuildConfig> {
  /** Path to the user's config file, relative to project root. Default: `"./docs.config.ts"`. */
  configFile?: string;
  /** Distro's renderPage implementation — same shape as build's. */
  renderPage: RenderPageHook<C>;
  /** Distro's TOC markup renderer — same shape as build's. */
  renderToc: RenderTocHook;
}

export function createSitePlugin<C extends BuildConfig>(
  options: VitePluginOptions<C>,
): Plugin {
  const configFile = options.configFile ?? "./docs.config.ts";
  let server: ViteDevServer | null = null;
  let configPromise: Promise<C> | null = null;

  const loadConfig = (): Promise<C> => {
    if (!server) {
      throw new Error("[@cjean-fr/build-core] Vite server not yet configured.");
    }
    if (!configPromise) {
      const absPath = path.resolve(server.config.root, configFile);
      configPromise = server.ssrLoadModule(absPath).then((mod) => {
        if (!mod["default"]) {
          throw new Error(
            `[@cjean-fr/build-core] ${configFile} must \`export default defineConfig({ ... })\`.`,
          );
        }
        return mod["default"] as C;
      });
    }
    return configPromise;
  };

  return {
    name: "@cjean-fr/build-core",

    async configureServer(devServer) {
      server = devServer;

      devServer.middlewares.use((req, res, next) => {
        const url = (req.url ?? "/").split("?")[0]!;

        Promise.resolve()
          .then(() => loadConfig())
          .then(async (config) => {
            // 1. Delegate search routes if the adapter handles them.
            if (config.search && config.search.serve) {
              const result = await config.search.serve({
                url: new URL(url, "http://localhost"),
                pages: () =>
                  collectRenderedPages(
                    devServer,
                    config,
                    options.renderPage,
                    options.renderToc,
                  ),
              });
              if (result) {
                respondWith(res, result);
                return;
              }
            }

            // 2. Skip non-HTML requests (assets, etc.).
            if (url.includes(".") && !url.endsWith(".html")) {
              next();
              return;
            }
            const file = findPageFile(config, url);
            if (!file) {
              next();
              return;
            }

            const html = await renderOne(
              devServer,
              config,
              file,
              options.renderPage,
              options.renderToc,
            );
            const transformed = await devServer.transformIndexHtml(
              url,
              "<!DOCTYPE html>\n" + html,
            );
            res.setHeader("Content-Type", "text/html; charset=utf-8");
            res.end(transformed);
          })
          .catch((err) => {
            devServer.config.logger.error(String(err));
            next(err);
          });
      });
    },

    handleHotUpdate({ file, server: devServer }) {
      const root = devServer.config.root;
      if (file === path.resolve(root, configFile)) {
        configPromise = null;
        devServer.ws.send({ type: "full-reload" });
        return [];
      }
      if (
        file.startsWith(root) &&
        !file.includes(`${path.sep}dist${path.sep}`)
      ) {
        devServer.ws.send({ type: "full-reload" });
      }
      return [];
    },
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Discover options that route page loading through Vite's SSR module graph. */
function devLoadOptions(
  devServer: ViteDevServer,
  config: BuildConfig,
): DiscoverOptions {
  return {
    loadPage: (file) => devServer.ssrLoadModule(file),
    markdown: config.markdown,
  };
}

async function renderOne<C extends BuildConfig>(
  devServer: ViteDevServer,
  config: C,
  file: string,
  renderPage: RenderPageHook<C>,
  renderToc: RenderTocHook,
): Promise<string> {
  const opts = devLoadOptions(devServer, config);
  const page = await loadPageFile(file, config, opts);
  const allPages = await discoverPages(config, opts);

  const lastUpdated = page.meta.updatedAt ?? null;
  const editUrl = resolveEditUrl(
    config.editUrl ?? null,
    path.relative(devServer.config.root, page.file),
  );

  const inner = await renderToStatic(async (ctx) => {
    setVite(null);
    return renderPage(page, { ctx, allPages, lastUpdated, editUrl, config });
  });
  return injectToc(inner, renderToc);
}

async function collectRenderedPages<C extends BuildConfig>(
  devServer: ViteDevServer,
  config: C,
  renderPage: RenderPageHook<C>,
  renderToc: RenderTocHook,
): Promise<ReadonlyArray<{ url: string; html: string; meta: PageMeta }>> {
  const pages = await discoverPages(config, devLoadOptions(devServer, config));
  const out: Array<{ url: string; html: string; meta: PageMeta }> = [];
  for (const page of pages) {
    const html = await renderOne(
      devServer,
      config,
      page.file,
      renderPage,
      renderToc,
    );
    out.push({
      url: page.url,
      html: "<!DOCTYPE html>\n" + html,
      meta: page.meta,
    });
  }
  return out;
}

function respondWith(
  res: import("node:http").ServerResponse,
  response: Response,
): void {
  res.statusCode = response.status;
  response.headers.forEach((value, key) => res.setHeader(key, value));
  response.text().then((body) => res.end(body));
}
````

## File: packages/docs/bin/docs.mjs
````javascript
#!/usr/bin/env node

// Silence DEP0205 emitted by @tailwindcss/node (still uses
// `module.register()`). Drop only this specific code so genuine warnings
// from elsewhere keep surfacing.
const originalEmit = process.emit;
process.emit = function (name, data, ...rest) {
  if (name === "warning" && data && data.code === "DEP0205") return false;
  return originalEmit.call(this, name, data, ...rest);
};

const { run } = await import("../dist/cli/index.js");

run(process.argv.slice(2)).catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
````

## File: packages/docs/src/tabs/client.ts
````typescript
/**
 * Tabs behaviour: tab click → switch panel + persist + cross-sync.
 *
 * Each `<Tabs>` container has either `data-docs-tabs` (local) or
 * `data-docs-tabs-sync="<key>"` (synced). When a synced tabs group is
 * activated, the script also activates the panel with the same label on
 * every other group sharing the key, and stores the label in
 * `localStorage["docs-tabs-sync:<key>"]`.
 *
 * On page load, synced groups restore their persisted label.
 */

const STORAGE_PREFIX = "docs-tabs-sync:";

function activate(container: Element, index: number): void {
  const buttons = Array.from(
    container.querySelectorAll<HTMLButtonElement>("[data-docs-tab-target]"),
  );
  const panels = Array.from(
    container.querySelectorAll<HTMLElement>("[data-docs-tab-panel]"),
  );
  buttons.forEach((btn, i) => {
    const active = i === index;
    btn.setAttribute("aria-selected", active ? "true" : "false");
    btn.classList.toggle("docs-tabs-tab-active", active);
    btn.classList.toggle("border-blue-500", active);
    btn.classList.toggle("text-blue-600", active);
    btn.classList.toggle("dark:text-blue-400", active);
    btn.classList.toggle("border-transparent", !active);
    btn.classList.toggle("text-gray-600", !active);
    btn.classList.toggle("dark:text-gray-400", !active);
  });
  panels.forEach((panel, i) => {
    panel.toggleAttribute("hidden", i !== index);
  });
}

function activateByLabel(container: Element, label: string): boolean {
  const buttons = Array.from(
    container.querySelectorAll<HTMLButtonElement>("[data-docs-tab-target]"),
  );
  const idx = buttons.findIndex((b) => b.dataset["docsTabLabel"] === label);
  if (idx === -1) return false;
  activate(container, idx);
  return true;
}

// Click handler.
document.addEventListener("click", (e) => {
  const target = e.target as Element | null;
  const btn = target?.closest<HTMLButtonElement>("[data-docs-tab-target]");
  if (!btn) return;
  const container = btn.closest(".docs-tabs");
  if (!container) return;
  const idx = Number(btn.dataset["docsTabTarget"]);
  if (Number.isNaN(idx)) return;
  activate(container, idx);

  // Sync across other groups with the same key.
  const syncKey = container.getAttribute("data-docs-tabs-sync");
  const label = btn.dataset["docsTabLabel"];
  if (syncKey && label) {
    try {
      localStorage.setItem(STORAGE_PREFIX + syncKey, label);
    } catch {
      // Ignore.
    }
    for (const other of document.querySelectorAll(
      `[data-docs-tabs-sync="${cssEscape(syncKey)}"]`,
    )) {
      if (other === container) continue;
      activateByLabel(other, label);
    }
  }
});

// Restore persisted choices on load.
for (const container of document.querySelectorAll("[data-docs-tabs-sync]")) {
  const syncKey = container.getAttribute("data-docs-tabs-sync");
  if (!syncKey) continue;
  let stored: string | null = null;
  try {
    stored = localStorage.getItem(STORAGE_PREFIX + syncKey);
  } catch {
    // Ignore.
  }
  if (stored) activateByLabel(container, stored);
}

function cssEscape(s: string): string {
  if (typeof CSS !== "undefined" && CSS.escape) return CSS.escape(s);
  return s.replace(/["\\]/g, "\\$&");
}

export {};
````

## File: packages/docs/src/theme/client.ts
````typescript
/**
 * Click handler for the `<ThemeToggle>` button.
 *
 * Uses event delegation on `document` so any number of toggle buttons on the
 * page just work. Persists the explicit choice in `localStorage["docs-theme"]`.
 */

document.addEventListener("click", (e) => {
  const target = e.target as Element | null;
  const btn = target?.closest("[data-docs-theme-toggle]");
  if (!btn) return;

  const html = document.documentElement;
  const nextDark = !html.classList.contains("dark");
  html.classList.toggle("dark", nextDark);
  try {
    localStorage.setItem("docs-theme", nextDark ? "dark" : "light");
  } catch {
    // localStorage may be unavailable (e.g. private mode w/ strict settings).
  }
});

export {};
````

## File: packages/docs/src/theme/shiki.css
````css
/**
 * Shiki multi-theme switching. Always needed when CodeBlock is rendered with
 * Shiki — Tailwind has no equivalent.
 *
 * Shiki emits each token with `--shiki-light` / `--shiki-dark` CSS vars
 * (config: `defaultColor: false`). We pick which one to display based on
 * the `dark` class on <html>.
 */

.shiki,
.shiki span {
  color: var(--shiki-light);
  background-color: var(--shiki-light-bg);
}

html.dark .shiki,
html.dark .shiki span {
  color: var(--shiki-dark);
  background-color: var(--shiki-dark-bg);
}

.docs-code-block .shiki {
  font-family: var(--docs-font-mono, ui-monospace, monospace);
  overflow-x: auto;
  border-radius: 0.5rem;
  padding: 1rem;
  font-size: 0.875rem;
  line-height: 1.6;
}
````

## File: packages/docs/src/renderHook.tsx
````typescript
/**
 * Docs-distro `renderPage` hook — wraps a page in the configured Layout,
 * populates the `DocsContext`, computes the sidebar.
 *
 * Used by both the build pipeline and the Vite dev plugin (same shape).
 */
import { setDocs } from "./context.js";
import { resolveSidebar } from "./sidebar.js";
import type { PageMeta, ResolvedDocsConfig } from "./types.js";
import type { RenderPageHook } from "@cjean-fr/build-core";

export const renderPage: RenderPageHook<ResolvedDocsConfig> = (
  page,
  { ctx, allPages, lastUpdated, editUrl, config },
) => {
  const meta = page.meta as PageMeta;
  const sidebar = resolveSidebar(
    allPages as readonly ((typeof allPages)[number] & { meta: PageMeta })[],
    config.sidebar,
    page.url,
  );

  setDocs({
    config,
    currentPage: page.url,
    meta,
    sidebar,
    lastUpdated,
    editUrl,
  });

  const LayoutChoice =
    meta.layout === false ? null : (meta.layout ?? config.components.Layout);
  const rawInner = page.Component({});
  // Markdown-authored pages (.md / .mdx) get wrapped in the prose container;
  // hand-authored .tsx pages style themselves. `format` comes from build-core,
  // which already knows how each page was loaded.
  const inner =
    page.format === "tsx" ? rawInner : <div class="docs-prose">{rawInner}</div>;
  return ctx.renderPage(() =>
    LayoutChoice === null ? inner : LayoutChoice({ children: inner }),
  );
};
````

## File: packages/docs/tsconfig.json
````json
{
  "extends": "../../packages/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src",
    "jsx": "react-jsx",
    "jsxImportSource": "@cjean-fr/jsx-string",
    "types": ["bun"]
  },
  "include": ["src/**/*"]
}
````

## File: packages/eslint-plugin-jsx-string/src/rules/no-javascript-urls.ts
````typescript
import { ESLintUtils } from "@typescript-eslint/utils";

export const noJavascriptUrls = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    type: "problem",
    docs: {
      description: "Disallow javascript: URLs in href attributes.",
    },

    schema: [],
    messages: {
      noJavascriptUrl: "javascript: URLs are not allowed for security reasons.",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXAttribute(node) {
        if (
          node.name.type === "JSXIdentifier" &&
          node.name.name === "href" &&
          node.value?.type === "Literal" &&
          typeof node.value.value === "string" &&
          node.value.value.toLowerCase().startsWith("javascript:")
        ) {
          context.report({
            node,
            messageId: "noJavascriptUrl",
          });
        }
      },
    };
  },
});
````

## File: packages/eslint-plugin-jsx-string/src/rules/no-react-hooks.ts
````typescript
import { ESLintUtils } from "@typescript-eslint/utils";

export const noReactHooks = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    type: "problem",
    docs: {
      description: "Disallow React hooks usage.",
    },

    schema: [],
    messages: {
      noHook:
        "{{name}} is not compatible with @cjean-fr/jsx-string. Static rendering only.",
      useState:
        "useState is not compatible with @cjean-fr/jsx-string. Extract state as props.",
      useEffect:
        "useEffect is not compatible with @cjean-fr/jsx-string. Fetch data before render.",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        if (
          node.callee.type === "Identifier" &&
          node.callee.name.startsWith("use")
        ) {
          const name = node.callee.name;
          let messageId: "noHook" | "useState" | "useEffect" = "noHook";

          if (name === "useState") messageId = "useState";
          else if (name === "useEffect") messageId = "useEffect";

          context.report({
            node,
            messageId,
            data: {
              name,
            },
          });
        }
      },
    };
  },
});
````

## File: packages/eslint-plugin-jsx-string/src/rules/no-react-imports.ts
````typescript
import { ESLintUtils } from "@typescript-eslint/utils";

export const noReactImports = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    type: "problem",
    docs: {
      description: "Disallow React and React-DOM imports.",
    },

    schema: [],
    messages: {
      noReactImport:
        "React imports are not compatible with @cjean-fr/jsx-string.",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ImportDeclaration(node) {
        const source = node.source.value;
        if (source === "react" || source === "react-dom") {
          context.report({
            node,
            messageId: "noReactImport",
          });
        }
      },
    };
  },
});
````

## File: packages/eslint-plugin-jsx-string/src/rules/no-refs.test.ts
````typescript
import { noRefs } from "./no-refs";
import * as parser from "@typescript-eslint/parser";
import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester({
  languageOptions: {
    parser,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
});

ruleTester.run("no-refs", noRefs, {
  valid: ['<input id="field" />', '<div data-ref="not-a-ref" />'],
  invalid: [
    {
      code: "<input ref={inputRef} />",
      errors: [{ messageId: "noRef" }],
    },
    {
      code: '<div ref="legacyStringRef">content</div>',
      errors: [{ messageId: "noRef" }],
    },
  ],
});
````

## File: packages/eslint-plugin-jsx-string/src/rules/no-refs.ts
````typescript
import { ESLintUtils } from "@typescript-eslint/utils";

export const noRefs = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    type: "problem",
    docs: {
      description: "Disallow React refs usage.",
    },

    schema: [],
    messages: {
      noRef:
        "Refs are not compatible with @cjean-fr/jsx-string as there is no DOM access.",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXAttribute(node) {
        if (node.name.type === "JSXIdentifier" && node.name.name === "ref") {
          context.report({
            node,
            messageId: "noRef",
          });
        }
      },
    };
  },
});
````

## File: packages/i18n-tiny/skills/i18n-tiny/SKILL.md
````markdown
---
name: i18n-tiny
description: Minimalist, type-safe internationalization library. Use this skill to implement and manage translations with strict TypeScript inference.
---

# i18n-tiny Skill

This skill provides a complete guide for an AI to implement, extend, and maintain internationalization using the `@cjean-fr/i18n-tiny` library. This library is centered around **type safety**, **minimalism**, and an adaptable workflow (either spec-first or inference-first).

## Core Concepts

The `@cjean-fr/i18n-tiny` library relies heavily on TypeScript's type system to ensure that translations are complete, parameters are correct, and placeholders exactly match expected variables.

1.  **Specification (`TranslationSpec`)**: A type or object where keys map to an array of the exact parameter names they require.
2.  **Translations**: An object containing the localized strings. Must satisfy the spec (correct keys). Placeholders in the string (like `{name}`) are strictly checked against the spec parameters.
3.  **Translator (`createTranslator`)**: A strongly-typed function that takes a translation key and enforces passing of its required parameters.

## Workflows

You can adopt one of two main workflows: **Spec-First** (recommended for clarity) or **Translation-First** (quickest setup).

### Workflow A: Spec-First (Recommended)

#### 1. Define the Translation Specification

Create a `TranslationSpec` type. Use `readonly ["paramName"]` for parameter lists to allow strong inference.

```typescript
// types/i18n.ts
export type AppTranslationSpec = {
  welcome: readonly ["name"]; // Requires { name }
  "items-count": readonly ["count"]; // Requires { count }
  logout: readonly []; // No parameters
};
```

#### 2. Implement Languages

For strict type-checking of both the keys AND the inline placeholders (`{name}`), it's best to use the `defineTranslations` helper. It catches mismatches immediately.

```typescript
// locales/en.ts
import type { AppTranslationSpec } from "../types/i18n";
import { defineTranslations } from "@cjean-fr/i18n-tiny";

export const en = defineTranslations<AppTranslationSpec>()({
  welcome: "Welcome back, {name}!",
  "items-count": "You have {count} items.",
  logout: "Sign Out",
});

export const fr = defineTranslations<AppTranslationSpec>()({
  welcome: "Bienvenue, {name} !",
  "items-count": "Vous avez {count} articles.",
  logout: "Se déconnecter",
  // ⚠️ If you typed "Bienvenue, {nom} !", TypeScript would throw an error
  // because `{nom}` does not match the `["name"]` spec!
});
```

#### 3. Create the Translator

Use `createTranslator<Spec>(translations)` to create your `t` function.

```typescript
import { en } from "./locales/en";
import type { AppTranslationSpec } from "./types/i18n";
import { createTranslator } from "@cjean-fr/i18n-tiny";

const t = createTranslator<AppTranslationSpec>(en);

// Type-safe usage:
t("welcome", { name: "Alice" }); // "Welcome back, Alice!"
t("logout"); // "Sign Out"
```

### Workflow B: Translation-First (Auto-inference)

If you prefer writing your base localization first and automatically inferring the Spec, use `InferSpec`:

```typescript
import {
  createTranslator,
  type InferSpec,
  defineTranslations,
} from "@cjean-fr/i18n-tiny";

// 1. Define base language with `as const`
export const enBase = {
  welcome: "Welcome {name}",
  logout: "Logout",
} as const; // <-- Important: as const

// 2. Automatically infer the Specification!
export type AppSpec = InferSpec<typeof enBase>;

// 3. Keep other languages strictly typed based on inferred spec
export const fr = defineTranslations<AppSpec>()({
  welcome: "Bienvenue {name}",
  logout: "Se déconnecter",
});

// 4. Create your translator
const t = createTranslator<AppSpec>(enBase);
```

## Advanced Usage

### React / JSX Support

By default, the translator returns a `string`. You can customize the return type (and allowed parameter type) for React components.

```tsx
import { type Translator } from "@cjean-fr/i18n-tiny";
import type { ReactNode } from "react";

// `tx` will return ReactNode and accept ReactNode as parameter values
const tx: Translator<AppTranslationSpec, ReactNode> = (key, ...args) => {
  return t(key, ...(args as any));
};

// Now you can safely pass JSX elements as parameters!
const element = tx("welcome", {
  name: <strong>Alice</strong>,
});
```

### ICU MessageFormat (Plurals, Gender)

For advanced interpolations like plurals, plug an external custom interpolator via the config.

```typescript
import { createTranslator } from "@cjean-fr/i18n-tiny";
import IntlMessageFormat from "intl-messageformat";

const t = createTranslator<AppTranslationSpec>(translations, {
  locale: "en-US",
  interpolate: (template, params, { locale }) => {
    return new IntlMessageFormat(template, locale).format(params) as string;
  },
});

// Assuming your string is: "{count, plural, =0 {Empty} one {1 item} other {{count} items}}"
t("items-count", { count: 1 }); // "1 item"
```

## Guidelines for AI Agents

- **Types Over Constants**: Defining the spec as a `type Spec = { key: readonly ["param"] }` is currently preferred over creating a runtime object for the spec.
- **Always prioritize `defineTranslations<Spec>()({ ... })`** when implementing translation objects. This is critical because `satisfies ValidTranslations<Spec>` only validates keys uniformly across languages, while `defineTranslations` natively catches inline placeholder typo errors (`{nom}` vs expected `{name}`).
- **Adding Keys**: If the project uses a `TranslationSpec` type, you **must** add any new key directly to the spec type before adding it to localized objects.
- **Interpolators**: `@cjean-fr/i18n-tiny` default string interpolation is basic (`{variable}`). If you encounter a project using ICU features (`plural`, `select`), ensure custom `interpolate` logic via `intl-messageformat` is configured.
````

## File: packages/i18n-tiny/src/index.test.ts
````typescript
import {
  createTranslator,
  interpolate,
  type ValidTranslations,
  type TranslatorConfig,
} from "./index";
import { describe, it, expect, mock } from "bun:test";

type UserSpec = {
  welcome: readonly ["name", "age"];
  goodbye: readonly [];
  "kebab-case-key": readonly ["user-name"];
  complex: readonly ["a", "b"];
  plural: readonly ["count"];
};

const validEnglish = {
  welcome: "Welcome {name}, you are {age} years old",
  goodbye: "Goodbye",
  "kebab-case-key": "Hello {user-name}",
  complex: "{a} and {b}",
  plural: "You have {count, plural, one {one item} other {# items}}",
} satisfies ValidTranslations<UserSpec>;

describe("translation system", () => {
  it("should create a valid translator and interpolate values", () => {
    const t = createTranslator<UserSpec>(validEnglish);

    expect(t("welcome", { name: "Alice", age: 25 })).toBe(
      "Welcome Alice, you are 25 years old",
    );
    expect(t("goodbye")).toBe("Goodbye");
  });

  it("should support dashes in variable names (kebab-case)", () => {
    const t = createTranslator<UserSpec>(validEnglish);
    expect(t("kebab-case-key", { "user-name": "Charlie" })).toBe(
      "Hello Charlie",
    );
  });

  it("should support ICU-like param extraction (static check mostly)", () => {
    const t = createTranslator<UserSpec>(validEnglish);
    // Explicitly checking that 'count' is accepted as a number
    expect(t("plural", { count: 5 })).toBe(
      "You have {count, plural, one {one item} other {# items}}",
    );
  });

  it("should use custom interpolator if provided", () => {
    const customInterpolate = mock(
      (template, params) => `Custom: ${template} (${JSON.stringify(params)})`,
    );
    const config: TranslatorConfig = {
      interpolate: customInterpolate,
    };

    const t = createTranslator<UserSpec>(validEnglish, config);
    const result = t("welcome", { name: "Bob", age: 30 });

    expect(result).toBe(
      'Custom: Welcome {name}, you are {age} years old ({"name":"Bob","age":30})',
    );
    expect(customInterpolate).toHaveBeenCalled();
  });

  it("should pass context to custom interpolator", () => {
    let capturedContext: any;
    const customInterpolate = (
      _template: string,
      _params: any,
      context: any,
    ) => {
      capturedContext = context;
      return "dummy";
    };

    const t = createTranslator<UserSpec>(validEnglish, {
      locale: "fr-FR",
      interpolate: customInterpolate,
    });

    t("goodbye"); // No params
    expect(capturedContext).toEqual({ locale: "fr-FR", key: "goodbye" });

    t("welcome", { name: "X", age: 10 });
    expect(capturedContext).toEqual({ locale: "fr-FR", key: "welcome" });
  });

  it("should support generic return types (e.g. Objects/JSX)", () => {
    // T is { text: string }
    const t = createTranslator<UserSpec, { text: string }>(validEnglish, {
      interpolate: (template) => ({ text: `Wrapped: ${template}` }),
    });

    const result = t("goodbye");
    expect(result).toEqual({ text: "Wrapped: Goodbye" });
  });

  it("should raise type errors (static verification only)", () => {
    const t = createTranslator<UserSpec>(validEnglish);

    // @ts-expect-error - missing parameter
    t("welcome", { name: "Alice" });

    // @ts-expect-error - invalid key
    t("invalid");
  });

  describe("interpolate() function", () => {
    it("should interpolate simple variables", () => {
      expect(interpolate("Hello {name}", { name: "Alice" })).toBe(
        "Hello Alice",
      );
    });

    it("should support dashes and underscores", () => {
      expect(interpolate("Val: {my-var}", { "my-var": "123" })).toBe(
        "Val: 123",
      );
      expect(interpolate("Val: {my_var}", { my_var: "456" })).toBe("Val: 456");
    });

    it("should leave unknown placeholders intact", () => {
      expect(interpolate("Hello {missing}", {})).toBe("Hello {missing}");
    });

    it("should handle multiple occurrences", () => {
      expect(interpolate("{a} - {a}", { a: "1" })).toBe("1 - 1");
    });

    it("should handle non-string values gracefully", () => {
      expect(interpolate("Count: {count}", { count: 42 })).toBe("Count: 42");
    });
  });

  describe("extensibility", () => {
    it("should support complex pluralization via custom interpolator", () => {
      const tFr = createTranslator<UserSpec>(validEnglish, {
        locale: "fr-FR",
        interpolate: (template, params) => {
          return template.replace(
            /\{(\w+), plural, one \{(.+?)\} other \{(.+?)\}\}/g,
            (_, key, one, other) => {
              const val = params[key];
              return val === 1 ? one : other.replace("#", val);
            },
          );
        },
      });

      expect(tFr("plural", { count: 1 })).toBe("You have one item");
      expect(tFr("plural", { count: 5 })).toBe("You have 5 items");
    });
  });
});
````

## File: packages/i18n-tiny/src/index.ts
````typescript
/**
 * Specification of translation keys and their required parameters.
 * Keys map to an array of parameter names.
 *
 * @example
 * type Spec = {
 *   hello: readonly ["name"]; // Requires { name: string }
 *   goodbye: readonly [];     // No params
 * };
 */
export type TranslationSpec = {
  [key: string]: readonly string[];
};

/**
 * Ensures that the implementation matches the specification.
 *
 * @example
 * const en = {
 *   hello: "Hello {name}!",
 *   goodbye: "Goodbye",
 * } satisfies ValidTranslations<Spec>;
 */
export type ValidTranslations<T extends TranslationSpec> = {
  readonly [K in keyof T]: string;
};

/**
 * Attempts to isolate the variable name before a separator (comma/space).
 * If logic becomes unstable, prefer simply returning the full segment.
 */

type CleanKey<K extends string> = K extends `${infer Name}${"," | " "}${string}`
  ? Name
  : K;

/**
 * Recursively extracts parameter names (e.g. {name}) from a string.
 * Supports simple ICU formats (e.g. {v, plural, ...}) by extracting "v".
 *
 * @example
 * type Params = ExtractParams<"Hello {name}!">;
 * // Params is of type "name"
 */

export type ExtractParams<S extends string> =
  S extends `${string}{${infer P}}${infer Rest}`
    ? CleanKey<P> | ExtractParams<Rest>
    : never;

/**
 * Automatically generates a TranslationSpec from a translation object.
 *
 * @example
 * const spec = inferSpec({ hello: "Hello {name}!" });
 * // spec is of type { readonly hello: readonly ["name"]; }
 */

export type InferSpec<T> = {
  readonly [K in keyof T]: T[K] extends string
    ? readonly ExtractParams<T[K]>[]
    : never;
};

/**
 * Validates that a literal string only contains allowed placeholders.
 * Returns unknown if valid or if not a literal string.
 * Returns an error object if invalid placeholders are found.
 */
type CheckParams<S extends string, Allowed extends string> = string extends S
  ? unknown
  : ExtractParams<S> extends Allowed
    ? unknown
    : {
        error: "Invalid placeholder";
        found: Exclude<ExtractParams<S>, Allowed>;
      };

// Return type T allows support for JSX, RawString or string

export type InterpolateFn<T = string> = (
  template: string,
  params: Record<string, any>,
  context: { locale?: string; key: string },
) => T;

export type TranslatorConfig<T = string> = {
  locale?: string;
  interpolate?: InterpolateFn<T>;
};

/**
 * A strongly-typed translator function.
 *
 * @template S - The TranslationSpec defining keys and params.
 * @template T - The return type (defaults to string). Also allows T as a parameter type.
 */
export type Translator<S extends TranslationSpec, T = string> = {
  <K extends keyof S>(
    key: K,
    ...args: [S[K][number]] extends [never]
      ? []
      : [params: Record<S[K][number], string | number | boolean | Date | T>]
  ): T;
};

/**
 * Replaces placeholders in a template string with values.
 *
 * @param template - The string with placeholders (e.g. "Hello {name}")
 * @param params - The values to inject (e.g. { name: "Alice" })
 * @returns The interpolated string.
 */
export function interpolate(
  template: string,
  params: Record<string, any> = {},
): string {
  return template.replace(/\{([\w-]+?)\}/g, (match, paramName) => {
    const value = params[paramName];
    return value !== undefined ? String(value) : match;
  });
}

/**
 * Creates a type-safe translator function.
 *
 * @param translations - The dictionary of translation strings.
 * @param config - Optional configuration for custom interpolation and locale.
 * @returns A translator function that enforces correct keys and params.
 *
 * @example
 * const spec = { hello: ["name"] } as const;
 * const t = createTranslator<typeof spec>({ hello: "Hello {name}" });
 * t("hello", { name: "World" }); // => "Hello World"
 */
export function createTranslator<
  S extends TranslationSpec,
  T = string,
  const V extends ValidTranslations<S> = ValidTranslations<S>,
>(
  translations: V & {
    [K in keyof S]: CheckParams<V[K] & string, S[K][number]>;
  },
  config?: TranslatorConfig<T>,
): Translator<S, T> {
  return (key, ...args) => {
    const template = translations[key as string] ?? (key as string);
    const params = (args[0] as Record<string, any>) || {};
    const context = { locale: config?.locale, key: key as string };

    if (config?.interpolate) {
      return config.interpolate(template, params, context);
    }

    // If no parameters are passed, return the raw template (casted to T)
    if (args.length === 0) {
      return template as unknown as T;
    }

    return interpolate(template, params) as unknown as T;
  };
}

/**
 * Helper to define translations with strict placeholder validation.
 * Use this to catch errors at the definition point.
 */
export function defineTranslations<S extends TranslationSpec>(): <
  const V extends ValidTranslations<S>,
>(
  translations: V & {
    [K in keyof S]: CheckParams<V[K] & string, S[K][number]>;
  },
) => V {
  return (translations) => translations;
}
````

## File: packages/jsonresume-theme-cjean/bin/jsonresume-theme-cjean.js
````javascript
#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { parseArgs } from "node:util";
import { render } from "../dist/index.js";

async function main() {
  const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    options: {
      help: { type: "boolean", short: "h" },
      output: { type: "string", short: "o" },
    },
    allowPositionals: true,
  });

  if (values.help) {
    console.log(`
Usage: npx jsonresume-theme-cjean [resume.json]

Options:
  -o, --output <file>  Output file (default: resume.html)
  -h, --help           Show help
    `);
    return;
  }

  const input = positionals[0] || "resume.json";
  const output = values.output || "resume.html";

  try {
    console.log(`⌛ Rendering resume from ${input}...`);
    const resumePath = resolve(process.cwd(), input);
    const resumeData = JSON.parse(await readFile(resumePath, "utf-8"));
    const html = await render(resumeData);
    const outputPath = resolve(process.cwd(), output);
    await writeFile(outputPath, html);
    console.log(`✅ Successfully exported resume to ${output}`);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`❌ Error: File not found: ${error.path}`);
    } else {
      console.error(`❌ Error: ${error.message}`);
    }
    process.exit(1);
  }
}

main();
````

## File: packages/jsonresume-theme-cjean/src/lib/google.ts
````typescript
/**
 * Generate a Google favicon URL.
 * @param url The URL to generate a favicon for.
 * @param size The size of the favicon.
 * @returns The Google favicon URL.
 */
export function generateGoogleFaviconUrl(
  url: string,
  size: number = 64,
): string {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(url)}&sz=${size}`;
}
````

## File: packages/jsonresume-theme-cjean/src/lib/gravatar.ts
````typescript
type GravatarOptions = {
  size?: number;
  rating?: "g" | "pg" | "r" | "x";
  d?:
    | "404"
    | "mp"
    | "identicon"
    | "monsterid"
    | "wavatar"
    | "retro"
    | "robohash"
    | "blank";
};

/**
 * Convert an email to a SHA-256 hash.
 * @param email The email to convert.
 * @returns The SHA-256 hash of the email.
 */
export async function emailToHash(email: string): Promise<string> {
  const hashBuffer = await crypto.subtle.digest(
    "sha-256",
    new TextEncoder().encode(email.trim().toLowerCase()),
  );
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Generate a gravatar URL from an email hash.
 * @param hash The email hash.
 * @param options The gravatar options.
 * @returns The gravatar picture.
 */
export function generateGravatarUrl(
  hash: string,
  options: GravatarOptions = {},
): string {
  const gravatarUrl = new URL(`https://www.gravatar.com/avatar/${hash}`);
  if (options.size) gravatarUrl.searchParams.set("s", options.size.toString());
  if (options.rating) gravatarUrl.searchParams.set("r", options.rating);
  if (options.d) gravatarUrl.searchParams.set("d", options.d);
  return gravatarUrl.toString();
}
````

## File: packages/jsonresume-theme-cjean/src/lib/wsrv.ts
````typescript
type WSRVOptions = {
  w?: number;
  h?: number;
  fit?: "cover" | "contain" | "fill" | "inside" | "outside";
  a?:
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "center"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "entropy"
    | "attention";
  output?: "webp" | "avif" | "png" | "jpg";
  encoding?: "base64" | null;
};

/**
 * Generate a URL for the WSRV CDN.
 * @param url The URL to proxy.
 * @param options The WSRV options.
 * @returns The WSRV URL.
 */
export function generateWSRVUrl(
  url: string,
  options: WSRVOptions = {},
): string {
  const wsrvUrl = new URL("https://wsrv.nl/");
  wsrvUrl.searchParams.set("url", url);
  if (options.w) wsrvUrl.searchParams.set("w", options.w.toString());
  if (options.h) wsrvUrl.searchParams.set("h", options.h.toString());
  if (options.output) wsrvUrl.searchParams.set("output", options.output);
  if (options.encoding) wsrvUrl.searchParams.set("encoding", options.encoding);
  if (options.fit) wsrvUrl.searchParams.set("fit", options.fit);
  if (options.a) wsrvUrl.searchParams.set("a", options.a);
  return wsrvUrl.toString();
}
````

## File: packages/jsonresume-theme-cjean/eslint.config.ts
````typescript
import jsxString from "@cjean-fr/eslint-plugin-jsx-string";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";

export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      "@cjean-fr/jsx-string": jsxString,
    },
    rules: {
      ...jsxString.configs.recommended.rules,
    },
  },
];
````

## File: packages/jsonresume-theme-cjean/LICENSE
````
MIT License

Copyright (c) 2026 Christophe Jean

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
````

## File: packages/jsx-flow/examples/ssg.tsx
````typescript
// @jsxImportSource @cjean-fr/jsx-string
/**
 * Demo: static site generation (SSG) with TurboAdapter
 *
 * Run: bun examples/ssg.tsx
 *
 * Writes dist/index.html (shell) and dist/fragments/*.html (islands).
 * The shell uses <turbo-frame src="..."> placeholders; Turbo lazy-loads
 * each fragment on page load and replaces the frame with its content.
 *
 * Fragment files are <turbo-frame id="id">content</turbo-frame> — the
 * format Turbo frame lazy-loading expects (distinct from the inline
 * <turbo-stream> format used in streaming SSR).
 */
import { Island, renderToStatic, TurboAdapter } from "../src/index.js";
import { renderToString, type JSXNode } from "@cjean-fr/jsx-string";
import { mkdir, writeFile } from "node:fs/promises";

// Simulated data

const stats = { users: 1_234, online: 56 };
const feed = [
  "Article published — 2 min ago",
  "New signup — 5 min ago",
  "Deploy succeeded — 12 min ago",
];

// Components

function Stats() {
  return (
    <div class="stats">
      <strong>{stats.users}</strong> users · <strong>{stats.online}</strong>{" "}
      online
    </div>
  );
}

function Feed() {
  return (
    <ul>
      {feed.map((item) => (
        <li>{item}</li>
      ))}
    </ul>
  );
}

// Shell — <Island> in static mode auto-generates src via generatePath

function Shell() {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>jsx-flow · SSG demo</title>
        {/* Turbo handles <turbo-frame src="..."> lazy-loading */}
        <script
          type="module"
          src="https://cdn.jsdelivr.net/npm/@hotwired/turbo@8/dist/turbo.es2017.esm.js"
        />
        <style>{`
          body { font-family: sans-serif; max-width: 640px; margin: 2rem auto; padding: 0 1rem; }
          .placeholder { color: #aaa; font-style: italic; }
          .stats, ul { border: 1px solid #e5e7eb; border-radius: 8px; padding: 1rem; }
        `}</style>
      </head>
      <body>
        <h1>Dashboard</h1>

        <h2>Stats</h2>
        <Island
          name="stats"
          fallback={<p class="placeholder">Loading stats…</p>}
        >
          {() => <Stats />}
        </Island>

        <h2>Activity feed</h2>
        <Island name="feed" fallback={<p class="placeholder">Loading feed…</p>}>
          {() => <Feed />}
        </Island>
      </body>
    </html>
  );
}

// Build

const generatePath = (id: string) => `/fragments/${id}.html`;

const { pages, fragments } = await renderToStatic(
  async (ctx) => {
    // renderPage applies head channel + adapter transforms automatically,
    // symmetric with renderToReadableStream's behaviour in streaming mode.
    const html = await ctx.renderPage(() => <Shell />);

    // Generate fragment files via adapter.Frame — the SSG lazy-load format.
    // TurboAdapter.Frame produces <turbo-frame id="id"> which Turbo fetches and
    // replaces the placeholder frame with. Distinct from Patch's <turbo-stream>.
    const fragments = new Map<string, string>();
    for (const [id, { factory }] of ctx.channels.fragment) {
      const content = await renderToString(
        TurboAdapter.Frame({ id, children: factory() as JSXNode }),
      );
      fragments.set(generatePath(id), content);
    }

    return { pages: new Map([["/index.html", html]]), fragments };
  },
  TurboAdapter,
  generatePath,
);

// Write output

await mkdir("dist/fragments", { recursive: true });

for (const [path, html] of pages) {
  const file = `dist${path}`;
  await writeFile(file, `<!DOCTYPE html>${html}`);
  console.log(`wrote ${file}`);
}

for (const [path, html] of fragments) {
  const file = `dist${path}`;
  await writeFile(file, html);
  console.log(`wrote ${file}`);
}

console.log("\nDone. Serve dist/ with any static file server.");
````

## File: packages/jsx-flow/src/components/Deferred.tsx
````typescript
import type { MergeType } from "../adapters.js";
import { Flow } from "../context.js";
import {
  useContext,
  type JSXNode,
  type HTMLAttributes,
} from "@cjean-fr/jsx-string";

interface DeferredBase extends HTMLAttributes {
  name?: string;
  fallback: JSXNode;
}

/** Server pushes the rendered content inline via the stream adapter. */
interface DeferredStreamed extends DeferredBase {
  // Factory, not a node — JSX evaluates eagerly; the thunk defers rendering to streaming time.
  children: () => JSXNode;
  merge?: MergeType;
  src?: never;
}

/** Client fetches the content from `src` after the shell is received. */
interface DeferredFetched extends DeferredBase {
  children?: never;
  src: string;
}

export type DeferredProps = DeferredStreamed | DeferredFetched;

/**
 * Renders a placeholder in the shell. After the shell is sent, the real content
 * is rendered (or fetched from `src`) and delivered to the placeholder as a DOM
 * patch via the active adapter. No client-side hydration — this is server-side
 * deferral.
 */
export function Deferred(props: DeferredProps): any {
  const { name, fallback, children, src } = props;
  const { config, nextId, patch } = useContext(Flow);

  const id = name ?? nextId();

  if (src) {
    return config.adapter.Placeholder({ id, src, children: fallback });
  }

  if (!children) {
    throw new Error("Deferred must have children if src is not provided.");
  }

  const merge: MergeType =
    "merge" in props ? (props.merge ?? "replace") : "replace";
  patch(id, children, merge);

  if (config.mode === "streaming") {
    return config.adapter.Placeholder({ id, src: null, children: fallback });
  }

  return config.adapter.Placeholder({
    id,
    src: config.generatePath(id),
    children: fallback,
  });
}
````

## File: packages/jsx-string/examples/async-component.tsx
````typescript
/**
 * Async components — await inside the component body, no hooks needed.
 * The whole tree is awaited before renderToString returns.
 *
 * Run: `bun examples/async-component.tsx`
 */
import { renderToString } from "@cjean-fr/jsx-string";

async function fetchUser(id: string) {
  // Fake network call
  await new Promise((r) => setTimeout(r, 10));
  return { id, name: "Alice", email: "alice@example.com" };
}

async function UserCard({ id }: { id: string }) {
  const user = await fetchUser(id);
  return (
    <article class="card">
      <h2>{user.name}</h2>
      <p>
        <a href={`mailto:${user.email}`}>{user.email}</a>
      </p>
    </article>
  );
}

const html = await renderToString(<UserCard id="42" />);
console.log(html);
````

## File: packages/jsx-string/examples/hello.tsx
````typescript
/**
 * Minimal renderToString — synchronous JSX in, HTML string out.
 *
 * Run: `bun examples/hello.tsx`
 */
import { renderToString } from "@cjean-fr/jsx-string";

const html = await renderToString(
  <main>
    <h1>Hello, world!</h1>
    <p>jsx-string renders JSX to plain HTML strings.</p>
  </main>,
);

console.log(html);
````

## File: packages/jsx-string/src/core/types.test-d.ts
````typescript
import type { JSX } from "./types";

/**
 * TEST : IntrinsicElements Fusions
 */

export const testReactProps: JSX.IntrinsicElements["div"] = {
  onClick: "alert('clicked')",
  className: "from-react",
};

export const testOurProps: JSX.IntrinsicElements["div"] = {
  class: "from-us",
  style: {
    color: "red",
    "--my-var": "10px",
    anything: "allowed",
  },
};

export const testSvg: JSX.IntrinsicElements["svg"] = {
  viewBox: "0 0 10 10",
};

export const testCustom: JSX.IntrinsicElements["custom-tag"] = {
  anyProp: 123,
};

declare const element: JSX.IntrinsicElements["div"];
element.onPaste; // Ok (React)
element.class; // Ok (JSX-String)
````

## File: packages/jsx-string/src/utils/void-elements.ts
````typescript
/**
 * HTML5 Void Elements
 * These elements cannot have children and do not require a closing slash in HTML5.
 * https://html.spec.whatwg.org/multipage/syntax.html#void-elements
 */
export const VOID_ELEMENTS = new Set<string>([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);
````

## File: packages/jsx-vite/src/index.test.tsx
````typescript
// @jsxImportSource @cjean-fr/jsx-string
import { Asset, assetUrl, setVite, type ViteManifest } from "./index.js";
import { withScope, renderToString } from "@cjean-fr/jsx-string";
import { describe, it, expect } from "bun:test";

async function render(node: unknown): Promise<string> {
  return renderToString(node as Parameters<typeof renderToString>[0]);
}

describe("Asset (dev mode)", () => {
  it("emits a stylesheet link for a .css entry", async () => {
    await withScope(async () => {
      setVite(null);
      const html = await render(<Asset entry="src/styles/main.css" />);
      expect(html).toContain(
        '<link rel="stylesheet" href="/src/styles/main.css"',
      );
    });
  });

  it("emits a module script for a .ts entry", async () => {
    await withScope(async () => {
      setVite(null);
      const html = await render(<Asset entry="src/main.ts" />);
      expect(html).toContain('<script type="module" src="/src/main.ts">');
    });
  });

  it("does not emit the Vite HMR client (transformIndexHtml handles it)", async () => {
    await withScope(async () => {
      setVite(null);
      const html = await render(
        <>
          <Asset entry="src/main.ts" />
          <Asset entry="src/other.ts" />
        </>,
      );
      expect(html).not.toContain("@vite/client");
    });
  });

  it("respects a custom base URL", async () => {
    await withScope(async () => {
      setVite(null, { base: "/app/" });
      const html = await render(<Asset entry="src/main.ts" />);
      expect(html).toContain('src="/app/src/main.ts"');
    });
  });
});

describe("Asset (production mode)", () => {
  const manifest: ViteManifest = {
    "src/main.ts": {
      file: "assets/main-abc123.js",
      src: "src/main.ts",
      isEntry: true,
      imports: ["_shared-xyz789.js"],
      css: ["assets/main-Bx7k2c.css"],
    },
    "_shared-xyz789.js": {
      file: "assets/shared-xyz789.js",
      name: "shared",
    },
    "src/styles/main.css": {
      file: "assets/main-only-d4f6.css",
      src: "src/styles/main.css",
      isEntry: true,
    },
  };

  it("resolves a JS entry to its hashed file", async () => {
    await withScope(async () => {
      setVite(manifest);
      const html = await render(<Asset entry="src/main.ts" />);
      expect(html).toContain(
        '<script type="module" src="/assets/main-abc123.js">',
      );
    });
  });

  it("emits co-bundled CSS before the script", async () => {
    await withScope(async () => {
      setVite(manifest);
      const html = await render(<Asset entry="src/main.ts" />);
      const cssIdx = html.indexOf("main-Bx7k2c.css");
      const jsIdx = html.indexOf("main-abc123.js");
      expect(cssIdx).toBeGreaterThan(-1);
      expect(jsIdx).toBeGreaterThan(cssIdx);
    });
  });

  it("emits modulepreload links for transitive imports", async () => {
    await withScope(async () => {
      setVite(manifest);
      const html = await render(<Asset entry="src/main.ts" />);
      expect(html).toContain(
        '<link rel="modulepreload" href="/assets/shared-xyz789.js"',
      );
    });
  });

  it("resolves a CSS-only entry as a stylesheet link", async () => {
    await withScope(async () => {
      setVite(manifest);
      const html = await render(<Asset entry="src/styles/main.css" />);
      expect(html).toContain(
        '<link rel="stylesheet" href="/assets/main-only-d4f6.css"',
      );
      expect(html).not.toContain("<script");
    });
  });

  it("throws when the entry is not found in the manifest", async () => {
    await withScope(async () => {
      setVite(manifest);
      expect(() => <Asset entry="src/does-not-exist.ts" />).toThrow(
        /not found in manifest/,
      );
    });
  });

  it("never emits the Vite dev client in production", async () => {
    await withScope(async () => {
      setVite(manifest);
      const html = await render(<Asset entry="src/main.ts" />);
      expect(html).not.toContain("@vite/client");
    });
  });

  it("respects a custom base URL", async () => {
    await withScope(async () => {
      setVite(manifest, { base: "/cdn/" });
      const html = await render(<Asset entry="src/main.ts" />);
      expect(html).toContain('src="/cdn/assets/main-abc123.js"');
      expect(html).toContain('href="/cdn/assets/main-Bx7k2c.css"');
    });
  });
});

describe("Asset (no setup)", () => {
  it("throws a clear error when setVite was not called", async () => {
    await withScope(async () => {
      expect(() => <Asset entry="src/main.ts" />).toThrow(/context not found/);
    });
  });
});

describe("assetUrl (dev mode)", () => {
  it("returns the source path under the base in dev", async () => {
    await withScope(async () => {
      setVite(null);
      expect(assetUrl("src/logo.svg")).toBe("/src/logo.svg");
      expect(assetUrl("src/fonts/inter.woff2")).toBe("/src/fonts/inter.woff2");
    });
  });

  it("respects a custom base URL", async () => {
    await withScope(async () => {
      setVite(null, { base: "/app/" });
      expect(assetUrl("src/logo.svg")).toBe("/app/src/logo.svg");
    });
  });

  it("works inside a JSX attribute", async () => {
    await withScope(async () => {
      setVite(null);
      const html = await renderToString(
        <link rel="icon" href={assetUrl("src/favicon.svg")} />,
      );
      expect(html).toContain('href="/src/favicon.svg"');
    });
  });
});

describe("assetUrl (production mode)", () => {
  const manifest: ViteManifest = {
    "src/logo.svg": {
      file: "assets/logo-Bx7k2.svg",
      src: "src/logo.svg",
    },
    "src/fonts/inter.woff2": {
      file: "assets/inter-abc123.woff2",
      src: "src/fonts/inter.woff2",
    },
  };

  it("returns the hashed file path under the base", async () => {
    await withScope(async () => {
      setVite(manifest);
      expect(assetUrl("src/logo.svg")).toBe("/assets/logo-Bx7k2.svg");
      expect(assetUrl("src/fonts/inter.woff2")).toBe(
        "/assets/inter-abc123.woff2",
      );
    });
  });

  it("respects a custom base URL", async () => {
    await withScope(async () => {
      setVite(manifest, { base: "/cdn/" });
      expect(assetUrl("src/logo.svg")).toBe("/cdn/assets/logo-Bx7k2.svg");
    });
  });

  it("throws when the entry is not in the manifest", async () => {
    await withScope(async () => {
      setVite(manifest);
      expect(() => assetUrl("src/does-not-exist.png")).toThrow(
        /not found in manifest/,
      );
    });
  });

  it("composes with arbitrary tags", async () => {
    await withScope(async () => {
      setVite(manifest);
      const html = await renderToString(
        <img src={assetUrl("src/logo.svg")} alt="logo" />,
      );
      expect(html).toContain('src="/assets/logo-Bx7k2.svg"');
      expect(html).toContain('alt="logo"');
    });
  });
});
````

## File: packages/jsx-vite/README.md
````markdown
# @cjean-fr/jsx-vite

> 🚧 Early development — API may change. Version 0.1.0.

Vite asset integration for [@cjean-fr/jsx-string](../jsx-string) projects. Reference your assets by their **source path** (`src/main.ts`, `src/styles/main.css`, `src/logo.svg`) and let one component (or one helper for arbitrary tags) resolve them correctly in both dev and production.

## Why

A jsx-string + Vite project typically hardcodes asset paths in its layout:

```tsx
<link rel="stylesheet" href="/assets/main.css" />
<script type="module" src="/assets/main.js"></script>
```

Three problems:

- **Dev/prod drift** — Vite serves sources directly in dev (`/src/styles/main.css`), bundles them with hashes in build (`/assets/main-Bx7k.css`). Most projects work around this with string replaces.
- **No cache-busting** — to keep the hardcoded paths working, you turn off Vite's content hashing.
- **No transitive preloading** — production bundles split chunks but the layout doesn't see those splits.

This package solves all three with one component.

## Install

```bash
bun add @cjean-fr/jsx-vite
```

## Usage

### 1. Reference assets in your layout

```tsx
import { Asset } from "@cjean-fr/jsx-vite";

export function Layout({ children }) {
  return (
    <html>
      <head>
        <title>My app</title>
        <Asset entry="src/main.ts" />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

The `entry` is the **source path** as Vite sees it. The same string works in both modes.

### 2. Configure the scope before rendering

Once per render, call `setVite()`:

```ts
import { setVite, loadViteManifest } from "@cjean-fr/jsx-vite";

// Production build: load the manifest produced by `vite build`
const manifest = await loadViteManifest("dist/.vite/manifest.json");
setVite(manifest, { base: "/" });

// Dev mode: pass null
setVite(null);
```

`loadViteManifest` returns `null` if the file is absent — same behavior dev setups rely on, so you can write:

```ts
const manifest = await loadViteManifest("dist/.vite/manifest.json");
setVite(manifest); // null in dev, real manifest in prod
```

### 3. Reference arbitrary assets with `assetUrl()`

For tags `<Asset>` doesn't emit (images, fonts, favicons, OpenGraph metadata, …), use `assetUrl(entry)` inside the attribute you build yourself:

```tsx
import { assetUrl } from "@cjean-fr/jsx-vite";

<link rel="icon" href={assetUrl("src/favicon.svg")} />
<link
  rel="preload"
  as="font"
  type="font/woff2"
  href={assetUrl("src/fonts/inter.woff2")}
  crossorigin
/>
<img src={assetUrl("src/hero.png")} alt="hero" />
<meta property="og:image" content={assetUrl("src/og-image.png")} />
```

Resolution rules:

- Dev: returns `{base}{entry}` (Vite serves the source directly).
- Prod: returns `{base}{chunk.file}` from the manifest.
- Throws if the entry is missing from the manifest in prod.

### 4. What `<Asset>` emits

**Dev mode** (`manifest === null`):

```tsx
<Asset entry="src/styles/main.css" />
// → <link rel="stylesheet" href="/src/styles/main.css">

<Asset entry="src/main.ts" />
// → <script type="module" src="/src/main.ts">
```

The Vite HMR client (`/@vite/client`) is **not** emitted here — pipe your output through `server.transformIndexHtml()` to let Vite inject it (and apply its other dev-mode transforms). Any setup that bypasses `transformIndexHtml` must add `<script type="module" src="/@vite/client">` manually.

**Production mode** (manifest provided):

```tsx
<Asset entry="src/main.ts" />
// → <link rel="stylesheet" href="/assets/main-Bx7k2c.css">     ← co-bundled CSS
//   <link rel="modulepreload" href="/assets/shared-xyz789.js"> ← transitive imports
//   <script type="module" src="/assets/main-abc123.js">        ← entry itself
```

CSS-only entries:

```tsx
<Asset entry="src/styles/main.css" />
// → <link rel="stylesheet" href="/assets/main-only-d4f6.css">
```

If the entry is not in the manifest, `<Asset>` throws a clear error listing the available entries — typos surface immediately.

## Vite configuration

For `loadViteManifest` to find a manifest, enable it in `vite.config.ts`:

```ts
export default defineConfig({
  build: {
    manifest: true,
    rollupOptions: {
      input: "src/main.ts",
    },
  },
});
```

The manifest will be written to `<outDir>/.vite/manifest.json`.

## API

| Export                         | Description                                                                                                   |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `Asset`                        | Component that resolves an entry to `<link>` / `<script>` / `<link rel="modulepreload">` tags (CSS / JS only) |
| `assetUrl(entry)`              | Function that resolves an entry to a URL string — use inside arbitrary tags (images, fonts, favicons, …)      |
| `setVite(manifest, { base? })` | Configure the render scope. Call once per render.                                                             |
| `loadViteManifest(path)`       | Load a Vite manifest from disk. Returns `null` if the file does not exist.                                    |
| `ViteManifest`                 | Type mirroring Vite's `manifest.json` shape                                                                   |
| `ViteManifestChunk`            | Type for a single manifest entry                                                                              |

## Notes

- `setVite()` uses `setContext()` from jsx-string — it must be called inside a `withScope()` (renderToString, renderToStatic, renderToReadableStream all establish one).
- `loadViteManifest()` uses `node:fs/promises` — works in Node ≥ 20, Bun, and Deno.
- The package has no dependency on `vite` itself — only on `@cjean-fr/jsx-string`.

## License

MIT © Christophe Jean
````

## File: .gitignore
````
# dependencies (bun install)
node_modules
.turbo

# IA
.agent

# output
dist
*.tgz

# code coverage
coverage
*.lcov

# logs
logs
_.log
report.[0-9]_.[0-9]_.[0-9]_.[0-9]_.json

# dotenv environment variable files
.env
.env.development.local
.env.test.local
.env.production.local
.env.local

# caches
.eslintcache
.cache
*.tsbuildinfo

# IntelliJ based IDEs
.idea
.vscode

# Finder (MacOS) folder config
.DS_Store

playground
````

## File: packages/docs/src/cli/init.ts
````typescript
import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";

interface InitOptions {
  force: boolean;
}

interface FileSpec {
  path: string;
  content: string;
}

/**
 * Scaffold a starter docs project in `cwd`.
 *
 * Tailwind 4 is the theming layer: the scaffold wires `@tailwindcss/vite`,
 * MDX (`.mdx` pages), dark-mode, and the docs preset stylesheet. Refuses to
 * overwrite existing files unless `--force` is passed.
 */
export async function runInit(
  cwd: string,
  options: InitOptions,
): Promise<void> {
  const files = buildFiles();

  if (!options.force) {
    const conflicts: string[] = [];
    for (const f of files) {
      try {
        await access(path.join(cwd, f.path));
        conflicts.push(f.path);
      } catch {
        /* missing — good */
      }
    }
    if (conflicts.length > 0) {
      process.stderr.write(
        `[@cjean-fr/docs] These files already exist:\n${conflicts.map((p) => `  - ${p}`).join("\n")}\nRe-run with --force to overwrite.\n`,
      );
      process.exitCode = 1;
      return;
    }
  }

  for (const f of files) {
    const full = path.join(cwd, f.path);
    await mkdir(path.dirname(full), { recursive: true });
    await writeFile(full, f.content, "utf-8");
    console.log(`  created ${f.path}`);
  }

  printNextSteps();
}

function buildFiles(): FileSpec[] {
  const docsConfig = `import { defineConfig } from "@cjean-fr/docs";

export default defineConfig({
  title: "My Docs",
  description: "Documentation built with @cjean-fr/docs.",

  pages: "src/pages",
  clientEntry: "src/client.ts",
  out: "dist",
  base: "/assets/",
  viteManifest: "dist/assets/.vite/manifest.json",
});
`;

  const viteConfig = `import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import remarkGfm from "remark-gfm";

// The @cjean-fr/docs plugin is registered by the CLI ('docs dev' / 'docs build').
// Only project-specific plugins live here.
export default defineConfig({
  plugins: [
    // \`.mdx\` pages compile to jsx-string components; the frontmatter becomes
    // the \`meta\` export the page loader reads.
    mdx({
      jsxImportSource: "@cjean-fr/jsx-string",
      // Built-in docs components (<CodeBlock>, <Tabs>, <Aside>, …) are
      // auto-provided — no need to import them in every page.
      providerImportSource: "@cjean-fr/docs/mdx-components",
      remarkPlugins: [
        remarkFrontmatter,
        [remarkMdxFrontmatter, { name: "meta" }],
        remarkGfm,
      ],
    }),
    tailwindcss(),
  ],
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "@cjean-fr/jsx-string",
  },
  build: {
    outDir: "dist/assets",
    assetsDir: "",
    manifest: true,
    rollupOptions: {
      input: "src/client.ts",
      output: {
        entryFileNames: "[name]-[hash].js",
        assetFileNames: "[name]-[hash][extname]",
      },
    },
  },
});
`;

  const client = `import "./styles/main.css";
import "@cjean-fr/docs/client";
`;

  const page = `---
title: Home
---

# Welcome

Edit \`src/pages/index.mdx\` to get started.

Pages are Markdown — the built-in components (\`CodeBlock\`, \`Tabs\`, \`Aside\`,
…) are available out of the box; just use them inline. Need your own? Add an
\`import\` at the top.
`;

  const mainCss = `@import "tailwindcss";
@import "@cjean-fr/docs/main.css";

/* Add your own styles below. */
`;

  return [
    { path: "docs.config.ts", content: docsConfig },
    { path: "vite.config.ts", content: viteConfig },
    { path: "src/client.ts", content: client },
    { path: "src/pages/index.mdx", content: page },
    { path: "src/styles/main.css", content: mainCss },
  ];
}

function printNextSteps(): void {
  const mdxDeps =
    "@mdx-js/rollup remark-frontmatter remark-mdx-frontmatter remark-gfm";
  const lines: string[] = [
    "",
    "Next steps:",
    `  1. bun add -D @tailwindcss/vite tailwindcss vite ${mdxDeps}`,
    "  1b. bun add @cjean-fr/docs @cjean-fr/jsx-string @cjean-fr/jsx-flow @cjean-fr/jsx-vite",
    "  2. Add to package.json scripts:",
    `       "dev": "docs dev",`,
    `       "build": "docs build"`,
    "  3. bun run dev",
    "",
  ];
  process.stdout.write(lines.join("\n"));
}
````

## File: packages/docs/src/components/Aside.tsx
````typescript
/**
 * Callout box. Four types with sensible defaults:
 *
 *   <Aside type="note">      …</Aside>   ← blue, info icon
 *   <Aside type="tip">       …</Aside>   ← green, sparkle icon
 *   <Aside type="caution">   …</Aside>   ← yellow, warning icon
 *   <Aside type="danger">    …</Aside>   ← red, alert icon
 *
 * Override the title with the `title` prop. Colors come from `docs-aside-*`
 * classes (Tailwind + the vendored stylesheet); restyle by overriding the
 * CSS variables `--docs-aside-{type}-bg` / `--docs-aside-{type}-border`.
 */
import { raw, type JSXNode } from "@cjean-fr/jsx-string";

export type AsideType = "note" | "tip" | "caution" | "danger";

export interface AsideProps {
  type?: AsideType;
  title?: string;
  children: JSXNode;
}

const ICONS: Record<AsideType, ReturnType<typeof raw>> = {
  note: raw(
    `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>`,
  ),
  tip: raw(
    `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.287 1.288L3 12l5.8 1.9a2 2 0 0 1 1.288 1.287L12 21l1.9-5.8a2 2 0 0 1 1.287-1.288L21 12l-5.8-1.9a2 2 0 0 1-1.288-1.287Z"></path></svg>`,
  ),
  caution: raw(
    `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>`,
  ),
  danger: raw(
    `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg>`,
  ),
};

const DEFAULT_TITLES: Record<AsideType, string> = {
  note: "Note",
  tip: "Tip",
  caution: "Caution",
  danger: "Danger",
};

const TYPE_CLASSES: Record<AsideType, string> = {
  note: "docs-aside-note border-blue-300 bg-blue-50 text-blue-900 dark:border-blue-700 dark:bg-blue-950/40 dark:text-blue-100",
  tip: "docs-aside-tip border-green-300 bg-green-50 text-green-900 dark:border-green-700 dark:bg-green-950/40 dark:text-green-100",
  caution:
    "docs-aside-caution border-yellow-300 bg-yellow-50 text-yellow-900 dark:border-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-100",
  danger:
    "docs-aside-danger border-red-300 bg-red-50 text-red-900 dark:border-red-700 dark:bg-red-950/40 dark:text-red-100",
};

export function Aside({ type = "note", title, children }: AsideProps) {
  return (
    <aside
      role="note"
      class={`docs-aside ${TYPE_CLASSES[type]} my-4 flex gap-3 rounded-lg border-l-4 p-4`}
    >
      <span class="docs-aside-icon mt-0.5 shrink-0">{ICONS[type]}</span>
      <div class="docs-aside-body min-w-0 flex-1">
        <p class="docs-aside-title mb-1 font-semibold">
          {title ?? DEFAULT_TITLES[type]}
        </p>
        <div class="docs-aside-content">{children}</div>
      </div>
    </aside>
  );
}
````

## File: packages/docs/src/components/CodeBlock.tsx
````typescript
/**
 * Code block renderer with Shiki syntax highlighting.
 *
 * - Runs at render time (server / build), zero client JS.
 * - Multi-theme: emits CSS variables (--shiki-light / --shiki-dark) so
 *   light and dark modes switch on the `dark` class without re-rendering.
 * - Falls back to plain escaped code if Shiki is missing or the language
 *   isn't recognized.
 */
import { raw } from "@cjean-fr/jsx-string";

export interface CodeBlockProps {
  /** The code to render. */
  code: string;
  /** Language id (Shiki bundled language). Default: `"text"` (no highlighting). */
  language?: string;
  /** Override the corner label. Defaults to `language`. */
  label?: string;
}

const DEFAULT_LIGHT_THEME = "github-light";
const DEFAULT_DARK_THEME = "github-dark";

type CodeToHtml = (code: string, options: object) => Promise<string>;

let shikiPromise: Promise<unknown> | null = null;

async function getCodeToHtml(): Promise<CodeToHtml | null> {
  if (shikiPromise === null) {
    shikiPromise = import("shiki").catch(() => null);
  }
  const mod = (await shikiPromise) as { codeToHtml?: CodeToHtml } | null;
  return mod?.codeToHtml ?? null;
}

export async function CodeBlock({
  code,
  language = "text",
  label,
}: CodeBlockProps) {
  const cleaned = code.trim();
  const codeToHtml = await getCodeToHtml();

  let body: string;
  if (codeToHtml) {
    try {
      body = await codeToHtml(cleaned, {
        lang: language,
        themes: { light: DEFAULT_LIGHT_THEME, dark: DEFAULT_DARK_THEME },
        defaultColor: false, // emit CSS vars only, no inline color/bg
      });
    } catch {
      body = renderPlain(cleaned);
    }
  } else {
    body = renderPlain(cleaned);
  }

  return (
    <div class="docs-code-block relative my-4">
      {(label ?? language) !== "text" && (
        <span class="docs-code-lang absolute top-2 right-3 font-mono text-xs text-gray-500 select-none dark:text-gray-400">
          {label ?? language}
        </span>
      )}
      {raw(body)}
    </div>
  );
}

function renderPlain(code: string): string {
  return `<pre class="docs-code-pre overflow-x-auto rounded-lg bg-gray-950 dark:bg-gray-900 border border-gray-800 p-4 text-sm font-mono leading-relaxed text-gray-100"><code>${escapeHtml(code)}</code></pre>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
````

## File: packages/docs/src/components/CodeExample.tsx
````typescript
/**
 * Async component that loads a code example from disk and renders it via
 * `<CodeBlock>`. Examples live under `config.examples` (default `./examples`)
 * — the `src` prop is the path relative to that directory.
 *
 * Keeps page sources free of inline code blobs.
 */
import { useDocs } from "../context.js";
import { CodeBlock } from "./CodeBlock.js";
import { readFile } from "node:fs/promises";
import path from "node:path";

export interface CodeExampleProps {
  /** Path relative to `config.examples` (e.g. `"guide/intro/hello.tsx"`). */
  src: string;
  /** Override the language label. Defaults to the file extension. */
  language?: string;
}

export async function CodeExample({ src, language }: CodeExampleProps) {
  const { config } = useDocs();
  const file = path.join(config.examples, src);
  const code = await readFile(file, "utf-8");
  return (
    <CodeBlock code={code} language={language ?? path.extname(src).slice(1)} />
  );
}
````

## File: packages/docs/src/components/Layout.tsx
````typescript
/**
 * Default document Layout. Reads config + meta from DocsContext, renders the
 * full HTML shell with nav + main content.
 *
 * Override with `defineConfig({ components: { Layout: MyLayout } })`. The
 * replacement receives the same `{ children }` prop and reads the same
 * context for everything else.
 */
import { useDocs } from "../context.js";
import type { LayoutProps } from "../types.js";
import { Nav } from "./Nav.js";
import { NavToggle } from "./NavToggle.js";
import { PageFooter } from "./PageFooter.js";
import { TableOfContents } from "./TableOfContents.js";
import { themeInitScript } from "./ThemeToggle.js";
import { Asset } from "@cjean-fr/jsx-vite";

export function Layout({ children }: LayoutProps) {
  const { config, meta } = useDocs();
  const title = meta.title ? `${meta.title} — ${config.title}` : config.title;
  const description = meta.description ?? config.description;

  return (
    <html lang="en" class="docs-html">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
        {themeInitScript}
        <Asset entry={config.clientEntry} />
      </head>
      <body class="docs-body bg-white text-gray-900 antialiased dark:bg-gray-950 dark:text-gray-100">
        <NavToggle />
        <div class="docs-shell mx-auto flex min-h-screen max-w-6xl gap-8 px-6">
          <Nav />
          <main class="docs-main min-w-0 flex-1 py-8">
            {children}
            <PageFooter />
          </main>
          <div class="docs-toc-column hidden w-48 shrink-0 py-8 xl:block">
            <TableOfContents />
          </div>
        </div>
      </body>
    </html>
  );
}
````

## File: packages/docs/src/components/Nav.tsx
````typescript
/**
 * Sidebar navigation. Renders the resolved sidebar from the docs context,
 * with the current page visually highlighted.
 *
 * The site title is read from config.title. SearchDialog is embedded above
 * the link list as the default location — users who want a different layout
 * can swap the whole Layout component via config.components.Layout.
 */
import { useDocs } from "../context.js";
import { SearchDialog } from "./SearchDialog.js";
import { ThemeToggle } from "./ThemeToggle.js";

export function Nav() {
  const { config, sidebar } = useDocs();

  return (
    <nav class="docs-nav fixed inset-0 z-40 hidden w-full max-w-xs overflow-y-auto border-r border-gray-200 bg-white px-6 py-8 data-[open]:block md:static md:block md:w-56 md:max-w-none md:shrink-0 md:overflow-visible md:px-0 md:pr-6 dark:border-gray-800 dark:bg-gray-950">
      <div class="docs-nav-header mb-4 flex items-start justify-between gap-2">
        <a href="/" class="docs-nav-brand block">
          <span class="docs-nav-brand-title text-lg font-bold text-gray-900 dark:text-white">
            {config.title}
          </span>
          {config.tagline && (
            <span class="docs-nav-brand-tagline block text-xs text-gray-500 dark:text-gray-400">
              {config.tagline}
            </span>
          )}
        </a>
        <ThemeToggle />
      </div>

      <div class="docs-nav-search mb-5">
        <SearchDialog />
      </div>

      {sidebar.groups.map((group) => (
        <div class="docs-nav-group">
          {group.label !== null && (
            <p class="docs-nav-group-label mt-5 mb-1 px-3 text-xs font-semibold tracking-wider text-gray-400 uppercase dark:text-gray-500">
              {group.label}
            </p>
          )}
          <ul class="docs-nav-list space-y-1">
            {group.items.map((item) => (
              <li class="docs-nav-item">
                <a
                  href={item.href}
                  class={navLinkClass(item.kind === "page" && item.current)}
                  {...(item.kind === "link" && item.external
                    ? { target: "_blank", rel: "noopener" }
                    : {})}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function navLinkClass(current: boolean): string {
  const base = "docs-nav-link block px-3 py-1.5 rounded text-sm";
  return current
    ? `${base} docs-nav-link-current bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-medium`
    : `${base} text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800`;
}
````

## File: packages/docs/src/components/NavToggle.tsx
````typescript
/**
 * Mobile-only hamburger button that opens the sidebar. Hidden on `md:` and up.
 * The actual visibility toggle is handled by the nav/client.ts script — this
 * just emits stable markup.
 */
import { raw } from "@cjean-fr/jsx-string";

const HAMBURGER = raw(
  `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="18" y2="18"></line></svg>`,
);

const CLOSE = raw(
  `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
);

export function NavToggle() {
  return (
    <button
      type="button"
      data-docs-nav-toggle
      aria-label="Open navigation"
      aria-expanded="false"
      class="docs-nav-toggle fixed top-4 right-4 z-50 inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 shadow-md md:hidden dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
    >
      <span class="docs-nav-toggle-open">{HAMBURGER}</span>
      <span class="docs-nav-toggle-close" hidden>
        {CLOSE}
      </span>
    </button>
  );
}
````

## File: packages/docs/src/components/PageFooter.tsx
````typescript
/**
 * Bottom-of-page footer: edit-on-GitHub link + last-updated timestamp.
 * Renders nothing if neither piece of data is available.
 */
import { useDocs } from "../context.js";

export function PageFooter() {
  const { editUrl, lastUpdated } = useDocs();
  if (!editUrl && !lastUpdated) return null;

  return (
    <footer class="docs-page-footer mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 pt-6 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
      {editUrl ? (
        <a
          class="docs-page-footer-edit inline-flex items-center gap-1 hover:text-gray-900 dark:hover:text-gray-100"
          href={editUrl}
          target="_blank"
          rel="noopener"
        >
          Edit this page on GitHub →
        </a>
      ) : (
        <span />
      )}
      {lastUpdated && (
        <time class="docs-page-footer-updated" datetime={lastUpdated}>
          Last updated: {formatDate(lastUpdated)}
        </time>
      )}
    </footer>
  );
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}
````

## File: packages/docs/src/components/SearchDialog.tsx
````typescript
/**
 * Static markup for a Ctrl+K style search dialog.
 *
 * Renders accessibly without JS — the dialog stays closed until the active
 * search adapter's client script attaches. The trigger button shows a
 * keyboard-shortcut hint.
 *
 * Stable IDs (the client script depends on these):
 *   - `search-trigger` — the open-dialog button
 *   - `search-dialog`  — the <dialog> element
 *   - `search-input`   — the query input
 *   - `search-status`  — the status text element
 *   - `search-results` — the results list
 */
export function SearchDialog() {
  return (
    <>
      <button
        id="search-trigger"
        type="button"
        class="docs-search-trigger inline-flex w-full items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-500 transition-colors hover:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-gray-600"
        aria-label="Open search"
      >
        <svg
          class="docs-search-icon size-4 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
          />
        </svg>
        <span class="docs-search-trigger-label flex-1 text-left">Search…</span>
        <kbd class="docs-search-kbd hidden items-center gap-1 rounded border border-gray-300 bg-gray-50 px-1.5 py-0.5 font-mono text-xs text-gray-600 sm:inline-flex dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
          <span class="text-base leading-none">⌘</span>K
        </kbd>
      </button>

      <dialog
        id="search-dialog"
        class="docs-search-dialog m-0 mx-auto mt-[10vh] w-full max-w-lg rounded-xl bg-white p-0 shadow-2xl backdrop:bg-gray-900/40 backdrop:backdrop-blur-sm open:flex open:flex-col dark:bg-gray-900 dark:backdrop:bg-black/60"
        aria-label="Search documentation"
      >
        <div class="docs-search-input-row flex items-center gap-3 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
          <svg
            class="docs-search-icon size-5 shrink-0 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
            />
          </svg>
          <input
            id="search-input"
            type="search"
            placeholder="Loading index…"
            class="docs-search-input flex-1 bg-transparent text-gray-900 outline-none placeholder:text-gray-400 disabled:opacity-50 dark:text-gray-100"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck={false}
            disabled
            aria-label="Search query"
            aria-controls="search-results"
            aria-describedby="search-status"
          />
          <kbd class="docs-search-kbd hidden items-center rounded border border-gray-300 bg-gray-50 px-1.5 py-0.5 font-mono text-xs text-gray-500 sm:inline-flex dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
            Esc
          </kbd>
        </div>

        <p
          id="search-status"
          class="docs-search-status px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400"
        >
          Loading…
        </p>

        <ul
          id="search-results"
          class="docs-search-results m-0 hidden max-h-[60vh] overflow-y-auto py-2"
          role="listbox"
          aria-label="Search results"
        ></ul>
      </dialog>
    </>
  );
}
````

## File: packages/docs/src/components/TableOfContents.tsx
````typescript
/**
 * Placeholder for the auto-generated TOC. Renders an empty `<aside>` that
 * `injectToc()` (called post-render) finds and replaces with the actual
 * heading list. Put it in your Layout where the TOC should appear (typical:
 * right column on wide screens).
 *
 * If a page has no h2/h3, the placeholder is silently removed.
 */
import { raw } from "@cjean-fr/jsx-string";

export function TableOfContents() {
  return raw("<aside data-toc-placeholder></aside>");
}
````

## File: packages/docs/src/components/Tabs.tsx
````typescript
/**
 * Tabbed content. Static markup with all panels rendered; the client script
 * shows one at a time and persists the choice across pages via `syncKey`.
 *
 *   <Tabs syncKey="install" tabs={[
 *     { label: "Bun", content: <CodeExample src="install/bun.sh" /> },
 *     { label: "npm", content: <CodeExample src="install/npm.sh" /> },
 *   ]} />
 *
 * Tabs with the same `syncKey` synchronize (clicking "Bun" in one switches
 * every other Tabs on the page that has a "Bun" panel to it, and the choice
 * is restored on next visit).
 */
import type { JSXNode } from "@cjean-fr/jsx-string";

export interface TabsProps {
  /** Synchronization key — Tabs sharing this key share their active label. */
  syncKey?: string;
  tabs: ReadonlyArray<{ label: string; content: JSXNode }>;
}

export function Tabs({ syncKey, tabs }: TabsProps) {
  if (tabs.length === 0) return null;

  return (
    <div
      class="docs-tabs my-4 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800"
      {...(syncKey
        ? { "data-docs-tabs-sync": syncKey }
        : { "data-docs-tabs": "" })}
    >
      <div
        role="tablist"
        class="docs-tabs-list flex border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50"
      >
        {tabs.map((tab, i) => (
          <button
            type="button"
            role="tab"
            data-docs-tab-target={String(i)}
            data-docs-tab-label={tab.label}
            aria-selected={i === 0 ? "true" : "false"}
            class={tabButtonClass(i === 0)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, i) => (
        <div
          role="tabpanel"
          data-docs-tab-panel={String(i)}
          class="docs-tabs-panel p-4"
          {...(i === 0 ? {} : { hidden: true })}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}

function tabButtonClass(active: boolean): string {
  const base =
    "docs-tabs-tab px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px";
  return active
    ? `${base} docs-tabs-tab-active border-blue-500 text-blue-600 dark:text-blue-400`
    : `${base} border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100`;
}
````

## File: packages/docs/src/components/ThemeToggle.tsx
````typescript
/**
 * Dark/light theme toggle button.
 *
 * Two visible states (light, dark). System preference is the default until
 * the user explicitly picks one; subsequent visits respect their choice via
 * `localStorage`. FOUC prevention happens in <Layout> via an inline script
 * that applies the `dark` class to `<html>` BEFORE body paint.
 */
import { raw } from "@cjean-fr/jsx-string";

const SUN_ICON = raw(
  `<svg class="docs-theme-toggle-icon docs-theme-toggle-sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>`,
);

const MOON_ICON = raw(
  `<svg class="docs-theme-toggle-icon docs-theme-toggle-moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>`,
);

export function ThemeToggle() {
  return (
    <button
      type="button"
      data-docs-theme-toggle
      class="docs-theme-toggle inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
      aria-label="Toggle theme"
    >
      {SUN_ICON}
      {MOON_ICON}
    </button>
  );
}

/**
 * Returns the inline `<script>` snippet to drop in the Layout head BEFORE
 * any content paints. Reads localStorage + system preference and applies the
 * `dark` class synchronously. ~250 bytes minified.
 */
export const themeInitScript = raw(
  `<script>(function(){try{var t=localStorage.getItem("docs-theme");var d=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);if(d)document.documentElement.classList.add("dark")}catch(e){}})();</script>`,
);
````

## File: packages/docs/src/nav/client.ts
````typescript
/**
 * Mobile nav toggle behaviour.
 *
 * - `[data-docs-nav-toggle]` clicks open/close the sidebar by toggling
 *   `data-open` on the `.docs-nav` element.
 * - Clicking a link inside the open nav closes it (so navigation feels
 *   instant on mobile).
 * - `Escape` closes the open nav.
 * - The toggle's icons swap via the `hidden` attribute mirroring open state.
 */

const NAV_SELECTOR = ".docs-nav";
const TOGGLE_SELECTOR = "[data-docs-nav-toggle]";

function isOpen(nav: Element): boolean {
  return nav.hasAttribute("data-open");
}

function setOpen(open: boolean): void {
  const nav = document.querySelector(NAV_SELECTOR);
  const toggle = document.querySelector(TOGGLE_SELECTOR);
  if (!nav) return;
  if (open) nav.setAttribute("data-open", "");
  else nav.removeAttribute("data-open");
  toggle?.setAttribute("aria-expanded", String(open));
  // Swap toggle icons.
  toggle
    ?.querySelector(".docs-nav-toggle-open")
    ?.toggleAttribute("hidden", open);
  toggle
    ?.querySelector(".docs-nav-toggle-close")
    ?.toggleAttribute("hidden", !open);
  // Lock body scroll when nav is full-screen on mobile.
  document.body.style.overflow = open ? "hidden" : "";
}

document.addEventListener("click", (e) => {
  const target = e.target as Element | null;
  if (!target) return;

  // Toggle button.
  if (target.closest(TOGGLE_SELECTOR)) {
    const nav = document.querySelector(NAV_SELECTOR);
    setOpen(nav ? !isOpen(nav) : false);
    return;
  }

  // Link inside open nav.
  const navOpen = document.querySelector(`${NAV_SELECTOR}[data-open]`);
  if (navOpen && target.closest("a")) {
    setOpen(false);
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const navOpen = document.querySelector(`${NAV_SELECTOR}[data-open]`);
    if (navOpen) setOpen(false);
  }
});

export {};
````

## File: packages/docs/src/theme/tokens.css
````css
/**
 * Theme tokens. Override these in your own CSS to retheme without forking
 * components.
 *
 *   :root { --docs-color-accent: #ec4899; }   in your styles file.
 *
 * The default light scheme is white background, blue accent. The dark scheme
 * activates whenever the `dark` class is present on <html> (set by
 * <ThemeToggle> in Phase 2).
 */

:root {
  /* Colors */
  --docs-color-bg: #ffffff;
  --docs-color-text: #111827;
  --docs-color-muted: #6b7280;
  --docs-color-accent: #2563eb;
  --docs-color-accent-soft: #eff6ff;
  --docs-color-border: #e5e7eb;
  --docs-color-mark-bg: #fef08a;

  /* Code blocks */
  --docs-code-bg: #030712;
  --docs-code-text: #f3f4f6;
  --docs-code-border: #1f2937;

  /* Typography */
  --docs-font-body:
    ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  --docs-font-mono:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
    "Courier New", monospace;

  /* Layout */
  --docs-shell-max-width: 64rem;
  --docs-sidebar-width: 14rem;
  --docs-content-padding: 1.5rem;
}

.dark {
  --docs-color-bg: #030712;
  --docs-color-text: #f3f4f6;
  --docs-color-muted: #9ca3af;
  --docs-color-accent: #60a5fa;
  --docs-color-accent-soft: #172554;
  --docs-color-border: #1f2937;
  --docs-color-mark-bg: #a16207;

  --docs-code-bg: #111827;
  --docs-code-border: #1f2937;
}
````

## File: packages/docs/src/toc/client.ts
````typescript
/**
 * Client-side TOC scroll-spy.
 *
 * Watches every `<h2>` / `<h3>` inside `<main>` with an IntersectionObserver
 * and toggles `is-active` on the corresponding TOC link. The "current
 * section" is the highest intersecting heading.
 *
 * Server-side TOC ids are assigned by `injectToc()` in src/toc.ts. The links
 * here just react to which headings are visible.
 */

const toc = document.querySelector(".docs-toc");
if (toc instanceof HTMLElement) {
  installScrollSpy(toc);
}

function installScrollSpy(toc: HTMLElement): void {
  const headings = Array.from(
    document.querySelectorAll<HTMLElement>("main h2[id], main h3[id]"),
  );
  if (headings.length === 0) return;

  const visible = new Set<string>();

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const id = entry.target.id;
        if (entry.isIntersecting) {
          visible.add(id);
        } else {
          visible.delete(id);
        }
      }
      // Active = first intersecting heading in document order.
      let activeId: string | null = null;
      for (const h of headings) {
        if (visible.has(h.id)) {
          activeId = h.id;
          break;
        }
      }
      toc
        .querySelectorAll<HTMLAnchorElement>(".docs-toc-link")
        .forEach((link) => {
          const isActive =
            activeId !== null && link.getAttribute("href") === `#${activeId}`;
          link.classList.toggle("is-active", isActive);
          if (isActive) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
    },
    {
      // Trigger when the heading enters the top quarter of the viewport.
      rootMargin: "0% 0% -75% 0%",
      threshold: 0,
    },
  );

  for (const h of headings) observer.observe(h);
}

export {};
````

## File: packages/docs/src/client.ts
````typescript
/**
 * Default client entry for `@cjean-fr/docs`. Add `import "@cjean-fr/docs/client"`
 * to your project's client bundle (e.g. inside `client.ts`) and all default
 * client-side enhancements get wired automatically:
 *
 *   - builtin search adapter runtime
 *   - TOC scroll-spy
 *
 * When other adapters ship, the search import becomes adapter-aware via
 * virtual module rewrite by the Vite plugin.
 */
import "./nav/client.js";
import "./tabs/client.js";
import "./theme/client.js";
import "./toc/client.js";
import "@cjean-fr/build-core/search/builtin/client";
````

## File: packages/docs/src/config.ts
````typescript
/**
 * `defineConfig(config)` — input validation + default filling.
 *
 * Returns a `ResolvedDocsConfig` consumed by the build pipeline and the Vite
 * plugin. Calling it explicitly in `docs.config.ts` gives the user TS
 * autocomplete and catches typos at compile time.
 */
import { Layout } from "./components/Layout.js";
import type { DocsConfig, ResolvedDocsConfig } from "./types.js";
import { builtin } from "@cjean-fr/build-core/search";

const DEFAULTS = {
  pages: "./pages",
  examples: "./examples",
  clientEntry: "src/client.ts",
  out: "./dist",
  base: "/",
  viteManifest: "dist/assets/.vite/manifest.json",
} as const;

export function defineConfig(config: DocsConfig): ResolvedDocsConfig {
  if (!config.title) {
    throw new Error("[@cjean-fr/docs] defineConfig(): `title` is required.");
  }

  return {
    title: config.title,
    tagline: config.tagline ?? null,
    description: config.description ?? config.title,
    pages: config.pages ?? DEFAULTS.pages,
    examples: config.examples ?? DEFAULTS.examples,
    clientEntry: config.clientEntry ?? DEFAULTS.clientEntry,
    out: config.out ?? DEFAULTS.out,
    base: normalizeBase(config.base ?? DEFAULTS.base),
    viteManifest: config.viteManifest ?? DEFAULTS.viteManifest,
    sidebar: config.sidebar ?? "auto",
    editUrl: config.editUrl ?? null,
    site: config.site ?? null,
    sitemap: config.sitemap !== false && Boolean(config.site),
    rss:
      config.rss === undefined || config.rss === false
        ? false
        : config.rss === true
          ? {}
          : config.rss,
    search: config.search === undefined ? builtin() : config.search,
    components: {
      Layout: config.components?.Layout ?? Layout,
    },
  };
}

function normalizeBase(base: string): string {
  if (!base.startsWith("/")) base = "/" + base;
  if (!base.endsWith("/")) base = base + "/";
  return base;
}
````

## File: packages/docs/src/context.ts
````typescript
/**
 * Render-scope context shared by all built-in components.
 *
 * The builder calls `setDocs(...)` once per page render. Components like
 * `<Layout>`, `<Nav>`, `<SearchDialog>` read it with `useDocs()`. Users who
 * write their own components can call `useDocs()` too.
 */
import type { PageMeta, ResolvedDocsConfig, ResolvedSidebar } from "./types.js";
import {
  context,
  setContext,
  useContext,
  type Context,
} from "@cjean-fr/jsx-string";

export interface DocsRenderContext {
  /** The resolved configuration (with all defaults filled in). */
  config: ResolvedDocsConfig;
  /** URL of the page currently being rendered. */
  currentPage: string;
  /** Meta of the page currently being rendered. */
  meta: PageMeta;
  /** Sidebar groups, with the current page already flagged. */
  sidebar: ResolvedSidebar;
  /** ISO 8601 last-modified date for the page (meta.updatedAt or git log). */
  lastUpdated: string | null;
  /** Resolved edit URL for the current page, or null when not configured. */
  editUrl: string | null;
}

const DocsContext: Context<DocsRenderContext> = context<DocsRenderContext>(
  "@cjean-fr/docs:render",
);

/** Configure the docs context for the current render scope. */
export function setDocs(value: DocsRenderContext): void {
  setContext(DocsContext, value);
}

/** Read the docs context — throws if called outside an active render scope. */
export function useDocs(): DocsRenderContext {
  return useContext(DocsContext);
}

/** Exposed for plugin authors who want to read the raw context token. */
export { DocsContext };
````

## File: packages/docs/src/index.ts
````typescript
/**
 * @cjean-fr/docs — documentation site builder.
 *
 * @module
 */

// Config helper
export { defineConfig } from "./config.js";

// Build entry
export { build, type BuildResult, type BuildOptions } from "./build.js";

// Components
export { Layout } from "./components/Layout.js";
export { Nav } from "./components/Nav.js";
export { SearchDialog } from "./components/SearchDialog.js";
export { CodeBlock, type CodeBlockProps } from "./components/CodeBlock.js";
export {
  CodeExample,
  type CodeExampleProps,
} from "./components/CodeExample.js";
export { TableOfContents } from "./components/TableOfContents.js";
export { ThemeToggle, themeInitScript } from "./components/ThemeToggle.js";
export { NavToggle } from "./components/NavToggle.js";
export { Aside, type AsideProps, type AsideType } from "./components/Aside.js";
export { Tabs, type TabsProps } from "./components/Tabs.js";
export { PageFooter } from "./components/PageFooter.js";

// Context (for custom components)
export {
  useDocs,
  setDocs,
  DocsContext,
  type DocsRenderContext,
} from "./context.js";

// Sidebar — docs-specific UX
export { resolveSidebar } from "./sidebar.js";

// Re-export commonly-used kernel primitives so consumers don't need a
// separate `@cjean-fr/build-core` import for the typical case.
export {
  discoverPages,
  getLastModified,
  preloadLastModified,
  resolveEditUrl,
  generateSitemap,
  generateRss,
  injectToc,
  slugify,
  type TocEntry,
  type SitemapInput,
  type RssInput,
  type Page,
  type PageMeta,
  type SearchAdapter,
  type SearchBuildInput,
  type SearchServeInput,
} from "@cjean-fr/build-core";

// Docs-specific types
export type {
  SidebarConfig,
  SidebarGroup,
  SidebarItem,
  SidebarLink,
  DocsConfig,
  ResolvedDocsConfig,
  LayoutProps,
  LayoutComponent,
  ResolvedSidebar,
  ResolvedSidebarItem,
  ResolvedSidebarPage,
  ResolvedSidebarLink,
} from "./types.js";
````

## File: packages/docs/src/sidebar.ts
````typescript
/**
 * Resolve `config.sidebar` against the discovered pages.
 *
 * Three input shapes (DOCS_SPEC §5.1 Q4):
 *
 *   `'auto'`               → groups inferred from `meta.sidebar.group`,
 *                            alphabetical group order, items ordered by
 *                            `meta.sidebar.order` then label.
 *
 *   `['Guide', 'API']`     → explicit group order, items still auto-discovered
 *                            from `meta.sidebar.group`.
 *
 *   `[{ label, items }, …]`→ fully explicit tree. Items are page slugs
 *                            (including `*` glob suffix) or external links.
 *
 * The output is a `ResolvedSidebar` with `current` flagged on the matching
 * page item.
 */
import type {
  PageMeta,
  ResolvedSidebar,
  ResolvedSidebarItem,
  SidebarConfig,
  SidebarGroup,
  SidebarItem,
  SidebarLink,
} from "./types.js";
import type { Page as CorePage } from "@cjean-fr/build-core";

/** Docs view of `DocsPage` — uses the augmented PageMeta with `sidebar`/`layout` fields. */
type DocsPage = Omit<CorePage, "meta"> & { meta: PageMeta };

export function resolveSidebar(
  pages: readonly DocsPage[],
  config: SidebarConfig,
  currentUrl: string,
): ResolvedSidebar {
  const visible = pages.filter((p) => !p.meta.sidebar?.hidden);

  if (config === "auto") {
    return resolveAuto(visible, currentUrl);
  }
  if (isStringArray(config)) {
    return resolveGroupList(visible, config, currentUrl);
  }
  return resolveExplicit(visible, config, currentUrl);
}

// ─────────────────────────────────────────────────────────────────────────────
// Level 1: auto
// ─────────────────────────────────────────────────────────────────────────────

function resolveAuto(
  pages: readonly DocsPage[],
  currentUrl: string,
): ResolvedSidebar {
  const ungrouped: DocsPage[] = [];
  const byGroup = new Map<string, DocsPage[]>();

  for (const page of pages) {
    const group = page.meta.sidebar?.group;
    if (group == null) {
      ungrouped.push(page);
    } else {
      const arr = byGroup.get(group) ?? [];
      arr.push(page);
      byGroup.set(group, arr);
    }
  }

  const groups: ResolvedSidebar["groups"][number][] = [];

  if (ungrouped.length > 0) {
    groups.push({
      label: null,
      items: sortPages(ungrouped).map((p) => pageToItem(p, currentUrl)),
    });
  }

  const groupNames = [...byGroup.keys()].sort((a, b) => a.localeCompare(b));
  for (const name of groupNames) {
    groups.push({
      label: name,
      items: sortPages(byGroup.get(name)!).map((p) =>
        pageToItem(p, currentUrl),
      ),
    });
  }

  return { groups };
}

// ─────────────────────────────────────────────────────────────────────────────
// Level 2: explicit group order, auto items
// ─────────────────────────────────────────────────────────────────────────────

function resolveGroupList(
  pages: readonly DocsPage[],
  groupOrder: readonly string[],
  currentUrl: string,
): ResolvedSidebar {
  const byGroup = new Map<string, DocsPage[]>();
  const ungrouped: DocsPage[] = [];
  const usedGroups = new Set(groupOrder);

  for (const page of pages) {
    const group = page.meta.sidebar?.group;
    if (group == null) {
      ungrouped.push(page);
    } else if (usedGroups.has(group)) {
      const arr = byGroup.get(group) ?? [];
      arr.push(page);
      byGroup.set(group, arr);
    }
  }

  const groups: ResolvedSidebar["groups"][number][] = [];

  if (ungrouped.length > 0) {
    groups.push({
      label: null,
      items: sortPages(ungrouped).map((p) => pageToItem(p, currentUrl)),
    });
  }

  for (const name of groupOrder) {
    const list = byGroup.get(name);
    if (!list || list.length === 0) continue; // empty groups silently omitted
    groups.push({
      label: name,
      items: sortPages(list).map((p) => pageToItem(p, currentUrl)),
    });
  }

  return { groups };
}

// ─────────────────────────────────────────────────────────────────────────────
// Level 3: fully explicit
// ─────────────────────────────────────────────────────────────────────────────

function resolveExplicit(
  pages: readonly DocsPage[],
  config: readonly SidebarGroup[],
  currentUrl: string,
): ResolvedSidebar {
  const byUrl = new Map(pages.map((p) => [p.url, p] as const));
  const groups: ResolvedSidebar["groups"][number][] = [];

  for (const group of config) {
    const items: ResolvedSidebarItem[] = [];
    for (const item of group.items) {
      items.push(...resolveItem(item, pages, byUrl, currentUrl));
    }
    if (items.length > 0) {
      groups.push({ label: group.label, items });
    }
  }

  return { groups };
}

function resolveItem(
  item: SidebarItem,
  pages: readonly DocsPage[],
  byUrl: ReadonlyMap<string, DocsPage>,
  currentUrl: string,
): ResolvedSidebarItem[] {
  if (typeof item === "string")
    return resolveSlug(item, pages, byUrl, currentUrl);
  if (isLink(item)) {
    return [
      {
        kind: "link",
        label: item.label,
        href: item.href,
        external: item.external ?? /^https?:/.test(item.href),
      },
    ];
  }
  // Nested group — Phase 1 flattens (no recursion in the visual tree).
  // Future enhancement: render nested groups visually.
  const flat: ResolvedSidebarItem[] = [];
  for (const child of item.items) {
    flat.push(...resolveItem(child, pages, byUrl, currentUrl));
  }
  return flat;
}

function resolveSlug(
  slug: string,
  pages: readonly DocsPage[],
  byUrl: ReadonlyMap<string, DocsPage>,
  currentUrl: string,
): ResolvedSidebarItem[] {
  // Wildcard suffix — e.g. `api/*` matches all pages whose URL starts with `/api/`.
  if (slug.endsWith("/*")) {
    const prefix = "/" + slug.slice(0, -1); // `api/*` → `/api/`
    const matches = pages.filter((p) => p.url.startsWith(prefix));
    return sortPages(matches).map((p) => pageToItem(p, currentUrl));
  }

  const url = "/" + slug;
  const page = byUrl.get(url);
  if (!page) {
    throw new Error(
      `[@cjean-fr/docs] sidebar references slug "${slug}" but no page has URL "${url}".`,
    );
  }
  return [pageToItem(page, currentUrl)];
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function sortPages(pages: readonly DocsPage[]): DocsPage[] {
  return [...pages].sort((a, b) => {
    const oa = a.meta.sidebar?.order ?? Number.POSITIVE_INFINITY;
    const ob = b.meta.sidebar?.order ?? Number.POSITIVE_INFINITY;
    if (oa !== ob) return oa - ob;
    return (a.meta.sidebar?.label ?? a.meta.title).localeCompare(
      b.meta.sidebar?.label ?? b.meta.title,
    );
  });
}

function pageToItem(page: DocsPage, currentUrl: string): ResolvedSidebarItem {
  return {
    kind: "page",
    label: page.meta.sidebar?.label ?? page.meta.title,
    href: page.url,
    current: page.url === currentUrl,
  };
}

function isStringArray(v: SidebarConfig): v is readonly string[] {
  return Array.isArray(v) && v.every((x) => typeof x === "string");
}

function isLink(v: SidebarItem): v is SidebarLink {
  return typeof v === "object" && v !== null && "href" in v;
}
````

## File: packages/docs/src/toc.ts
````typescript
/**
 * Docs TOC markup renderer.
 *
 * Supplied to build-core via the `renderToc` hook: build-core does the
 * heading-id assignment + entry extraction (presentation-free); this owns the
 * markup and Tailwind classes. Pairs with `<TableOfContents />`, which emits
 * the `data-toc-placeholder` that build-core replaces with this output.
 */
import type { TocEntry } from "@cjean-fr/build-core";

export function renderToc(entries: readonly TocEntry[]): string {
  const items = entries
    .map(
      (e) =>
        `<li class="docs-toc-entry docs-toc-level-${e.level} m-0">` +
        `<a href="#${e.id}" class="docs-toc-link block py-1 ${e.level === 3 ? "pl-6 text-xs" : "pl-3"} text-sm text-gray-500 dark:text-gray-400 border-l-2 border-transparent hover:text-gray-900 dark:hover:text-gray-100 -ml-px transition-colors aria-[current=true]:text-blue-600 dark:aria-[current=true]:text-blue-400 aria-[current=true]:border-blue-500">${escapeHtml(e.text)}</a>` +
        `</li>`,
    )
    .join("");
  return (
    `<aside class="docs-toc sticky top-8 text-sm" aria-label="Table of contents">` +
    `<p class="docs-toc-title m-0 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">On this page</p>` +
    `<ul class="docs-toc-list list-none p-0 m-0 border-l border-gray-200 dark:border-gray-800">${items}</ul>` +
    `</aside>`
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
````

## File: packages/docs/src/types.ts
````typescript
/**
 * Docs-distro types — opinionated for documentation sites.
 *
 * Generic kernel types (`PageMeta`, `Page`, `SearchAdapter`, …) live in
 * `@cjean-fr/build-core` and are re-exported from the package root.
 */
import type {
  PageMeta as CorePageMeta,
  SearchAdapter,
} from "@cjean-fr/build-core";
import type { JSXNode } from "@cjean-fr/jsx-string";

// ─────────────────────────────────────────────────────────────────────────────
// Docs-augmented PageMeta — adds sidebar + layout fields
// ─────────────────────────────────────────────────────────────────────────────

export interface PageMeta extends CorePageMeta {
  /** Sidebar positioning. */
  sidebar?: {
    /** Override the sidebar label. Defaults to `title`. */
    label?: string;
    /** Sort within a group. Lower numbers come first. */
    order?: number;
    /** Group this page belongs to (matched against config.sidebar level 2). */
    group?: string;
    /** Exclude from the sidebar (page is still built). */
    hidden?: boolean;
  };

  /** Override the default Layout for this page only. */
  layout?: LayoutComponent | false;
}

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar config — docs-specific UX
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Progressive disclosure: pass `'auto'`, a list of group names, or a full
 * tree. See DOCS_SPEC.md §5.1 + Q4.
 */
export type SidebarConfig =
  | "auto"
  | readonly string[]
  | readonly SidebarGroup[];

export interface SidebarGroup {
  label: string;
  items: readonly SidebarItem[];
}

export type SidebarItem = string | SidebarLink | SidebarGroup;

export interface SidebarLink {
  label: string;
  /** Either a page slug (resolved by routing) or an absolute URL. */
  href: string;
  /** When `true`, marks this as an external link (opens in a new tab). */
  external?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// User config
// ─────────────────────────────────────────────────────────────────────────────

export interface DocsConfig {
  /** Site title. Used in `<title>` and the nav header. */
  title: string;

  /** Short tagline shown in the sidebar under the title (e.g. "Documentation"). */
  tagline?: string;

  /** Site-wide description. Used as default `<meta name="description">`. */
  description?: string;

  /** Directory containing `.tsx` page files. Default: `"./pages"`. */
  pages?: string;

  /** Directory containing `<CodeExample>` source files. Default: `"./examples"`. */
  examples?: string;

  /** Path of the project's client entry (the file Vite bundles for the browser). Default: `"src/client.ts"`. */
  clientEntry?: string;

  /** Output directory for the static build. Default: `"./dist"`. */
  out?: string;

  /** Public path prefix for assets. Default: `"/"`. */
  base?: string;

  /** Path to the Vite manifest, relative to project root. Default: auto. */
  viteManifest?: string;

  /** Sidebar configuration — see SidebarConfig. Default: `'auto'`. */
  sidebar?: SidebarConfig;

  /**
   * Edit-on-GitHub link template. `{slug}` is substituted with the page file
   * path relative to the project root. Disables the link if absent.
   */
  editUrl?: string;

  /**
   * Public origin URL of the deployed site (e.g. `"https://docs.example.com"`).
   * Required for sitemap.xml and feed.xml generation; without it, neither
   * file is emitted.
   */
  site?: string;

  /** Generate sitemap.xml at build (requires `site`). Default: `true` when `site` is set. */
  sitemap?: boolean;

  /** Generate feed.xml at build (requires `site`). Default: `false`. */
  rss?: boolean | { title?: string; description?: string; language?: string };

  /** Search adapter — pass `builtin()`, custom adapter, or `false`. */
  search?: SearchAdapter | false;

  /** Override built-in components. */
  components?: {
    Layout?: LayoutComponent;
  };
}

/**
 * The shape returned by `defineConfig()` — same as DocsConfig but with all
 * defaults filled in. Consumed by the builder and the Vite plugin.
 */
export interface ResolvedDocsConfig {
  title: string;
  tagline: string | null;
  description: string;
  pages: string;
  examples: string;
  clientEntry: string;
  out: string;
  base: string;
  viteManifest: string;
  sidebar: SidebarConfig;
  editUrl: string | null;
  site: string | null;
  sitemap: boolean;
  rss: false | { title?: string; description?: string; language?: string };
  search: SearchAdapter | false;
  components: {
    Layout: LayoutComponent;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Layout contract
// ─────────────────────────────────────────────────────────────────────────────

export interface LayoutProps {
  children: JSXNode;
}

export type LayoutComponent = (props: LayoutProps) => JSXNode;

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar resolution (post-build)
// ─────────────────────────────────────────────────────────────────────────────

/** Resolved sidebar after applying config + page discovery. */
export interface ResolvedSidebar {
  groups: ReadonlyArray<{
    label: string | null;
    items: ReadonlyArray<ResolvedSidebarItem>;
  }>;
}

export type ResolvedSidebarItem = ResolvedSidebarPage | ResolvedSidebarLink;

export interface ResolvedSidebarPage {
  kind: "page";
  label: string;
  href: string;
  /** True when this item matches the currently rendered page. */
  current: boolean;
}

export interface ResolvedSidebarLink {
  kind: "link";
  label: string;
  href: string;
  external: boolean;
}
````

## File: packages/docs/README.md
````markdown
# @cjean-fr/docs

> 🚧 Early development — version 0.1.0.

Documentation site builder on top of [@cjean-fr/jsx-string](../jsx-string) +
[jsx-flow](../jsx-flow) + [jsx-vite](../jsx-vite).

Status: **Phases 1–2** shipped. See [`DOCS_SPEC.md`](../DOCS_SPEC.md) for the
full design.

## Theming

Tailwind 4 is the theming layer. In your stylesheet:

```css
@import "tailwindcss";
@import "@cjean-fr/docs/main.css";
```

`main.css` ships as source — your Tailwind compiles it. It wires the
`dark:` variant to the `.dark` class on `<html>` (so the built-in
ThemeToggle works), imports the theme tokens and Shiki rules, and tells
Tailwind to scan the published docs JS bundles so utility classes
referenced by built-in components are generated. `docs init` sets this up
for you.

## License

MIT © Christophe Jean
````

## File: packages/eslint-plugin-jsx-string/src/rules/no-context.ts
````typescript
import { ESLintUtils } from "@typescript-eslint/utils";

export const noContext = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    type: "problem",
    docs: {
      description: "Disallow React Context usage.",
    },

    schema: [],
    messages: {
      noContext:
        "React Context is not compatible with @cjean-fr/jsx-string. Use props or a Registry.",
    },
  },
  defaultOptions: [],
  create(context) {
    const contextIdentifiers = new Set<string>();

    const isCreateContext = (callee: any) =>
      (callee.type === "Identifier" && callee.name === "createContext") ||
      (callee.type === "MemberExpression" &&
        callee.property.type === "Identifier" &&
        callee.property.name === "createContext");

    return {
      CallExpression(node) {
        if (isCreateContext(node.callee)) {
          context.report({
            node,
            messageId: "noContext",
          });
        }
      },
      VariableDeclarator(node) {
        if (
          node.init &&
          node.init.type === "CallExpression" &&
          isCreateContext(node.init.callee) &&
          node.id.type === "Identifier"
        ) {
          contextIdentifiers.add(node.id.name);
        }
      },
      JSXMemberExpression(node) {
        if (
          node.property.type === "JSXIdentifier" &&
          node.property.name === "Provider" &&
          node.object.type === "JSXIdentifier" &&
          contextIdentifiers.has(node.object.name)
        ) {
          context.report({
            node,
            messageId: "noContext",
          });
        }
      },
    };
  },
});
````

## File: packages/eslint-plugin-jsx-string/src/rules/no-unsafe-event-handlers.ts
````typescript
import { ESLintUtils } from "@typescript-eslint/utils";

export const noUnsafeEventHandlers = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    type: "suggestion",
    docs: {
      description: "Warn about event handlers which might be unsafely handled.",
    },

    schema: [],
    messages: {
      unsafeHandler:
        "Event handler attribute detected. @cjean-fr/jsx-string will escape it to ensure HTML validity, but be cautious about the injected JS code.",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXAttribute(node) {
        if (
          node.name.type === "JSXIdentifier" &&
          /^on[A-Za-z]/.test(node.name.name)
        ) {
          context.report({
            node,
            messageId: "unsafeHandler",
          });
        }
      },
    };
  },
});
````

## File: packages/eslint-plugin-jsx-string/src/index.ts
````typescript
import { noContext } from "./rules/no-context.js";
import { noJavascriptUrls } from "./rules/no-javascript-urls.js";
import { noReactHooks } from "./rules/no-react-hooks.js";
import { noReactImports } from "./rules/no-react-imports.js";
import { noRefs } from "./rules/no-refs.js";
import { noUnsafeEventHandlers } from "./rules/no-unsafe-event-handlers.js";

const rules = {
  "no-react-imports": noReactImports,
  "no-react-hooks": noReactHooks,
  "no-unsafe-event-handlers": noUnsafeEventHandlers,
  "no-javascript-urls": noJavascriptUrls,
  "no-context": noContext,
  "no-refs": noRefs,
};

const plugin: any = {
  rules,
};

const configs = {
  recommended: {
    plugins: {
      "@cjean-fr/jsx-string": plugin,
    },
    rules: {
      "@cjean-fr/jsx-string/no-react-imports": "error",
      "@cjean-fr/jsx-string/no-react-hooks": "error",
      "@cjean-fr/jsx-string/no-unsafe-event-handlers": "warn",
      "@cjean-fr/jsx-string/no-javascript-urls": "error",
      "@cjean-fr/jsx-string/no-context": "error",
      "@cjean-fr/jsx-string/no-refs": "error",
    },
  },
};

plugin.configs = configs;

export default plugin;
````

## File: packages/eslint-plugin-jsx-string/package.json
````json
{
  "name": "@cjean-fr/eslint-plugin-jsx-string",
  "version": "0.1.0",
  "description": "ESLint plugin for @cjean-fr/jsx-string to ensure static rendering compatibility",
  "author": "Christophe Jean",
  "license": "MIT",
  "homepage": "https://github.com/cjean-fr/atelier/tree/main/packages/eslint-plugin-jsx-string#readme",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/cjean-fr/atelier.git",
    "directory": "packages/eslint-plugin-jsx-string"
  },
  "bugs": {
    "url": "https://github.com/cjean-fr/atelier/issues"
  },
  "keywords": [
    "eslint",
    "eslintplugin",
    "jsx-string",
    "react",
    "static-rendering",
    "xss-prevention"
  ],
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "engines": {
    "node": ">=24.0.0"
  },
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "publishConfig": {
    "access": "public"
  },
  "scripts": {
    "build": "tsc",
    "test": "bun test",
    "check": "tsc --noEmit",
    "format": "prettier --write \"**/*.{ts,json,md}\""
  },
  "peerDependencies": {
    "eslint": ">=8",
    "@cjean-fr/jsx-string": ">=1.3.0"
  },
  "devDependencies": {
    "@typescript-eslint/parser": "catalog:",
    "@typescript-eslint/rule-tester": "catalog:",
    "@typescript-eslint/utils": "catalog:",
    "@types/bun": "catalog:",
    "eslint": "catalog:",
    "typescript": "catalog:"
  },
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ]
}
````

## File: packages/eslint-plugin-jsx-string/README.md
````markdown
# @cjean-fr/eslint-plugin-jsx-string

ESLint plugin for `@cjean-fr/jsx-string` to ensure compatibility with static rendering.

## Installation

```bash
bun add -D @cjean-fr/eslint-plugin-jsx-string
# or
npm install --save-dev @cjean-fr/eslint-plugin-jsx-string
```

## Usage (Flat Config)

Add the plugin to your `eslint.config.js`:

```javascript
import jsxString from "@cjean-fr/eslint-plugin-jsx-string";

export default [
  jsxString.configs.recommended,
  {
    rules: {
      // You can override rules if needed
      "@cjean-fr/jsx-string/no-unsafe-event-handlers": "warn",
    },
  },
];
```

## Rules

| Rule                       | Description                                                | Default |
| -------------------------- | ---------------------------------------------------------- | ------- |
| `no-react-imports`         | Disallow React and React-DOM imports.                      | `error` |
| `no-react-hooks`           | Disallow React hooks usage (useState, useEffect, etc).     | `error` |
| `no-unsafe-event-handlers` | Warn about event handlers which might be unsafely handled. | `warn`  |
| `no-javascript-urls`       | Disallow `javascript:` URLs in href attributes.            | `error` |
| `no-context`               | Disallow React Context usage.                              | `error` |
| `no-refs`                  | Disallow React refs usage.                                 | `error` |

## License

MIT © Christophe Jean

---

<p align="center">Made with ❤️ in Paris</p>
````

## File: packages/jsonresume-theme-cjean/src/components/Period.tsx
````typescript
import { t } from "../lib/i18n.js";
import DateTime, { type DateTimeProps } from "./DateTime.js";
import type { HTMLAttributes } from "@cjean-fr/jsx-string";

interface PeriodProps extends HTMLAttributes {
  startDate?: string | Date;
  endDate?: string | Date;
  format?: DateTimeProps["format"];
}

export default function Period({
  startDate,
  endDate,
  format,
  ...props
}: PeriodProps) {
  if (!startDate && !endDate) return null;

  return (
    <div {...props}>
      {startDate ? (
        <>
          <DateTime date={startDate} format={format} />
          {"\u00A0\u2014\u00A0"}
          {endDate ? (
            <DateTime date={endDate} format={format} />
          ) : (
            <span className="text-primary font-bold">{t("present")}</span>
          )}
        </>
      ) : (
        <DateTime date={endDate!} format={format} />
      )}
    </div>
  );
}
````

## File: packages/jsonresume-theme-cjean/src/components/ProfilePageJsonLd.tsx
````typescript
import { t } from "../lib/i18n.js";
import type { Resume } from "../schema.js";

function getProfilePageJsonLd(resume: Resume) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: resume.basics.label
      ? t("profile_page_name", {
          name: resume.basics.name,
          label: resume.basics.label,
        })
      : resume.basics.name,
    description: resume.basics.summary,
    dateModified: resume.meta.lastModified,
    mainEntity: {
      "@type": "Person",
      name: resume.basics.name,
      birthDate: resume.basics.birthDate,
      jobTitle: resume.basics.label,
      url: resume.basics.url,
      description: resume.basics.summary,
      image: resume.basics.image,
      email: resume.basics.email,
      telephone: resume.basics.phone,
      address: {
        "@type": "PostalAddress",
        addressLocality: resume.basics.location?.city,
        addressRegion: resume.basics.location?.region,
        postalCode: resume.basics.location?.postalCode,
        addressCountry: resume.basics.location?.countryCode,
      },
      alumniOf: resume.education.map((edu) => ({
        "@type": "EducationalOrganization",
        name: edu.institution,
        url: edu.url,
      })),
      worksFor: resume.work.map((job) => {
        return {
          "@type": "Organization",
          name: job.name,
          location: job.location,
          member: {
            "@type": "OrganizationRole",
            roleName: job.position,
          },
          url: job.url,
        };
      }),
      sameAs: resume.basics.profiles?.map((p) => p.url).filter(Boolean),
      knowsAbout: resume.skills.flatMap((s) => s.keywords || []),
    },
  };
}

export function ProfilePageJsonLd({ resume }: { resume: Resume }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getProfilePageJsonLd(resume)),
      }}
    />
  );
}
````

## File: packages/jsonresume-theme-cjean/src/components/StructuredData.tsx
````typescript
export function StructuredData({ json }: { json: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(json),
      }}
    />
  );
}
````

## File: packages/jsonresume-theme-cjean/.gitignore
````
resume.json
resume.html
public
````

## File: packages/jsonresume-theme-cjean/tsconfig.json
````json
{
  "extends": "../../packages/typescript-config/base.json",
  "compilerOptions": {
    "types": ["vite/client", "react"],
    "jsx": "react-jsx",
    "jsxImportSource": "@cjean-fr/jsx-string",
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
````

## File: packages/jsx-flow/src/components/Patch.tsx
````typescript
import type { MergeType } from "../adapters.js";
import { Flow } from "../context.js";
import { useContext, type JSXNode } from "@cjean-fr/jsx-string";

export interface PatchProps {
  /** Id of the existing DOM element to target. */
  target: string;
  merge?: MergeType;
  // Factory, not a node — JSX evaluates eagerly; the thunk defers rendering to streaming time.
  children: () => JSXNode;
}

/** Pushes a fragment to an existing DOM target without rendering a placeholder. */
export function Patch({
  target,
  merge = "replace",
  children,
}: PatchProps): any {
  const { patch } = useContext(Flow);
  patch(target, children, merge);
  return null;
}
````

## File: packages/jsx-flow/src/adapters.tsx
````typescript
// @jsxImportSource @cjean-fr/jsx-string
import { injectIntoHead } from "./utils.js";
import { raw, type JSXNode } from "@cjean-fr/jsx-string";

export type MergeType = "replace" | "append" | "prepend" | "before" | "after";

export type PatchAdapter = {
  /** Renders the placeholder in the shell (both streaming and SSG). */
  Placeholder(props: {
    id: string;
    src: string | null;
    children: JSXNode;
  }): JSXNode;
  /** Renders a fragment for inline streaming — arrives in the same HTTP response as the shell. */
  Patch(props: { id: string; children: JSXNode; merge: MergeType }): JSXNode;
  /** Renders a fragment as a standalone file response for SSG lazy-loading. */
  Frame(props: { id: string; children: JSXNode }): JSXNode;
  /**
   * Optional shell transformation applied before streaming fragments.
   * Use it to inject adapter-specific scripts or markup into the rendered shell HTML.
   */
  transformShell?(shell: string): string;
};

export const TurboAdapter: PatchAdapter = {
  Placeholder: function ({ id, src, children }) {
    return src ? (
      <turbo-frame id={id} src={src}>
        {children}
      </turbo-frame>
    ) : (
      <turbo-frame id={id}>{children}</turbo-frame>
    );
  },

  // Inline streaming: <turbo-stream> tells Turbo how to patch the live DOM.
  Patch: ({ id, children, merge }) => (
    <turbo-stream action={merge} target={id}>
      <template>{children}</template>
    </turbo-stream>
  ),

  // SSG lazy-load: Turbo fetches src and looks for a matching <turbo-frame> in the response.
  Frame: ({ id, children }) => <turbo-frame id={id}>{children}</turbo-frame>,
};

// https://github.com/WICG/declarative-partial-updates
// Pure spec adapter — replace only, zero JS.
// ⚠️  Experimental: requires chrome://flags/#enable-experimental-web-platform-features.
// Add a polyfill in your shell component (e.g. template-for-polyfill) or use NativeAdapter
// which bundles a minimal inline polyfill and supports all merge types.
export const WebPlatformAdapter: PatchAdapter = {
  Placeholder: function ({ id, src, children }) {
    // <?start> and <?end> are processing instructions that JSX syntax cannot express
    // (tag names starting with "?" are rejected by the parser). They are injected via
    // raw() — id is guaranteed safe by assertFragmentId in Deferred and Patch.
    const open = raw(`<?start name="${id}">`);
    const close = raw(`<?end>`);
    if (src) {
      const safeJsonSrc = JSON.stringify(src).replace(/<\//g, "<\\/");
      // patchsrc="..." would be the declarative equivalent (future potential addition to
      // the spec — not yet in template-for-polyfill). Until then, a fetch script is needed.
      const script = raw(
        `<script>(function(){fetch(${safeJsonSrc}).then(function(r){document.body.streamAppendHTML(r.body)})})();</script>`,
      );
      return [open, children, close, script];
    }
    return [open, children, close];
  },

  // Inline streaming: <template for> applied by the HTML parser (or external polyfill).
  Patch: ({ id, children, merge }) => {
    if (merge !== "replace") {
      throw new Error(
        `WebPlatformAdapter only supports "replace" (WICG spec). Use NativeAdapter for other merge types.`,
      );
    }
    return <template htmlFor={id}>{children}</template>;
  },

  Frame: ({ id, children }) => <template htmlFor={id}>{children}</template>,
};

// Minimal MutationObserver polyfill for <template for> streaming support.
// Watches for <template for="id"> elements added by the streaming HTML parser
// and applies them to the <?start name="id">…<?end> regions.
// HTML5 parses <?start name="id"> as a Comment with nodeValue `?start name="id"`.
const POLYFILL = `(function(){function a(t){var n=t.getAttribute('for'),it=document.createNodeIterator(document.body||document.documentElement,128),nd,s=null,e=null;while((nd=it.nextNode())){if(!s&&nd.nodeValue==='?start name="'+n+'"'){s=nd;continue;}if(s&&nd.nodeValue==='?end'){e=nd;break;}}if(!s)return;var c=s.nextSibling;while(c&&c!==e){var x=c.nextSibling;c.remove();c=x;}s.after(t.content.cloneNode(true));t.remove();}new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeName==='TEMPLATE'&&n.getAttribute&&n.getAttribute('for'))a(n);});});}).observe(document.documentElement,{childList:true,subtree:true});})()`;

const ADJ: Record<Exclude<MergeType, "replace">, string> = {
  append: "beforeend",
  prepend: "afterbegin",
  before: "beforebegin",
  after: "afterend",
};

// Self-contained adapter: bundles the minimal polyfill and supports all merge types
// via insertAdjacentHTML for non-replace cases.
export const NativeAdapter: PatchAdapter = {
  // Inject the minimal polyfill into <head> — no external CDN required.
  transformShell: (shell) =>
    injectIntoHead(shell, `<script>${POLYFILL}</script>`),

  Placeholder: WebPlatformAdapter.Placeholder,

  Patch: ({ id, children, merge }) => {
    if (merge === "replace") {
      return <template htmlFor={id}>{children}</template>;
    }
    // insertAdjacentHTML for merge types not yet supported by the WICG spec.
    const tmplId = `patch-${id}`;
    const script = raw(
      `<script>(function(){var t=document.getElementById(${JSON.stringify(tmplId)});var el=document.getElementById(${JSON.stringify(id)});if(t&&el){el.insertAdjacentHTML(${JSON.stringify(ADJ[merge])},t.innerHTML);t.remove();}})();</script>`,
    );
    return [<template id={tmplId}>{children}</template>, script];
  },

  Frame: ({ id, children }) => <template htmlFor={id}>{children}</template>,
};

// ESI (Edge Side Includes) — CDN-level composition via esi:include / esi:inline (ESI 1.0).
// Primary use case: SSG where each fragment is a standalone URL fetched by the CDN.
// The shell contains <esi:include src="..."> tags; the CDN fetches, caches and assembles
// them independently with per-fragment TTL.
//
// Streaming note: Patch emits <esi:inline fetchable="yes"> which some CDN implementations
// (Varnish, Fastly) can serve as internal subrequests. Without a CDN ESI processor,
// esi:inline tags are inert in the browser.
//
// Only supports "replace" — ESI has no native insert/append/prepend semantics.
export const EsiAdapter: PatchAdapter = {
  Placeholder: ({ src, children }) => {
    if (src) {
      // id is safe (validated by assertFragmentId), src may contain & or "
      const safeSrc = src.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
      return raw(`<esi:include src="${safeSrc}" />`);
    }
    // No src (streaming mode): ESI requires a URL — render fallback inline.
    return children;
  },

  Patch: ({ id, children, merge }) => {
    if (merge !== "replace") {
      throw new Error(
        `EsiAdapter only supports "replace" — ESI has no insert/append/prepend semantics.`,
      );
    }
    return [
      raw(`<esi:inline name="${id}" fetchable="yes">`),
      children,
      raw(`</esi:inline>`),
    ] as JSXNode;
  },

  // Fragment file served at the URL referenced by esi:include.
  // Plain HTML — the CDN inserts the response body in place of the include tag.
  Frame: ({ children }) => children,
};

export const HtmxAdapter: PatchAdapter = {
  Placeholder: function ({ id, src, children }) {
    return src ? (
      <div id={id} hx-get={src} hx-trigger="load" hx-swap="outerHTML">
        {children}
      </div>
    ) : (
      <div id={id}>{children}</div>
    );
  },

  // Inline streaming: OOB swap patches the live DOM without a round-trip.
  Patch: ({ id, children, merge }) => {
    const swap: Record<MergeType, string> = {
      replace: "outerHTML",
      append: "beforeend",
      prepend: "afterbegin",
      before: "beforebegin",
      after: "afterend",
    };
    return (
      <div id={id} hx-swap-oob={swap[merge]}>
        {children}
      </div>
    );
  },

  // SSG lazy-load: hx-get fetches and replaces the placeholder via hx-swap="outerHTML".
  Frame: ({ id, children }) => <div id={id}>{children}</div>,
};
````

## File: packages/jsx-flow/src/index.test.tsx
````typescript
// @jsxImportSource @cjean-fr/jsx-string
import {
  initFlow,
  Deferred,
  Patch,
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
````

## File: packages/jsx-flow/src/index.ts
````typescript
/**
 * jsx-flow — HTML document orchestration layer for @cjean-fr/jsx-string
 *
 * @module
 */

export { Deferred } from "./components/Deferred.js";
export { Patch } from "./components/Patch.js";
export { Slot, type SlotProps } from "./components/Slot.js";
export { assertFragmentId } from "./fragmentId.js";
export type { PatchProps } from "./components/Patch.js";
export { initFlow, Flow } from "./context.js";
export type { FragmentEffect, FlowContext, Config } from "./context.js";
export { streamFragments } from "./streamFragments.js";
export { renderToReadableStream, renderToStatic } from "./render.js";
export type { StaticContext, StaticOptions } from "./render.js";
export {
  type MergeType,
  type PatchAdapter,
  NativeAdapter,
  TurboAdapter,
  HtmxAdapter,
  WebPlatformAdapter,
  EsiAdapter,
} from "./adapters.js";
````

## File: packages/jsx-flow/src/render.ts
````typescript
import { type PatchAdapter } from "./adapters.js";
import { type FlowContext, type Config, initFlow, Flow } from "./context.js";
import { streamFragments } from "./streamFragments.js";
import {
  renderToString,
  withScope,
  useContext,
  type JSXNode,
} from "@cjean-fr/jsx-string";

function withFlow<T>(
  handler: (ctx: FlowContext) => T,
  config: Config,
): Promise<T> {
  return withScope(async function () {
    initFlow(config);
    return handler(useContext(Flow));
  });
}

/**
 * Default adapter used when renderToStatic is called without an adapter.
 * Renders pure-static pages fine; any access to deferred-fragment encoding throws
 * with a clear message pointing to the missing option.
 */
const NOOP_ADAPTER: PatchAdapter = {
  Placeholder: () => {
    throw new Error(
      "jsx-flow: <Deferred> requires an adapter. Pass { adapter } to renderToStatic.",
    );
  },
  Patch: () => {
    throw new Error(
      "jsx-flow: deferred fragments require an adapter. Pass { adapter } to renderToStatic.",
    );
  },
  Frame: () => {
    throw new Error(
      "jsx-flow: deferred fragments require an adapter. Pass { adapter } to renderToStatic.",
    );
  },
};

const DEFAULT_GENERATE_PATH = (id: string) => `/fragments/${id}.html`;

/**
 * FlowContext extended for static generation.
 * `renderPage` applies `transformShell` so streaming and static produce the same
 * shell bytes for a given input.
 */
export interface StaticContext extends FlowContext {
  /** Render a page node, applying adapter.transformShell if present. */
  renderPage(node: () => JSXNode): Promise<string>;
  /**
   * Render every pending fragment via the configured adapter and pass each one
   * to `cb`. `url` is the path produced by `generatePath(id)`.
   * Throws if no adapter was configured.
   */
  emitFragments(
    cb: (id: string, url: string, html: string) => void | Promise<void>,
  ): Promise<void>;
}

export interface StaticOptions {
  /** Required if any page uses <Deferred> or you call ctx.emitFragments. */
  adapter?: PatchAdapter;
  /** Fragment URL convention. Default: (id) => `/fragments/${id}.html`. */
  generatePath?: (id: string) => string;
}

/**
 * @example
 * const stream = await renderToReadableStream(() => <App />, TurboAdapter);
 */
export async function renderToReadableStream(
  node: () => JSXNode,
  adapter: PatchAdapter,
): Promise<ReadableStream<string>> {
  return withFlow(
    async function ({ fragments }) {
      return new ReadableStream<string>({
        async start(controller) {
          const shell = await renderToString(node());
          const prepared = adapter.transformShell
            ? adapter.transformShell(shell)
            : shell;

          if (fragments.size === 0) {
            controller.enqueue(`${prepared}\n`);
          } else {
            const match = prepared.match(/((?:<\/body>)?\s*<\/html>\s*)$/i);
            const closing = match?.[1] ?? "";
            const before = closing
              ? prepared.slice(0, -closing.length)
              : prepared;

            controller.enqueue(`${before}\n`);
            await streamFragments(fragments, adapter, (_id, html) => {
              controller.enqueue(`${html}\n`);
            });
            controller.enqueue(`${closing}\n`);
          }

          controller.close();
        },
      });
    },
    { adapter, mode: "streaming" },
  );
}

/**
 * Static generation.
 *
 * For pure-static sites (no <Deferred>), call without options:
 * @example
 * await renderToStatic(async (ctx) => {
 *   for (const page of pages) {
 *     const html = await ctx.renderPage(() => page.component({ ... }));
 *     await Bun.write(page.outPath, "<!DOCTYPE html>\n" + html);
 *   }
 * });
 *
 * When pages use <Deferred>, pass { adapter } and materialize fragments:
 * @example
 * await renderToStatic(async (ctx) => {
 *   for (const page of pages) {
 *     const html = await ctx.renderPage(() => page.component({ ... }));
 *     await Bun.write(page.outPath, "<!DOCTYPE html>\n" + html);
 *   }
 *   await ctx.emitFragments(async (_id, url, html) => {
 *     await Bun.write("./out" + url, html);
 *   });
 * }, { adapter: NativeAdapter });
 */
export async function renderToStatic<T>(
  handler: (ctx: StaticContext) => T,
  options?: StaticOptions,
): Promise<T> {
  const adapter = options?.adapter ?? NOOP_ADAPTER;
  const generatePath = options?.generatePath ?? DEFAULT_GENERATE_PATH;
  const hasAdapter = adapter !== NOOP_ADAPTER;

  return withFlow(
    async (ctx) => {
      const staticCtx: StaticContext = {
        ...ctx,
        renderPage: async (node) => {
          const html = await renderToString(node());
          return adapter.transformShell ? adapter.transformShell(html) : html;
        },
        emitFragments: async (cb) => {
          if (!hasAdapter) {
            throw new Error(
              "jsx-flow: emitFragments requires an adapter. Pass { adapter } to renderToStatic.",
            );
          }
          await streamFragments(ctx.fragments, adapter, async (id, html) => {
            await cb(id, generatePath(id), html);
          });
        },
      };
      return handler(staticCtx);
    },
    { adapter, mode: "static", generatePath },
  );
}
````

## File: packages/jsx-flow/README.md
````markdown
# @cjean-fr/jsx-flow

> 🚧 Early development — API may change. Version 0.2.0.

Fragment streaming extension for [@cjean-fr/jsx-string](../jsx-string). Renders deferred JSX fragments and delivers them to the browser as DOM patches — via Turbo Streams, HTMX, the WICG Declarative Partial Updates API, or ESI-based CDN composition.

## When to use

Use `jsx-string` alone for SSG, emails, and pure SSR. Add `jsx-flow` when you need **progressive enhancement**: the initial HTML loads fast with placeholders, and heavy or slow components are rendered separately and patched into the page without a full reload.

| `@cjean-fr/jsx-string`    | `@cjean-fr/jsx-flow`                               |
| ------------------------- | -------------------------------------------------- |
| Renders JSX → HTML string | Adds deferred fragments + streaming patch delivery |
| Server-only, zero runtime | Emits adapter-specific markup for DOM updates      |
| `renderToString()`        | `renderToReadableStream()` / `renderToStatic()`    |
| Context via `withScope()` | Adapters: Turbo, HTMX, Native, WebPlatform, ESI    |

## Why deferred regions in streaming SSR

A standard `renderToString` call is a serial pipeline: the server computes the full page before sending the first byte. With streaming, the shell (layout, navigation, above-the-fold content) goes to the browser immediately while heavy components are still rendering.

Each `<Deferred>` renders **concurrently** and independently — the slowest component does not block the others. The browser receives the shell, paints it, then receives patches as they arrive and applies them in-place.

- **TTFB / FCP** — users see content in one round-trip, not after all async work settles
- **No virtual DOM, no hydration** — patches are applied as plain HTML by the adapter's client mechanism (Turbo, HTMX) or a minimal polyfill
- **Fault isolation** — a failed fragment logs and is silently skipped; the rest of the page is unaffected
- **Memory** — fragments are streamed out as they render, not accumulated before flushing

## Why deferred regions in SSG

In static generation every page is a snapshot. Cache invalidation is the hard part: when a deeply nested component changes, you regenerate the entire page. Deferred fragments split that snapshot.

The shell (stable layout, navigation) is one file. Each fragment is a separate file at a predictable URL. Your build pipeline treats them independently:

- **Granular invalidation** — only fragments whose data changed need to be regenerated; the shell stays cached
- **Per-fragment TTL** — a "live prices" fragment can expire in 60 s while the surrounding page is cached for a day
- **CDN composition** — shell and fragments are plain HTML files; any CDN can serve them
- **Incremental builds** — on large sites, regenerating ten fragment files instead of ten thousand pages cuts build time

## Install

```bash
bun add @cjean-fr/jsx-flow
```

## Concepts

### `<Deferred>` — deferred render with placeholder

Renders a placeholder immediately in the shell. After the shell is sent, the real content renders concurrently and is delivered as a DOM patch.

```tsx
import { Deferred } from "@cjean-fr/jsx-flow";

// Streaming: server pushes the fragment in the same response
<Deferred fallback={<Spinner />}>
  {() => <HeavyDashboard />}
</Deferred>

// Static: client fetches the fragment from src
<Deferred src="/fragments/heavy.html" fallback={<Spinner />} />

// Append into a container rather than replacing the placeholder
<Deferred merge="append" fallback={<ul id="feed" />}>
  {() => <li>Latest post</li>}
</Deferred>
```

`children` must be a **factory** `() => JSXNode`, not a plain node. JSX evaluates eagerly — the thunk defers rendering to streaming time.

### `<Patch>` — headless fragment push

Registers a fragment without rendering anything in the shell. Use it to push content to a DOM element that already exists.

```tsx
import { Patch } from "@cjean-fr/jsx-flow";

// Appends a notification to an existing list
<Patch target="toast-list" merge="append">
  {() => <li>File uploaded</li>}
</Patch>

// Updates a badge counter in-place
<Patch target="cart-badge">
  {() => <span>{count}</span>}
</Patch>
```

### Merge types

Both `<Deferred>` and `<Patch>` accept a `merge` prop describing how the content is applied **relative to the target DOM element identified by `id`**. The content rendered by the factory has no id requirement.

| `merge`     | Effect                                          |
| ----------- | ----------------------------------------------- |
| `"replace"` | Target element is replaced by content (default) |
| `"append"`  | Content inserted as last child of target        |
| `"prepend"` | Content inserted as first child of target       |
| `"before"`  | Content inserted as previous sibling of target  |
| `"after"`   | Content inserted as next sibling of target      |

> `WebPlatformAdapter` only supports `"replace"` (WICG spec limitation). `EsiAdapter` only supports `"replace"` (ESI has no native insert/append semantics).

### Patch adapters

Each adapter is a pure encoding backend implementing three methods plus an optional `transformShell`.

| Adapter              | `Placeholder`          | `Patch` (streaming inline)                     | `Frame` (SSG lazy-load) |
| -------------------- | ---------------------- | ---------------------------------------------- | ----------------------- |
| `TurboAdapter`       | `<turbo-frame>`        | `<turbo-stream action="…">`                    | `<turbo-frame id="…">`  |
| `HtmxAdapter`        | `<div hx-get>`         | `<div hx-swap-oob="…">`                        | `<div id="…">`          |
| `WebPlatformAdapter` | `<?start name>…<?end>` | `<template for="…">` (`replace` only)          | `<template for="…">`    |
| `NativeAdapter`      | `<?start name>…<?end>` | `<template for>` + `insertAdjacentHTML`        | `<template for="…">`    |
| `EsiAdapter`         | `<esi:include src>`    | `<esi:inline name fetchable>` (`replace` only) | raw HTML                |

- **`Patch`** — fragment delivered inline in the same HTTP response as the shell.
- **`Frame`** — fragment served as a standalone file fetched by the client (SSG).

#### `NativeAdapter` (recommended default)

Uses the [Declarative Partial Updates](https://developer.chrome.com/blog/declarative-partial-updates) API plus a minimal inline polyfill injected via `transformShell`. All merge types, no external client library, works in modern browsers.

#### `WebPlatformAdapter`

Pure WICG spec — no JS at all. Requires `chrome://flags/#enable-experimental-web-platform-features` until the spec ships. Only supports `"replace"`.

#### `EsiAdapter` — CDN-level composition

Designed for **SSG with a CDN ESI processor** (Varnish, Fastly, nginx ESI module). The shell contains `<esi:include src="…">` tags; the CDN fetches each fragment independently, applies separate TTLs, and assembles the final response before it reaches the browser.

```tsx
// Each Deferred needs an explicit src pointing to the fragment URL
<Deferred src="/fragments/nav.html" fallback={<nav>…</nav>} />
<Deferred src="/fragments/feed.html" fallback={<p>Loading…</p>} />
```

Only `"replace"` is supported; ESI has no insert/append semantics. No client-side JS — composition is entirely at the CDN.

## Usage

### Streaming (server pushes fragments)

```tsx
import {
  renderToReadableStream,
  NativeAdapter,
  Deferred,
} from "@cjean-fr/jsx-flow";

const stream = await renderToReadableStream(
  () => (
    <html>
      <body>
        <header>Fast</header>
        <Deferred fallback={<p>Loading…</p>}>
          {() => <HeavyDashboard />}
        </Deferred>
      </body>
    </html>
  ),
  NativeAdapter,
);

// stream is a ReadableStream<string> — pipe it to the HTTP response
```

### Static generation, pure-static (no `<Deferred>`)

```tsx
import { renderToStatic } from "@cjean-fr/jsx-flow";

await renderToStatic(async (ctx) => {
  for (const page of pages) {
    const html = await ctx.renderPage(() =>
      page.component({ currentPage: page.url }),
    );
    await Bun.write(page.outPath, "<!DOCTYPE html>\n" + html);
  }
});
```

No adapter required — jsx-flow stays invisible for pure-static rendering.

### Static generation with deferred fragments

```tsx
import { renderToStatic, NativeAdapter } from "@cjean-fr/jsx-flow";

await renderToStatic(
  async (ctx) => {
    for (const page of pages) {
      const html = await ctx.renderPage(() =>
        page.component({ currentPage: page.url }),
      );
      await Bun.write(page.outPath, "<!DOCTYPE html>\n" + html);
    }

    // Materialize each pending fragment as a standalone file
    await ctx.emitFragments(async (_id, url, html) => {
      await Bun.write("./out" + url, html);
    });
  },
  {
    adapter: NativeAdapter,
    generatePath: (id) => `/fragments/${id}.html`,
  },
);
```

`emitFragments` walks the registered fragments, renders each through the adapter, and hands the resulting `(id, url, html)` to your callback — you decide where to write.

### Imperative push from a plugin or hook

```ts
import { Flow } from "@cjean-fr/jsx-flow";
import { useContext } from "@cjean-fr/jsx-string";

const { patch } = useContext(Flow);
patch("cart-badge", () => <span>{count}</span>);
patch("toast-list", () => <li>Saved</li>, "append");
```

## API

### Components

| Export     | Description                                                             |
| ---------- | ----------------------------------------------------------------------- |
| `Deferred` | Renders a placeholder; delivers real content as a patch after the shell |
| `Patch`    | Renders nothing; pushes a fragment to an existing DOM target            |

### Renderers

| Export                                    | Description                                                                                                                                         |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `renderToReadableStream(node, adapter)`   | Streams shell + fragments as a `ReadableStream<string>`                                                                                             |
| `renderToStatic(handler, options?)`       | Runs `handler` inside a static render scope. `options.adapter` + `options.generatePath` required only when using `<Deferred>` / `ctx.emitFragments` |
| `streamFragments(fragments, adapter, cb)` | Low-level: render a `Map<id, FragmentEffect>` and call `cb(id, html)` for each                                                                      |

### Context & scope

| Export          | Description                                                   |
| --------------- | ------------------------------------------------------------- |
| `Flow`          | Context token — `useContext(Flow)` from inside a render scope |
| `FlowContext`   | Type: `{ config, fragments, nextId, patch }`                  |
| `StaticContext` | `FlowContext` + `renderPage(node)` + `emitFragments(cb)`      |

### Adapters & types

| Export               | Description                                                                  |
| -------------------- | ---------------------------------------------------------------------------- |
| `TurboAdapter`       | Hotwire Turbo Streams — all merge types                                      |
| `HtmxAdapter`        | HTMX OOB swaps — all merge types                                             |
| `NativeAdapter`      | Declarative Partial Updates + bundled polyfill — all merge types             |
| `WebPlatformAdapter` | Pure WICG spec — `replace` only                                              |
| `EsiAdapter`         | CDN-level ESI composition — `replace` only                                   |
| `PatchAdapter`       | `{ Placeholder, Patch, Frame, transformShell? }`                             |
| `MergeType`          | `"replace" \| "append" \| "prepend" \| "before" \| "after"`                  |
| `FragmentEffect`     | `{ factory: () => JSXNode; merge: MergeType }`                               |
| `assertFragmentId`   | Validates a fragment id (helpful in custom plugins calling `patch` directly) |

## License

MIT © Christophe Jean
````

## File: packages/jsx-string/examples/concurrent.tsx
````typescript
/**
 * Concurrent renders — each withScope() is isolated, so the same context key
 * can hold different values in parallel calls without interference.
 *
 * Run: `bun examples/concurrent.tsx`
 */
import {
  context,
  setContext,
  useContext,
  withScope,
  renderToString,
} from "@cjean-fr/jsx-string";

const Locale = context<"en" | "fr">("examples:locale");

const messages = {
  en: "Hello, world!",
  fr: "Bonjour le monde !",
};

function Page() {
  const locale = useContext(Locale);
  return (
    <main lang={locale}>
      <h1>{messages[locale]}</h1>
    </main>
  );
}

const [enHtml, frHtml] = await Promise.all([
  withScope(async () => {
    setContext(Locale, "en");
    return renderToString(<Page />);
  }),
  withScope(async () => {
    setContext(Locale, "fr");
    return renderToString(<Page />);
  }),
]);

console.log("EN:", enHtml);
console.log("FR:", frHtml);
````

## File: packages/jsx-string/examples/context.tsx
````typescript
/**
 * Context API — pass data through the tree without prop-drilling.
 * Each withScope() establishes an isolated AsyncLocalStorage store.
 *
 * Run: `bun examples/context.tsx`
 */
import {
  context,
  setContext,
  useContext,
  withScope,
  renderToString,
} from "@cjean-fr/jsx-string";

// Define context keys once, at module level.
const Theme = context<"light" | "dark">("examples:theme");

function Box({ children }: { children: string }) {
  const theme = useContext(Theme);
  const cls =
    theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900";
  return <div class={cls}>{children}</div>;
}

const html = await withScope(async () => {
  setContext(Theme, "dark");
  return renderToString(<Box>Hello from a dark theme.</Box>);
});

console.log(html);
````

## File: packages/jsx-string/examples/server.tsx
````typescript
/**
 * Tiny HTTP server using Bun.serve. Renders JSX to HTML on each request,
 * with per-request context injected at the top of the scope.
 *
 * Run: `bun examples/server.tsx`
 * Then: `curl -i http://localhost:3000/?name=World`
 */
import {
  context,
  setContext,
  useContext,
  withScope,
  renderToString,
} from "@cjean-fr/jsx-string";

const Request = context<{ name: string }>("examples:request");

function Page() {
  const { name } = useContext(Request);
  return (
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Hello, {name}</title>
      </head>
      <body>
        <h1>Hello, {name}!</h1>
        <p>Rendered by jsx-string on Bun.serve.</p>
      </body>
    </html>
  );
}

Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    const name = url.searchParams.get("name") ?? "stranger";

    const html = await withScope(async () => {
      setContext(Request, { name });
      return renderToString(<Page />);
    });

    return new Response("<!DOCTYPE html>\n" + html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  },
});

console.log("Listening on http://localhost:3000");
````

## File: packages/jsx-string/src/index.test.tsx
````typescript
// @jsxImportSource @cjean-fr/jsx-string
import type { JSXNode } from "./core/types.js";
import * as Main from "./index.js";
import { renderToString } from "./index.js";
import { describe, it, expect } from "bun:test";

describe("Main Entry Point API Contract", () => {
  it("should export core rendering, fragments and trust markers", () => {
    expect(typeof Main.renderToString).toBe("function");
    expect(Main.raw("test").toString()).toBe("test");
    expect(Main.Fragment).toBeDefined();
  });

  it("should export context and isolation APIs", () => {
    expect(typeof Main.withScope).toBe("function");
    expect(typeof Main.snapshot).toBe("function");
    expect(typeof Main.context).toBe("function");
    expect(typeof Main.setContext).toBe("function");
    expect(typeof Main.useContext).toBe("function");
  });

  it("should strictly encapsulate internal implementation details", () => {
    expect((Main as any).jsx).toBeUndefined();
    expect((Main as any).jsxs).toBeUndefined();
    expect((Main as any).RawString).toBeUndefined();
    expect((Main as any).isRawString).toBeUndefined();
  });
});

describe("Functional & Classless Components", () => {
  it("should render standard functional components", async () => {
    const Button = ({ label }: { label: string }) => <button>{label}</button>;
    expect(await renderToString(<Button label="Click" />)).toBe(
      "<button>Click</button>",
    );
  });

  it("should support deep nesting with sequential children rendering", async () => {
    const Box = ({ children }: { children?: JSXNode }) => (
      <div class="box">{children}</div>
    );
    const App = () => (
      <Box>
        <p>Hello</p>
      </Box>
    );
    expect(await renderToString(<App />)).toBe(
      '<div class="box"><p>Hello</p></div>',
    );
  });

  it("should handle components returning Fragments without array leakage or trailing commas", async () => {
    const List = () => (
      <>
        <li>1</li>
        <li>2</li>
      </>
    );
    expect(
      await renderToString(
        <ul>
          <List />
        </ul>,
      ),
    ).toBe("<ul><li>1</li><li>2</li></ul>");
  });
});

describe("Asynchronous Rendering Pipeline", () => {
  it("should support async components with deferred resolution loops", async () => {
    const AsyncComp = async () => {
      await new Promise((r) => setTimeout(r, 2));
      return <div>Async</div>;
    };
    expect(await renderToString(<AsyncComp />)).toBe("<div>Async</div>");
  });

  it("should handle async components returning multi-node fragments", async () => {
    const AsyncList = async () => {
      await Promise.resolve();
      return (
        <>
          <li>1</li>
          <li>2</li>
        </>
      );
    };
    expect(await renderToString(<AsyncList />)).toBe("<li>1</li><li>2</li>");
  });

  it("should concurrent-resolve interleaved nested promises in the same text body", async () => {
    const element = (
      <div>
        {Promise.resolve("A")} {Promise.resolve("B")}
      </div>
    );
    expect(await renderToString(element)).toBe("<div>A B</div>");
  });
});

describe("Attribute Processing, Hardening & Sanitization", () => {
  it("should map legacy React properties to native lowercased HTML targets", async () => {
    expect(await renderToString(<label htmlFor="id">Label</label>)).toBe(
      '<label for="id">Label</label>',
    );
    expect(await renderToString(<div tabIndex={1} />)).toBe(
      '<div tabindex="1"></div>',
    );
    expect(await renderToString(<input readOnly />)).toBe("<input readonly>");
  });

  it("should sanitize dangerous URL schemas while preserving case-sensitive SVG namespaces", async () => {
    const svg = (
      <svg viewBox="0 0 10 10">
        <use xlinkHref="javascript:alert(1)" />
      </svg>
    );
    expect(await renderToString(svg)).toBe(
      '<svg viewBox="0 0 10 10"><use xlink:href="#blocked"></use></svg>',
    );
  });

  it("should allow verified and non-malicious data-URIs inside source descriptors", async () => {
    const img = <img srcSet="data:image/png;base64,abc 1x" />;
    expect(await renderToString(img)).toBe(
      '<img srcset="data:image/png;base64,abc 1x">',
    );
    expect(await renderToString(<img srcSet="javascript:alert(1) 1x" />)).toBe(
      '<img srcset="#blocked">',
    );
    expect(
      await renderToString(
        <img srcSet="https://example.com/img.png 1x, javascript:alert(1) 2x" />,
      ),
    ).toBe('<img srcset="#blocked">');
  });

  it("should drop invalid structural attributes like spaces in naming descriptors", async () => {
    // @ts-ignore
    expect(await renderToString(<div {...{ "data foo": "bar" }} />)).toBe(
      "<div></div>",
    );
  });

  it("should purge nullish entries out of complex object style specifications", async () => {
    const inlineStyle = {
      color: "red",
      marginTop: undefined,
      marginContent: null,
    };
    expect(await renderToString(<div style={inlineStyle as any} />)).toBe(
      '<div style="color:red"></div>',
    );
  });

  it("should treat empty, undefined or unprovided inner HTML directives gracefully", async () => {
    expect(
      await renderToString(
        <div dangerouslySetInnerHTML={{ __html: undefined as any }} />,
      ),
    ).toBe("<div></div>");
    expect(
      await renderToString(
        <div dangerouslySetInnerHTML={{ __html: "<b>html</b>" }} />,
      ),
    ).toBe("<div><b>html</b></div>");
  });

  it("should safely stringify abstract types like Symbol and BigInt", async () => {
    expect(
      await renderToString(
        <div>
          {Symbol("test")} {BigInt(123)}
        </div>,
      ),
    ).toBe("<div>Symbol(test) 123</div>");
  });
});
````

## File: packages/jsx-vite/src/index.tsx
````typescript
/**
 * Vite asset integration for jsx-string projects.
 *
 * In dev mode, Vite serves source files directly with HMR. In production,
 * Vite emits hashed bundle files described by a manifest at `.vite/manifest.json`.
 * This package lets a layout reference assets by their *source* path
 * (`src/main.ts`, `src/logo.svg`, `src/styles/main.css`) and resolves them
 * correctly in both modes:
 *
 * @example
 * import { Asset, assetUrl } from "@cjean-fr/jsx-vite";
 *
 * <head>
 *   <Asset entry="src/styles/main.css" />
 *   <Asset entry="src/main.ts" />
 *   <link rel="icon" href={assetUrl("src/favicon.svg")} />
 * </head>
 * <img src={assetUrl("src/logo.png")} alt="logo" />
 *
 * @module
 */
import {
  context,
  setContext,
  useContext,
  type Context,
  type JSXNode,
} from "@cjean-fr/jsx-string";
import { readFile, access } from "node:fs/promises";

/** A single chunk in a Vite manifest. Mirrors `vite.ManifestChunk`. */
export interface ViteManifestChunk {
  file: string;
  src?: string;
  name?: string;
  isEntry?: boolean;
  isDynamicEntry?: boolean;
  imports?: string[];
  dynamicImports?: string[];
  css?: string[];
  assets?: string[];
}

/** The shape of `.vite/manifest.json`. */
export type ViteManifest = Record<string, ViteManifestChunk>;

interface ViteScope {
  /** Production manifest, or `null` in dev mode. */
  manifest: ViteManifest | null;
  /** URL prefix prepended to every resolved asset path. Default: `"/"`. */
  base: string;
}

const ViteContext: Context<ViteScope> = context<ViteScope>(
  "@cjean-fr/jsx-vite:scope",
);

/**
 * Load and parse a Vite manifest from disk. Returns `null` if the file does
 * not exist — that's how dev-mode setups signal "no manifest yet".
 *
 * @example
 * const manifest = await loadViteManifest("docs/assets/.vite/manifest.json");
 * // manifest is null in dev (file absent), the parsed object after `vite build`.
 */
export async function loadViteManifest(
  path: string,
): Promise<ViteManifest | null> {
  try {
    await access(path);
  } catch {
    return null;
  }
  const text = await readFile(path, "utf-8");
  return JSON.parse(text) as ViteManifest;
}

/**
 * Configure Vite asset resolution for the current render scope. Call once
 * before rendering, with the loaded manifest (production) or `null` (dev).
 */
export function setVite(
  manifest: ViteManifest | null,
  options?: { base?: string },
): void {
  setContext(ViteContext, {
    manifest,
    base: options?.base ?? "/",
  });
}

/**
 * Resolve a Vite entry to its URL string. Use this to reference arbitrary
 * assets (images, fonts, favicons, …) inside attributes:
 *
 * @example
 * <img src={assetUrl("src/logo.png")} alt="logo" />
 * <link rel="icon" href={assetUrl("src/favicon.svg")} />
 * <link rel="preload" as="font" href={assetUrl("src/fonts/inter.woff2")} crossorigin />
 *
 * Dev mode: returns `{base}{entry}` (Vite serves the source directly).
 *
 * Production mode: looks up the entry in the manifest and returns
 * `{base}{chunk.file}` (the hashed output path). Throws if the entry is
 * not in the manifest.
 *
 * For the common CSS/JS case, prefer `<Asset entry="…" />`, which also emits
 * the necessary co-bundled CSS and `modulepreload` links.
 */
export function assetUrl(entry: string): string {
  return resolveUrl(useContext(ViteContext), entry);
}

function resolveUrl(scope: ViteScope, entry: string): string {
  if (scope.manifest === null) return `${scope.base}${entry}`;
  const chunk = scope.manifest[entry];
  if (!chunk) {
    throw new Error(
      `[jsx-vite] entry "${entry}" not found in manifest. Known entries: ${Object.keys(scope.manifest).join(", ")}`,
    );
  }
  return `${scope.base}${chunk.file}`;
}

/**
 * Resolve a Vite entry to the appropriate HTML tags. Reads the manifest from
 * the active render scope (set via `setVite`).
 *
 * Dev mode (`manifest === null`):
 * - `entry="path/to/file.css"` → `<link rel="stylesheet" href="{base}{entry}">`
 * - any other entry → `<script type="module" src="{base}{entry}">`
 *
 * The Vite HMR client (`/@vite/client`) is NOT emitted here — pipe the
 * rendered HTML through `server.transformIndexHtml()` to let Vite inject it
 * (and apply its other dev transforms). Any setup that doesn't go through
 * `transformIndexHtml` must add `<script type="module" src="/@vite/client">`
 * manually.
 *
 * Production mode (`manifest` provided):
 * - Looks up the entry in the manifest; throws if absent.
 * - Emits the resolved CSS as `<link rel="stylesheet">`.
 * - Emits `<link rel="modulepreload">` for each transitive JS import.
 * - Emits the entry itself as `<link rel="stylesheet">` (CSS entries) or
 *   `<script type="module">` (JS entries).
 *
 * For non-CSS/JS assets (images, fonts, favicons, …), use `assetUrl(entry)`
 * inside a tag you build yourself.
 */
export function Asset({ entry }: { entry: string }): any {
  const scope = useContext(ViteContext);
  return scope.manifest === null
    ? resolveDev(scope, entry)
    : resolveProd(scope, entry);
}

function resolveDev(scope: ViteScope, entry: string): JSXNode {
  const url = resolveUrl(scope, entry);
  if (entry.endsWith(".css")) return <link rel="stylesheet" href={url} />;
  return <script type="module" src={url}></script>;
}

function resolveProd(scope: ViteScope, entry: string): JSXNode {
  const manifest = scope.manifest!;
  const chunk = manifest[entry];
  if (!chunk) {
    throw new Error(
      `[jsx-vite] entry "${entry}" not found in manifest. Known entries: ${Object.keys(manifest).join(", ")}`,
    );
  }

  const out: JSXNode[] = [];
  const seen = new Set<string>();

  // Co-bundled CSS — render-blocking, must appear before scripts.
  for (const css of chunk.css ?? []) {
    out.push(<link rel="stylesheet" href={`${scope.base}${css}`} />);
  }

  // Transitive imports become modulepreload hints.
  visitImports(manifest, chunk, scope.base, seen, out);

  // The entry itself.
  const entryUrl = `${scope.base}${chunk.file}`;
  if (chunk.file.endsWith(".css")) {
    out.push(<link rel="stylesheet" href={entryUrl} />);
  } else {
    out.push(<script type="module" src={entryUrl}></script>);
  }
  return out;
}

function visitImports(
  manifest: ViteManifest,
  chunk: ViteManifestChunk,
  base: string,
  seen: Set<string>,
  out: JSXNode[],
): void {
  for (const importKey of chunk.imports ?? []) {
    if (seen.has(importKey)) continue;
    seen.add(importKey);
    const importedChunk = manifest[importKey];
    if (!importedChunk) continue;
    // Recurse first so deeper imports come before their dependents.
    visitImports(manifest, importedChunk, base, seen, out);
    for (const css of importedChunk.css ?? []) {
      out.push(<link rel="stylesheet" href={`${base}${css}`} />);
    }
    out.push(
      <link rel="modulepreload" href={`${base}${importedChunk.file}`} />,
    );
  }
}
````

## File: turbo.json
````json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build", "check", "format"],
      "outputs": ["dist/**"]
    },
    "check": {
      "cache": true
    },
    "format": {
      "cache": true
    },
    "publish": {
      "dependsOn": ["test", "build"]
    },
    "test": {
      "cache": true
    }
  }
}
````

## File: .github/workflows/release.yml
````yaml
name: Manuel Release (Bun)

on:
  workflow_dispatch:
    inputs:
      package:
        description: "Select the package to publish"
        required: true
        type: choice
        options:
          - jsx-string
          - i18n-tiny

jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: write
    steps:
      - uses: actions/checkout@v6
        with:
          fetch-depth: 0

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version-file: package.json

      - name: Install Dependencies
        run: bun install --frozen-lockfile

      - name: Extract Version
        id: meta
        run: |
          # Lit la version dans le package.json du dossier choisi
          VERSION=$(jq -r '.version' packages/${{ github.event.inputs.package }}/package.json)
          TAG="${{ github.event.inputs.package }}@$VERSION"
          echo "version=$VERSION" >> $GITHUB_OUTPUT
          echo "tag=$TAG" >> $GITHUB_OUTPUT

      - name: Check if Tag Exists
        run: |
          TAG="${{ steps.meta.outputs.tag }}"
          if git show-ref --tags --verify --quiet "refs/tags/$TAG" || \
             git ls-remote --exit-code --tags --refs origin "refs/tags/$TAG" >/dev/null; then
            echo "Erreur : Le tag ${{ steps.meta.outputs.tag }} existe déjà sur local ou distant."
            echo "Veuillez incrémenter la version dans le package.json localement avant de relancer."
            exit 1
          fi

      - name: Build Package
        run: bun run build --filter=@cjean-fr/${{ github.event.inputs.package }}

      - name: Setup Node (for OIDC support)
        uses: actions/setup-node@v5
        with:
          node-version: 26
          registry-url: "https://registry.npmjs.org"

      - name: Publish to NPM
        run: |
          cd packages/${{ github.event.inputs.package }}
          bun pm pack
          npm publish *.tgz --provenance
````

## File: packages/docs/src/cli/index.ts
````typescript
import { renderPage } from "../renderHook.js";
import { renderToc } from "../toc.js";
import type { ResolvedDocsConfig } from "../types.js";
import { runInit } from "./init.js";
import { run as coreRun } from "@cjean-fr/build-core/cli";

const USAGE = `@cjean-fr/docs

Usage:
  docs init [--force]     Scaffold a starter project in the current directory.
  docs dev [--port N]     Start the dev server with HMR.
  docs build              Build the documentation site (vite build + render).
  docs --help             Show this message.
`;

export function run(argv: string[]): Promise<void> {
  return coreRun<ResolvedDocsConfig>(argv, {
    renderPage,
    renderToc,
    usage: USAGE,
    extraCommands: {
      init: async (rest) => {
        await runInit(process.cwd(), {
          force: rest.includes("--force"),
        });
      },
    },
  });
}
````

## File: packages/docs/src/build.ts
````typescript
/**
 * Build entry — thin wrapper around `@cjean-fr/build-core`'s `buildSite`.
 * Provides the docs `renderPage` hook (Layout + DocsContext + sidebar).
 */
import { renderPage } from "./renderHook.js";
import { renderToc } from "./toc.js";
import type { ResolvedDocsConfig } from "./types.js";
import {
  buildSite,
  type BuildOptions as CoreBuildOptions,
  type BuildResult,
} from "@cjean-fr/build-core";

export type { BuildResult };

export interface BuildOptions extends Omit<
  CoreBuildOptions<ResolvedDocsConfig>,
  "renderPage" | "renderToc"
> {}

export function build(
  config: ResolvedDocsConfig,
  options: BuildOptions = {},
): Promise<BuildResult> {
  return buildSite(config, { ...options, renderPage, renderToc });
}
````

## File: packages/docs/src/vite.ts
````typescript
/**
 * Vite plugin entry — thin wrapper around `@cjean-fr/build-core`'s
 * `createSitePlugin`. Pre-wires the docs `renderPage` hook so the user's
 * `vite.config.ts` doesn't need to know about it.
 *
 * The CLI (`docs dev`) registers this plugin automatically. Users who
 * bypass the CLI can install it manually in their `vite.config.ts`.
 */
import { renderPage } from "./renderHook.js";
import { renderToc } from "./toc.js";
import type { ResolvedDocsConfig } from "./types.js";
import { createSitePlugin } from "@cjean-fr/build-core/vite";
import type { Plugin } from "vite";

export interface DocsPluginOptions {
  /** Path to the docs config file (relative to project root). Default: `"./docs.config.ts"`. */
  configFile?: string;
}

export function docs(options: DocsPluginOptions = {}): Plugin {
  return createSitePlugin<ResolvedDocsConfig>({
    configFile: options.configFile,
    renderPage,
    renderToc,
  });
}
````

## File: packages/docs/package.json
````json
{
  "name": "@cjean-fr/docs",
  "version": "0.1.0",
  "description": "Documentation site builder on top of @cjean-fr/jsx-string + jsx-flow + jsx-vite",
  "author": "Christophe Jean",
  "license": "MIT",
  "homepage": "https://github.com/cjean-fr/atelier/tree/main/packages/docs#readme",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/cjean-fr/atelier.git",
    "directory": "packages/docs"
  },
  "bugs": {
    "url": "https://github.com/cjean-fr/atelier/issues"
  },
  "keywords": [
    "docs",
    "documentation",
    "static-site",
    "ssg",
    "jsx",
    "vite",
    "starlight-alternative"
  ],
  "type": "module",
  "types": "./dist/index.d.ts",
  "bin": {
    "docs": "./bin/docs.mjs"
  },
  "engines": {
    "node": ">=24.0.0"
  },
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    },
    "./vite": {
      "types": "./dist/vite.d.ts",
      "default": "./dist/vite.js"
    },
    "./client": {
      "default": "./dist/client.js"
    },
    "./mdx-components": {
      "types": "./dist/mdx-components.d.ts",
      "default": "./dist/mdx-components.js"
    },
    "./main.css": "./src/theme/main.css"
  },
  "publishConfig": {
    "access": "public"
  },
  "scripts": {
    "build": "vite build",
    "check": "tsc --noEmit",
    "format": "prettier --write \"**/*.{ts,tsx,json,md,css}\"",
    "test": "bun test"
  },
  "dependencies": {
    "@cjean-fr/build-core": "workspace:*",
    "@cjean-fr/jsx-string": "workspace:*",
    "@cjean-fr/jsx-flow": "workspace:*",
    "@cjean-fr/jsx-vite": "workspace:*"
  },
  "devDependencies": {
    "@types/react": "catalog:",
    "@types/bun": "catalog:",
    "shiki": "catalog:",
    "typescript": "catalog:",
    "vite": "catalog:",
    "vite-plugin-dts": "catalog:"
  },
  "peerDependencies": {
    "@types/react": "^19",
    "shiki": "^4",
    "vite": "^8"
  },
  "peerDependenciesMeta": {
    "@types/react": {
      "optional": true
    },
    "shiki": {
      "optional": true
    },
    "vite": {
      "optional": true
    }
  },
  "files": [
    "dist",
    "src/theme",
    "bin",
    "README.md",
    "LICENSE"
  ]
}
````

## File: packages/docs/vite.config.ts
````typescript
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "@cjean-fr/jsx-string",
  },
  build: {
    target: "esnext",
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      entry: {
        index: path.resolve(__dirname, "src/index.ts"),
        vite: path.resolve(__dirname, "src/vite.ts"),
        client: path.resolve(__dirname, "src/client.ts"),
        "mdx-components": path.resolve(__dirname, "src/mdx-components.ts"),
        "cli/index": path.resolve(__dirname, "src/cli/index.ts"),
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        "@cjean-fr/jsx-string",
        "@cjean-fr/jsx-string/jsx-runtime",
        "@cjean-fr/jsx-flow",
        "@cjean-fr/jsx-vite",
        "@cjean-fr/build-core",
        "@cjean-fr/build-core/cli",
        "@cjean-fr/build-core/vite",
        "@cjean-fr/build-core/search",
        "@cjean-fr/build-core/search/builtin/client",
        "shiki",
        "vite",
        /^node:/,
      ],
      output: {
        // Mirror the source structure under dist/ so subpath exports work.
        entryFileNames: "[name].js",
        chunkFileNames: "shared/[name]-[hash].js",
      },
    },
  },
  plugins: [
    dts({
      include: ["src/**/*"],
      // Keep declaration files alongside JS for subpath exports.
      entryRoot: "src",
    }),
    // Theme CSS ships as source (see package.json exports `./main.css` and
    // `./style.css`); the consumer's Tailwind compiles it. No copy needed.
  ],
});
````

## File: packages/i18n-tiny/README.md
````markdown
# @cjean-fr/i18n-tiny

**Zero-dependency, type-safe, minimalist internationalization library.**

Provides a simple way to manage translations with **strict TypeScript inference**, ensuring you never miss a translation key or a required parameter.

## Features

- 📦 **Tiny**: Minimal footprint, zero external dependencies.
- 🔒 **Type-Safe**: Autocompletion for keys and validation for required parameters.
- 🚀 **Fast**: Simple string interpolation.
- 🛠 **Flexible**: "Define Spec First" approach.
- 🤖 **AI-Friendly**: Built-in [skill](./skills/i18n-tiny/SKILL.md) for agentic adoption.

## Installation

```bash
bun add @cjean-fr/i18n-tiny
# or
npm install @cjean-fr/i18n-tiny
```

## Usage

### 1. Define your Translation Specification

Define the structure of your translations (Keys -> List of required params). It's recommended to define a `type` with `readonly` arrays.

```typescript
import { createTranslator, defineTranslations } from "@cjean-fr/i18n-tiny";

export type AppTranslationSpec = {
  welcome: readonly ["name"]; // Requires 'name'
  notifications: readonly ["count"]; // Requires 'count'
  logout: readonly []; // No parameters
  "user-profile": readonly ["id"]; // Supports dashes in keys
};
```

### 2. Implement Languages

Use the `defineTranslations` helper to strictly enforce keys AND inline placeholders. This is the **most bulletproof** way to catch typos like `{nom}` instead of `{name}` at compile time.

```typescript
export const en = defineTranslations<AppTranslationSpec>()({
  welcome: "Welcome back, {name}!",
  notifications: "You have {count} new messages.",
  logout: "Log out",
  "user-profile": "User profile #{id}",
});

// A typo in a placeholder will trigger a TypeScript error!
// export const fr = defineTranslations<AppTranslationSpec>()({
//   welcome: "Bienvenue {nom} !", // ❌ Error: Type '"Bienvenue {nom} !"' is not assignable...
//   ...
// });
```

### 3. Create the Translator

```typescript
const t = createTranslator<AppTranslationSpec>(en);

// ✅ Correct usage
console.log(t("welcome", { name: "Alice" })); // "Welcome back, Alice!"
console.log(t("logout")); // "Log out"
```

### Alternative: Auto-Infer The Specification

If you prefer to write your translations first, you can use `InferSpec` to automatically generate the specification from a base language.

```typescript
import {
  type InferSpec,
  defineTranslations,
  createTranslator,
} from "@cjean-fr/i18n-tiny";

// 1. Define base language (must use `as const`)
const baseEn = {
  welcome: "Welcome {name}",
  logout: "Log out",
} as const;

// 2. Infer the Spec automatically
type AppSpec = InferSpec<typeof baseEn>;

// 3. Keep other languages strictly typed based on the inferred spec
const fr = defineTranslations<AppSpec>()({
  welcome: "Bienvenue {name}",
  logout: "Se déconnecter",
});

const t = createTranslator<AppSpec>(baseEn);
```

### Interpolation

The library uses a regex-based interpolation. Supported placeholders: `{variable}`, `{user_name}`, `{my-variable}`.

```typescript
import { interpolate } from "@cjean-fr/i18n-tiny";

interpolate("Hello {name}", { name: "Bob" }); // "Hello Bob"
```

## Advanced: Custom Result Types (JSX, etc.)

By default, the translator returns a `string`. You can customize the return type (and allowed parameter types) to integrate with UI libraries like React.

```tsx
import { type Translator } from "@cjean-fr/i18n-tiny";
import type { ReactNode } from "react";

// Define tx returning ReactNode and accepting ReactNode as parameters
const tx: Translator<AppTranslationSpec, ReactNode> = (key, ...args) => {
  return t(key, ...(args as any));
};

// Now you can pass JSX elements as parameters!
const element = tx("welcome", {
  name: <strong>Alice</strong>,
});
```

## Advanced: Custom Interpolator (ICU, etc.)

By default, the library uses simple regex string replacement. You can easily plug in a more powerful interpolator like **ICU MessageFormat** (useful for plurals, gender, etc.) by passing an `interpolate` function in the config.

```typescript
import { createTranslator } from "@cjean-fr/i18n-tiny";
import IntlMessageFormat from "intl-messageformat";

const translations = {
  cart: "{count, plural, =0 {No items} one {1 item} other {{count} items}} in your cart.",
} as const;

type Spec = {
  cart: readonly ["count"];
};

const t = createTranslator<Spec>(translations, {
  locale: "en-US",
  interpolate: (template, params, { locale }) => {
    return new IntlMessageFormat(template, locale).format(params) as string;
  },
});

console.log(t("cart", { count: 1 })); // "1 item in your cart."
```

## AI-Friendly

`@cjean-fr/i18n-tiny` is designed with AI-first development in mind. The strict Type-safety and **Spec-First** approach make it easy for AI agents to write correct translations.

It includes a dedicated **Skill** that agents can consume to learn how to use the library optimally.

```bash
npx skills add cjean-fr/atelier --skill i18n-tiny
```

## Security

⚠️ **This library does NOT sanitize inputs.**

The `interpolate` function performs simple string replacement. **Do not** use the output directly in HTML (e.g., `innerHTML`) if parameters contain user-generated content.

## License

MIT © Christophe Jean

---

<p align="center">Made with ❤️ in Paris</p>
````

## File: packages/jsonresume-theme-cjean/src/components/Header.tsx
````typescript
export default ({ bgTiles }: { bgTiles: string }) => (
  <div
    className="bg-primary bg-angled-gradient from-header-from to-header-to relative h-2.5 overflow-hidden shadow-inner md:-mb-60 md:h-80 dark:opacity-90 dark:contrast-125 dark:saturate-50 print:hidden"
    aria-hidden="true"
  >
    <img
      src={bgTiles}
      alt=""
      fetchPriority="high"
      className="absolute inset-0 size-full object-cover object-center"
    />
  </div>
);
````

## File: packages/jsonresume-theme-cjean/src/lib/trianglify.ts
````typescript
/**
 * Simple seedable PRNG to ensure predictable results
 */
class PRNG {
  private seed: number;
  constructor(seed: number) {
    this.seed = seed;
  }
  next() {
    // https://en.wikipedia.org/wiki/Lehmer_random_number_generator
    this.seed = (this.seed * 16807) % 2147483647; // Mersenne premier ($2^{31} - 1$)
    return (this.seed - 1) / 2147483646;
  }
}

interface Point {
  x: number;
  y: number;
}

type Triangle = [Point, Point, Point];

export interface TrianglifyOptions {
  width?: number;
  height?: number;
  cellSize?: number;
  variance?: number;
  seed?: number;
}

/**
 * Generates a jittered grid triangulation as an SVG Data URI
 * @param options
 * @returns
 */
export function generateTriangulation(options: TrianglifyOptions = {}): string {
  const {
    width = 900,
    height = 300,
    cellSize = 50,
    variance = 0.75,
    seed = 1,
  } = options;

  const prng = new PRNG(seed);
  const points = generatePoints(width, height, cellSize, variance, prng);
  const groups = generateTriangleGroups(points, prng);
  const svg = buildSvgData(width, height, groups);

  const encoded = encodeURIComponent(svg)
    .replace(/%20/g, " ")
    .replace(/%3D/g, "=")
    .replace(/%3A/g, ":")
    .replace(/%2F/g, "/")
    .replace(/%22/g, "'");
  return `data:image/svg+xml,${encoded}`;
}

/**
 * Generate points for the triangulation.
 * @param width
 * @param height
 * @param cellSize
 * @param variance
 * @param prng
 * @returns
 */
function generatePoints(
  width: number,
  height: number,
  cellSize: number,
  variance: number,
  prng: PRNG,
): Point[][] {
  const points: Point[][] = [];
  const columns = Math.ceil(width / cellSize) + 2;
  const rows = Math.ceil(height / cellSize) + 2;

  for (let j = 0; j < rows; j++) {
    const row: Point[] = [];
    for (let i = 0; i < columns; i++) {
      const x = Math.round(
        (i - 0.5) * cellSize + (prng.next() - 0.5) * cellSize * variance,
      );
      const y = Math.round(
        (j - 0.5) * cellSize + (prng.next() - 0.5) * cellSize * variance,
      );
      row.push({ x, y });
    }
    points.push(row);
  }

  return points;
}

/**
 * Get a random fill color.
 * @param prng
 * @returns
 */
function getRandomFillColor(prng: PRNG): string {
  const rand = prng.next();
  const hexColor = rand > 0.5 ? "#000000" : "#ffffff";
  const alpha = (Math.round(rand * 5) * 5).toString(16).padStart(2, "0");
  return hexColor + alpha;
}

/**
 * Format a triangle path in relative coordinates.
 * @param triangle
 * @param lastPoint
 * @returns
 */
function formatRelativeTrianglePath(
  triangle: Triangle,
  lastPoint: Point,
): string {
  const [p0, p1, p2] = triangle;
  const dx0 = p0.x - lastPoint.x;
  const dy0 = p0.y - lastPoint.y;
  const dx1 = p1.x - p0.x;
  const dy1 = p1.y - p0.y;
  const dx2 = p2.x - p1.x;
  const dy2 = p2.y - p1.y;

  return `m${dx0} ${dy0} ${dx1} ${dy1} ${dx2} ${dy2}`.replace(/ -/g, "-");
}

/**
 * Generate triangle groups.
 * @param points
 * @param prng
 * @returns
 */
function generateTriangleGroups(
  points: Point[][],
  prng: PRNG,
): Record<string, string> {
  const svgPathsByColor: Record<string, string> = {};
  const lastPointByColor: Record<string, Point> = {};
  const rows = points.length;
  const columns = points[0]?.length ?? 0;

  for (let j = 0; j < rows - 1; j++) {
    for (let i = 0; i < columns - 1; i++) {
      const triangles: Triangle[] = [
        [points[j]![i]!, points[j]![i + 1]!, points[j + 1]![i]!],
        [points[j]![i + 1]!, points[j + 1]![i + 1]!, points[j + 1]![i]!],
      ];

      triangles.forEach((triangle) => {
        const fill = getRandomFillColor(prng);

        if (!svgPathsByColor[fill]) {
          svgPathsByColor[fill] = "";
          lastPointByColor[fill] = { x: 0, y: 0 };
        }

        const lastPoint = lastPointByColor[fill]!;
        const relativePath = formatRelativeTrianglePath(triangle, lastPoint);

        svgPathsByColor[fill] += relativePath;
        lastPointByColor[fill] = triangle[2]!;
      });
    }
  }

  return svgPathsByColor;
}

/**
 * Build the SVG data.
 * @param width
 * @param height
 * @param groups
 * @returns
 */
function buildSvgData(
  width: number,
  height: number,
  groups: Record<string, string>,
): string {
  let paths = "";
  for (const [fill, data] of Object.entries(groups)) {
    paths += `<path fill="${fill}" d="${data}"/>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid slice">${paths}</svg>`;
}
````

## File: packages/jsonresume-theme-cjean/src/index.tsx
````typescript
import Layout from "./components/Layout.js";
import { init } from "./lib/i18n.js";
import { getLogoFromUrl, getPictureFromEmail } from "./lib/image.js";
import { ResumeSchema } from "./schema.js";
import css from "./styles/tailwind.input.css?inline";

/**
 *
 * @param resumeData
 * @returns
 */
export async function render(resumeData: unknown): Promise<string> {
  const resume = ResumeSchema.parse(resumeData);

  // Initialize i18n
  init(resume.meta.lang);

  // Fetch favicons if enabled
  if (resume.meta.themeConfig.ui.showLogos) {
    await Promise.all(
      resume.work
        .filter((work) => !work.logo)
        .map(async (work) => {
          work.logo = await getLogoFromUrl(work.url);
        }),
    );
  }

  // Fetch gravatar if no image are provided
  if (!resume.basics.image && resume.basics.email) {
    resume.basics.image = await getPictureFromEmail(resume.basics.email);
  }

  return (await (<Layout resume={resume} css={css} />)).toString();
}
````

## File: packages/jsonresume-theme-cjean/src/schema.ts
````typescript
import { z } from "zod/v4/mini";

export const ThemeConfigSchema = z.object({
  ui: z.prefault(
    z.object({
      primary: z._default(z.string(), "#255b8f"),
      headerFrom: z._default(z.string(), "#ccc074"),
      headerTo: z._default(z.string(), "#4971af"),
      footerFrom: z._default(z.string(), "#463932"),
      footerTo: z._default(z.string(), "#7fbdbc"),
      backgroundTilesSeed: z._default(z.number(), 1),
      showLogos: z._default(z.boolean(), true),
      cta: z.optional(
        z.object({
          text: z.string(),
          url: z.string(),
          icon: z._default(
            z.optional(z.string().check(z.regex(/^[a-z]+:[a-z-]+$/))),
            "tabler:message-circle",
          ),
        }),
      ),
      links: z._default(z.array(z.string()), [
        "phone",
        "email",
        "location",
        "profiles",
      ]),
    }),
    {},
  ),
  seo: z.prefault(
    z.object({
      title: z.optional(z.string()),
      description: z.optional(z.string()),
      canonical: z.optional(z.url()),
      favicon: z.optional(z.string()),
      ogImage: z.optional(z.url()),
      twitterImage: z.optional(z.url()),
      firstName: z.optional(z.string()),
      lastName: z.optional(z.string()),
      robots: z._default(z.optional(z.string()), "index, follow"),
    }),
    {},
  ),
  modest: z._default(z.boolean(), false),
});

export const WorkSchema = z.pipe(
  z
    .looseObject({
      name: z.optional(z.string()),
      company: z.optional(z.string()),
      location: z.optional(z.string()),
      description: z.optional(z.string()),
      position: z.optional(z.string()),
      url: z.optional(z.url()),
      website: z.optional(z.url()),
      startDate: z.string(),
      endDate: z.optional(z.string()),
      summary: z.optional(z.string()),
      highlights: z.optional(z.array(z.string())),
      logo: z.optional(z.url()),
    })
    .check(
      z.refine(({ name, company }) => Boolean(name || company), {
        path: ["name"],
        message: "Either 'name' or 'company' must be provided.",
      }),
    ),
  z.transform(({ company, name, url, website, ...rest }) => {
    return {
      ...rest,
      name: name ?? company,
      ...(url || website ? { url: url ?? website } : {}),
    };
  }),
);

export const ProfileSchema = z.looseObject({
  network: z.string(),
  username: z.optional(z.string()),
  url: z.optional(z.url()),
});

export const LocationSchema = z.looseObject({
  address: z.optional(z.string()),
  postalCode: z.optional(z.string()),
  city: z.optional(z.string()),
  countryCode: z.optional(z.string().check(z.length(2))),
  region: z.optional(z.string()),
});

export const BasicsSchema = z.looseObject({
  name: z.string(),
  label: z.optional(z.string()),
  image: z.optional(z.url()),
  email: z.optional(z.email()),
  phone: z.optional(z.string()),
  birthDate: z.optional(z.string()),
  url: z.optional(z.url()),
  summary: z.optional(z.string()),
  location: z.optional(LocationSchema),
  profiles: z.optional(z.array(ProfileSchema)),
});

export const EducationSchema = z.object({
  institution: z.string(),
  url: z.optional(z.url()),
  area: z.optional(z.string()),
  studyType: z.optional(z.string()),
  startDate: z.string(),
  endDate: z.optional(z.string()),
  score: z.optional(z.string()),
  courses: z.optional(z.array(z.string())),
});

export const CertificatesSchema = z.object({
  name: z.string(),
  date: z.optional(z.string()),
  url: z.optional(z.url()),
  issuer: z.optional(z.string()),
});

export const SkillsSchema = z.object({
  name: z.string(),
  level: z.optional(z.string()),
  keywords: z.optional(z.array(z.string())),
});

export const LanguagesSchema = z.looseObject({
  language: z.string(),
  fluency: z.optional(z.string()),
});

export const ResumeSchema = z.object({
  meta: z.prefault(
    z.looseObject({
      lang: z._default(z.catch(z.enum(["en", "fr"]), "en"), "en"),
      lastModified: z._default(z.string(), () => new Date().toISOString()),
      themeConfig: z.prefault(ThemeConfigSchema, {}),
    }),
    {},
  ),
  work: z._default(z.optional(z.array(WorkSchema)), []),
  basics: BasicsSchema,
  education: z._default(z.optional(z.array(EducationSchema)), []),
  certificates: z._default(z.optional(z.array(CertificatesSchema)), []),
  skills: z._default(z.optional(z.array(SkillsSchema)), []),
  languages: z._default(z.optional(z.array(LanguagesSchema)), []),
});

export type Resume = z.infer<typeof ResumeSchema>;
export type ThemeConfig = z.infer<typeof ThemeConfigSchema>;
````

## File: packages/jsx-flow/src/context.ts
````typescript
import type { PatchAdapter, MergeType } from "./adapters.js";
import { assertFragmentId } from "./fragmentId.js";
import {
  context,
  setContext,
  type Context,
  type JSXNode,
} from "@cjean-fr/jsx-string";

/** A deferred fragment: encoded by the adapter, applied as a DOM patch. */
export type FragmentEffect = { factory: () => JSXNode; merge: MergeType };

export type Config =
  | {
      adapter: PatchAdapter;
      mode: "streaming";
      generatePath?: never;
      idPrefix?: string;
    }
  | {
      adapter: PatchAdapter;
      mode: "static";
      generatePath: (id: string) => string;
      idPrefix?: string;
    };

export interface FlowContext {
  config: Config;
  /** Pending fragments, in registration order. Exposed for inspection and streamFragments. */
  fragments: Map<string, FragmentEffect>;
  nextId: () => string;
  /** Register a deferred fragment targeting the DOM element with id `id`. */
  patch(id: string, factory: () => JSXNode, merge?: MergeType): void;
}

export const Flow: Context<FlowContext> = context<FlowContext>(
  "@cjean-fr/jsx-flow:flow",
);

export function initFlow(config: Config): void {
  let counter = 0;
  const fragments = new Map<string, FragmentEffect>();
  setContext(Flow, {
    config,
    fragments,
    nextId: () => `${config.idPrefix ?? "fragment-"}${++counter}`,
    patch(id, factory, merge) {
      assertFragmentId(id, "patch");
      fragments.set(id, { factory, merge: merge ?? "replace" });
    },
  });
}
````

## File: packages/jsx-flow/package.json
````json
{
  "name": "@cjean-fr/jsx-flow",
  "version": "0.2.0",
  "description": "HTML document orchestration layer for @cjean-fr/jsx-string",
  "author": "Christophe Jean",
  "license": "MIT",
  "homepage": "https://github.com/cjean-fr/atelier/tree/main/packages/jsx-flow#readme",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/cjean-fr/atelier.git",
    "directory": "packages/jsx-flow"
  },
  "bugs": {
    "url": "https://github.com/cjean-fr/atelier/issues"
  },
  "keywords": [
    "jsx",
    "html",
    "ssr",
    "streaming",
    "fragments",
    "deferred",
    "htmx",
    "turbo"
  ],
  "type": "module",
  "types": "./dist/index.d.ts",
  "engines": {
    "node": ">=24.0.0"
  },
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    }
  },
  "publishConfig": {
    "access": "public"
  },
  "scripts": {
    "build": "bunup src/index.ts --format esm --minify --jsx.import-source @cjean-fr/jsx-string",
    "check": "tsc --noEmit",
    "format": "prettier --write \"**/*.{ts,tsx,json,md}\"",
    "test": "bun test"
  },
  "dependencies": {
    "@cjean-fr/jsx-string": "workspace:*"
  },
  "devDependencies": {
    "@types/react": "catalog:",
    "@types/bun": "catalog:",
    "bunup": "catalog:",
    "typescript": "catalog:"
  },
  "peerDependencies": {
    "@types/react": "^19"
  },
  "peerDependenciesMeta": {
    "@types/react": {
      "optional": true
    }
  },
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ]
}
````

## File: packages/jsx-string/src/core/context.test.ts
````typescript
import {
  context,
  setContext,
  useContext,
  withScope,
  snapshot,
} from "./context.js";
import { expect, describe, it } from "bun:test";

const UserToken = context<{ name: string }>("test:user");
const PluginToken = context<{ items: string[] }>("test:plugin");

describe("context", () => {
  describe("useContext / setContext", () => {
    it("throws outside withScope", () => {
      expect(() => useContext(UserToken)).toThrow(
        "[jsx-string] useContext() called outside of a withScope() scope.",
      );
      expect(() => setContext(UserToken, { name: "x" })).toThrow(
        "[jsx-string] setContext() called outside of a withScope() scope.",
      );
    });

    it("throws when context not found in scope", async () => {
      await withScope(() => {
        expect(() => useContext(UserToken)).toThrow(
          "[jsx-string] useContext() — context not found in current scope.",
        );
      });
    });

    it("reads back what was written", async () => {
      await withScope(() => {
        setContext(UserToken, { name: "Alice" });
        expect(useContext(UserToken)).toEqual({ name: "Alice" });
      });
    });

    it("propagates through async continuations", async () => {
      await withScope(async () => {
        setContext(UserToken, { name: "Bob" });
        await new Promise((r) => setTimeout(r, 5));
        expect(useContext(UserToken).name).toBe("Bob");
      });
    });

    it("mutations persist within same scope", async () => {
      await withScope(async () => {
        setContext(UserToken, { name: "Alice" });
        await Promise.resolve();
        useContext(UserToken).name = "Alice Updated";
        await Promise.resolve();
        expect(useContext(UserToken).name).toBe("Alice Updated");
      });
    });
  });

  describe("withScope", () => {
    it("isolates concurrent scopes", async () => {
      const results = await Promise.all([
        withScope(async () => {
          setContext(UserToken, { name: "A" });
          await new Promise((r) => setTimeout(r, 10));
          return useContext(UserToken).name;
        }),
        withScope(async () => {
          setContext(UserToken, { name: "B" });
          await Promise.resolve();
          return useContext(UserToken).name;
        }),
      ]);
      expect(results).toEqual(["A", "B"]);
    });

    it("returns callback result", async () => {
      const result = await withScope(() => 42);
      expect(result).toBe(42);
    });

    it("sub-scope is empty without seed", async () => {
      await withScope(async () => {
        setContext(UserToken, { name: "Parent" });
        await withScope(() => {
          expect(() => useContext(UserToken)).toThrow(
            "not found in current scope",
          );
        });
      });
    });
  });

  describe("snapshot / seed", () => {
    it("seed pre-fills sub-scope", async () => {
      await withScope(async () => {
        setContext(UserToken, { name: "Parent" });
        const seed = snapshot();

        await withScope(
          () => {
            expect(useContext(UserToken).name).toBe("Parent");
          },
          { seed },
        );
      });
    });

    it("child mutation does not affect parent", async () => {
      await withScope(async () => {
        setContext(UserToken, { name: "Parent" });
        const seed = snapshot();

        await withScope(
          () => {
            setContext(UserToken, { name: "Child" });
            expect(useContext(UserToken).name).toBe("Child");
          },
          { seed },
        );

        expect(useContext(UserToken).name).toBe("Parent");
      });
    });

    it("snapshot throws outside withScope", () => {
      expect(() => snapshot()).toThrow(
        "[jsx-string] snapshot() called outside of a withScope() scope.",
      );
    });
  });

  describe("inter-plugin communication", () => {
    it("plugins share same scope", async () => {
      await withScope(() => {
        setContext(UserToken, { name: "Alice" });
        setContext(PluginToken, { items: [] });

        useContext(PluginToken).items.push(useContext(UserToken).name);

        expect(useContext(PluginToken).items).toEqual(["Alice"]);
      });
    });
  });

  describe("context(key) — cross-instance sharing", () => {
    it("same key returns the same Symbol within one instance", () => {
      const a = context<string>("test:demo");
      const b = context<string>("test:demo");
      expect(a).toBe(b);
    });

    it("different keys return different Symbols", () => {
      const a = context<string>("test:x");
      const b = context<string>("test:y");
      expect(a).not.toBe(b);
    });

    it("key uses Symbol.for so it survives across instances", () => {
      const Shared = context<string>("test:shared");
      // Simulate a "second instance" by retrieving the same global symbol.
      const sameViaRegistry = Symbol.for(
        "@cjean-fr/jsx-string.context.test:shared",
      );
      expect(Shared).toBe(sameViaRegistry as unknown as typeof Shared);
    });

    it("rejects empty or non-string keys", () => {
      expect(() => context<string>("")).toThrow(/non-empty string key/);
      // @ts-expect-error — intentionally wrong type at runtime
      expect(() => context<string>(123)).toThrow(/non-empty string key/);
      // @ts-expect-error — intentionally wrong type at runtime
      expect(() => context<string>()).toThrow(/non-empty string key/);
    });

    it("works with setContext/useContext inside a scope", async () => {
      const Shared = context<{ value: number }>("test:in-scope");
      await withScope(() => {
        setContext(Shared, { value: 42 });
        expect(useContext(Shared).value).toBe(42);
      });
    });
  });

  describe("AsyncLocalStorage singleton", () => {
    it("storage is reachable via globalThis Symbol.for key", () => {
      const key = Symbol.for("@cjean-fr/jsx-string.storage");
      const g = globalThis as unknown as Record<symbol, unknown>;
      expect(g[key]).toBeDefined();
    });
  });
});
````

## File: packages/jsx-string/src/core/context.ts
````typescript
import { AsyncLocalStorage } from "node:async_hooks";

declare const __brand: unique symbol;

export interface Context<T> {
  readonly [__brand]: T;
}

export interface ScopeOptions {
  seed?: Map<Context<unknown>, unknown>;
}

type ScopeMap = Map<Context<unknown>, unknown>;

// ─────────────────────────────────────────────────────────────────────────────
// Module-duplication-safe state.
//
// Both `storage` and named contexts must be unique across instances of this
// module — otherwise a Vite plugin (loaded by Node) and user pages (loaded by
// Vite SSR), microfrontends, or any other setup that may resolve this package
// twice will end up with disjoint AsyncLocalStorage / Symbol identities and
// `setContext` / `useContext` won't see each other.
//
// We use `Symbol.for(...)` registry keys on `globalThis`. The first instance
// to load creates the singleton; subsequent ones reuse it.
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = Symbol.for("@cjean-fr/jsx-string.storage");
const CONTEXTS_KEY = Symbol.for("@cjean-fr/jsx-string.contexts");

type GlobalState = {
  [STORAGE_KEY]?: AsyncLocalStorage<ScopeMap>;
  [CONTEXTS_KEY]?: Map<string, symbol>;
};

function getStorage(): AsyncLocalStorage<ScopeMap> {
  const g = globalThis as unknown as GlobalState;
  if (!g[STORAGE_KEY]) g[STORAGE_KEY] = new AsyncLocalStorage<ScopeMap>();
  return g[STORAGE_KEY];
}

function getNamedContexts(): Map<string, symbol> {
  const g = globalThis as unknown as GlobalState;
  if (!g[CONTEXTS_KEY]) g[CONTEXTS_KEY] = new Map();
  return g[CONTEXTS_KEY];
}

/**
 * Create a typed context token, identified by a globally-unique string key.
 *
 * The key is mapped to `Symbol.for("@cjean-fr/jsx-string.context.{key}")` —
 * the same key always resolves to the same Symbol across module instances,
 * so libraries that may be loaded twice (Vite plugin + Vite SSR, web
 * workers, microfrontends, edge re-init…) still share context state.
 *
 * **Convention**: namespace the key with your package or app to avoid
 * collisions across libraries. Recommended forms:
 *
 *   `context<T>("@my-org/my-pkg:purpose")`
 *   `context<T>("my-app:theme")`
 *
 * Two different keys always return different Symbols. The same key always
 * returns the same Symbol — even after a hot reload.
 *
 * @example
 * const Theme = context<"light" | "dark">("my-app:theme");
 * const Flow = context<FlowContext>("@cjean-fr/jsx-flow:flow");
 */
export function context<T>(globalKey: string): Context<T> {
  if (typeof globalKey !== "string" || globalKey.length === 0) {
    throw new Error(
      "[jsx-string] context(key): a non-empty string key is required. " +
        'Use a namespaced form like `context<T>("@my-org/my-pkg:purpose")`.',
    );
  }
  const reg = getNamedContexts();
  const existing = reg.get(globalKey);
  if (existing) return existing as unknown as Context<T>;
  const sym = Symbol.for(`@cjean-fr/jsx-string.context.${globalKey}`);
  reg.set(globalKey, sym);
  return sym as unknown as Context<T>;
}

export function setContext<T>(ctx: Context<T>, value: T): void {
  const map = getStorage().getStore();
  if (!map)
    throw new Error(
      "[jsx-string] setContext() called outside of a withScope() scope.",
    );
  map.set(ctx as Context<unknown>, value);
}

export function useContext<T>(ctx: Context<T>): T {
  const map = getStorage().getStore();
  if (!map)
    throw new Error(
      "[jsx-string] useContext() called outside of a withScope() scope.",
    );
  if (!map.has(ctx as Context<unknown>)) {
    throw new Error(
      "[jsx-string] useContext() — context not found in current scope. Did you call setContext() in this withScope?",
    );
  }
  return map.get(ctx as Context<unknown>) as T;
}

export async function withScope<T>(
  fn: () => T | Promise<T>,
  options?: ScopeOptions,
): Promise<T> {
  return getStorage().run(new Map(options?.seed), fn);
}

export function snapshot(): Map<Context<unknown>, unknown> {
  const map = getStorage().getStore();
  if (!map)
    throw new Error(
      "[jsx-string] snapshot() called outside of a withScope() scope.",
    );
  return new Map(map);
}
````

## File: packages/jsx-string/src/jsx-runtime.test.ts
````typescript
// @jsxImportSource @cjean-fr/jsx-string
import { renderToString } from "./index.js";
import * as JSXDevRuntime from "./jsx-dev-runtime.js";
import { jsxDEV } from "./jsx-dev-runtime.js";
import * as JSXRuntime from "./jsx-runtime.js";
import {
  jsx,
  jsxAttr,
  jsxEscape,
  jsxTemplate,
  Fragment,
} from "./jsx-runtime.js";
import { describe, it, expect } from "bun:test";

describe("JSX Runtime Export Contract", () => {
  it("jsx-runtime should export standard factories (but NOT jsxDEV)", () => {
    expect(typeof JSXRuntime.jsx).toBe("function");
    expect(typeof JSXRuntime.jsxs).toBe("function");
    expect("jsxDEV" in JSXRuntime).toBe(false);
    expect(JSXRuntime.Fragment).toBeDefined();
    expect(typeof JSXRuntime.jsxTemplate).toBe("function");
    expect(typeof JSXRuntime.jsxAttr).toBe("function");
    expect(typeof JSXRuntime.jsxEscape).toBe("function");
  });

  it("jsx-dev-runtime should export jsxDEV", () => {
    expect(typeof JSXDevRuntime.jsxDEV).toBe("function");
    expect(typeof JSXDevRuntime.jsxs).toBe("function");
    expect(JSXDevRuntime.Fragment).toBeDefined();
    expect(typeof JSXDevRuntime.jsxTemplate).toBe("function");
    expect(typeof JSXDevRuntime.jsxAttr).toBe("function");
    expect(typeof JSXDevRuntime.jsxEscape).toBe("function");
  });
});

describe("Automatic JSX Dev Runtime", () => {
  it("ignores key/isStaticChildren/source/self per the spec — never renders them as children", () => {
    const source = { fileName: "Layout.tsx", lineNumber: 18, columnNumber: 9 };
    const el = jsxDEV(
      "script",
      { type: "module", src: "/assets/client.js" },
      undefined,
      false,
      source,
      null,
    );
    expect(el.toString()).toBe(
      '<script type="module" src="/assets/client.js"></script>',
    );
    expect(el.toString()).not.toContain("[object Object]");
  });

  it("reads children from props.children, not from positional args", () => {
    const el = jsxDEV(
      "div",
      { children: "hello" },
      undefined,
      false,
      { fileName: "x", lineNumber: 1, columnNumber: 1 },
      null,
    );
    expect(el.toString()).toBe("<div>hello</div>");
  });
});

describe("Automatic JSX Runtime Factories", () => {
  it("renders an element with children from props", () => {
    expect(jsx("span", { children: "ok" }).toString()).toBe("<span>ok</span>");
  });

  it("renders multiple children passed via props.children array", async () => {
    const element = jsx("div", {
      id: "p",
      children: [
        jsx("span", { children: "1" }),
        jsx("span", { children: "2" }),
      ],
    });
    expect(await renderToString(element)).toBe(
      '<div id="p"><span>1</span><span>2</span></div>',
    );
  });

  it("ignores the third positional argument (it is the JSX `key`, never a child)", async () => {
    // Per the automatic runtime spec, the third arg is `key`. Old versions
    // of this package treated it as a child when `props.children` was
    // absent, silently rendering keys as content.
    const element = jsx("div", { id: "p" }, "some-key");
    expect(await renderToString(element)).toBe('<div id="p"></div>');
  });

  it("should collapse nested Fragments structures into flat layout lines", async () => {
    const result = jsx(Fragment, {
      children: [jsx(Fragment, { children: "deep" })],
    });
    expect(await renderToString(result as any)).toBe("deep");
  });
});

describe("Deno Precompile Target Runtime Pipeline", () => {
  describe("jsxTemplate Core Compilation Mechanics", () => {
    it("should map static chunks lacking dynamic injections", () => {
      expect(jsxTemplate(["<h1>hello</h1>"]).toString()).toBe("<h1>hello</h1>");
    });

    it("should properly weave changing text slices and dynamic arguments together", () => {
      const result = jsxTemplate(["<h1>Hello ", "!</h1>"], jsxEscape("Ada"));
      expect(result.toString()).toBe("<h1>Hello Ada!</h1>");
    });

    it("should accept attributes and inline nested sub-trees into structural nodes", () => {
      const child = jsx("span", { children: "x" });
      const result = jsxTemplate(["<div>", "</div>"], child);
      expect(result.toString()).toBe("<div><span>x</span></div>");
    });
  });

  describe("jsxEscape Injection Sanitization Engine", () => {
    it("should screen out raw script tags through thorough character conversion maps", () => {
      const result = jsxTemplate(
        ["<div>", "</div>"],
        jsxEscape("<script>alert(1)</script>"),
      );
      expect(result.toString()).toBe(
        "<div>&lt;script&gt;alert(1)&lt;/script&gt;</div>",
      );
    });

    it("should wipe out invalid values like holes or conditions seamlessly", () => {
      const result = jsxTemplate(
        ["<div>", "</div>"],
        jsxEscape([null, undefined, false, true]),
      );
      expect(result.toString()).toBe("<div></div>");
    });
  });

  describe("jsxAttr Property Enforcement Layer", () => {
    it("should drop empty configuration properties entirely from the string stream", () => {
      const out = jsxTemplate(
        ["<div ", " ", "></div>"],
        jsxAttr("id", undefined),
        jsxAttr("checked", false),
      );
      expect(out.toString()).toBe("<div  ></div>");
    });

    it("should safely double-escape quote sequences located inside value assignments", () => {
      const result = jsxTemplate(
        ["<a ", "></a>"],
        jsxAttr("title", '"><script>x</script>'),
      );
      expect(result.toString()).toBe(
        '<a title="&quot;&gt;&lt;script&gt;x&lt;/script&gt;"></a>',
      );
    });

    it("should filter function types passed to listeners while maintaining string capability", () => {
      const original = console.warn;
      console.warn = () => {}; // Mute standard error trace
      try {
        const ok = jsxTemplate(
          ["<button ", "></button>"],
          jsxAttr("onClick", "alert(1)"),
        );
        expect(ok.toString()).toBe('<button onclick="alert(1)"></button>');

        const dropped = jsxTemplate(
          ["<button ", "></button>"],
          jsxAttr("onClick", () => {}),
        );
        expect(dropped.toString()).toBe("<button ></button>");
      } finally {
        console.warn = original;
      }
    });
  });

  describe("Parallel Execution Loops", () => {
    it("should unpack attribute properties and multi-node subtrees hidden inside pending promises", async () => {
      const attrPromise = jsxAttr("href", Promise.resolve("/about"));
      const result = jsxTemplate(["<a ", ">x</a>"], attrPromise);
      expect(await result).toBeInstanceOf(Object); // RawString container
      expect((await result).toString()).toBe('<a href="/about">x</a>');
    });

    it("should drive concurrent tasks simultaneously in a non-blocking map pattern", async () => {
      const start = Date.now();
      const slow = (v: string, ms: number) =>
        new Promise<string>((r) => setTimeout(() => r(v), ms));
      const result = jsxTemplate(
        ["<p>", " - ", "</p>"],
        jsxEscape(slow("a", 30)),
        jsxEscape(slow("b", 20)),
      );

      expect((await result).toString()).toBe("<p>a - b</p>");
      expect(Date.now() - start).toBeLessThan(35); // Verifies parallel execution loop
    });
  });
});
````

## File: packages/jsx-string/tsconfig.json
````json
{
  "extends": "../typescript-config/base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@cjean-fr/jsx-string",
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "./",
    "paths": {
      "@cjean-fr/jsx-string": ["./src/index.ts"],
      "@cjean-fr/jsx-string/jsx-runtime": ["./src/jsx-runtime.ts"],
      "@cjean-fr/jsx-string/jsx-dev-runtime": ["./src/jsx-dev-runtime.ts"]
    },
    "types": ["bun", "react"]
  },
  "include": ["src"]
}
````

## File: packages/jsx-vite/package.json
````json
{
  "name": "@cjean-fr/jsx-vite",
  "version": "0.1.0",
  "description": "Vite asset integration for @cjean-fr/jsx-string projects",
  "author": "Christophe Jean",
  "license": "MIT",
  "homepage": "https://github.com/cjean-fr/atelier/tree/main/packages/jsx-vite#readme",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/cjean-fr/atelier.git",
    "directory": "packages/jsx-vite"
  },
  "bugs": {
    "url": "https://github.com/cjean-fr/atelier/issues"
  },
  "keywords": [
    "jsx",
    "vite",
    "ssr",
    "asset",
    "manifest",
    "hmr"
  ],
  "sideEffects": false,
  "type": "module",
  "types": "./dist/index.d.ts",
  "engines": {
    "node": ">=24.0.0"
  },
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    }
  },
  "publishConfig": {
    "access": "public"
  },
  "scripts": {
    "build": "bunup src/index.tsx --format esm --minify --jsx.import-source @cjean-fr/jsx-string",
    "check": "tsc --noEmit",
    "format": "prettier --write \"**/*.{ts,tsx,json,md}\"",
    "test": "bun test"
  },
  "dependencies": {
    "@cjean-fr/jsx-string": "workspace:*"
  },
  "devDependencies": {
    "@types/react": "catalog:",
    "@types/bun": "catalog:",
    "bunup": "catalog:",
    "typescript": "catalog:"
  },
  "peerDependencies": {
    "@types/react": "^19"
  },
  "peerDependenciesMeta": {
    "@types/react": {
      "optional": true
    }
  },
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ]
}
````

## File: packages/jsonresume-theme-cjean/src/components/DateTime.tsx
````typescript
import { dateFormatter } from "../lib/i18n.js";
import type { HTMLAttributes } from "@cjean-fr/jsx-string";

export interface DateTimeProps extends HTMLAttributes {
  date: Date | string;
  format?: Parameters<typeof dateFormatter.format>[1];
  children?: any;
}

export default function DateTime({
  date,
  format,
  children,
  ...props
}: DateTimeProps) {
  const normalizedDate = dateFormatter.normalize(date);
  if (!normalizedDate) return <span {...props}>{children}</span>;

  let content = children;
  if (format && !content) {
    content = dateFormatter.format(normalizedDate, format);
  }

  return (
    <time dateTime={dateFormatter.toISO(normalizedDate)} {...props}>
      {content}
    </time>
  );
}
````

## File: packages/jsonresume-theme-cjean/src/components/Links.tsx
````typescript
import { t } from "../lib/i18n.js";
import type { Resume } from "../schema.js";
import { getIcon } from "./Icons.js";
import type { HTMLAttributes } from "@cjean-fr/jsx-string";

function buildMapsUri(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

async function getProfileIcon(network: string) {
  try {
    return await getIcon(`tabler:brand-${network.toLowerCase()}`);
  } catch (e) {
    return getIcon("tabler:link");
  }
}

const BasicsItem = ({ children, ...props }: HTMLAttributes) => (
  <li className="inline-flex items-center gap-x-1" {...props}>
    {children}
  </li>
);

export default function Links({
  basics,
  list = ["phone", "email", "location", "profiles"],
}: {
  basics: Resume["basics"];
  list: Resume["meta"]["themeConfig"]["ui"]["links"];
}) {
  const { phone, email, location, profiles = [] } = basics;
  const displayedProfiles = new Set<string>();

  const renderLink = (link: string) => {
    const key = link.toLowerCase();

    if (key === "phone" && phone) {
      return (
        <BasicsItem key="phone">
          {getIcon("tabler:phone")}
          <a href={`tel:${encodeURIComponent(phone)}`} title={t("phone_call")}>
            {phone}
          </a>
        </BasicsItem>
      );
    }

    if (key === "email" && email) {
      return (
        <BasicsItem key="email">
          {getIcon("tabler:mail")}
          <a href={`mailto:${email}`} title={t("email_send")}>
            {email}
          </a>
        </BasicsItem>
      );
    }

    if (
      key === "location" &&
      location &&
      location.city &&
      (location.countryCode || location.region)
    ) {
      return (
        <BasicsItem key="location">
          {getIcon("tabler:map-pin")}
          <a
            href={buildMapsUri(
              [
                location.city,
                location.postalCode,
                location.region,
                location.countryCode,
              ]
                .filter(Boolean)
                .join(", "),
            )}
            title={t("show_address")}
            target="_blank"
            rel="noopener noreferrer"
            referrerPolicy="no-referrer"
          >
            {location.city}, {location.countryCode || location.region}
          </a>
        </BasicsItem>
      );
    }

    if (key === "profiles") {
      return profiles
        .filter((p) => !displayedProfiles.has(p.network.toLowerCase()))
        .map((profile) => {
          displayedProfiles.add(profile.network.toLowerCase());
          return (
            <BasicsItem key={profile.network}>
              {getProfileIcon(profile.network)}
              <a
                href={profile.url}
                rel="me noopener noreferrer"
                title={profile.username}
                target="_blank"
                referrerPolicy="no-referrer"
              >
                {profile.network}
              </a>
            </BasicsItem>
          );
        });
    }

    // specific network
    const profile = profiles.find((p) => p.network.toLowerCase() === key);
    if (profile && !displayedProfiles.has(key)) {
      displayedProfiles.add(key);
      return (
        <BasicsItem key={profile.network}>
          {getProfileIcon(profile.network)}
          <a
            href={profile.url}
            rel="me noopener noreferrer"
            title={profile.username}
            target="_blank"
            referrerPolicy="no-referrer"
          >
            {profile.network}
          </a>
        </BasicsItem>
      );
    }

    return null;
  };

  return (
    <ul
      className="my-3 inline-flex flex-wrap gap-x-[2ch] gap-y-2"
      aria-label={t("contact_info")}
    >
      {list.map(renderLink)}
    </ul>
  );
}
````

## File: packages/jsonresume-theme-cjean/src/components/SEO.tsx
````typescript
import type { Resume } from "../schema.js";
import { getIcon } from "./Icons.js";

export default async function SEO({ resume }: { resume: Resume }) {
  const { basics, meta } = resume;
  const { seo } = meta.themeConfig;

  const title =
    seo.title ||
    (basics.label ? `${basics.name} - ${basics.label}` : basics.name);
  const description = seo.description || basics.summary;
  const { firstNameSlice, lastNameSlice } = splitName(basics.name);

  return (
    <>
      <Base
        title={title}
        description={description}
        canonical={seo.canonical}
        robots={seo.robots}
        favicon={seo.favicon}
      />
      <OpenGraph
        title={title}
        description={description}
        url={seo.canonical}
        image={seo.ogImage || basics.image}
        firstName={seo.firstName || firstNameSlice}
        lastName={seo.lastName || lastNameSlice}
      />
      <Twitter
        title={title}
        description={description}
        url={seo.canonical}
        image={seo.twitterImage || basics.image}
      />
    </>
  );
}

export function splitName(name: string) {
  const [firstName, ...rest] = name.split(" ");
  return {
    firstNameSlice: firstName,
    lastNameSlice: rest.join(" "),
  };
}

export async function Base({
  title,
  description,
  canonical,
  robots,
  favicon,
}: {
  title: string;
  description?: string;
  canonical?: string;
  robots?: string;
  favicon?: string;
}) {
  return (
    <>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <meta name="robots" content={robots || "index, follow"} />
      {canonical && <link rel="canonical" href={canonical} />}
      {favicon && (
        <link
          rel="icon"
          href={`data:image/svg+xml;base64,${btoa(
            (await getIcon(favicon)).toString(),
          )}`}
        />
      )}
    </>
  );
}

export function OpenGraph({
  title,
  description,
  url,
  image,
  firstName,
  lastName,
}: {
  title: string;
  description?: string;
  url?: string;
  image?: string;
  firstName?: string;
  lastName?: string;
}) {
  return (
    <>
      <meta property="og:type" content="profile" />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      {firstName && <meta property="profile:first_name" content={firstName} />}
      {lastName && <meta property="profile:last_name" content={lastName} />}
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}
    </>
  );
}

export function Twitter({
  title,
  description,
  url,
  image,
}: {
  title: string;
  description?: string;
  url?: string;
  image?: string;
}) {
  return (
    <>
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={title} />
      {description && (
        <meta property="twitter:description" content={description} />
      )}
      {image && <meta property="twitter:image" content={image} />}
      {url && <meta property="twitter:url" content={url} />}
    </>
  );
}
````

## File: packages/jsonresume-theme-cjean/src/lib/image.ts
````typescript
import { generateGoogleFaviconUrl } from "./google.js";
import { emailToHash, generateGravatarUrl } from "./gravatar.js";
import { generateWSRVUrl } from "./wsrv.js";

/**
 * Get the company logo from an URL.
 * @param url The URL to get the logo from
 * @param size The size of the logo
 * @returns The optimized logo
 */
export async function getLogoFromUrl(
  url?: string,
  size: number = 64,
): Promise<string | undefined> {
  if (!url) return undefined;

  try {
    const googleFaviconUrl = generateGoogleFaviconUrl(url, size);
    const cdnUrl = generateWSRVUrl(googleFaviconUrl, {
      w: size,
      h: size,
      output: "webp",
      encoding: "base64",
    });

    const response = await fetch(cdnUrl);
    if (!response.ok) {
      console.warn(
        `Error while fetching logo from ${url}: ${response.statusText}`,
      );
      return undefined;
    }

    return await response.text();
  } catch (e) {
    return undefined;
  }
}

export async function getPictureFromEmail(
  email: string,
  size: number = 200,
): Promise<string | undefined> {
  const hash = await emailToHash(email);

  try {
    const gravatarUrl = generateGravatarUrl(hash, {
      size,
      d: "404",
    });

    const cdnUrl = generateWSRVUrl(gravatarUrl, {
      w: size,
      h: size,
      output: "webp",
      encoding: "base64",
    });

    const response = await fetch(cdnUrl);
    if (!response.ok) {
      console.warn(
        `Error while fetching gravatar from ${email}: ${response.statusText}`,
      );
      return undefined;
    }

    return await response.text();
  } catch (e) {
    return undefined;
  }
}
````

## File: packages/jsx-string/src/utils/escape.test.ts
````typescript
import {
  escapeContent,
  escapeAttr,
  isSafeSrcset,
  isSafeUrl,
  isValidAttrName,
  sanitize,
} from "./escape.js";
import { describe, it, expect } from "bun:test";

describe("escape utilities", () => {
  describe("escapeContent", () => {
    it("should escape for HTML content", () => {
      expect(escapeContent("<b>\"Hello\" & 'World'</b>")).toBe(
        "&lt;b&gt;\"Hello\" &amp; 'World'&lt;/b&gt;",
      );
      expect(escapeContent("Hello 123")).toBe("Hello 123");
    });
  });

  describe("escapeAttr", () => {
    it("should escape for HTML attributes", () => {
      const attr = escapeAttr("\"><script>'");
      expect(attr).toBe("&quot;&gt;&lt;script&gt;'");
      expect(escapeAttr("Hello 123")).toBe("Hello 123");
    });
  });

  describe("isSafeUrl", () => {
    it("should allow safe URLs and data-images", () => {
      expect(isSafeUrl("https://example.com")).toBe(true);
      expect(isSafeUrl("/path")).toBe(true);
      expect(isSafeUrl("data:image/png;base64,abc")).toBe(true);
      expect(isSafeUrl("")).toBe(true);
    });

    it("should block dangerous protocols and bypasses", () => {
      expect(isSafeUrl("javascript:alert(1)")).toBe(false);
      expect(isSafeUrl("  JAVASCRIPT:alert(1)")).toBe(false);
      expect(isSafeUrl("java\0script:alert(1)")).toBe(false);
      expect(isSafeUrl("data:text/html,hack")).toBe(false);
      expect(isSafeUrl("java\tscript:alert(1)")).toBe(false);
      expect(isSafeUrl("java\nscript:alert(1)")).toBe(false);
    });
  });

  describe("isSafeSrcset", () => {
    it("should allow safe image candidate lists", () => {
      expect(isSafeSrcset("image-1x.png 1x, image-2x.png 2x")).toBe(true);
      expect(isSafeSrcset("data:image/png;base64,abc 1x")).toBe(true);
    });

    it("should block dangerous schemes in any candidate", () => {
      expect(
        isSafeSrcset("https://example.com/img.png 1x, javascript:alert(1) 2x"),
      ).toBe(false);
      expect(
        isSafeSrcset(
          "data:image/png;base64,abc 1x, data:text/html,<svg onload=alert(1)> 2x",
        ),
      ).toBe(false);
    });
  });

  describe("sanitize", () => {
    it("should remove all invisible Unicode characters", () => {
      expect(sanitize("a\0b\u0001c\u200Bd")).toBe("abcd");
    });
  });

  describe("isValidAttrName", () => {
    it("should allow standard, framework and special symbols", () => {
      const valid = [
        "class",
        "data-f",
        "@click",
        "[prop]",
        "(evt)",
        "x:y",
        "a.b",
        "_",
        "$",
      ];
      valid.forEach((name) => expect(isValidAttrName(name)).toBe(true));
    });

    it("should block structural separators", () => {
      const invalid = ["a b", "a=", 'a"', "a'", "a>", "a/"];
      invalid.forEach((name) => expect(isValidAttrName(name)).toBe(false));
    });
  });
});
````

## File: packages/i18n-tiny/package.json
````json
{
  "name": "@cjean-fr/i18n-tiny",
  "version": "1.0.1",
  "description": "Zero-dependency, type-safe, minimalist internationalization library.",
  "author": "Christophe Jean",
  "license": "MIT",
  "homepage": "https://github.com/cjean-fr/atelier/tree/main/packages/i18n-tiny#readme",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/cjean-fr/atelier.git",
    "directory": "packages/i18n-tiny"
  },
  "bugs": {
    "url": "https://github.com/cjean-fr/atelier/issues"
  },
  "keywords": [
    "i18n",
    "internationalization",
    "translation",
    "tiny",
    "typescript",
    "type-safe",
    "inference",
    "zero-dependency"
  ],
  "sideEffects": false,
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "engines": {
    "node": ">=24.0.0"
  },
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "publishConfig": {
    "access": "public"
  },
  "scripts": {
    "build": "bunup --minify",
    "check": "tsc --noEmit",
    "format": "prettier --write \"**/*.{ts,tsx,json,md}\"",
    "test": "bun test"
  },
  "devDependencies": {
    "@types/bun": "catalog:",
    "bunup": "catalog:",
    "typescript": "catalog:"
  },
  "files": [
    "dist",
    "README.md",
    "LICENSE",
    "skills"
  ]
}
````

## File: packages/jsonresume-theme-cjean/src/components/FloatingButton.tsx
````typescript
import { getIcon } from "./Icons.js";
import { type HTMLAttributes } from "@cjean-fr/jsx-string";

interface FloatingButtonProps extends HTMLAttributes {
  text: string;
  url: string;
  icon?: Parameters<typeof getIcon>[0];
}

export default ({
  text,
  url,
  icon = "tabler:message-circle",
  ...props
}: FloatingButtonProps) => {
  return (
    <>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        id="cta-fab"
        aria-label={text}
        className="fab--extended group fixed right-8 bottom-8 z-20 inline-flex items-center space-x-2 rounded-full bg-black/80 p-4 text-lg whitespace-nowrap text-white shadow-md backdrop-blur-sm transition-colors hover:bg-black dark:bg-gray-700 dark:text-white print:hidden"
        {...props}
      >
        <span className="shrink-0">{getIcon(icon)}</span>
        <span className="-mr-2 max-w-0 overflow-hidden text-transparent transition-all duration-300 ease-in-out group-hover:mr-0 group-hover:max-w-96 group-hover:text-inherit group-focus:mr-0 group-focus:max-w-96 group-focus:text-inherit group-[.fab--extended]:mr-0 group-[.fab--extended]:max-w-96 group-[.fab--extended]:text-inherit">
          {text}
        </span>
      </a>
      <script
        dangerouslySetInnerHTML={{
          __html: `(${initFloatingButton.toString()})();`,
        }}
      />
    </>
  );
};

export const initFloatingButton = () => {
  const fab = document.getElementById("cta-fab");
  if (!fab) return;

  const isReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (isReduced) return;

  let lastScroll = window.scrollY || document.documentElement.scrollTop;
  const threshold = 15;

  const handleScroll = () => {
    const current = window.scrollY || document.documentElement.scrollTop;
    const diff = current - lastScroll;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        fab.classList.remove("fab--extended");
      } else {
        fab.classList.add("fab--extended");
      }
      lastScroll = Math.max(current, 0);
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
};
````

## File: packages/jsonresume-theme-cjean/src/components/Icons.tsx
````typescript
import { raw } from "@cjean-fr/jsx-string";

type IconifyIconName = `${string}:${string}`;
type IconifyAPIOptions = {
  height?: number | "auto" | "unset" | "none";
  width?: number | "auto" | "unset" | "none";
  rotate?: 1 | 2 | 3 | "90deg" | "180deg" | "270deg";
  flip?: "horizontal" | "vertical";
  color?: string;
};

export const fetchIcon = async (
  name: IconifyIconName,
  options: IconifyAPIOptions = {},
) => {
  const url = new URL(`https://api.iconify.design/${name}.svg`);
  for (const [key, value] of Object.entries(options)) {
    if (value) {
      url.searchParams.set(key, value.toString());
    }
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch icon ${name}`);
  }
  return response.text();
};

export const getIcon = async (
  name: string,
  size: number = 24,
  ariaHidden: boolean = true,
) => {
  const icon = await fetchIcon(name as IconifyIconName, {
    height: size,
  });

  const modifiedIcon = ariaHidden
    ? icon.replace("<svg", '<svg aria-hidden="true"')
    : icon;

  return raw(modifiedIcon);
};
````

## File: packages/jsonresume-theme-cjean/src/components/Skills.tsx
````typescript
import { t } from "../lib/i18n.js";
import type { Resume } from "../schema.js";
import Section from "./Section.js";
import type { HTMLAttributes } from "@cjean-fr/jsx-string";

interface SkillsProps extends HTMLAttributes {
  skills: Resume["skills"];
}

export default function Skills({ skills, ...props }: SkillsProps) {
  if (!skills || skills.length === 0) return null;

  return (
    <Section name={t("skills")} {...props}>
      {skills.map((skill) => (
        <div className="mb-4 break-inside-avoid" key={skill.name}>
          <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            {skill.name}
          </h3>
          <ul className="my-3 flex flex-wrap gap-2 leading-8">
            {skill.keywords?.map((keyword) => (
              <li className="badge" key={keyword}>
                {keyword}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </Section>
  );
}
````

## File: packages/jsonresume-theme-cjean/README.md
````markdown
# jsonresume-theme-cjean

A clean, professional [JSON Resume](https://jsonresume.org/) theme built with Tailwind CSS and TypeScript.

![Theme Preview](https://i.imgur.com/lWBFRBK.png)

## Features

- **Responsive Design**: Looks great on mobile and desktop.
- **Print Optimized**: Automatically adjusted for high-quality PDF exports.
- **SEO Ready**: Full support for Meta tags, OpenGraph, Twitter Cards, and JSON-LD.
- **Customizable Aesthetics**: Easy branding via granular `ui` configuration and geometric patterns.
- **Multi-locale Support**: Comes with `fr` and `en`. Locales are managed in a single file (`i18n.ts`) — feel free to contribute yours!
- **Modern Tech Stack**: Built with Bun, TypeScript, and JSX components.
- **CLI**: Built-in CLI to render your resume to an HTML file.

## Usage

### Installation

```bash
bun install
```

### Build

```bash
bun run build
```

### Execution (CLI)

While this theme is compatible with the official [resume-cli](https://github.com/jsonresume/resume-cli), it also comes with its own built-in CLI to render your resume to an HTML file:

#### Using npx

```bash
npx jsonresume-theme-cjean resume.json -o resume.html
```

#### Using bunx

```bash
bunx jsonresume-theme-cjean resume.json -o resume.html
```

## Configuration

You can customize the theme by adding a `meta` object to your `resume.json`.

```json
{
  "meta": {
    "theme": "cjean",
    "lang": "fr",
    "lastModified": "2026-02-06",
    "themeConfig": {
      "ui": {
        "primary": "#c80044",
        "headerFrom": "#0271bf",
        "headerTo": "#c80044",
        "footerFrom": "#0271bf",
        "footerTo": "#003d68",
        "backgroundTilesSeed": 188
      },
      "seo": {
        "title": "CV de Jean Dupont",
        "description": "Développeur Fullstack expérimenté",
        "robots": "index, follow"
      },
      "modest": false
    }
  },
  "basics": { ... }
}
```

### themeConfig Options

#### UI Options (`ui`)

| Option                | Description                                                                  | Default                                      |
| :-------------------- | :--------------------------------------------------------------------------- | :------------------------------------------- |
| `primary`             | Primary theme color                                                          | `#255b8f`                                    |
| `headerFrom`          | Gradient start color for header                                              | `#ccc074`                                    |
| `headerTo`            | Gradient end color for header                                                | `#4971af`                                    |
| `footerFrom`          | Gradient start color for footer                                              | `#463932`                                    |
| `footerTo`            | Gradient end color for footer                                                | `#7fbdbc`                                    |
| `backgroundTilesSeed` | Seed for the geometric background patterns                                   | `1`                                          |
| `links`               | Order and choice of contact links (phone, email, ...)                        | `["phone", "email", "location", "profiles"]` |
| `showLogos`           | Show work experiences logos taken from `work.logo or from `work.url` favicon | true                                         |
| `cta`                 | Add a Floating Action Button on the bottom right                             | -                                            |
| `cta.text`            | The button text                                                              | -                                            |
| `cta.url`             | The button target url                                                        | -                                            |
| `cta.icon`            | The button icon                                                              | -                                            |

**Note on `links`**:

- The order in the array determines the order of appearance.
- **Special keywords**: `phone`, `email`, `location`, `profiles`
- **`profiles` keyword**: A "catch-all" that renders all social networks not explicitly mentioned.
- **Specific networks**: You can use the name of a network (e.g., `"LinkedIn"`, `"GitHub"`) to place it exactly where you want.
- _Example_: `["LinkedIn", "email", "location"]` will show only these three, in that order.
- _Example_: `["phone", "profiles", "email"]` will show the phone, then ALL social profiles, then the email.

**Icons & Social Networks**:
The theme uses [Iconify](https://icon-sets.iconify.design/) to dynamically fetch icons.

- **Social Networks**: Icons for profiles are automatically prefixed with `tabler:brand-`. For example, a network named `LinkedIn` will search for `tabler:brand-linkedin`.
- **Custom Icons**: For the `cta.icon`, you must provide the full Iconify identifier (e.g., `mdi:email`, `tabler:message-circle`).
- **Search Icons**: You can browse thousands of available icons on the [Iconify Explorer](https://icon-sets.iconify.design/).

#### SEO Options (`seo`)

| Option         | Description                                 | Default            |
| :------------- | :------------------------------------------ | :----------------- |
| `title`        | Meta title (overrides default name - label) | -                  |
| `description`  | Meta description (overrides basics.summary) | -                  |
| `canonical`    | Canonical URL                               | -                  |
| `favicon`      | Iconify identifier to use as favicon        | -                  |
| `ogImage`      | Open Graph image URL                        | `basics.image`     |
| `twitterImage` | Twitter card image URL                      | `basics.image`     |
| `robots`       | Robots meta tag content                     | `index, follow`    |
| `firstName`    | SEO explicit first name                     | (parsed from name) |
| `lastName`     | SEO explicit last name                      | (parsed from name) |

#### Other Options

| Option   | Description                                           | Default |
| :------- | :---------------------------------------------------- | :------ |
| `modest` | Minimal branding (removes theme credit and generator) | `false` |

### Meta Options (root)

| Option         | Description                         | Default |
| :------------- | :---------------------------------- | :------ |
| `lang`         | Locale of the resume (`en` or `fr`) | `en`    |
| `lastModified` | Last modification date (ISO format) | (now)   |

## Adding New Locales

To add a new locale (e.g., Spanish `es`):

1.  Open `src/lib/i18n.ts`.
2.  Add the new translations to the `fr` or `en` model to stay in sync with the `ThemeSpec`.
3.  Define the new locale resource:
    ```typescript
    const es = defineTranslations<ThemeSpec>()({
      work_experience: "Experiencia laboral",
      // ... copy and translate all keys
    });
    ```
4.  Add it to the `resources` object:
    ```typescript
    const resources = {
      en,
      fr,
      es,
    };
    ```

## License

MIT © Christophe Jean

---

<p align="center">Made with ❤️ in Paris</p>
````

## File: packages/jsx-string/src/exports.test.ts
````typescript
import * as Main from "@cjean-fr/jsx-string";
import * as JSXRuntime from "@cjean-fr/jsx-string/jsx-runtime";
import { describe, it, expect } from "bun:test";

describe("package exports", () => {
  describe("main entry point", () => {
    it("should export renderToString", () => {
      expect(typeof Main.renderToString).toBe("function");
    });

    it("should export raw", () => {
      expect(Main.raw("test").toString()).toBe("test");
    });

    it("should export Fragment", () => {
      expect(Main.Fragment).toBeDefined();
    });

    it("should export scope API", () => {
      expect(typeof Main.withScope).toBe("function");
      expect(typeof Main.snapshot).toBe("function");
    });

    it("should export context API", () => {
      expect(typeof Main.context).toBe("function");
      expect(typeof Main.setContext).toBe("function");
      expect(typeof Main.useContext).toBe("function");
    });

    it("should NOT export internal details", () => {
      expect((Main as any).jsx).toBeUndefined();
      expect((Main as any).jsxs).toBeUndefined();
      expect((Main as any).h).toBeUndefined();
      expect((Main as any).RawString).toBeUndefined();
      expect((Main as any).isRawString).toBeUndefined();
      expect((Main as any).useScope).toBeUndefined();
    });
  });

  describe("jsx-runtime entry point", () => {
    it("should export jsx, jsxs, Fragment", () => {
      expect(typeof JSXRuntime.jsx).toBe("function");
      expect(typeof JSXRuntime.jsxs).toBe("function");
      expect(JSXRuntime.Fragment).toBeDefined();
    });

    it("should export the Deno precompile runtime trio", () => {
      expect(typeof JSXRuntime.jsxTemplate).toBe("function");
      expect(typeof JSXRuntime.jsxAttr).toBe("function");
      expect(typeof JSXRuntime.jsxEscape).toBe("function");
    });
  });
});
````

## File: packages/jsx-string/src/jsx-runtime.ts
````typescript
import type { Component, JSXNode, HTMLAttributes } from "./core/types.js";
import { RawString, type RenderResult } from "./core/types.js";
import { renderAttribute, renderChild, renderElement } from "./utils/html.js";

export type { JSX } from "./core/types.js";

/**
 * Automatic JSX Transform — production variant.
 *
 * Per the JSX automatic runtime spec, signature is `(type, props, key?)`. The
 * `key` is diagnostic, NOT a child. Children always live in `props.children`.
 *
 * Older versions of this package accepted variadic positional children for
 * classic-transform compatibility. That overload was removed in v2.0 because
 * it silently mis-rendered any element with a `key` and no children — the key
 * string was treated as the child. If you need classic-style `jsx(tag, props,
 * child1, child2)`, pass an explicit `children` array on `props` instead.
 */
export function jsx<P extends {} = {}>(
  tag: string | Component<P>,
  props: P,
  _key?: unknown,
): RenderResult {
  const p = (props ?? {}) as P & { children?: any };

  if (typeof tag === "function") {
    const result = renderChild(tag(p));
    return typeof result === "string"
      ? new RawString(result)
      : result.then((s) => new RawString(s));
  }

  return renderElement(tag, p as HTMLAttributes, p.children as JSXNode);
}

/**
 * Automatic JSX Transform — multi-children variant. Same shape as `jsx`;
 * emitted by transforms when children are statically known to be an array.
 */
export const jsxs: typeof jsx = jsx;

/**
 * JSX Fragment — groups children without wrapping them in a DOM element.
 *
 * Use the shorthand `<>...</>` syntax in JSX; the runtime resolves it to this
 * function. Returns its children unchanged, so they are flattened into the
 * parent element's content during rendering.
 *
 * @example
 * ```tsx
 * const List = () => (
 * <>
 * <li>one</li>
 * <li>two</li>
 * </>
 * );
 * await renderToString(<ul><List /></ul>);
 * // => "<ul><li>one</li><li>two</li></ul>"
 * ```
 */
export function Fragment({
  children,
}: {
  children?: JSXNode;
}): JSXNode | undefined {
  return children;
}

/**
 * Deno `jsx: "precompile"` runtime: serialize a single dynamic HTML attribute.
 *
 * Emitted by the compiler for each non-static attribute. Returns a string like
 * `name="value"` (or `name` for boolean `true`, or `""` when the attribute is
 * skipped). Applies the same security checks as the standard transform: URL
 * scheme blocking, attribute-name validation, event-handler filtering, safe
 * CSS values.
 *
 * `className` is rewritten to `class`. When a value is a Promise (e.g. from
 * an async source), returns `Promise<string>` so `jsxTemplate` can await it.
 */
export function jsxAttr(
  name: string,
  value: unknown,
): string | Promise<string> {
  return renderAttribute(name, value);
}

/**
 * Deno `jsx: "precompile"` runtime: prepare a dynamic child for embedding into
 * a template.
 *
 * Returns a value that `jsxTemplate` knows how to concatenate:
 * - `""` for nullish / boolean / empty string,
 * - the `RawString` itself (no re-escape),
 * - an escaped string for primitives,
 * - an array of escaped children (mirrors the JSX child-array shape),
 * - a `Promise` resolving to one of the above for async values — `jsxTemplate`
 * detects it and awaits before concatenation.
 */
export function jsxEscape(value: unknown): unknown {
  if (value == null || value === false || value === true || value === "")
    return "";
  if (value instanceof RawString) return value;
  if (value instanceof Promise) return value.then(jsxEscape);

  if (Array.isArray(value)) {
    let hasAsync = false;
    for (let i = 0; i < value.length; i++) {
      if (value[i] instanceof Promise) {
        hasAsync = true;
        break;
      }
    }
    if (!hasAsync) {
      const out: unknown[] = new Array(value.length);
      for (let i = 0; i < value.length; i++) {
        out[i] = jsxEscape(value[i]);
      }
      return out;
    }
    return Promise.all(value.map(jsxEscape));
  }
  return renderChild(value as JSXNode);
}

/**
 * Deno `jsx: "precompile"` runtime: concatenate static template slices with
 * dynamic expressions (each already pre-rendered by `jsxAttr` / `jsxEscape`
 * or by a nested `jsx()` call).
 *
 * Expressions may include Promises (returned by `jsxAttr` for async attribute
 * values, by `jsxEscape` for async children, or by `jsx()` for async
 * components). If any are pending, returns `Promise<RawString>`; otherwise
 * returns a synchronous `RawString`.
 */
export function jsxTemplate(
  templates: ArrayLike<string>,
  ...exprs: unknown[]
): RenderResult {
  let hasAsync = false;
  for (let i = 0; i < exprs.length; i++) {
    if (exprs[i] instanceof Promise) {
      hasAsync = true;
      break;
    }
  }
  if (!hasAsync) return new RawString(joinTemplate(templates, exprs));
  return Promise.all(exprs).then(
    (resolved) => new RawString(joinTemplate(templates, resolved)),
  );
}

/**
 * Internal helper to join template strings and flattened expressions.
 */
function joinTemplate(templates: ArrayLike<string>, exprs: unknown[]): string {
  let out = templates[0] ?? "";
  for (let i = 0; i < exprs.length; i++) {
    out += flattenExpr(exprs[i]) + (templates[i + 1] ?? "");
  }
  return out;
}

/**
 * Internal helper to flatten and stringify structural values (arrays, RawStrings).
 */
function flattenExpr(value: unknown): string {
  if (value == null || value === false || value === true) return "";
  if (value instanceof RawString) return value.value;
  if (Array.isArray(value)) {
    let out = "";
    for (let i = 0; i < value.length; i++) out += flattenExpr(value[i]);
    return out;
  }
  return String(value);
}
````

## File: README.md
````markdown
# Christophe Jean - Atelier

Personal monorepo of high-performance, type-safe tools built around JSX-to-HTML rendering.

## Packages

### `jsx-string` stack

| Package | Description |
| :--- | :--- |
| [`@cjean-fr/jsx-string`](./packages/jsx-string) | JSX-to-HTML string renderer. Zero dependencies. |
| [`@cjean-fr/jsx-flow`](./packages/jsx-flow) | Orchestration layer for deferred fragments and DOM patching (`<Deferred>`, `<Patch>`, Turbo / HTMX / Native adapters). |
| [`@cjean-fr/jsx-vite`](./packages/jsx-vite) | Vite asset integration — `<Asset>`, `assetUrl`, manifest resolution. |
| [`@cjean-fr/build-core`](./packages/build-core) | SSG kernel shared by site builders: filesystem routing, markdown, TOC, sitemap, RSS, git last-modified, search adapters, CLI. |
| [`@cjean-fr/docs`](./packages/docs) | Documentation site builder on top of the jsx-string stack. |

### Other tools

| Package | Description |
| :--- | :--- |
| [`@cjean-fr/eslint-plugin-jsx-string`](./packages/eslint-plugin-jsx-string) | ESLint rules for safe jsx-string usage. |
| [`@cjean-fr/i18n-tiny`](./packages/i18n-tiny) | Zero-dependency, type-safe minimalist i18n. |
| [`jsonresume-theme-cjean`](./packages/jsonresume-theme-cjean) | Clean, print-optimized JSON Resume theme (Tailwind + TypeScript). |

### Apps (internal)

| App | Description |
| :--- | :--- |
| [`jsx-string-doc`](./apps/jsx-string-doc) | Documentation site for `@cjean-fr/jsx-string` — end-to-end consumer of the stack. |

## Development

Managed with **Bun workspaces** and **Turbo**.

```bash
bun install
bun run build    # Build all packages
bun run test     # Run all tests
bun run check    # Type-check everything
```

## License

MIT © Christophe Jean
````

## File: packages/jsonresume-theme-cjean/src/components/Banner.tsx
````typescript
import type { HTMLAttributes } from "@cjean-fr/jsx-string";

interface BannerProps extends HTMLAttributes {
  name: string;
  label?: string;
}

export default function Banner({
  name,
  label,
  children,
  ...props
}: BannerProps) {
  return (
    <header
      className="flex-1 grow border-b border-gray-100 pb-8 dark:border-white/5"
      {...props}
    >
      <h1 className="text-primary kerning-normal inline-block text-5xl font-extrabold tracking-tight uppercase sm:text-6xl">
        {name}
      </h1>
      {label && (
        <p className="mt-2 text-3xl font-light tracking-wide text-gray-500 dark:text-slate-400">
          {label}
        </p>
      )}
      {children}
    </header>
  );
}
````

## File: packages/jsonresume-theme-cjean/src/components/Footer.tsx
````typescript
import { dateFormatter, tx } from "../lib/i18n.js";
import type { Resume } from "../schema.js";
import DateTime from "./DateTime.js";
import type { HTMLAttributes } from "@cjean-fr/jsx-string";

interface FooterProps extends HTMLAttributes {
  meta: Resume["meta"];
  bgTiles: string;
}

export default function Footer({ meta, bgTiles, ...props }: FooterProps) {
  const dateStr = meta.lastModified;

  return (
    <footer
      className="bg-angled-gradient from-footer-from to-footer-to relative isolate z-0 -mt-10 h-32 content-center pt-12 pb-2 text-center text-sm text-white dark:opacity-90 dark:contrast-125 dark:saturate-50 print:hidden"
      {...props}
    >
      <img
        src={bgTiles}
        alt=""
        loading="lazy"
        className="absolute inset-0 -z-10 size-full object-cover object-center"
        aria-hidden="true"
      />
      <div>
        {tx("last_modified", {
          date: (
            <DateTime date={dateStr}>
              {dateFormatter.format(dateStr, "date")}
            </DateTime>
          ),
        })}
      </div>
      <div className="mt-1 text-xs opacity-75">
        {!meta.themeConfig.modest &&
          tx("theme_credit", {
            link: (
              <a
                href="https://www.cjean.fr"
                target="_blank"
                className="underline decoration-white/30 underline-offset-2 transition-colors hover:decoration-white/80"
              >
                Christophe Jean
              </a>
            ),
          })}
      </div>
    </footer>
  );
}
````

## File: packages/jsonresume-theme-cjean/src/lib/i18n.ts
````typescript
import {
  createTranslator,
  type ValidTranslations,
  type Translator,
  defineTranslations,
} from "@cjean-fr/i18n-tiny";
import { raw, type JSXNode } from "@cjean-fr/jsx-string";

export type ThemeSpec = {
  work_experience: readonly [];
  education: readonly [];
  skills: readonly [];
  present: readonly [];
  contact_info: readonly [];
  phone_call: readonly [];
  email_send: readonly [];
  show_address: readonly [];
  portrait_alt: readonly ["name"];
  last_modified: readonly ["date"];
  profile_page_name: readonly ["name", "label"];
  theme_credit: readonly ["link"];
};

const en = defineTranslations<ThemeSpec>()({
  work_experience: "Work Experience",
  education: "Education",
  skills: "Skills",
  present: "Present",
  contact_info: "Contact Information",
  phone_call: "Call mobile phone",
  email_send: "Send email",
  show_address: "Show address",
  portrait_alt: "Portrait of {name}",
  last_modified: "Last updated on {date}",
  profile_page_name: "{name}'s resume - {label}",
  theme_credit: "Theme made with love by {link}",
});

const fr = defineTranslations<ThemeSpec>()({
  work_experience: "Expériences professionnelles",
  education: "Formations",
  skills: "Compétences",
  present: "Présent",
  contact_info: "Informations de contact",
  phone_call: "Appeler sur le téléphone mobile",
  email_send: "Envoyer un email",
  show_address: "Afficher l'adresse",
  portrait_alt: "Portrait de {name}",
  last_modified: "Dernière mise à jour le {date}",
  profile_page_name: "CV de {name} - {label}",
  theme_credit: "Thème proposé avec amour par {link}",
});

const resources = {
  en,
  fr,
};

type Locale = keyof typeof resources;

let translator: Translator<ThemeSpec> | undefined = undefined;

let currentLocale: Locale = "en";

/**
 * Translate a key to the current locale.
 * @param key The key to translate.
 * @param args The arguments to pass to the translator.
 * @returns The translated string.
 */
export const t: Translator<ThemeSpec> = (key, ...args) => {
  if (!translator) {
    translator = createTranslator<ThemeSpec>(
      resources[currentLocale] satisfies ValidTranslations<ThemeSpec>,
    );
  }
  return translator(key, ...args);
};

/**
 * Translate a key to the current locale and return a RawString.
 * @param key The key to translate.
 * @param args The arguments to pass to the translator.
 * @returns The translated string as a RawString.
 */
export const tx: Translator<ThemeSpec, JSXNode> = (key, ...args) => {
  return raw(t(key, ...(args as any)));
};

/**
 * Initialize the translator with a specific locale.
 */
export function init(locale: Locale) {
  currentLocale = locale;
  translator = createTranslator(resources[locale]);
}

export type DateFormat = "year" | "month" | "date" | "iso";

export const dateFormatter = {
  normalize(date: Date | string): Date | null {
    const d = typeof date === "string" ? new Date(date) : date;
    return isNaN(d.getTime()) ? null : d;
  },
  format(date: Date | string, format: DateFormat): string {
    const d = this.normalize(date);
    if (!d) return "";

    const locales =
      typeof currentLocale !== "undefined" ? currentLocale : "fr-FR";

    switch (format) {
      case "month": // Ex: "février 2026"
        return new Intl.DateTimeFormat(locales, {
          month: "long",
          year: "numeric",
        }).format(d);

      case "year": // Ex: "2026"
        return d.getFullYear().toString();

      case "date": // Ex: "17/02/2026"
        return new Intl.DateTimeFormat(locales, {
          day: "numeric",
          month: "numeric",
          year: "numeric",
        }).format(d);

      case "iso": // Ex: "2026-02-17T..."
        return d.toISOString();

      default:
        throw new Error(`Unhandled date format: ${format}`);
    }
  },
  toISO(date: Date | string): string {
    return this.normalize(date)?.toISOString() ?? "";
  },
};
````

## File: packages/jsonresume-theme-cjean/vite.config.js
````javascript
import dts from 'vite-plugin-dts';
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  publicDir: false,
  plugins: [
    tailwindcss(),
    dts({ rollupTypes: true })
  ],
  build: {
    lib: {
      entry: {
        index: "src/index.tsx",
      },
      formats: ["es", "cjs"],
      fileName: "index",
    },
    outDir: "dist",
    emptyOutDir: true,
  },
});
````

## File: .github/workflows/ci.yml
````yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    name: Test & Build (CLI on ${{ matrix.runtime }})
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        runtime: [node, bun]
    env:
      DO_NOT_TRACK: 1

    steps:
      - name: Checkout
        uses: actions/checkout@v6

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Setup Node
        uses: actions/setup-node@v5
        with:
          node-version: "24"

      - name: Install dependencies
        run: bun install

      # --- jsx-string ----------------------------------------------------
      - name: Type check jsx-string
        run: bun run check
        working-directory: packages/jsx-string
      - name: Test jsx-string
        run: bun test
        working-directory: packages/jsx-string
      - name: Build jsx-string
        run: bun run build
        working-directory: packages/jsx-string
      - name: Verify jsx-string artifacts
        run: |
          test -f dist/index.js || exit 1
          test -f dist/index.d.ts || exit 1
        working-directory: packages/jsx-string

      # --- eslint-plugin-jsx-string --------------------------------------
      - name: Type check eslint-plugin
        run: bun run check
        working-directory: packages/eslint-plugin-jsx-string
      - name: Test eslint-plugin
        run: bun test
        working-directory: packages/eslint-plugin-jsx-string

      # --- jsx-flow ------------------------------------------------------
      - name: Type check jsx-flow
        run: bun run check
        working-directory: packages/jsx-flow
      - name: Test jsx-flow
        run: bun test
        working-directory: packages/jsx-flow
      - name: Build jsx-flow
        run: bun run build
        working-directory: packages/jsx-flow

      # --- jsx-vite ------------------------------------------------------
      - name: Type check jsx-vite
        run: bun run check
        working-directory: packages/jsx-vite
      - name: Test jsx-vite
        run: bun test
        working-directory: packages/jsx-vite
      - name: Build jsx-vite
        run: bun run build
        working-directory: packages/jsx-vite

      # --- build-core ----------------------------------------------------
      - name: Type check build-core
        run: bun run check
        working-directory: packages/build-core
      - name: Test build-core
        run: bun test
        working-directory: packages/build-core
      - name: Build build-core
        run: bun run build
        working-directory: packages/build-core

      # --- docs ----------------------------------------------------------
      - name: Type check docs
        run: bun run check
        working-directory: packages/docs
      - name: Build docs
        run: bun run build
        working-directory: packages/docs

      # --- Integration: jsx-string-doc built via the CLI ---------------
      # The CLI binary lives in @cjean-fr/docs and is invoked through the
      # workspace symlink. Matrix runs it under both `node` and `bun` so
      # we catch runtime-specific issues (npx audience vs bun-native).
      - name: Build jsx-string-doc (CLI under ${{ matrix.runtime }})
        run: ${{ matrix.runtime }} ./node_modules/@cjean-fr/docs/bin/docs.mjs build
        working-directory: apps/jsx-string-doc
      - name: Verify jsx-string-doc artifacts
        run: |
          test -f dist/index.html || exit 1
          test -f dist/search-index.json || exit 1
        working-directory: apps/jsx-string-doc
````

## File: packages/jsonresume-theme-cjean/src/components/Section.tsx
````typescript
import type { HTMLAttributes } from "@cjean-fr/jsx-string";

interface SectionProps extends HTMLAttributes {
  name?: string;
}

export default function Section({ name, children, ...props }: SectionProps) {
  const sectionId = name
    ? `section-${name.toLowerCase().replace(/\s+/g, "-")}`
    : undefined;

  return (
    <section aria-labelledby={sectionId} {...props}>
      {name && (
        <h2
          id={sectionId}
          className="before:bg-primary relative mt-8 mb-4 break-after-avoid text-2xl tracking-tight text-gray-900 before:absolute before:-bottom-1 before:left-0 before:h-1 before:w-[3ch] before:rounded-[0_0.25rem_0.25rem_0] dark:text-white before:print:[print-color-adjust:exact]"
        >
          {name}
        </h2>
      )}
      {children}
    </section>
  );
}
````

## File: packages/jsonresume-theme-cjean/src/components/Education.tsx
````typescript
import { t } from "../lib/i18n.js";
import type { Resume } from "../schema.js";
import Period from "./Period.js";
import Section from "./Section.js";
import type { HTMLAttributes } from "@cjean-fr/jsx-string";

interface EducationProps extends HTMLAttributes {
  education: Resume["education"];
  certificates: Resume["certificates"];
}

export default function Education({ education, certificates }: EducationProps) {
  const hasEducation = education && education.length > 0;
  const hasCertificates = certificates && certificates.length > 0;

  if (!hasEducation && !hasCertificates) return null;

  return (
    <Section name={t("education")}>
      <ol className="timeline">
        {education?.map((edu, index) => (
          <li className="timeline-item" key={`edu-${index}`}>
            <article className="group">
              <div className="min-w-0 flex-1">
                <div className="grid grid-cols-1 gap-x-4 md:grid-cols-[1fr_auto]">
                  <div className="min-w-0">
                    <header>
                      <h3 className="truncate text-xl font-bold tracking-tight text-gray-900 md:whitespace-normal dark:text-white">
                        {edu.studyType}
                      </h3>
                    </header>

                    <div className="mt-1 text-gray-600 dark:text-slate-300">
                      {edu.url ? (
                        <a
                          href={edu.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          translate="no"
                          className="hover:text-primary font-medium text-gray-700 underline-offset-4 transition-colors hover:underline dark:text-slate-200"
                        >
                          {edu.institution}
                        </a>
                      ) : (
                        <span
                          translate="no"
                          className="font-medium text-gray-700 dark:text-slate-200"
                        >
                          {edu.institution}
                        </span>
                      )}
                      {edu.area && (
                        <span className="ml-2 text-sm text-gray-500">
                          - {edu.area}
                        </span>
                      )}
                    </div>
                  </div>

                  <Period
                    startDate={edu.startDate}
                    endDate={edu.endDate}
                    format="year"
                    className="mt-1 flex shrink-0 text-sm text-gray-500 capitalize md:mt-1.5 md:items-start md:text-right dark:text-slate-400"
                  />
                </div>
              </div>
            </article>
          </li>
        ))}

        {certificates?.map((cert, index) => (
          <li
            className="timeline-item timeline-item-secondary"
            key={`cert-${index}`}
          >
            <article className="group">
              <div className="min-w-0 flex-1">
                <div className="grid grid-cols-1 gap-x-4 md:grid-cols-[1fr_auto]">
                  <div className="min-w-0">
                    <header>
                      <h3 className="truncate text-xl font-bold tracking-tight text-gray-900 md:whitespace-normal dark:text-white">
                        {cert.name}
                      </h3>
                    </header>

                    <div className="mt-1 text-gray-600 dark:text-slate-300">
                      {cert.url ? (
                        <a
                          href={cert.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          translate="no"
                          className="hover:text-primary font-medium text-gray-700 underline-offset-4 transition-colors hover:underline dark:text-slate-200"
                        >
                          {cert.issuer}
                        </a>
                      ) : (
                        <span
                          translate="no"
                          className="font-medium text-gray-700 dark:text-slate-200"
                        >
                          {cert.issuer}
                        </span>
                      )}
                    </div>
                  </div>

                  <Period
                    endDate={cert.date}
                    format="year"
                    className="mt-1 flex shrink-0 text-sm text-gray-500 capitalize md:mt-1.5 md:items-start md:text-right dark:text-slate-400"
                  />
                </div>
              </div>
            </article>
          </li>
        ))}
      </ol>
    </Section>
  );
}
````

## File: packages/jsonresume-theme-cjean/src/components/WorkExperience.tsx
````typescript
import { t } from "../lib/i18n.js";
import { type Resume } from "../schema.js";
import Period from "./Period.js";
import Section from "./Section.js";
import type { HTMLAttributes } from "@cjean-fr/jsx-string";

interface WorkExperienceProps extends HTMLAttributes {
  works: Resume["work"];
  showLogos?: boolean;
}

export default function WorkExperience({
  works,
  showLogos,
}: WorkExperienceProps) {
  if (!works || works.length === 0) return null;

  return (
    <Section name={t("work_experience")}>
      <ol className="timeline" reversed>
        {works.map((work) => (
          <li className="timeline-item" key={work.name + work.startDate}>
            <article className="group">
              <div className="flex items-start gap-4">
                {showLogos && (
                  <div className="mt-1 shrink-0">
                    {work.logo ? (
                      <img
                        src={work.logo}
                        alt={work.name}
                        width="48"
                        height="48"
                        className="h-12 w-12 rounded-lg object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 font-bold text-gray-400 uppercase select-none dark:bg-slate-800 dark:text-slate-500">
                        {work.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="grid grid-cols-1 gap-x-4 md:grid-cols-[1fr_auto]">
                    <div className="min-w-0">
                      <header>
                        <h3 className="truncate text-xl font-bold tracking-tight text-gray-900 md:whitespace-normal dark:text-white">
                          {work.position}
                        </h3>
                      </header>

                      <div className="mt-1 text-gray-600 dark:text-slate-300">
                        {work.url ? (
                          <a
                            href={work.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            translate="no"
                            className="hover:text-primary font-medium text-gray-700 underline-offset-4 transition-colors hover:underline dark:text-slate-200"
                          >
                            {work.name}
                          </a>
                        ) : (
                          <span
                            translate="no"
                            className="font-medium text-gray-700 dark:text-slate-200"
                          >
                            {work.name}
                          </span>
                        )}
                        {work.description && (
                          <span className="ml-2 text-sm text-gray-500">
                            - {work.description}
                          </span>
                        )}
                      </div>
                    </div>

                    <Period
                      startDate={work.startDate}
                      endDate={work.endDate}
                      format="month"
                      className="mt-1 flex shrink-0 text-sm text-gray-500 capitalize md:mt-1.5 md:items-start md:text-right dark:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {work.summary && (
                <p className="mt-3 text-sm leading-relaxed text-pretty text-gray-600 dark:text-slate-400">
                  {work.summary}
                </p>
              )}

              <ul className="bullet-list">
                {work.highlights?.map((highlight: string) => (
                  <li className="bullet-item" key={highlight}>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </article>
          </li>
        ))}
      </ol>
    </Section>
  );
}
````

## File: packages/jsonresume-theme-cjean/src/styles/tailwind.input.css
````css
@import "tailwindcss";
@variant dark (&:where(.dark, .dark *));

@theme {
  --color-primary: var(--theme-primary);
  --color-header-from: var(--theme-header-from);
  --color-header-to: var(--theme-header-to);
  --color-footer-from: var(--theme-footer-from);
  --color-footer-to: var(--theme-footer-to);
  --text-smaller: smaller;
  --font-size-smaller: smaller;
  --min-width-30: 7.5rem;
}

@variant dark {
  @theme {
    /* Lower lightness and chroma (saturation) for a softer look on dark backgrounds */
    --color-primary: oklch(from var(--theme-primary) calc(l * 0.9) calc(c * 0.7) h);
  }
}

@utility kerning-* {
  font-kerning: --value("auto", "none", "normal");
}

@utility bg-angled-gradient {
  --gradient-angle: 16deg;
  background-image: linear-gradient(var(--gradient-angle),
      var(--tw-gradient-from, transparent),
      var(--tw-gradient-to, transparent));
}

@layer components {
  .timeline {
    @apply relative list-none space-y-8 border-gray-200/60 md:ml-4 md:border-l-4 md:pl-8 dark:border-slate-700/50;
  }

  .timeline-item {
    @apply relative break-inside-avoid;
  }

  /* Timeline dot/marker */
  .timeline-item::before {
    @apply border-primary absolute top-1.5 -left-[34px] hidden h-4 w-4 -translate-x-1/2 rounded-full border-[3px] bg-white content-[''] md:block;
  }

  .dark .timeline-item::before {
    @apply bg-slate-900/95;
  }

  .timeline-item-secondary::before {
    @apply border-gray-200 dark:border-slate-800;
  }

  .bullet-list {
    @apply mt-3 ml-5 list-disc space-y-1.5 marker:text-gray-300 dark:marker:text-slate-400;
  }

  .bullet-item {
    @apply pl-1 text-sm text-gray-600 dark:text-slate-400;
  }

  .badge {
    @apply inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-sm font-medium text-gray-600 inset-ring inset-ring-gray-500/10 dark:bg-slate-800 dark:text-slate-300 dark:inset-ring-white/10;
  }
}
````

## File: packages/jsx-string/src/core/types.ts
````typescript
// Augment React's types when @types/react is installed,
// so jsx-string attributes (class, string event handlers) are accepted there too.
declare module "react" {
  interface HTMLAttributes<T> {
    class?: string;
    [key: `on${string}`]: any;
  }
  interface SVGAttributes<T> {
    class?: string;
    [key: `on${string}`]: any;
  }
}

/**
 * Trusted, already-escaped HTML.
 *
 * The class is registered on `globalThis` under `Symbol.for(...)` so that
 * even when jsx-string is loaded multiple times (Vite SSR + Node-loaded
 * plugins, workers, microfrontends), every loaded instance reuses the
 * SAME class — `instanceof RawString` then stays meaningful across module
 * boundaries instead of silently failing and re-escaping trusted HTML.
 */
declare class RawStringType {
  readonly value: string;
  constructor(value: string);
  toString(): string;
}

const RAWSTRING_KEY = Symbol.for("@cjean-fr/jsx-string.RawString");
const g = globalThis as { [RAWSTRING_KEY]?: typeof RawStringType };

if (!g[RAWSTRING_KEY]) {
  g[RAWSTRING_KEY] = class RawString {
    readonly value: string;
    constructor(value: string) {
      this.value = value;
    }
    toString(): string {
      return this.value;
    }
  };
}

export const RawString: typeof RawStringType = g[RAWSTRING_KEY]!;
export type RawString = RawStringType;

/**
 * Mark an HTML string as trusted: it will be rendered verbatim without HTML
 * escaping. Use this for HTML you generated yourself or from a source you
 * fully trust — typically a Markdown renderer's output or a templating helper.
 *
 * **Common mistake — `raw()` is *not* for rendering user text.** If you have
 * a string and just want it to appear on the page (with `<`, `>`, `&`
 * displayed as characters), embed it directly — the default behavior already
 * HTML-escapes for you:
 *
 * ```tsx
 * <p>{userText}</p>   // ✅ safe — `<`/`>`/`&` shown as text
 * <p>{raw(userText)}</p>  // ❌ XSS if userText contains <script>...
 * ```
 *
 * ⚠️ **For untrusted HTML that must render *as HTML*** (e.g. forum posts
 * that allow basic formatting), escaping alone is not enough — you need an
 * HTML *sanitizer* (a different tool: it strips dangerous tags/attrs
 * structurally, instead of encoding them). Use
 * [`DOMPurify`](https://github.com/cure53/DOMPurify) or
 * [`sanitize-html`](https://github.com/apostrophecms/sanitize-html) and pass
 * their output to `raw()`.
 *
 * @example
 * ```tsx
 * import { raw } from "@cjean-fr/jsx-string";
 *
 * // Trusted source: server-side Markdown renderer.
 * const html = await renderMarkdown(post.body);
 * return <article>{raw(html)}</article>;
 * ```
 */
export const raw = (value: string): RawString => new RawString(value);

export type RenderResult = RawString | Promise<RawString>;

interface JSXElement {
  toString(): string;
}

/**
 * CSS Properties that allow any property name, including CSS variables.
 * When @types/react is installed, style autocompletion comes from React.CSSProperties
 * via the normal tsconfig jsxImportSource chain — no extra setup needed.
 */
export interface CSSProperties {
  [key: string]: string | number | undefined;
}

/**
 * Event handlers expressed as static strings instead of functions.
 * Common handlers are listed explicitly for dot-notation access;
 * all others are covered by the [key: string]: any index signature on HTMLAttributes.
 */
export type StringEventHandlers = {
  onClick?: string;
  onChange?: string;
  onInput?: string;
  onSubmit?: string;
  onFocus?: string;
  onBlur?: string;
  onKeyDown?: string;
  onKeyUp?: string;
  onKeyPress?: string;
  onMouseEnter?: string;
  onMouseLeave?: string;
  onMouseOver?: string;
  onMouseOut?: string;
  onMouseMove?: string;
  onMouseDown?: string;
  onMouseUp?: string;
  onTouchStart?: string;
  onTouchEnd?: string;
  onTouchMove?: string;
  onPaste?: string;
  onCopy?: string;
  onCut?: string;
  onScroll?: string;
  onLoad?: string;
  onError?: string;
  onSelect?: string;
  onDrag?: string;
  onDrop?: string;
  onDragOver?: string;
  onDragStart?: string;
  onDragEnd?: string;
  onContextMenu?: string;
  onDoubleClick?: string;
  onWheel?: string;
  onResize?: string;
  onAbort?: string;
  onCanPlay?: string;
  onPlay?: string;
  onPause?: string;
  onEnded?: string;
};

/**
 * Strip event handlers and layout props from T, then reattach them as static-friendly versions.
 * Works standalone — does not require @types/react.
 */
export type ToStatic<T = {}> = {
  [K in keyof T as K extends
    | `on${string}`
    | "children"
    | "style"
    | "class"
    | "className"
    ? never
    : K]: T[K];
} & {
  class?: string;
  className?: string;
  style?: string | CSSProperties | Promise<string | CSSProperties>;
  children?: JSXNode;
  dangerouslySetInnerHTML?: { __html: string };
} & StringEventHandlers;

/**
 * Base attributes shared by all HTML elements.
 * Permissive by default: [key: string]: any allows any valid HTML attribute.
 * When @types/react is installed, ToStatic<React.HTMLAttributes<any>> gives richer autocomplete.
 */
export interface HTMLAttributes extends ToStatic {
  id?: string;
  class?: string;
  className?: string;
  style?: string | CSSProperties | Promise<string | CSSProperties>;
  children?: JSXNode;
  dangerouslySetInnerHTML?: { __html: string };
  lang?: string;
  dir?: "ltr" | "rtl" | "auto";
  role?: string;
  tabIndex?: number;
  tabindex?: number;
  title?: string;
  hidden?: boolean | string;
  slot?: string;
  /** Catch-all for any other HTML or data attribute */
  [key: string]: any;
}

/**
 * Base attributes shared by all SVG elements.
 */
export interface SVGAttributes extends HTMLAttributes {
  viewBox?: string;
  xmlns?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: string | number;
  width?: string | number;
  height?: string | number;
  d?: string;
  cx?: string | number;
  cy?: string | number;
  r?: string | number;
  x?: string | number;
  y?: string | number;
}

/**
 * Types of children that can be passed to a JSX element.
 */
export type JSXNode =
  | string
  | number
  | boolean
  | null
  | undefined
  | JSXElement
  | Promise<JSXNode>
  | JSXNode[];

export type Component<P = {}> = (
  props: P & HTMLAttributes & { children?: JSXNode },
) => JSXNode;

/**
 * JSX Namespace for the internal factory.
 * IntrinsicElements is permissive ([tag: string]: HTMLAttributes).
 * Per-element attribute checking (img → src, a → href, …) is available
 * automatically when @types/react is installed, via the jsxImportSource chain.
 */
export namespace JSX {
  export type Element = RawString | Promise<RawString>;
  export interface IntrinsicElements {
    [tag: string]: HTMLAttributes;
  }
  export interface IntrinsicAttributes {
    key?: string | number | null | undefined;
    [key: string]: any;
  }
  export interface ElementAttributesProperty {
    props: {};
  }
  export interface ElementChildrenAttribute {
    children: {};
  }
}

declare global {
  namespace JSX {
    interface Element extends RawString {}
    interface IntrinsicElements {
      [tag: string]: HTMLAttributes;
    }
    interface IntrinsicAttributes {
      key?: string | number | null | undefined;
      [key: string]: any;
    }
  }
}
````

## File: packages/jsx-string/src/index.ts
````typescript
import type { JSXNode } from "./core/types.js";
import { renderChild } from "./utils/html.js";

export { raw } from "./core/types.js";
export { Fragment } from "./jsx-runtime.js";
export type {
  CSSProperties,
  StringEventHandlers,
  ToStatic,
  HTMLAttributes,
  SVGAttributes,
  JSXNode,
  Component,
  JSX,
} from "./core/types.js";
export {
  context,
  setContext,
  useContext,
  withScope,
  snapshot,
  type Context,
  type ScopeOptions,
} from "./core/context.js";

/**
 * Render a JSX tree to an HTML string.
 *
 * Always returns `Promise<string>` — even when the tree contains no async
 * work — because any component can return a Promise. Output is HTML-safe by
 * default (see the README "Security model" section for what is and isn't
 * defended).
 *
 * Concurrent calls are isolated: `Promise.all([renderToString(a), renderToString(b)])`
 * is safe even when `a` and `b` use `context()` / `setContext()` inside a
 * `withScope()`.
 *
 * @example
 * ```tsx
 * import { renderToString } from "@cjean-fr/jsx-string";
 *
 * const Page = async ({ id }: { id: string }) => {
 *   const user = await fetchUser(id);
 *   return <h1>Hello {user.name}</h1>;
 * };
 *
 * const html = await renderToString(<Page id="42" />);
 * ```
 */
export async function renderToString(node: JSXNode): Promise<string> {
  return renderChild(node);
}
````

## File: packages/jsx-string/src/utils/escape.ts
````typescript
// https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html

/**
 * Attributes that expect a URL and should be sanitized.
 */
export const URL_ATTRIBUTES = new Set([
  "href",
  "src",
  "action",
  "formaction",
  "cite",
  "poster",
  "icon",
  "data",
  "xlink:href",
  "srcset",
]);

const REGEX_CONTENT_TEST = /[&<>]/;
const REGEX_ATTR_TEST = /[&<>"]/;
const REGEX_OTHER_UNICODE_CHARS_TEST = /\p{C}/u;
const REGEX_OTHER_UNICODE_CHARS_REPLACE = /\p{C}/gu;
// Reject whitespace, quotes, brackets, `=`, `/`, AND any Unicode "Other"
// codepoint (controls, formatters, surrogates, etc.) in one pass. This lets
// `renderAttributeSync`'s hot path validate with a single regex test for
// clean ASCII names — only names that fail need the slower `sanitize` retry.
const REGEX_VALID_ATTR_NAME = /^[^\s"'>/=\p{C}]+$/u;
const REGEX_VALID_TAG_NAME = /^[a-zA-Z][a-zA-Z0-9-]*$/;
const REGEX_UNSAFE_PROTOCOLS = /^(?:java|vb)script:/i;
const REGEX_NON_IMAGE_DATA_URI = /^data:(?!image\/)/i;

/**
 * Strips all 'Other' Unicode characters (controls, invisible formatters, etc.).
 */
export const sanitize = (str: string): string => {
  if (!REGEX_OTHER_UNICODE_CHARS_TEST.test(str)) {
    return str;
  }
  return str.replace(REGEX_OTHER_UNICODE_CHARS_REPLACE, "");
};

/**
 * Escape `&`, `<`, `>` for HTML text content.
 *
 * Two-stage strategy: an upfront `regex.test` (highly optimized native scan)
 * short-circuits for strings with no escapable char — the common case for
 * benign user text. Only when an escape is required do we walk the string
 * with `charCodeAt` + `slice`, which is still faster than `replaceAll` with
 * a callback (no per-match function dispatch).
 */
export const escapeContent = (str: string): string => {
  if (!REGEX_CONTENT_TEST.test(str)) return str;
  let out = "";
  let last = 0;
  for (let i = 0; i < str.length; i++) {
    let rep: string;
    switch (str.charCodeAt(i)) {
      case 38: // &
        rep = "&amp;";
        break;
      case 60: // <
        rep = "&lt;";
        break;
      case 62: // >
        rep = "&gt;";
        break;
      default:
        continue;
    }
    if (i !== last) out += str.slice(last, i);
    out += rep;
    last = i + 1;
  }
  return out + str.slice(last);
};

/**
 * Escape `&`, `<`, `>`, `"` for HTML attribute values (which we always wrap in
 * double quotes). Single quotes don't need escaping in double-quoted attrs.
 * Same two-stage strategy as {@link escapeContent}.
 */
export const escapeAttr = (str: string): string => {
  if (!REGEX_ATTR_TEST.test(str)) return str;
  let out = "";
  let last = 0;
  for (let i = 0; i < str.length; i++) {
    let rep: string;
    switch (str.charCodeAt(i)) {
      case 38: // &
        rep = "&amp;";
        break;
      case 60: // <
        rep = "&lt;";
        break;
      case 62: // >
        rep = "&gt;";
        break;
      case 34: // "
        rep = "&quot;";
        break;
      default:
        continue;
    }
    if (i !== last) out += str.slice(last, i);
    out += rep;
    last = i + 1;
  }
  return out + str.slice(last);
};

/**
 * OWASP Rule #5: URL Sanitize
 * Blocks dangerous protocols like javascript:, vbscript:, and non-image data URIs.
 * Handles null bytes and common obfuscation attempts by sanitizing first.
 */
export const isSafeUrl = (url: string): boolean => {
  const sanitized = sanitize(url).trim();

  if (!sanitized) return true;
  if (REGEX_UNSAFE_PROTOCOLS.test(sanitized)) return false;
  if (REGEX_NON_IMAGE_DATA_URI.test(sanitized)) return false;

  return true;
};

/**
 * `srcset` is a comma-separated list of image candidates, not a single URL.
 * Block if any candidate URL uses a dangerous scheme.
 */
export const isSafeSrcset = (srcset: string): boolean => {
  const sanitized = sanitize(srcset).trim();
  if (!sanitized) return true;

  for (const candidate of sanitized.split(",")) {
    const url = candidate.trimStart().split(/\s+/, 1)[0] ?? "";
    if (!isSafeUrl(url)) return false;
  }

  return true;
};

export const isValidAttrName = (name: string): boolean => {
  return REGEX_VALID_ATTR_NAME.test(name);
};

export const isValidTagName = (name: string): boolean => {
  return REGEX_VALID_TAG_NAME.test(name);
};
````

## File: packages/jsx-string/src/utils/html.test.ts
````typescript
import {
  renderAttributes,
  renderChild,
  renderElement,
  renderStyle,
  RawString,
  raw,
} from "./html.js";
import { expect, describe, it } from "bun:test";

const resolve = (v: string | Promise<string>) => Promise.resolve(v);

describe("html utilities", () => {
  describe("raw utility", () => {
    it("should create a RawString instance", () => {
      const r = raw("<b>test</b>");
      expect(r).toBeInstanceOf(RawString);
      expect(r.value).toBe("<b>test</b>");
    });
  });

  describe("renderAttributes", () => {
    it("should render class and className as separate attributes (no merge)", () => {
      // Matches the precompile transform: each attribute is rendered in isolation.
      expect(renderAttributes({ class: "a", className: "b" })).toBe(
        ' class="a" class="b"',
      );
    });

    it("should handle className alone", () => {
      expect(renderAttributes({ className: "only-class" })).toBe(
        ' class="only-class"',
      );
    });

    it("should handle boolean attributes", () => {
      expect(renderAttributes({ disabled: true, checked: false })).toBe(
        " disabled",
      );
    });

    it("should handle style objects", () => {
      expect(
        renderAttributes({ style: { color: "red", marginTop: "10px" } }),
      ).toBe(' style="color:red;margin-top:10px"');
    });

    it("should handle style as raw string", () => {
      expect(renderAttributes({ style: "color: red; margin-top: 10px;" })).toBe(
        ' style="color: red; margin-top: 10px;"',
      );
    });

    it("should block unsafe URLs", () => {
      expect(renderAttributes({ href: "javascript:alert(1)" })).toBe(
        ' href="#blocked"',
      );
    });

    it("should allow safe data: image URLs", () => {
      expect(renderAttributes({ src: "data:image/png;base64,abc" })).toBe(
        ' src="data:image/png;base64,abc"',
      );
    });

    it("should support string event handlers and block non-string values", () => {
      expect(
        renderAttributes({
          onClick: "alert('hello')",
          onHover: (() => {}) as any,
          id: "btn",
        }),
      ).toBe(' onclick="alert(\'hello\')" id="btn"');
    });

    it("should support custom event handler with template literals", () => {
      expect(
        renderAttributes({
          onclick: "alert(`Hello ${this.dataset.name}`)",
          "data-name": "World",
        }),
      ).toBe(
        ' onclick="alert(`Hello ${this.dataset.name}`)" data-name="World"',
      );
    });

    it("should filter unsafe CSS values", () => {
      expect(
        renderAttributes({
          style: {
            backgroundImage: "url(javascript:alert(1))",
            color: "red",
          },
        }),
      ).toBe(' style="color:red"');
    });

    it("should allow safe url() in CSS", async () => {
      const result = await renderAttributes({
        style: { backgroundImage: "url(https://example.com/img.png)" },
      });
      expect(result).toContain("url(https://example.com/img.png)");
    });

    it("should ignore internal props", () => {
      expect(renderAttributes({ key: "1", ref: "r", id: "ok" })).toBe(
        ' id="ok"',
      );
    });

    it("should ignore null and undefined values", () => {
      expect(renderAttributes({ id: "ok", foo: null, bar: undefined })).toBe(
        ' id="ok"',
      );
    });

    it("should pass through data-* and aria-* attributes verbatim", () => {
      expect(
        renderAttributes({ "data-test-id": "123", "aria-label": "test" }),
      ).toBe(' data-test-id="123" aria-label="test"');
    });

    it("should pass through unknown attributes verbatim regardless of casing", () => {
      expect(renderAttributes({ dataTestId: "123", ariaLabel: "test" })).toBe(
        ' dataTestId="123" ariaLabel="test"',
      );
    });

    it("should block function values on lowercase event handlers (regression)", () => {
      // Bug repro: a previous fast-path gated the event-handler check on
      // "name has uppercase letters", which let `onclick={fn}` through even
      // though REGEX_EVENT_HANDLER is case-insensitive — leaking the function
      // source as a real attribute, i.e. XSS via inline handler.
      expect(
        renderAttributes({
          onclick: (() => {}) as any,
          onfocus: (() => {}) as any,
          ONCLICK: (() => {}) as any,
          id: "btn",
        }),
      ).toBe(' id="btn"');
    });

    it("should block non-string values on lowercase event handlers (regression)", () => {
      // Event handlers require a string value (JS code). Numbers, booleans,
      // objects, arrays are all meaningless here and must be dropped, even
      // when the handler name is fully lowercase.
      expect(
        renderAttributes({
          onclick: 42 as any,
          onmouseover: true as any,
          onkeydown: { handler: "x" } as any,
          id: "btn",
        }),
      ).toBe(' id="btn"');
    });

    it("should strip invisible Unicode chars from attribute names (regression)", () => {
      // Bug repro: a previous optim ran the validation regex before sanitize,
      // and the validation regex doesn't reject `\p{C}` chars (ZWSP, LRM,
      // NUL, etc.). Hidden control chars would then leak into attribute names
      // verbatim instead of being stripped.
      expect(renderAttributes({ "data​-id": "123" })).toBe(' data-id="123"');
      expect(renderAttributes({ "cla‎ss": "x" })).toBe(' class="x"');
      expect(renderAttributes({ "id\x00": "v" })).toBe(' id="v"');
    });

    it("should resolve a direct Promise in an attribute", async () => {
      const result = await renderAttributes({
        title: Promise.resolve("async title") as any,
      });
      expect(result).toBe(' title="async title"');
    });

    it("should handle mixed sync/async in same props object", async () => {
      const result = await renderAttributes({
        id: "static",
        title: Promise.resolve("async-title") as any,
        class: "static-class",
      });
      expect(result).toContain('id="static"');
      expect(result).toContain('class="static-class"');
      expect(result).toContain('title="async-title"');
    });

    it("should enforce URL safety on a Promise-valued URL attribute", async () => {
      const result = await renderAttributes({
        href: Promise.resolve("javascript:alert(1)") as any,
      });
      expect(result).toBe(' href="#blocked"');
    });

    it("should accept a Promise<CSSProperties> as style", async () => {
      const result = await renderAttributes({
        style: Promise.resolve({ color: "red", marginTop: "4px" }) as any,
      });
      expect(result).toBe(' style="color:red;margin-top:4px"');
    });
  });

  describe("renderStyle", () => {
    it("should convert camelCase to kebab-case", () => {
      expect(renderStyle({ backgroundColor: "red", "--custom": "blue" })).toBe(
        "background-color:red;--custom:blue",
      );
    });

    it("should convert multi-capital camelCase to kebab-case", () => {
      expect(
        renderStyle({
          borderTopColor: "red",
          borderTopLeftRadius: "4px",
          listStyleType: "disc",
          textDecorationLine: "underline",
        }),
      ).toBe(
        "border-top-color:red;border-top-left-radius:4px;list-style-type:disc;text-decoration-line:underline",
      );
    });

    it("should drop unsafe CSS values", () => {
      expect(
        renderStyle({
          backgroundImage: "url(javascript:alert(1))",
          color: "red",
        }),
      ).toBe("color:red");
    });
  });

  describe("renderChild", () => {
    it("should handle a mixed sync + async array", async () => {
      const mixed = [
        new RawString("<b>safe</b>"),
        Promise.resolve("raw & text"),
        Promise.resolve(new RawString("<i>also safe</i>")),
        "plain",
      ];
      const result = await renderChild(mixed);
      expect(result).toBe("<b>safe</b>raw &amp; text<i>also safe</i>plain");
    });

    it("should handle a direct Promise child", async () => {
      const result = await renderChild(Promise.resolve("async text"));
      expect(result).toBe("async text");
    });

    it("should handle a direct RawString child", () => {
      const result = renderChild(raw("<b>raw</b>"));
      expect(result).toBe("<b>raw</b>");
    });

    it("should escape a plain string child", () => {
      expect(renderChild("hello")).toBe("hello");
      expect(renderChild("<b>")).toBe("&lt;b&gt;");
    });

    it("should handle a number child", () => {
      expect(renderChild(42)).toBe("42");
    });

    it("should handle an empty array", () => {
      expect(renderChild([])).toBe("");
    });

    it("should handle a fully synchronous array", () => {
      expect(renderChild(["a", "b", new RawString("<c>")])).toBe("ab<c>");
    });

    it("should handle array with null/undefined/boolean values", () => {
      expect(renderChild(["a", null, undefined, false, true, "b"])).toBe("ab");
    });

    it("should handle deeply nested promises in array", async () => {
      const result = await renderChild([
        Promise.resolve(Promise.resolve("deep")),
      ]);
      expect(result).toBe("deep");
    });
  });

  describe("renderElement — tag name validation", () => {
    it("should render valid HTML tags", () => {
      expect((renderElement("div", {}, []) as RawString).value).toBe(
        "<div></div>",
      );
    });

    it("should render custom elements with hyphens", () => {
      expect((renderElement("my-component", {}, []) as RawString).value).toBe(
        "<my-component></my-component>",
      );
    });

    it("should block tag names with spaces", () => {
      expect(
        (renderElement('div class="injected"', {}, []) as RawString).value,
      ).toBe("");
    });

    it("should block tag names starting with a digit", () => {
      expect((renderElement("1div", {}, []) as RawString).value).toBe("");
    });

    it("should block tag names with angle brackets", () => {
      expect((renderElement("<script>", {}, []) as RawString).value).toBe("");
    });

    it("should supports nested renderElement", () => {
      expect(
        (renderElement("div", {}, [renderElement("span", {}, [])]) as RawString)
          .value,
      ).toBe("<div><span></span></div>");
    });
  });

  describe("regression — REGEX_CSS_URL lastIndex corruption", () => {
    const UNSAFE_DATA = "url('data:text/html,<h1>xss</h1>')";

    it("should block unsafe data on consecutive calls", async () => {
      // First call: exec() finds the match, lastIndex moves past the match.
      // isSafeUrl returns false => early return => lastIndex remains non-zero.
      await resolve(renderStyle({ backgroundImage: UNSAFE_DATA }));

      // Second call: REGEX_CSS_URL.exec() starts from the previous lastIndex.
      // If it exceeds the string length, it returns null immediately, potentially
      // accepting an unsafe value incorrectly if not handled.
      const result = await resolve(
        renderStyle({ backgroundImage: UNSAFE_DATA }),
      );

      expect(result).toBe("");
    });
  });
});
````

## File: packages/jsx-string/skills/jsx-string/SKILL.md
````markdown
---
name: jsx-string
description: Use this skill when the user wants to render JSX to HTML strings, create static sites (SSG), build email templates, implement lightweight SSR, generate PDF content, or needs secure HTML rendering. Trigger on JSX-to-string tasks, email template generation, server-side rendering without React, or static site generation.
license: MIT
compatibility: Node.js, Bun, Deno, Vite, esbuild, TypeScript
---

# @cjean-fr/jsx-string

Async-first JSX-to-HTML renderer with built-in XSS protection and concurrent-safe context. Zero runtime dependencies.

## Install

```bash
npm install @cjean-fr/jsx-string
```

`@types/react` is optional — install it for enhanced HTML attribute autocomplete.

## Quick Setup

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@cjean-fr/jsx-string"
  }
}
```

Vite / esbuild:

```ts
esbuild: {
  jsx: "automatic",
  jsxImportSource: "@cjean-fr/jsx-string",
}
```

## Decision Tree

```
Need to render JSX to HTML?
│
├─ Static content / Email / SSG? → renderToString()
│
├─ Components that fetch data? → async components (native support)
│
├─ Shared data across the tree? → context() + withScope() + setContext() / useContext()
│
└─ Streaming / DOM patches / islands? → @cjean-fr/jsx-flow
      ├─ <Island> — deferred render with placeholder (streaming or static)
      ├─ <Patch>  — push to an existing DOM target, no placeholder
      └─ enqueue  — imperative API for plugins (via useContext(Fragments))
```

## Core API

```typescript
import { renderToString, raw } from "@cjean-fr/jsx-string";

// renderToString ALWAYS returns Promise<string> — even for sync components
const html = await renderToString(<div>Hello</div>);

// Trusted HTML — bypasses escaping
const html = await renderToString(<div>{raw("<b>Bold</b>")}</div>);

// Or via dangerouslySetInnerHTML
const html = await renderToString(
  <div dangerouslySetInnerHTML={{ __html: "<b>Bold</b>" }} />,
);
```

> **`withScope` is optional.** Only wrap renders in `withScope()` when you need `context()` / `setContext()` / `useContext()`. For pure rendering, call `renderToString()` directly. Concurrent renders (`Promise.all`) work fine without it.

## Async Patterns

Every component can be `async`. Promise children are supported natively. The renderer resolves all async work concurrently.

```tsx
// ✅ Async component — await inside, return JSX
const UserCard = async ({ id }: { id: string }) => {
  const user = await fetchUser(id);
  return <div>{user.name}</div>;
};

// ✅ Parallel fetches for independent data
const Dashboard = async ({ userId }: { userId: string }) => {
  const [user, posts] = await Promise.all([fetchUser(userId), fetchPosts(userId)]);
  return <div>{user.name} — {posts.length} posts</div>;
};

// ✅ Promise as child — resolved automatically
const html = await renderToString(
  <div>{Promise.resolve("async text")}</div>,
);
// => <div>async text</div>

// ❌ Rendering a Promise without await on renderToString — will hang
const html = renderToString(<AsyncComponent />); // missing await
```

## Context API

Typed, isolated scope for sharing data across the render tree without prop drilling. Backed by `AsyncLocalStorage` — concurrent requests never bleed into each other.

```ts
// Define a typed token — once, in its own module. The string key is a
// globally-unique namespace ("<scope>:<purpose>"); same key → same Symbol
// across module duplicates (Vite SSR, workers, microfrontends).
export const AuthContext = context<{ user: string; locale: string }>(
  "my-app:auth",
);
```

```tsx
// Read it anywhere in the tree
const Header = () => {
  const { user, locale } = useContext(AuthContext);
  return <header lang={locale}>Hello {user}</header>;
};

// Wrap your render in an isolated scope
const html = await withScope(async () => {
  setContext(AuthContext, { user: "Alice", locale: "fr" });
  return renderToString(<Header />);
});
```

`useContext` throws immediately if called outside a `withScope` or if the value was never set — no silent `undefined`.

### Sub-scopes with snapshot

```ts
await withScope(async () => {
  setContext(AuthContext, { user: "Alice", locale: "fr" });

  // Child scope inherits parent data via snapshot()
  await withScope(
    async () => {
      useContext(AuthContext).user; // ✅ "Alice"
      setContext(AuthContext, { user: "Child", locale: "en" }); // local only
    },
    { seed: snapshot() },
  );

  useContext(AuthContext).user; // ✅ still "Alice"
});
```

### Multiple context tokens

Each feature declares its own typed token — no shared global object to pollute.

```ts
export const AuthContext = context<{ userId: string }>("my-app:auth");
export const ThemeContext = context<{ dark: boolean }>("my-app:theme");

await withScope(async () => {
  setContext(AuthContext, { userId: "42" });
  setContext(ThemeContext, { dark: true });
  return renderToString(<App />);
});
```

## Migration from React

| React pattern                  | jsx-string equivalent                              |
| ------------------------------ | -------------------------------------------------- |
| `useState`, `useEffect`        | Fetch data before render, pass as props            |
| `createContext` / `<Provider>` | `context<T>(key)` + `withScope()` + `setContext()` |
| Event handler functions        | String values only (`onClick="alert(1)"`)          |
| `ref`                          | Not supported                                      |
| `className`                    | Both `class` and `className` accepted              |

```tsx
// React: hooks + useEffect
const Page = () => {
  const [data, setData] = useState(null);
  useEffect(() => { setData(fetchData()); }, []);
  return data ? <Content data={data} /> : <Loading />;
};

// jsx-string: async component
const Page = async () => {
  const data = await fetchData();
  return <Content data={data} />;
};
```

## SSG Pattern

```typescript
import { renderToString } from "@cjean-fr/jsx-string";
import { mkdir, writeFile } from "fs/promises";

const routes = [
  { path: "/", component: <HomePage /> },
  { path: "/about", component: <AboutPage /> },
];

await Promise.all(
  routes.map(async ({ path, component }) => {
    const html = await renderToString(component);
    const file = path === "/" ? "dist/index.html" : `dist${path}/index.html`;
    await mkdir(file.replace(/\/[^/]+$/, ""), { recursive: true });
    await writeFile(file, `<!DOCTYPE html>${html}`);
  }),
);
```

## Security (Built-in)

No opt-in required — all output is OWASP-aligned by default.

```tsx
// Text content escaped
<div>{"<script>alert(1)</script>"}</div>
// => <div>&lt;script&gt;alert(1)&lt;/script&gt;</div>

// javascript: blocked in URL attributes
<a href="javascript:alert(1)">link</a>
// => <a href="#blocked">link</a>

// String event handlers supported, function event handlers blocked with warning
<button onClick="alert(1)">btn</button>  // ✅ onclick="alert(1)"
<button onClick={fn}>btn</button>         // ⚠️ warning, attribute dropped
```

## ESLint Plugin

```bash
npm install -D @cjean-fr/eslint-plugin-jsx-string
```

```js
// eslint.config.js
import jsxString from "@cjean-fr/eslint-plugin-jsx-string";

export default [jsxString.configs.recommended];
```

Rules included: `no-react-hooks`, `no-react-imports`, `no-context` (React context), `no-refs`, `no-javascript-urls`, `no-unsafe-event-handlers`.

## Testing

```typescript
// @jsxImportSource @cjean-fr/jsx-string
import { describe, it, expect } from "bun:test";
import {
  renderToString,
  withScope,
  context,
  setContext,
  useContext,
} from "@cjean-fr/jsx-string";

describe("Component", () => {
  it("renders correctly", async () => {
    const html = await renderToString(<div>Hello</div>);
    expect(html).toBe("<div>Hello</div>");
  });

  it("escapes HTML", async () => {
    const html = await renderToString(<div>{"<script>"}</div>);
    expect(html).toBe("<div>&lt;script&gt;</div>");
  });

  it("renders with context", async () => {
    const Ctx = context<{ user: string }>("test:user");
    const Greeting = () => <span>{useContext(Ctx).user}</span>;

    const html = await withScope(async () => {
      setContext(Ctx, { user: "Alice" });
      return renderToString(<Greeting />);
    });
    expect(html).toBe("<span>Alice</span>");
  });
});
```

## Troubleshooting

| Problem                       | Solution                                                                  |
| ----------------------------- | ------------------------------------------------------------------------- |
| TypeScript errors on JSX      | Check `tsconfig.json` has `"jsxImportSource": "@cjean-fr/jsx-string"`     |
| `[object Promise]` in output  | Missing `await` on `renderToString()`                                     |
| `useContext` throws           | Call it inside a `withScope()` after `setContext()`                       |
| Style not applied             | Use camelCase: `borderTopColor`, not `border-top-color`                   |
| `class` not working           | Both `class` and `className` are accepted                                 |
| JSX in test file not resolved | Add `// @jsxImportSource @cjean-fr/jsx-string` at top of `.tsx` test file |
````

## File: packages/jsonresume-theme-cjean/src/components/Layout.tsx
````typescript
import { t } from "../lib/i18n.js";
import { generateTriangulation } from "../lib/trianglify.js";
import type { Resume } from "../schema.js";
import Banner from "./Banner.js";
import Education from "./Education.js";
import FloatingButton from "./FloatingButton.js";
import Footer from "./Footer.js";
import Header from "./Header.js";
import Links from "./Links.js";
import { ProfilePageJsonLd } from "./ProfilePageJsonLd.js";
import SEO from "./SEO.js";
import Skills from "./Skills.js";
import WorkExperience from "./WorkExperience.js";
import { raw, type HTMLAttributes } from "@cjean-fr/jsx-string";

interface LayoutProps extends HTMLAttributes {
  resume: Resume;
  css: string;
}

export default async ({ resume, css, ...props }: LayoutProps) => {
  const { basics, work: works, education, certificates, skills, meta } = resume;
  const { ui, modest } = meta.themeConfig;

  const bgTiles = generateTriangulation({
    seed: ui.backgroundTilesSeed,
    cellSize: 60,
    variance: 0.8,
  });

  return (
    <>
      {raw("<!doctype html>\n")}
      <html lang={meta.lang}>
        <head>
          <meta charSet="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta name="theme-color" content={ui.primary} />
          {!modest && (
            <meta name="generator" content="JSON Resume Theme CJEAN" />
          )}

          <SEO resume={resume} />

          {basics.image && (
            <link
              rel="preload"
              as="image"
              href={basics.image}
              fetchPriority="high"
            />
          )}

          <style
            dangerouslySetInnerHTML={{
              __html: `
                :root {
                  --theme-primary: ${ui.primary};
                  --theme-header-from: ${ui.headerFrom};
                  --theme-header-to: ${ui.headerTo};
                  --theme-footer-from: ${ui.footerFrom};
                  --theme-footer-to: ${ui.footerTo};
                }
                ${css}
              `,
            }}
          />
        </head>
        <body
          className="bg-gray-200 text-gray-800 dark:bg-slate-950 dark:text-slate-300 print:bg-transparent print:text-sm"
          {...props}
        >
          <Header bgTiles={bgTiles} />
          <main className="relative z-10 container mx-auto max-w-5xl rounded bg-white p-4 shadow-md backdrop-blur-3xl md:p-6 dark:bg-slate-900/95 dark:text-slate-200 dark:shadow-2xl dark:ring-1 dark:ring-white/10 print:rounded-none print:shadow-none [&_a]:underline">
            <article>
              <Banner name={basics.name} label={basics.label} />

              <Links basics={basics} list={meta.themeConfig.ui.links} />

              {(basics.image || basics.summary) && (
                <div className="flex break-inside-avoid flex-wrap justify-center gap-4 sm:flex-nowrap">
                  {basics.image && (
                    <div className="relative inline-block">
                      <img
                        src={basics.image}
                        alt={t("portrait_alt", { name: basics.name })}
                        width="200"
                        height="200"
                        fetchPriority="high"
                        className="relative aspect-square min-w-30 rounded-full object-cover"
                      />
                    </div>
                  )}
                  {basics.summary && (
                    <p className="content-center text-lg print:text-base">
                      {basics.summary}
                    </p>
                  )}
                </div>
              )}

              <WorkExperience works={works} showLogos={ui.showLogos} />
              <Education education={education} certificates={certificates} />
              <Skills skills={skills} />
            </article>
          </main>
          <Footer meta={meta} bgTiles={bgTiles} />
          {ui.cta && (
            <FloatingButton
              text={ui.cta.text}
              url={ui.cta.url}
              icon={ui.cta.icon}
            />
          )}
          <ProfilePageJsonLd resume={resume} />
          <script
            dangerouslySetInnerHTML={{
              __html: `if (window.matchMedia('(prefers-color-scheme: dark)').matches) document.documentElement.classList.add('dark');`,
            }}
          />
        </body>
      </html>
    </>
  );
};
````

## File: packages/jsonresume-theme-cjean/CHANGELOG.md
````markdown
# jsonresume-theme-cjean

## 1.3.1

### New features

- **Gravatar**: Added support for gravatar images if no picture are provided.

## 1.3.0

### New features

- **CLI**: Added a built-in CLI to export your resume directly via `npx jsonresume-theme-cjean`.
- **Dependencies**: Removed dependency on `resume-cli` for exports.

## 1.2.1

### Minor UI fixes

- **Work Experience**: Fix layout of work experience items.

## 1.2.0

### Improvements

- refresh UI
- Update dependencies

## 1.1.6

### Improvements

- **Logo**: Better error handling for missing logo.
- **Types**: Do not export `Resume` type for improved declaration bundling.
- **FAB**: Use `scrollY` instead of deprecated `pageYOffset`.
- **resume.json**: Cover more resume.json cases.

## 1.1.5

### Bug fixes

- **Imports**: Fix package names in imports.

## 1.1.4

### Improvements

- **Section**: Add `break-after-avoid` to section title to prevent page breaks after section titles.

## 1.1.3

### Improvements

- **Types**: Export `Resume` type for improved declaration bundling.

## 1.1.1

### Performance improvements

- **Header Background**: Improve web performance by using `<img>` elements instead of CSS background images.
- **CSS**: Remove unused CSS.

## 1.1.0

### New features

- **Header Background**: Reduce background SVG size by 3x.
- **Favicon**: Added support for a favicon via the `favicon` field in the `meta.themeConfig` object.

## 1.0.0

### Initial release

- **Responsive Design**: Looks great on mobile and desktop.
- **Print Optimized**: Automatically adjusted for high-quality PDF exports.
- **SEO Ready**: Full support for Meta tags, OpenGraph, Twitter Cards, and JSON-LD.
- **Customizable Aesthetics**: Easy branding via granular `ui` configuration and geometric patterns.
- **Multi-locale Support**: Comes with `fr` and `en`. Locales are managed in a single file (`i18n.ts`) — feel free to contribute yours!
- **Modern Tech Stack**: Built with Bun, TypeScript, and functional components.
````

## File: packages/jsx-string/CHANGELOG.md
````markdown
# Changelog

## 2.0.0

### Fixed

- **`RawString` class is now a `globalThis` singleton.** Backed by
  `Symbol.for("@cjean-fr/jsx-string.RawString")`. Previously, when jsx-string
  was loaded multiple times in the same process (typical setup: Vite dev
  server SSR-loads user pages with its own jsx-string instance, while a
  Node-loaded plugin holds another), the two instances had distinct
  `RawString` classes. `child instanceof RawString` then failed across
  instances, sending trusted HTML through the untrusted-text escape path —
  the rendered page came out with literal `&lt;html&gt;…` in the body. The
  class is now resolved once per process, mirroring the existing fixes for
  `AsyncLocalStorage` and context tokens.

### Changed

- **BREAKING — `jsx`, `jsxs`, `jsxDEV` no longer accept variadic positional
  children.** The automatic runtime spec is `(type, props, key?)`; the third
  argument is the JSX `key` (diagnostic), never a child. The old variadic
  overload silently rendered the `key` string as child content whenever an
  element had no `props.children` — e.g. `jsx("div", { id: "p" }, "k")` used
  to produce `<div id="p">k</div>`. It now produces `<div id="p"></div>`.
  Children must live on `props.children`.

  ```ts
  // Before (v1.x classic-style)
  jsx("div", { id: "p" }, jsx("span", {}, "1"), jsx("span", {}, "2"));

  // After (v2.0)
  jsx("div", {
    id: "p",
    children: [jsx("span", { children: "1" }), jsx("span", { children: "2" })],
  });
  ```

  Code emitted by the standard TypeScript/Babel automatic JSX transform is
  unaffected — it already passes children via `props.children`. Only hand-written
  `jsx(...)` calls using the legacy classic-style variadic form need to migrate.

- **BREAKING — `context(key)` now requires a non-empty string key.** Old
  `context<T>()` no-arg form is removed. The key must be a globally-unique
  namespaced string (e.g. `"@my-org/my-pkg:purpose"`), used as
  `Symbol.for(...)` lookup. This makes context tokens stable across module
  duplications — Vite plugin loaded by Node + user pages loaded by Vite SSR
  no longer end up with mismatched `Symbol`s; same for web workers,
  microfrontends, edge re-init, federated bundles. The previous no-arg form
  silently broke in those scenarios.
- **`AsyncLocalStorage` is now a `globalThis` singleton.** Backed by
  `Symbol.for("@cjean-fr/jsx-string.storage")`. Multiple loaded instances of
  jsx-string share one storage. No API change beyond the context key
  requirement above.

### Migration

```ts
// Before (v1.x)
const Auth = context<{ userId: string }>();

// After (v2.0)
const Auth = context<{ userId: string }>("my-app:auth");
```

The key is up to you — convention is `"<scope>:<purpose>"` to avoid
collisions. Two callers with the same key share the same Symbol (by design,
for cross-instance sharing).

## 1.5.0

### Added

- **Deno `jsx: "precompile"` support**: New `jsxTemplate`, `jsxAttr`, `jsxEscape` exports on `/jsx-runtime`. Deno's compiler bakes static HTML into template strings at compile time and only calls these runtime helpers for dynamic slots — typically 7-20x faster than the standard transform. All security checks (URL scheme blocking, attribute escaping, name validation) and async semantics (Promise children, async components, concurrent resolution) carry over. Configure with `"jsx": "precompile"` + `"jsxImportSource": "@cjean-fr/jsx-string"` in `deno.json`.

### Changed

- **BREAKING — `class` / `className` no longer merged**: When both props are present on the same element, they now render as separate `class="..."` attributes instead of being merged into one (e.g. `<div class={a} className={b}>` → `<div class="a_value" class="b_value">`). This matches the precompile transform's per-attribute contract; the same behavior now applies in standard mode for parity. To migrate, use a single `class` (or `className`) prop with a pre-joined string.
- **`RawString` — removed `__isRawString` duck-typing**: The `__isRawString` public property and its fallback check in `isRawString()` have been removed. Trusted HTML detection now relies solely on `instanceof RawString`. This removes a spoofable escape hatch from the security boundary.
- **`context<T>()` — token backed by `Symbol`**: Context tokens are now created with `Symbol()` instead of `Object.create(null)`. Both use reference identity as Map keys with identical performance; `Symbol` is semantically correct for an opaque, unique, non-forgeable identifier.
- **`resolveNestedPromises` — single-pass**: Merged the former `hasNestedPromise` detection pass into `resolveNestedPromises`. The function now returns the original value synchronously when no promises are found, and a resolved `Promise<unknown>` otherwise. Removes one full tree traversal on the async path.
- **`data-*` / `aria-*` camelCase conversion removed**: Attribute names starting with `data-` or `aria-` are now passed through verbatim like all other unknown attributes. The conversion was unused in practice (JSX authors write `data-foo-bar` directly) and inconsistent with how React handles these attributes.

### Fixed

- **CSS camelCase conversion**: `REGEX_CAMEL_TO_KEBAB` was missing the `g` flag, causing multi-capital CSS property names (e.g. `borderTopColor`, `borderTopLeftRadius`) to be silently corrupted. Single-capital properties (e.g. `marginTop`, `zIndex`) were unaffected.
- **Tag name injection**: `renderElement` now validates tag names via a dedicated `isValidTagName` check. Invalid names (containing spaces, angle brackets, or starting with a digit) are skipped with a warning instead of being written verbatim into the HTML output.
- **`isRawString` parameter type**: Changed from `any` to `unknown` for stricter type safety.

## 1.4.1

### Fixed

- **Context Initialization**: Add fallback for AsyncContext in case it is not available.

## 1.4.0

### Added

- **Async Context API**: Added `withContext` and `useContext` for type-safe async context.

## 1.3.0

### Added

- **RawString Helper**: Introduced `raw(str)` to safely wrap strings that should be rendered without HTML escaping, preserving user-provided content like translated names or formatted text.

### Changed

- **`SafeString` to `RawString`**: Updated `SafeString` to `RawString` across the codebase to more accurately reflect its purpose: preserving content exactly as-is (raw) rather than guaranteeing safety (safe).

### Fixed

- **Type Compatibility**: Resolved TypeScript type issues preventing the seamless use of `JSXChild` with translators and JSX components by aligning type definitions with actual rendering behavior.

## 1.2.6

### Added

- **Asynchronous Rendering API**: Introduced `renderToStringAsync` to correctly resolve `Promise`-based asynchronous components, establishing a strict boundary where `renderToString` remains purely synchronous.
- **Selective Attribute Normalization**: Upgraded the HTML attribute mapping logic. React-specific mappings (like `className` to `class` and `htmlFor` to `for`) are evaluated correctly, while native HTML, `data-`, `aria-`, and SVG attributes (e.g., `viewBox`) are preserved faithfully with exact expected casings.

### Fixed

- **Persistent RegExp Status**: Fixed a state-retention bug involving the `lastIndex` property on `hasUnescapedChars` regex tests which caused inconsistent string escaping behaviors.
- **Attribute Security**: Refined event-handler filtering. Event handlers (`onclick`, etc.) are stripped natively, triggering a clearer developer warning unless wrapped specifically in a validated `SafeString`.
- **`JSXChild` Type Definitions**: Broadened type validation for `JSXChild` compatibility with standard React elements without compromising the strict, static-rendering guarantees.
- **Peer Dependencies Alignment**: Explicitly moved `@types/react` to an optional peer dependency to prevent intrusive TypeScript overlap for strictly zero-dependency consumers.

## 1.2.2

### Patch Changes

- Update packages.json data and README.md
- add SKILL for AI agents

## 1.2.0

### Added

- Preserve/translate React/SVG attribute names (e.g., `htmlFor`, `xlinkHref`, `viewBox`).
- `dangerouslySetInnerHTML.__html` now treats `null`/`undefined` as empty string.
- Inline event handlers are now always dropped during rendering.
- Unsafe CSS values are now always filtered, and Promises inside style objects are now awaited.

## 1.1.1

### Fixed

- Added missing `jsxs` and `jsxDEV` exports to the compiled bundle, enabling the automatic JSX runtime.

## 1.1.0

### Added

- Support for Classic JSX Runtime: the `jsx` factory now accepts children as additional arguments (e.g., `jsx(tag, props, ...children)`), following the historical React signature.
- Documentation in README for both Automatic and Classic JSX runtimes configuration in `tsconfig.json`.

### Changed

- Improved `jsx` factory to merge residual arguments into `props.children` when they are present.

## 1.0.0

- Initial release of `@cjean-fr/jsx-string`.
````

## File: packages/jsx-string/src/utils/html.ts
````typescript
import type { CSSProperties, JSXNode, HTMLAttributes } from "../core/types.js";
import { RawString } from "../core/types.js";
import {
  escapeContent,
  escapeAttr,
  isSafeUrl,
  isSafeSrcset,
  isValidAttrName,
  isValidTagName,
  sanitize,
  URL_ATTRIBUTES,
} from "./escape.js";
import { VOID_ELEMENTS } from "./void-elements.js";

export { RawString, raw, type RenderResult } from "../core/types.js";

const REGEX_CAMEL_TO_KEBAB = /[A-Z]/g;
const REGEX_EVENT_HANDLER = /^on[a-z]/i;
const REGEX_CSS_UNSAFE = /expression\s*\(|javascript\s*:/i;
const REGEX_HAS_UPPER = /[A-Z]/;
const INTERNAL_PROPS = new Set<string>([
  "children",
  "dangerouslySetInnerHTML",
  "key",
  "ref",
]);
const ATTRIBUTE_NAME_MAP = new Map<string, string>([
  ["htmlFor", "for"],
  ["className", "class"],
  ["acceptCharset", "accept-charset"],
  ["httpEquiv", "http-equiv"],
  ["xlinkHref", "xlink:href"],
  ["xmlnsXlink", "xmlns:xlink"],
  ["xmlLang", "xml:lang"],
  ["xmlBase", "xml:base"],
  ["xmlSpace", "xml:space"],
  ["tabIndex", "tabindex"],
  ["readOnly", "readonly"],
  ["maxLength", "maxlength"],
  ["minLength", "minlength"],
  ["autoFocus", "autofocus"],
  ["autoPlay", "autoplay"],
  ["autoComplete", "autocomplete"],
  ["encType", "enctype"],
  ["noValidate", "novalidate"],
  ["dateTime", "datetime"],
  ["srcSet", "srcset"],
]);

const isSafeCssValue = (value: string): boolean => {
  const sanitized = sanitize(value);
  if (REGEX_CSS_UNSAFE.test(sanitized)) return false;

  for (const match of sanitized.matchAll(/url\(\s*(['"]?)(.*?)\1\s*\)/gi)) {
    if (!isSafeUrl(match[2]?.trim() ?? "")) return false;
  }

  return true;
};

/**
 * Convert a props object into an HTML attribute string.
 *
 * @param props - Attributes object to render; if `null` or `undefined` an empty string is produced
 * @returns The HTML attribute string
 */
export function renderAttributes(
  props: HTMLAttributes | null | undefined,
): string | Promise<string> {
  if (!props) return "";

  let out = "";
  let pending: Promise<string>[] | null = null;

  for (const key in props) {
    const r = renderAttribute(key, (props as any)[key]);
    if (typeof r === "string") {
      if (r) out += ` ${r}`;
    } else {
      (pending ??= []).push(r.then((s) => (s ? ` ${s}` : "")));
    }
  }

  return pending
    ? Promise.all(pending).then((parts) => out + parts.join(""))
    : out;
}

/**
 * Render a single HTML attribute into its serialized form (no leading space).
 *
 * Returns `""` if the attribute should be skipped (invalid name, null/false value,
 * unsafe event-handler function, empty/unsafe style). Returns `name` alone for
 * boolean `true`, otherwise `name="escaped value"`. URL attributes with
 * `javascript:` / `vbscript:` schemes are replaced with `#blocked`.
 *
 * Caller is responsible for adding any whitespace separator between attributes.
 * `className` is rewritten to `class`; multiple `class`/`className` props in the
 * same element render as separate attributes (no merge) — this matches Deno's
 * precompile transform where each attribute is rendered in isolation.
 */
function renderAttributeSync(name: string, value: unknown): string {
  if (INTERNAL_PROPS.has(name) || value === false || value == null) return "";

  // `isValidAttrName` rejects whitespace, quotes, brackets, `=`, `/`, AND
  // Unicode "Other" chars (controls, ZWSP, LRM, etc.) in one regex test —
  // the latter would otherwise leak verbatim into the output. Clean ASCII
  // names pass on the first try; only names that fail get re-sanitized so
  // hidden chars (`data​-id`) can still produce a usable `data-id`.
  let attrName = name;
  if (!isValidAttrName(attrName)) {
    attrName = sanitize(attrName);
    if (!isValidAttrName(attrName)) return "";
  }

  // Only camelCase attribute names ever need remapping (the map keys all have
  // an uppercase letter). Skip the Map lookup for the common lowercase case.
  const hasUpper = REGEX_HAS_UPPER.test(attrName);
  if (hasUpper) {
    attrName = ATTRIBUTE_NAME_MAP.get(attrName) ?? attrName;
  }
  // Event-handler check: REGEX_EVENT_HANDLER is case-insensitive and must run
  // regardless of casing — `onclick={fn}` is just as dangerous as
  // `onClick={fn}`. Cheap pre-filter: only names starting with 'o'/'O' can
  // possibly match, avoiding the regex test on every non-event attribute.
  const c0 = attrName.charCodeAt(0);
  if ((c0 === 79 || c0 === 111) && REGEX_EVENT_HANDLER.test(attrName)) {
    if (typeof value === "function") {
      console.warn(
        `[jsx-string] Event handler "${attrName}" was passed a function. ` +
          `This is not supported in static HTML rendering. Use a string instead.`,
      );
      return "";
    }
    if (typeof value !== "string") return "";
    if (hasUpper) attrName = attrName.toLowerCase();
  }

  if (attrName === "style") {
    let style: string;
    if (value !== null && typeof value === "object") {
      style = renderStyle(value as CSSProperties);
    } else {
      style = String(value);
      if (!isSafeCssValue(style)) return "";
    }
    if (!style) return "";
    return `style="${escapeAttr(style)}"`;
  }

  if (value === true) return attrName;

  let str = typeof value === "string" ? value : String(value);
  // URL_ATTRIBUTES is keyed lowercase. After remapping, mapped names are
  // already lowercase, so only re-lowercase when the original had uppercase
  // and survived without remapping (e.g. "HREF" written verbatim).
  const urlKey =
    hasUpper && REGEX_HAS_UPPER.test(attrName)
      ? attrName.toLowerCase()
      : attrName;
  if (urlKey === "srcset") {
    if (!isSafeSrcset(str)) str = "#blocked";
  } else if (URL_ATTRIBUTES.has(urlKey) && !isSafeUrl(str)) str = "#blocked";
  return `${attrName}="${escapeAttr(str)}"`;
}

export function renderAttribute(
  name: string,
  value: unknown,
): string | Promise<string> {
  if (value instanceof Promise) {
    return value.then((v) => renderAttribute(name, v));
  }
  return renderAttributeSync(name, value);
}

/**
 * Serialize a CSS properties object into an inline CSS declaration string.
 *
 * Converts camelCase property names to kebab-case, preserves CSS custom properties
 * (keys starting with `--`) as-is, and omits entries whose values are `null` or `undefined`.
 *
 * @param style - An object mapping CSS property names to values
 * @returns A semicolon-delimited CSS declaration string (e.g., `color:red;margin-top:1px`)
 */
export function renderStyle(style: CSSProperties): string {
  let out = "";
  for (const key in style) {
    const value = style[key];
    if (value == null) continue;
    const prop = key.startsWith("--")
      ? key
      : key.replace(REGEX_CAMEL_TO_KEBAB, "-$&").toLowerCase();
    const str = String(value);
    if (!isSafeCssValue(str)) continue;
    if (out.length > 0) out += ";";
    out += `${prop}:${str}`;
  }
  return out;
}

function renderArrayAsync(
  arr: JSXNode[],
  startIndex: number,
  prefix: string,
  pending: Promise<string>,
): Promise<string> {
  const remaining = arr.length - startIndex;
  const tail: (string | Promise<string>)[] = new Array(remaining);
  tail[0] = pending;
  for (let i = 1; i < remaining; i++) {
    tail[i] = renderChild(arr[startIndex + i]);
  }
  return Promise.all(tail).then((parts) => {
    let out = prefix;
    for (let i = 0; i < parts.length; i++) out += parts[i];
    return out;
  });
}

/**
 * Convert a JSX child (primitive, RawString, array, or Promise) into rendered
 * HTML text. The returned string is always already HTML-safe (escaped where
 * needed, raw where trusted), so callers concatenate it directly without
 * further escaping. Async children produce a `Promise<string>`.
 */
export function renderChild(child: JSXNode): string | Promise<string> {
  if (child == null || child === true || child === false) return "";
  if (typeof child === "string") return escapeContent(child);
  if (typeof child === "number") return String(child);
  if (child instanceof RawString) return child.value;
  if (Array.isArray(child)) {
    let out = "";
    for (let i = 0; i < child.length; i++) {
      const c = child[i];
      if (c instanceof RawString) {
        out += c.value;
        continue;
      }
      if (typeof c === "string") {
        out += escapeContent(c);
        continue;
      }
      if (typeof c === "number") {
        out += c;
        continue;
      }
      if (c == null || c === true || c === false) continue;
      const r = renderChild(c);
      if (typeof r === "string") out += r;
      else return renderArrayAsync(child, i, out, r);
    }
    return out;
  }
  if (child instanceof Promise) return child.then(renderChild);
  return escapeContent(String(child));
}

/**
 * Render a JSX element into an HTML-safe `RawString`.
 *
 * Returning a `RawString` (rather than a plain `string`) lets the result be
 * dropped back into another element's children without being re-escaped — the
 * single boundary that distinguishes "trusted, already-rendered HTML" from
 * "untrusted user text" in the rest of the pipeline.
 *
 * When `props.dangerouslySetInnerHTML` is provided, its `__html` is used as
 * the element content; otherwise the provided children are rendered.
 * Attributes and children may be asynchronous; in that case the function
 * returns a `Promise<RawString>`.
 */
// Cache of tag names already proven safe. Tag names come from a tiny vocabulary
// (HTML/SVG elements + a few user custom-elements) and are reused thousands of
// times per render, so a cache avoids re-running the validation regex.
const VALID_TAGS = new Set<string>();

export function renderElement(
  tag: string,
  props: HTMLAttributes,
  children: JSXNode,
): RawString | Promise<RawString> {
  if (!VALID_TAGS.has(tag)) {
    if (!isValidTagName(tag)) {
      console.warn(
        `[jsx-string] Invalid tag name "${tag}" was skipped. Tag names must start with a letter and contain only letters, digits, or hyphens.`,
      );
      return EMPTY_RAW;
    }
    VALID_TAGS.add(tag);
  }
  const attrs = renderAttributes(props);
  const content = props.dangerouslySetInnerHTML
    ? props.dangerouslySetInnerHTML.__html == null
      ? ""
      : String(props.dangerouslySetInnerHTML.__html)
    : renderChild(children);

  if (typeof attrs === "string" && typeof content === "string") {
    return new RawString(buildElement(tag, attrs, content));
  }
  return Promise.all([attrs, content]).then(
    ([a, c]) => new RawString(buildElement(tag, a, c)),
  );
}

const EMPTY_RAW = new RawString("");

function buildElement(tag: string, attrs: string, content: string): string {
  if (VOID_ELEMENTS.has(tag)) return `<${tag}${attrs}>`;
  return `<${tag}${attrs}>${content}</${tag}>`;
}
````

## File: packages/jsx-string/package.json
````json
{
  "name": "@cjean-fr/jsx-string",
  "version": "2.0.0",
  "description": "The small, safe way to render JSX into HTML strings. Zero dependencies. Fully typed.",
  "author": "Christophe Jean",
  "license": "MIT",
  "homepage": "https://github.com/cjean-fr/atelier/tree/main/packages/jsx-string#readme",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/cjean-fr/atelier.git",
    "directory": "packages/jsx-string"
  },
  "bugs": {
    "url": "https://github.com/cjean-fr/atelier/issues"
  },
  "keywords": [
    "jsx",
    "html",
    "string",
    "tiny",
    "ssg",
    "security",
    "xss-prevention"
  ],
  "sideEffects": false,
  "type": "module",
  "types": "./dist/index.d.ts",
  "engines": {
    "node": ">=24.0.0"
  },
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    },
    "./jsx-runtime": {
      "types": "./dist/jsx-runtime.d.ts",
      "default": "./dist/jsx-runtime.js"
    },
    "./jsx-dev-runtime": {
      "types": "./dist/jsx-dev-runtime.d.ts",
      "default": "./dist/jsx-dev-runtime.js"
    }
  },
  "publishConfig": {
    "access": "public"
  },
  "scripts": {
    "build": "bunup src/index.ts src/jsx-runtime.ts src/jsx-dev-runtime.ts --format esm --minify",
    "check": "tsc --noEmit",
    "format": "prettier --write \"**/*.{ts,tsx,json,md}\"",
    "test": "bun test"
  },
  "devDependencies": {
    "@types/react": "catalog:",
    "@types/bun": "catalog:",
    "bunup": "catalog:",
    "typescript": "catalog:"
  },
  "peerDependencies": {
    "@types/react": "^19"
  },
  "peerDependenciesMeta": {
    "@types/react": {
      "optional": true
    }
  },
  "files": [
    "dist",
    "README.md",
    "LICENSE",
    "skills"
  ],
  "browser": {
    "node:async_hooks": false
  }
}
````

## File: package.json
````json
{
  "name": "@cjean-fr/atelier",
  "module": "index.ts",
  "type": "module",
  "private": true,
  "workspaces": {
    "packages": [
      "apps/*",
      "packages/*"
    ],
    "catalog": {
      "@cjean-fr/i18n-tiny": "workspace:*",
      "@cjean-fr/jsx-string": "workspace:*",
      "@cjean-fr/jsx-flow": "workspace:*",
      "@cjean-fr/jsx-vite": "workspace:*",
      "@cjean-fr/build-core": "workspace:*",
      "@cjean-fr/docs": "workspace:*",
      "@cjean-fr/eslint-plugin-jsx-string": "workspace:*",
      "@iconify-icons/tabler": "^1.2",
      "@tailwindcss/vite": "^4",
      "@types/bun": "^1",
      "@types/node": "^22",
      "@types/react": "^19",
      "bunup": "^0.16",
      "esbuild": "^0.28",
      "eslint": "^10",
      "gray-matter": "^4",
      "postcss": "^8",
      "rehype-stringify": "^10",
      "remark-parse": "^11",
      "remark-rehype": "^11",
      "shiki": "^4",
      "tailwindcss": "^4",
      "typescript": "^6",
      "typescript-eslint": "^8",
      "@typescript-eslint/parser": "^8",
      "@typescript-eslint/eslint-plugin": "^8",
      "@typescript-eslint/utils": "^8",
      "@typescript-eslint/rule-tester": "^8",
      "unified": "^11",
      "vite": "^8",
      "vite-plugin-dts": "^5",
      "zod": "^4"
    }
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.3.0",
    "@trivago/prettier-plugin-sort-imports": "latest",
    "@typescript-eslint/eslint-plugin": "latest",
    "@typescript-eslint/parser": "latest",
    "bun": "latest",
    "eslint": "latest",
    "prettier": "latest",
    "prettier-plugin-tailwindcss": "latest",
    "tailwindcss": "^4.3.0",
    "turbo": "latest",
    "typescript-eslint": "latest"
  },
  "peerDependencies": {
    "typescript": "^6.0.3"
  },
  "scripts": {
    "build": "turbo build",
    "check": "turbo check",
    "format": "turbo format",
    "test": "turbo test",
    "publish": "turbo publish"
  },
  "packageManager": "bun@1.3.10"
}
````

## File: packages/jsonresume-theme-cjean/package.json
````json
{
  "name": "jsonresume-theme-cjean",
  "version": "1.3.2",
  "description": "A clean, professional, and print-optimized JSON Resume theme built with Tailwind CSS and TypeScript.",
  "author": "Christophe Jean",
  "license": "MIT",
  "homepage": "https://github.com/cjean-fr/atelier/tree/main/packages/jsonresume-theme-cjean#readme",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/cjean-fr/atelier.git",
    "directory": "packages/jsonresume-theme-cjean"
  },
  "bugs": {
    "url": "https://github.com/cjean-fr/atelier/issues"
  },
  "engines": {
    "node": ">=24.0.0"
  },
  "keywords": [
    "jsonresume-theme",
    "resume",
    "cv",
    "tailwind",
    "typescript",
    "print-optimized"
  ],
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "bin": {
    "jsonresume-theme-cjean": "./bin/jsonresume-theme-cjean.js"
  },
  "devDependencies": {
    "@cjean-fr/i18n-tiny": "workspace:*",
    "@cjean-fr/jsx-string": "workspace:*",
    "@tailwindcss/vite": "catalog:",
    "@types/react": "catalog:",
    "tailwindcss": "catalog:",
    "typescript": "catalog:",
    "vite": "catalog:",
    "vite-plugin-dts": "catalog:",
    "zod": "catalog:",
    "eslint": "catalog:",
    "typescript-eslint": "catalog:",
    "@typescript-eslint/parser": "catalog:",
    "@typescript-eslint/eslint-plugin": "catalog:",
    "@cjean-fr/eslint-plugin-jsx-string": "workspace:*"
  },
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  },
  "publishConfig": {
    "access": "public"
  },
  "files": [
    "dist",
    "bin",
    "package.json",
    "README.md",
    "LICENSE"
  ],
  "scripts": {
    "build": "vite build",
    "check": "tsc --noEmit",
    "format": "prettier --write \"**/*.{ts,tsx,json,md}\"",
    "lint": "eslint ."
  },
  "type": "module"
}
````

## File: packages/jsx-string/README.md
````markdown
# @cjean-fr/jsx-string

[![CI](https://github.com/cjean-fr/atelier/actions/workflows/ci.yml/badge.svg)](https://github.com/cjean-fr/atelier/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@cjean-fr/jsx-string)](https://www.npmjs.com/package/@cjean-fr/jsx-string)
[![gzip size](https://img.badgesize.io/https://unpkg.com/@cjean-fr/jsx-string/dist/index.js?compression=gzip&label=gzip)](https://unpkg.com/@cjean-fr/jsx-string/dist/index.js)

**JSX → HTML strings. Simple, async-first, designed for server-side needs.**

---

## Why jsx-string?

jsx-string is a **server-first JSX renderer** that embraces backend-specific patterns:

| Aspect                  | jsx-string                                                                 | react-dom/server                          | preact-render-to-string              |
| ----------------------- | -------------------------------------------------------------------------- | ----------------------------------------- | ------------------------------------ |
| **Async by default**    | ✅ Native `await` in render                                                | ⚠️ Via Suspense                           | ❌ Sync only                         |
| **Server-first design** | ✅ Scoped context for per-request isolation                                | ❌ Client-first patterns                  | ❌ Client-first patterns             |
| **Single purpose**      | ✅ Render JSX → HTML strings                                               | ❌ Renderer depends on full React runtime | ✅ Renderer (depends on Preact core) |
| **Zero dependencies**   | ✅ ~3 KB                                                                   | ❌ ~140 KB (with React)                   | ❌ ~8 KB (with Preact)               |
| **XSS defenses**        | ✅ Escape + URL scheme block + attribute whitelist + function-handler drop | ⚠️ Escape only                            | ⚠️ Escape only                       |

No hooks, no refs, no hydration — **just direct JSX→HTML rendering with server-side ergonomics**.

---

## Install

```bash
bun add @cjean-fr/jsx-string   # or: npm install
```

### Configuration

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@cjean-fr/jsx-string"
  }
}
```

For Vite/esbuild: use `jsx: "automatic"` with the same `jsxImportSource`.
`@types/react` is optional — install it for attribute autocomplete.

---

## Quickstart

### Basic rendering

```tsx
import { renderToString } from "@cjean-fr/jsx-string";

const html = await renderToString(
  <main>
    <h1>Hello, world!</h1>
    <p>jsx-string renders JSX to plain HTML strings.</p>
  </main>,
);
// => "<main><h1>Hello, world!</h1><p>jsx-string renders JSX to plain HTML strings.</p></main>"
```

### Async components (the simple way)

```tsx
import { renderToString } from "@cjean-fr/jsx-string";

const Greeting = async ({ id }: { id: string }) => {
  const user = await db.users.find(id); // await works directly in render
  return <h1>Hello {user.name}</h1>;
};

const html = await renderToString(<Greeting id="42" />);
// => "<h1>Hello Alice</h1>"
```

`renderToString` **always returns `Promise<string>`** — even for sync trees.
Concurrent renders work out of the box: `await Promise.all([renderToString(a), renderToString(b)])`.

---

## Core Features

### 🔒 Security by Default

jsx-string **escapes everything by default** — no opt-in required:

```tsx
// Text content: & < > escaped
<div>{'<script>alert(1)</script>'}</div>
// => <div>&lt;script&gt;alert(1)&lt;/script&gt;</div>

// URL attributes: javascript:/vbscript:/data: blocked
<a href="javascript:alert(1)">x</a>
// => <a href="#blocked">x</a>

// Event handlers: only strings accepted (functions dropped + warn)
<button onClick={() => {}}>x</button>
// => <button>x</button> (onClick dropped)

// Invalid tags: dropped with warning
<div>{/* <my-component> without registration */}</div>
// => <div></div> + warning
```

**Your responsibility:**

- `raw(html)` and `dangerouslySetInnerHTML` **bypass escaping** — never use with untrusted input.
- Event handler strings (`onClick="myFunc()"`) are HTML-escaped, but the JS inside is **not sanitized** — never interpolate user data.

```tsx
import { raw } from "@cjean-fr/jsx-string";

// ✅ Safe: trusted source (e.g., markdown renderer)
<div>{raw('<b>trusted HTML</b>')}</div>

// ❌ UNSAFE: user input
<div>{raw(userInput)}</div>  // XSS risk!
```

### 🔄 Context API (Scoped Context)

Per-request context with **typed keys** — `AsyncLocalStorage`-backed, no provider components needed, designed for server-side isolation.

```tsx
import {
  context,
  useContext,
  setContext,
  withScope,
  renderToString,
} from "@cjean-fr/jsx-string";

// Define context keys at module level — keys are global strings (Symbol.for)
// so the same key resolves to the same Symbol even if jsx-string is loaded
// twice (Vite plugin + Vite SSR, web workers, microfrontends, …).
const Auth = context<{ userId: string }>("my-app:auth");

const Page = () => <p>User: {useContext(Auth).userId}</p>;

// Each request gets isolated context — no cross-request leaks
const html = await withScope(async () => {
  setContext(Auth, { userId: "42" });
  return renderToString(<Page />);
});
// => <p>User: 42</p>
```

**Nested scopes with inheritance:**

```tsx
await withScope(async () => {
  setContext(Auth, { userId: "42" });

  // Child scope inherits parent data via snapshot()
  await withScope(async () => {
    const parentData = snapshot(); // captures current context
    // ... use parentData to seed child scope
  });
});
```

`useContext` **throws if called outside a scope** or before `setContext` is called.

### 📦 Trusted HTML

Use `raw()` for HTML from trusted sources (markdown renderers, sanitizers):

```tsx
import { raw } from "@cjean-fr/jsx-string";

const markdownHtml = await renderMarkdown("# Hello");
<div>{raw(markdownHtml)}</div>;
// => <div><h1>Hello</h1></div> (no escaping)
```

`dangerouslySetInnerHTML` also works (React-compatible API):

```tsx
<div dangerouslySetInnerHTML={{ __html: "<b>trusted</b>" }} />
```

---

## Examples

Self-contained runnable scripts under [`examples/`](./examples):

| File                                                    | Demonstrates                                                     |
| ------------------------------------------------------- | ---------------------------------------------------------------- |
| [`hello.tsx`](./examples/hello.tsx)                     | Minimal `renderToString` of static JSX                           |
| [`async-component.tsx`](./examples/async-component.tsx) | Async component with `await` inside render                       |
| [`context.tsx`](./examples/context.tsx)                 | `context()` + `setContext()` + `useContext()` with `withScope()` |
| [`concurrent.tsx`](./examples/concurrent.tsx)           | Parallel renders with isolated context scopes                    |
| [`server.tsx`](./examples/server.tsx)                   | `Bun.serve` HTTP handler with per-request context                |

Run standalone:

```bash
bun examples/hello.tsx
bun examples/server.tsx  # then: curl 'http://localhost:3000/?name=World'
```

---

## API Reference

| Export                     | Type                    | Description                                                                                               |
| -------------------------- | ----------------------- | --------------------------------------------------------------------------------------------------------- |
| `renderToString(node)`     | `Promise<string>`       | Renders JSX tree to HTML string.                                                                          |
| `raw(string)`              | `RawString`             | Marks HTML as trusted (no escape).                                                                        |
| `Fragment`                 | `symbol`                | Standard JSX Fragment (`<>…</>`).                                                                         |
| `context<T>(key)`          | `Context<T>`            | Creates a typed, namespaced context token. `key` is a globally-unique string (e.g. `"@org/pkg:purpose"`). |
| `setContext(token, value)` | `void`                  | Writes to current scope.                                                                                  |
| `useContext(token)`        | `T`                     | Reads from current scope; **throws if absent**.                                                           |
| `withScope(fn, options?)`  | `Promise<T>`            | Runs `fn` in isolated async scope.                                                                        |
| `snapshot()`               | `Map<Context, unknown>` | Captures current scope state for sub-scopes.                                                              |

---

## Security Model (Deep Dive)

### ✅ Defended by Default

All outputs are sanitized **automatically** — no configuration needed.

#### Text Content

- Escapes: `&` ` <` `>`
- Example: `<script>` → `&lt;script&gt;`

#### Attributes

- **Names:** Rejects whitespace, quotes, `>`, `/`, `=`, and Unicode "Other" chars (controls, ZWSP, LRM, surrogates).
  Regex: `/^[^\s"'>/=\p{C}]+$/u`
- **Values:** Escapes `&` ` <` `>` `"`; always double-quoted.
- **URL attributes:** Blocks `javascript:`, `vbscript:`, non-image `data:` schemes.
  Blocked schemes replaced with `#blocked`.
  Obfuscation via `\0`, `\t`, `\n` stripped before check.
  Affected attributes: `href`, `src`, `action`, `formaction`, `cite`, `poster`, `icon`, `data`, `xlink:href`, `srcset`.

#### Tags

- Must match `/^[a-zA-Z][a-zA-Z0-9-]*$/`.
- Invalid tags: dropped with warning, element omitted from output.

#### Style

- Rejects `expression()` and `javascript:` in CSS values.
- `url()` arguments validated as URLs (same rules as URL attributes).

#### Event Handlers

- **Strings only:** `onClick="alert(1)"` → allowed (HTML-escaped).
- **Non-strings dropped:** Functions → warn + drop. Numbers/Objects → silent drop.
- ⚠️ **JS not sanitized** — never interpolate user input in handler strings.

### ⚠️ Your Responsibility

| Scenario                  | Risk | Mitigation                    |
| ------------------------- | ---- | ----------------------------- |
| `raw(userInput)`          | XSS  | Sanitize with DOMPurify first |
| `dangerouslySetInnerHTML` | XSS  | Only use with trusted HTML    |
| `onClick={"userFunc()"}`  | XSS  | Never interpolate user data   |

### 🛡️ Trusted HTML

For trusted sources (markdown, templating engines):

```tsx
import { raw } from "@cjean-fr/jsx-string";

// ✅ Safe: trusted markdown renderer
const html = await markdownToHtml(userMarkdown);
<div>{raw(html)}</div>;

// ✅ Safe: DOMPurify sanitized
const safeHtml = DOMPurify.sanitize(userInput);
<div>{raw(safeHtml)}</div>;
```

---

## Performance

Benchmarks ported from [preact-render-to-string](https://github.com/preactjs/preact-render-to-string/tree/main/benchmarks).
Source: [`packages/jsx-string-bench/src/bench.ts`](../jsx-string-bench/src/bench.ts).

| Runtime       | Scenario           | jsx-string | preact-render-to-string@6 | react-dom@18 |
| ------------- | ------------------ | ---------- | ------------------------- | ------------ |
| Node 26 (V8)  | 1000 text blocks   | **635 µs** | 650 µs                    | 5.1 ms       |
| Node 26 (V8)  | 10×1000 deep stack | **770 µs** | 820 µs                    | 6.7 ms       |
| Bun 1.3 (JSC) | 1000 text blocks   | **460 µs** | 670 µs                    | 6.2 ms       |
| Bun 1.3 (JSC) | 10×1000 deep stack | **697 µs** | 1.15 ms                   | 8.4 ms       |

_Ryzen 7 PRO 8840HS, median of 3 runs._

**Analysis:**

- On Node 26: V8 optimizations make jsx-string **~parity with Preact** on wide trees, **~7% faster** on deep trees.
- On Bun (JSC): **30-40% faster than Preact** across all scenarios.
- Against React: **8-14× faster** regardless of tree shape (structural advantage — no virtual DOM).

> Numbers vary by machine. Re-run locally: `bun run bench` in `packages/jsx-string-bench`.

---

## Runtimes

| Runtime                | Support | Notes                                                                         |
| ---------------------- | ------- | ----------------------------------------------------------------------------- |
| **Node 20+**           | ✅ Full | Native `AsyncLocalStorage`                                                    |
| **Bun**                | ✅ Full | Works with `node:async_hooks` (native compatibility)                          |
| **Deno**               | ✅ Full | Works with `node:async_hooks` (native compatibility)                          |
| **Cloudflare Workers** | ✅ Full | Requires `compatibility_flags = ["nodejs_compat_v2"]` for `AsyncLocalStorage` |

### Deno Setup

```json
// tsconfig.json (Deno with jsx: "precompile")
{
  "compilerOptions": {
    "jsx": "precompile",
    "jsxImportSource": "@cjean-fr/jsx-string"
  }
}
```

`jsxTemplate`, `jsxAttr`, and `jsxEscape` runtime functions are exported for Deno’s precompile mode.
`dangerouslySetInnerHTML` is **dropped in precompile mode** — use `{raw(html)}` as child instead.

---

## Design Philosophy

### ✅ What jsx-string Does

- **Eager rendering:** No virtual DOM, no reconciliation — direct string concatenation.
- **Async-first:** Components can `await` directly in render body.
- **Scoped context:** Typed, nestable context for server-side rendering.
- **Security-first:** Everything escaped by default.

### ⚠️ What jsx-string Doesn’t Do

- **Client-side rendering:** Server-only. No hydration.
- **React compatibility:** No hooks, no refs, no React runtime.
- **React Server Components:** Not RSC-aware (use Next.js App Router’s built-in renderer).

### 💡 Key Differences from React

| Feature                | jsx-string            | React               |
| ---------------------- | --------------------- | ------------------- |
| Async in render        | ✅ Yes                | ❌ No (needs hooks) |
| Context model          | ✅ Scoped per-request | ❌ Provider-based   |
| Virtual DOM            | ❌ No                 | ✅ Yes              |
| Hooks                  | ❌ No                 | ✅ Yes              |
| Refs                   | ❌ No                 | ✅ Yes              |
| `class` vs `className` | Separate (no merge)   | Merged              |

---

## When NOT to Use

| Use Case                                     | Recommendation              |
| -------------------------------------------- | --------------------------- |
| Client-side rendering/hydration              | Use React, Preact, or Solid |
| React ecosystem (MUI, Radix, Tanstack Query) | Requires React runtime      |
| Next.js App Router / RSC                     | Use Next.js built-in RSC    |

### For Streaming/DOM Patching

Use [`@cjean-fr/jsx-flow`](https://github.com/cjean-fr/atelier/tree/main/packages/jsx-flow):

- Adds `<Deferred>`, `<Patch>`, streaming support
- Adapters for Turbo Streams, HTMX, Native DOM updates, ESI

---

## License

MIT © Christophe Jean
````
