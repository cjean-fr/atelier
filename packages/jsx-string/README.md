# @cjean-fr/jsx-string

**The small, safe way to render JSX into HTML strings.**

Zero dependencies. Fully typed. Optimized for performance and security.

## Features

- 🚀 **Fast**: Extremely lightweight and optimized for high-speed rendering.
- 🛡️ **Secure**: OWASP-aligned escaping & URL sanitization (`javascript:` blocked).
- 💎 **Type-friendly**: Zero-config JSX types. Smoothly bridges with React-based ecosystems.
- 🔄 **Async ready**: Built-in support for `async` components and `Promises`.
- ✅ **Feature-rich**: Style objects/strings, class merging, boolean attributes, `Fragment`, `SafeString`.

## Installation

```bash
bun add @cjean/jsx-string
# or
npm install @cjean/jsx-string
```

## Configuration

Enable automatic JSX transform in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@cjean/jsx-string"
  }
}
```

## Usage

### 1. Synchronous Rendering

If your JSX tree contains no Promises or async components, `renderToString` returns a `string` immediately.

```tsx
import { renderToString } from "@cjean/jsx-string";

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
import { renderToString } from "@cjean/jsx-string";

const AsyncComponent = async ({ name }) => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  return <div>Hello {name}</div>;
};

const html = await renderToString(
  <section>
    <AsyncComponent name="World" />
    {Promise.resolve(<span>!</span>)}
  </section>,
);
// => '<section><div>Hello World</div><span>!</span></section>'
```

> **Note**: `renderToString` is hybrid. It returns a `string` if possible, otherwise a `Promise`.

### 3. Safe HTML & Custom Content

Preserve pre-escaped HTML or inject trusted content safely.

```tsx
import { SafeString } from "@cjean/jsx-string";

// Using SafeString (wrapper)
const safe = new SafeString("<span>Safe</span>");
renderToString(<div>{safe}</div>); // '<div><span>Safe</span></div>'

// Using dangerouslySetInnerHTML (React-like)
renderToString(<div dangerouslySetInnerHTML={{ __html: "<b>Trusted</b>" }} />);
```

## Security

Security is built-in, not optional:

- **Escaping**: All text content is escaped by default following OWASP rules.
- **Attributes**: Values are escaped, attribute names are validated against a safe pattern.
- **URL Sanitization**: Attributes like `href` or `src` are sanitized to block `javascript:` and `vbscript:` protocols.

```tsx
// XSS is prevented:
renderToString(<div>{"<script>alert(1)</script>"}</div>);
// => '<div>&lt;script&gt;alert(1)&lt;/script&gt;</div>'

// Unsafe URL becomes #blocked:
renderToString(<a href="javascript:alert(1)">click</a>);
// => '<a href="#blocked">click</a>'
```

## API Reference

- `renderToString(node)` — Hybrid renderer (returns `string | Promise<string>`).
- `SafeString` — Utility to wrap strings that should not be escaped.
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
