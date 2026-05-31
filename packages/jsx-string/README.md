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
