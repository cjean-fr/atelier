---
name: jsx-string
description: Use this skill when the user wants to render JSX to HTML strings, create static sites (SSG), build email templates, generate HTML strings on the server without using React runtime or client-side hydration, generate PDF content, or needs secure HTML rendering with escaped content. Trigger on JSX-to-string tasks, email template generation, server-side rendering without React, or static site generation.
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

If the request is unclear, ask one clarifying question.

| Need                                                  | Use                                              |
| ----------------------------------------------------- | ------------------------------------------------ |
| HTML strings only                                     | `renderToString()`                               |
| Component itself must await data before returning JSX | async components                                 |
| Shared state in the render tree                       | `context()` tokens + the `context` render option |
| DOM streaming, islands, or browser patching           | `@cjean-fr/jsx-flow`                             |

If the user wants browser DOM updates, hydration, hooks, event handlers, or client-side interactivity, do not use this package for that task; explain that `jsx-string` is for HTML-string generation and server-side rendering only.

## Core API

```typescript
import { renderToString, raw } from "@cjean-fr/jsx-string";

// renderToString ALWAYS returns Promise<string> — even for sync components
const html = await renderToString(<div>Hello</div>);

// Trusted HTML — bypasses escaping. Never use raw() or dangerouslySetInnerHTML with untrusted input.
const html = await renderToString(<div>{raw("<b>Bold</b>")}</div>);

// Or via dangerouslySetInnerHTML with pre-sanitized content only
const html = await renderToString(
  <div dangerouslySetInnerHTML={{ __html: "<b>Bold</b>" }} />,
);
```

> **Context is opt-in.** For pure rendering, call `renderToString(<App />)` directly. To share data through the tree, pass a factory plus bindings: `renderToString(() => <App />, { context: [Token.with(value)] })`. Concurrent renders (`Promise.all`) are always isolated.

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
// If renderToString is called without await, explain that it returns a Promise<string>
// and the caller must await it; do not treat the result as a string.
const html = renderToString(<AsyncComponent />); // missing await
```

## Context API

Typed, isolated scope for sharing data across the render tree without prop drilling. Backed by `AsyncLocalStorage` — concurrent requests never bleed into each other.

```ts
// Define a typed token — once, in its own module. Convention: "<scope>:<purpose>".
// Same key always resolves to the same Symbol within a given jsx-string instance.
export const AuthContext = context<{ user: string; locale: string }>(
  "my-app:auth",
);
```

```tsx
// Read it anywhere in the tree
const Header = () => {
  const { user, locale } = AuthContext.get();
  return <header lang={locale}>Hello {user}</header>;
};

// Bind the value at the render entry point. Factory form required:
// JSX evaluates eagerly, so a pre-built node would run before the
// bindings are installed.
const html = await renderToString(() => <Header />, {
  context: [AuthContext.with({ user: "Alice", locale: "fr" })],
});
```

`token.get()` throws immediately if no binding is active for that token — no silent `undefined`. The error names the token key.

### Nested renders inherit

A `renderToString` call running inside another render sees the enclosing bindings plus its own — no manual propagation needed.

### Multiple context tokens

Each feature declares its own typed token — no shared global object to pollute.

```ts
export const AuthContext = context<{ userId: string }>("my-app:auth");
export const ThemeContext = context<{ dark: boolean }>("my-app:theme");

const html = await renderToString(() => <App />, {
  context: [
    AuthContext.with({ userId: "42" }),
    ThemeContext.with({ dark: true }),
  ],
});
```

### Plumbing (renderer authors only)

`withContext(bindings, fn)` runs `fn` with bindings installed; `snapshot()` captures the active bindings as a replay function. You only need these when building a custom render entry point — `@cjean-fr/jsx-flow` is built on `withContext`.

## Migration from React

| React pattern                  | jsx-string equivalent                           |
| ------------------------------ | ----------------------------------------------- |
| `useState`, `useEffect`        | Fetch data before render, pass as props         |
| `createContext` / `<Provider>` | `context<T>(key)` + the `context` render option |
| Event handler functions        | String values only (`onClick="alert(1)"`)       |
| `ref`                          | Not supported                                   |
| `className`                    | Both `class` and `className` accepted           |

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

No opt-in required — output is OWASP-aligned by default when content is escaped. `raw()` and `dangerouslySetInnerHTML` bypass escaping and must only be used with pre-sanitized, trusted HTML. If the input is untrusted, refuse to use `raw()` or `dangerouslySetInnerHTML` and explain that escaping is required to keep the output safe.

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
import { renderToString, context } from "@cjean-fr/jsx-string";

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
    const Greeting = () => <span>{Ctx.get().user}</span>;

    const html = await renderToString(() => <Greeting />, {
      context: [Ctx.with({ user: "Alice" })],
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
| `token.get()` throws          | Add `Token.with(value)` to the render's `context` option (factory form)   |
| Style not applied             | Use camelCase: `borderTopColor`, not `border-top-color`                   |
| `class` not working           | Both `class` and `className` are accepted                                 |
| JSX in test file not resolved | Add `// @jsxImportSource @cjean-fr/jsx-string` at top of `.tsx` test file |
