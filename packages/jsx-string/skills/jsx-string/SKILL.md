---
name: jsx-string
description: Use this skill when the user wants to render JSX to HTML strings, create static sites (SSG), build email templates, implement lightweight SSR, generate PDF content, or needs secure HTML rendering. Trigger on JSX-to-string tasks, email template generation, server-side rendering without React, or static site generation.
license: MIT
compatibility: Node.js, Bun, Deno, Vite, esbuild, TypeScript
---

# @cjean-fr/jsx-string

Zero-dependency JSX-to-HTML renderer with built-in XSS protection.

## Install

```bash
npm install @cjean-fr/jsx-string
npm install -D @types/react
```

## Quick Setup

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@cjean-fr/jsx-string"
  }
}
```

### ESLint (Highly Recommended)

To ensure your code stays compatible with static rendering, use our official ESLint plugin:

```bash
bun add -D @cjean-fr/eslint-plugin-jsx-string
```

#### ESLint Flat Config (`eslint.config.js`)

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

## Decision Tree

```
Need to render JSX?
│
├─ Yes ──────────────────────────────────────────
│   │
│   ├─ Email / PDF / Static content? → renderToString()
│   │
│   ├─ Need async data? ───────────────────────
│   │   │
│   │   ├─ Multiple fetches? → Promise.all()
│   │   │
│   │   └─ Single fetch? → await inside component
│   │
│   └─ Fetch can fail? → try/catch or AsyncBoundary
│
└─ No → Use template literals or string interpolation
```

## Core API

```typescript
import { renderToString } from "@cjean-fr/jsx-string";

// Sync
const html = renderToString(<div>Hello</div>);

// Async - when component contains await
const html = await renderToString(<AsyncComponent />);

// Pre-sanitized HTML
import { raw } from "@cjean-fr/jsx-string";
renderToString(<div>{raw("<b>Bold</b>")}</div>);

// Raw HTML (bypasses escaping - dangerous!)
renderToString(<div dangerouslySetInnerHTML={{ __html: "<b>Bold</b>" }} />);
```

## Migration from React

Code stays compatible with React - just follow these rules.

### Rules

| Rule                                     | Why                           |
| ---------------------------------------- | ----------------------------- |
| No hooks (`useState`, `useEffect`, etc.) | Static rendering only         |
| No context providers                     | Use Registry or props         |
| No event handlers in render              | Static HTML, no interactivity |
| No refs                                  | No DOM access                 |

### Pattern: Extract Data Before Render

```typescript
// Instead of hooks
const Page = () => {
  const [data, setData] = useState(null);
  useEffect(() => { setData(fetchData()); }, []);
  if (!data) return <Loading />;
  return <Content data={data} />;
};

// Do this instead
const Page = ({ data }: { data: Data }) => {
  if (!data) return <Loading />;
  return <Content data={data} />;
};

// React: <Page data={useHook()} />
// jsx-string: <Page data={await fetchData()} />
```

## Async Patterns

```typescript
// ✅ GOOD: await before return, like React
const UserCard = ({ id }: { id: string }) => {
  const user = await fetchUser(id);
  return <div>{user.name}</div>;
};

// ✅ GOOD: Parallel fetches for independent data
const Dashboard = ({ userId }: { userId: string }) => {
  const [user, posts] = await Promise.all([
    fetchUser(userId),
    fetchPosts(userId),
  ]);
  return <div>{/* ... */}</div>;
};

// ❌ BAD: Promise object rendered as text
const Broken = () => <div>{fetchUser("1")}</div>;

// ❌ BAD: Await in return (awkward)
const AlsoBad = async ({ id }: { id: string }) =>
  <div>{(await fetchUser(id)).name}</div>;
```

## SSG Pattern

```typescript
import { renderToString } from "@cjean-fr/jsx-string";
import { mkdir, writeFile } from "fs/promises";

const routes = [
  { path: "/", component: <HomePage /> },
  { path: "/about", component: <AboutPage /> },
];

const build = async () => {
  for (const route of routes) {
    const html = await renderToString(route.component);
    const filePath = route.path === "/" ? "dist/index.html" : `dist${route.path}/index.html`;
    await mkdir(filePath.replace(/\/[^/]+$/, ""), { recursive: true });
    await writeFile(filePath, `<!DOCTYPE html>${html}`);
  }
};
```

## Registry

For deeply nested data access without prop drilling:

```typescript
// registry.ts - single source of truth
export const registry = {
  theme: "light" as const,
  user: null as User | null,
};

// user-module.ts - deep module can access directly
export const UserBadge = () => {
  if (!registry.user) return <span>Guest</span>;
  return <span>{registry.user.name}</span>;
};

// header.tsx - no prop drilling needed
import { UserBadge } from "./user-module";

const Header = () => (
  <nav>
    <UserBadge />
  </nav>
);

// app.tsx - set data once
import { registry } from "./registry";

registry.user = await fetchUser(id);
const html = renderToString(<Header />);
```

## Error Handling

```typescript
// Simple try/catch at renderToString level
const html = await renderToString(<Page />).catch(() => "<div>Error</div>");

// Inline error handling in async components (simplest, recommended)
// await <Child /> works because JSX compiles to a function call returning RawString | Promise<RawString>
const UserSection = async ({ id }: { id: string }) => {
  try {
    return await <UserCard id={id} />;
  } catch {
    return <div>Failed to load user</div>;
  }
};

// Reusable: withCatch HOC
// ⚠️ <ErrorBoundary><Child /></ErrorBoundary> does NOT work:
//   JSX evaluates children BEFORE the component is called, so any throw or
//   rejected Promise escapes the try/catch. Use withCatch instead.
import type { RenderResult } from "@cjean-fr/jsx-string";

const withCatch = <P extends object>(
  Component: (props: P) => RenderResult,
  fallback: RenderResult,
) => async (props: P): Promise<RenderResult> => {
  try {
    return await Component(props);
  } catch (error) {
    console.error("Render error:", error);
    return fallback;
  }
};

// Usage — call site is transparent, works like a normal component
const SafeUserCard = withCatch(UserCard, <div>Failed to load</div>);
// <SafeUserCard id="1" />

// Timeout
const withTimeout = async <T,>(promise: Promise<T>, ms: number) => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), ms),
    ),
  ]);
};
```

## Testing

Examples use Vitest, but work with Jest and bun:test.

```typescript
import { describe, it, expect, fn } from "vitest";
import { renderToString } from "@cjean-fr/jsx-string";

describe("Component", () => {
  it("renders correctly", async () => {
    const html = await renderToString(<UserCard name="Alice" />);
    expect(html).toContain("Alice");
  });

  it("escapes HTML", async () => {
    const html = await renderToString(<UserCard name="<script>" />);
    expect(html).toContain("&lt;script&gt;");
  });

  it("with mock fetch", async () => {
    global.fetch = fn(async () => ({ json: async () => ({ name: "Bob" }) }));
    const html = await renderToString(<UserCard id="1" />);
    expect(html).toContain("Bob");
  });
});
```

## Security (Built-in)

```typescript
// All escaped by default
renderToString(<div>{"<script>"}</div>); // &lt;script&gt;

// javascript: blocked
renderToString(<a href="javascript:alert(1)">link</a>); // href="#blocked";

// Event handlers supported as strings
renderToString(<button onClick="alert(1)">btn</button>); // <button onclick="alert(1)">btn</button>
renderToString(<button onClick={fn}>btn</button>); // blocked with warning (functions not supported)
```

## Troubleshooting

| Problem                    | Solution                                                       |
| -------------------------- | -------------------------------------------------------------- |
| "TypeScript errors on JSX" | Check tsconfig has `"jsxImportSource": "@cjean-fr/jsx-string"` |
| "Promise in output"        | Missing `await` on renderToString or inside component          |
| "Styles don't work"        | Use camelCase: `backgroundColor`, not `background-color`       |
| "class doesn't work"       | Use `className` (JSX convention)                               |

## Output Checklist

1. ✅ `import { renderToString } from "@cjean-fr/jsx-string"`
2. ✅ tsconfig configured
3. ✅ Use `await` for async components
4. ✅ Handle errors with try/catch
5. ✅ Test with `await renderToString()`
6. ❌ No React imports, hooks, or react-dom
7. ✅ Code stays React-compatible (no vendor lock-in)
