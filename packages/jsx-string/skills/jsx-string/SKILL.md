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

### ESLint (Optional)

Block React imports at lint time (ESLint flat config):

```javascript
// eslint.config.js
import tseslint from "@typescript-eslint/eslint-plugin";

export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            { name: "react", message: "React imports are not compatible with @cjean-fr/jsx-string." },
            { name: "react-dom", message: "React imports are not compatible with @cjean-fr/jsx-string." }
          ]
        }
      ],
      "@typescript-eslint/no-restricted-syntax": [
        "error",
        {
          selector: "CallExpression[callee.name='useState']",
          message: "useState is not compatible with @cjean-fr/jsx-string. Extract state as props."
        },
        {
          selector: "CallExpression[callee.name='useEffect']",
          message: "useEffect is not compatible with @cjean-fr/jsx-string. Fetch data before render."
        }
      ]
    }
  }
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
import { SafeString } from "@cjean-fr/jsx-string";
const safe = new SafeString("<b>Bold</b>");
renderToString(<div>{safe}</div>);

// Raw HTML (bypasses escaping - dangerous!)
renderToString(<div dangerouslySetInnerHTML={{ __html: rawHtml }} />);
```

## Migration from React

Code stays compatible with React - just follow these rules.

### Rules

| Rule | Why |
|------|-----|
| No hooks (`useState`, `useEffect`, etc.) | Static rendering only |
| No context providers | Use Registry or props |
| No event handlers in render | Static HTML, no interactivity |
| No refs | No DOM access |

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
// Simple try/catch
const html = await renderToString(<Component />).catch(err => "<div>Error</div>");

// ErrorBoundary - React-compatible pattern in user land
interface ErrorBoundaryProps {
  children: JSXChild;
  fallback: JSXChild;
}

const ErrorBoundary = async ({ children, fallback }: ErrorBoundaryProps) => {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error("Render error:", error);
    return <>{fallback}</>;
  }
};

// Usage
const SafeComponent = ({ id }: { id: string }) => (
  <ErrorBoundary fallback={<div>Failed to load</div>}>
    <RiskyComponent id={id} />
  </ErrorBoundary>
);

// Timeout - React-compatible pattern in user land
const withTimeout = async <T,>(promise: Promise<T>, ms: number) => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("Timeout")), ms))
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

// Event handlers removed
renderToString(<button onClick={fn}>btn</button>); // <button>btn</button>;
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "TypeScript errors on JSX" | Check tsconfig has `"jsxImportSource": "@cjean-fr/jsx-string"` |
| "Promise in output" | Missing `await` on renderToString or inside component |
| "Styles don't work" | Use camelCase: `backgroundColor`, not `background-color` |
| "class doesn't work" | Use `className` (JSX convention) |

## Output Checklist

1. ✅ `import { renderToString } from "@cjean-fr/jsx-string"`
2. ✅ tsconfig configured
3. ✅ Use `await` for async components
4. ✅ Handle errors with try/catch
5. ✅ Test with `await renderToString()`
6. ❌ No React imports, hooks, or react-dom
7. ✅ Code stays React-compatible (no vendor lock-in)
