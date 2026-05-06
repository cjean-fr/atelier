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

### ESLint (Recommended)

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
│   ├─ Need shared state across tree? → withContext() / useContext()
│   │
│   └─ Need streaming / deferred rendering? → @cjean-fr/jsx-string-island
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

| Rule                                     | Why                            |
| ---------------------------------------- | ------------------------------ |
| No hooks (`useState`, `useEffect`, etc.) | Static rendering only          |
| No React context (`createContext`, etc.) | Use `withContext`/`useContext` |
| No event handlers in render              | Static HTML, no interactivity  |
| No refs                                  | No DOM access                  |

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

## Context API

For deeply nested data access without prop drilling, use the built-in Context API backed by `AsyncLocalStorage`.
Unlike React Context, there is no `<Provider>` component. `withContext()` automatically creates a fresh, empty context object (`{}`) for its scope. You inject data by simply mutating this object before rendering.

If `useContext()` is called outside of a `withContext` scope, it safely throws an error rather than silently returning `undefined`.

```typescript
import { withContext, useContext, renderToStringAsync } from "@cjean-fr/jsx-string";

// Read from context anywhere in the tree
const UserBadge = () => {
  const ctx = useContext();
  if (!ctx.user) return <span>Guest</span>;
  return <span>{ctx.user.name}</span>;
};

const Header = () => (
  <nav>
    <UserBadge />
  </nav>
);

// Wrap your render in an isolated context scope
const html = await withContext(async (ctx) => {
  // Inject data by mutating the fresh context object
  ctx.user = await fetchUser(id);

  // Works seamlessly with both renderToString and renderToStringAsync
  return renderToStringAsync(<Header />);
});
```

The `Context` interface is empty by default and MUST be extended via TypeScript module augmentation for strong typing:

```typescript
declare module "@cjean-fr/jsx-string" {
  export interface Context {
    user?: User;
  }
}
```

Plugins like `@cjean-fr/jsx-string-island` also use this to attach their own internal state.

## Testing

Examples use Vitest, but work with Jest and bun:test.

```typescript
import { describe, it, expect, fn } from "vitest";
import { renderToStringAsync } from "@cjean-fr/jsx-string";

const UserCard = ({ name }) => <div>{name}</div>;

describe("Component", () => {
  it("renders correctly", async () => {
    const html = await renderToStringAsync(<UserCard name="Alice" />);
    expect(html).toContain("Alice");
  });

  it("escapes HTML", async () => {
    const html = await renderToStringAsync(<UserCard name="<script>" />);
    expect(html).toContain("&lt;script&gt;");
  });

  it("with mock fetch", async () => {
    global.fetch = fn(async () => ({ json: () => ({ name: "Bob" }) }));
    const html = await renderToStringAsync(<UserCard id="1" />);
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
5. ✅ Test with `await renderToStringAsync()`
6. ❌ No React imports, hooks, or react-dom
7. ✅ Code stays React-compatible (no vendor lock-in)
