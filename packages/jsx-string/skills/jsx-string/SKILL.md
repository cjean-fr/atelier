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
└─ Streaming / client-side hydration? → @cjean-fr/jsx-string-island
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
// Define a typed token — once, in its own module
export const AuthContext = context<{ user: string; locale: string }>();
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
export const AuthContext = context<{ userId: string }>();
export const ThemeContext = context<{ dark: boolean }>();

await withScope(async () => {
  setContext(AuthContext, { userId: "42" });
  setContext(ThemeContext, { dark: true });
  return renderToString(<App />);
});
```

## Migration from React

| React pattern                  | jsx-string equivalent                           |
| ------------------------------ | ----------------------------------------------- |
| `useState`, `useEffect`        | Fetch data before render, pass as props         |
| `createContext` / `<Provider>` | `context<T>()` + `withScope()` + `setContext()` |
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
    const Ctx = context<{ user: string }>();
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
