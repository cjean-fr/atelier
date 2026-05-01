# @cjean-fr/jsx-string

**The small, safe way to render JSX into HTML strings.**

Zero dependencies. Fully typed. Optimized for performance and security.

## Features

- 🚀 **Fast**: Extremely lightweight and optimized for high-speed rendering.
- 🛡️ **Secure**: OWASP-aligned escaping & URL sanitization (`javascript:` blocked).
- 💎 **Type-friendly**: Zero-config JSX types. Smoothly bridges with React-based ecosystems.
- 🔄 **Async ready**: Built-in support for `async` components and `Promises`.
- ✅ **Feature-rich**: Style objects/strings, class merging, boolean attributes, `Fragment`, `RawString`.

## Installation

```bash
bun add @cjean-fr/jsx-string
# Recommended to keep your code static-rendering safe:
bun add -D @cjean-fr/eslint-plugin-jsx-string
```

## Configuration

### 1. Automatic JSX Runtime (Recommended)

Enable automatic JSX transform in your `tsconfig.json`. This is the modern way to use JSX where you don't need to import `jsx` in every file.

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@cjean-fr/jsx-string"
  }
}
```

### 2. Classic JSX Runtime

If you prefer or need to use the Classic JSX runtime (e.g., with older tools or for specific performance needs), use the following configuration in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "jsx": "react",
    "jsxFactory": "jsx",
    "jsxFragmentFactory": "Fragment"
  }
}
```

Then, you must import `jsx` and/or `Fragment` in your files, or use a `// @jsx jsx` pragma.

### 3. Babel Integration

When using Babel, configure `@babel/preset-react` to use the automatic runtime:

```json
{
  "presets": [
    [
      "@babel/preset-react",
      {
        "runtime": "automatic",
        "importSource": "@cjean-fr/jsx-string"
      }
    ]
  ]
}
```

### 4. Vite / esbuild

In your `vite.config.ts` or esbuild configuration:

```ts
import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "@cjean-fr/jsx-string",
  },
});
```

### 5. Linting (Recommended)

To ensure your code stays compatible with static rendering (no hooks, no React imports), use the dedicated ESLint plugin:

```javascript
// eslint.config.js
import jsxString from "@cjean-fr/eslint-plugin-jsx-string";

export default [jsxString.configs.recommended];
```

## Use Cases

- **Static Site Generation (SSG)**: Generate static HTML files securely without the overhead of a full frontend framework. Perfect for blogs, documentation sites, or landing pages.
- **Email Templates**: Write maintainable email templates using the familiar JSX syntax with complete TypeScript support, then compile them to raw HTML string for your mailer.
- **Lightweight SSR**: Return HTML strings directly from lightweight backend frameworks (like Hono, Elysia, or Express) without requiring a virtual DOM or complex hydration logic.
- **PDF Generation**: Assemble reliable HTML markups server-side before feeding them to tools like Puppeteer or specialized PDF printers.

## Usage

### 1. Synchronous Rendering

If your JSX tree contains no Promises or async components, `renderToString` returns a `string` immediately.

```tsx
import { renderToString } from "@cjean-fr/jsx-string";

const html = renderToString(
  <div id="root" className="container">
    <h1 style={{ marginTop: "20px" }}>Hello World</h1>
  </div>,
);
// => '<div id="root" class="container"><h1 style="margin-top:20px">Hello World</h1></div>'
```

### 2. Asynchronous Rendering

If the tree contains `async` components or `Promises`, `renderToString` returns a `Promise<string>`.

```tsx
import { renderToStringAsync } from "@cjean-fr/jsx-string";

const AsyncComponent = async ({ name }) => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  return <div>Hello {name}</div>;
};

const html = await renderToStringAsync(
  <section>
    <AsyncComponent name="World" />
    {Promise.resolve(<span>!</span>)}
  </section>,
);
// => '<section><div>Hello World</div><span>!</span></section>'
```

### 3. Raw HTML & Custom Content

Preserve pre-rendered HTML or inject trusted content safely.

```tsx
import { raw } from "@cjean-fr/jsx-string";

// Using raw helper
const content = raw("<span>Raw</span>");
renderToString(<div>{content}</div>); // '<div><span>Raw</span></div>'

// Using dangerouslySetInnerHTML (React-like)
renderToString(<div dangerouslySetInnerHTML={{ __html: "<b>Trusted</b>" }} />);
```

### 4. Context API

`@cjean-fr/jsx-string` exposes a type-safe Async Context API (`withContext` and `useContext`) backed by `AsyncLocalStorage`. It allows sharing data (like user sessions or configuration) deeply across the entire rendering tree without prop-drilling.

```tsx
import { withContext, useContext, renderToStringAsync } from "@cjean-fr/jsx-string";

// 1. Read from context anywhere in the tree
const UserProfile = () => {
  const ctx = useContext();
  return <div>Welcome, {ctx.user}</div>;
};

// 2. Wrap your render in an isolated context scope
const html = await withContext(async () => {
  const ctx = useContext();
  ctx.user = "Alice"; // Mutate the current scope safely
  
  return renderToStringAsync(<UserProfile />);
});
// => "<div>Welcome, Alice</div>"
```

## Ecosystem

Extend `@cjean-fr/jsx-string` with official plugins:

- **`@cjean-fr/jsx-string-await`**: A streaming solution offering an `<Await />` component to render fallbacks synchronously while deferring complex async trees. It streams resolved chunks via Web Streams using strategies like Hotwire or HTMX (`renderToStream`).

## AI-Friendly

`@cjean-fr/jsx-string` is designed to be easily manipulated by AI agents. Being pure functions without complex state mechanisms like React hooks, AIs can generate full HTML views flawlessly.

It includes a dedicated **Skill** that agents can consume to learn how to use the library optimally.

```bash
npx skills add cjean-fr/atelier --skill jsx-string
```

## Security

Security is built-in, not optional:

- **Escaping**: All text content is escaped by default following OWASP rules.
- **Attributes**: Values are escaped, attribute names are validated against a safe pattern.
- **URL Sanitization**: Attributes like `href` or `src` are sanitized to block `javascript:` and `vbscript:` protocols.
- **Inline Handlers**: `on*` attributes are supported as strings (automatically escaped). Functions are blocked with a warning.
- **Inline Styles**: Unsafe CSS values are filtered out, and Promises inside style objects are awaited.

```tsx
// XSS is prevented:
renderToString(<div>{"<script>alert(1)</script>"}</div>);
// => "<div>&lt;script&gt;alert(1)&lt;/script&gt;</div>"

// Unsafe URL becomes #blocked:
renderToString(<a href="javascript:alert(1)">click</a>);
// => '<a href="#blocked">click</a>'

// Event handlers are escaped and functional:
renderToString(<button onClick="alert('Hello')">Click</button>);
// => '<button onclick="alert('Hello')">Click</button>'
```

Inline handlers are supported as static strings. Complex event bindings via functions are not supported as this package renders static HTML strings.
Nested async values inside `style` are supported: they are awaited before serialization.

Note: `dangerouslySetInnerHTML` always bypasses escaping by design.

## API Reference

- `renderToString(node)` — Hybrid renderer (returns `string | Promise<string>`).
- `raw(string)` — Helper function to create `RawString` instances.
- `RawString` — Instances created using `raw()` for raw HTML strings.
- `Fragment` — Standard JSX Fragment component.
- `jsx/jsxs/h` — Internal JSX factories.
- `StandardAttributes` — Base types for HTML elements (includes `style`, `class`, `className`, etc).
- `JSXChild` — Recursive type for any valid JSX child (string, number, element, promise, array).

## Contributing

```bash
bun install
bun run build   # Build distribution
bun run test    # Run all tests
bun run check   # Type-check
```

## License

MIT © Christophe Jean

---

<p align="center">Made with ❤️ in Paris</p>
