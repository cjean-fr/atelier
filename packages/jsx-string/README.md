# @cjean-fr/jsx-string

[![CI](https://github.com/cjean-fr/atelier/actions/workflows/ci.yml/badge.svg)](https://github.com/cjean-fr/atelier/actions/workflows/ci.yml)

**JSX → HTML strings. Async-first. Secure by default. Zero runtime dependencies.**

The JSX-to-string renderer built for async components and concurrent-safe context — without React.

## Why?

Most JSX-to-string libraries treat async as an afterthought and offer no way to share data across the render tree. `@cjean-fr/jsx-string` is built from the ground up for:

- **Server-side HTML** where components fetch their own data
- **Email generation** with complex, data-driven templates
- **SSG pipelines** that orchestrate concurrent async renders
- **Any context where React is overkill** but JSX is the right tool

## Install

```bash
bun add @cjean-fr/jsx-string
# or
npm install @cjean-fr/jsx-string
```

## Setup

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

> TypeScript users with `@types/react` installed get enhanced attribute autocomplete for free. It is not required.

### Deno (`jsx: "precompile"`)

Deno ships a JSX transform that analyses your tree statically and bakes the static HTML into template strings at compile time — [7-20x faster](https://docs.deno.com/runtime/reference/jsx/) than the standard transform on the server side. `@cjean-fr/jsx-string` exports the `jsxTemplate` / `jsxAttr` / `jsxEscape` runtime functions Deno's compiler emits, so you can opt in by adding to `deno.json`:

```json
{
  "compilerOptions": {
    "jsx": "precompile",
    "jsxImportSource": "@cjean-fr/jsx-string"
  }
}
```

All the security guarantees (URL scheme blocking, attribute escaping, valid name checks) and async semantics (Promise children, async components, concurrent resolution) still apply — dynamic attribute Promises and async expressions are awaited before the final string is assembled.

**Limitations of precompile mode** (intrinsic to the contract — each attribute is rendered in isolation):

- `dangerouslySetInnerHTML` is dropped silently. Use `{raw(html)}` as a child instead.
- `class` and `className` are not merged across the same element. `<div class={a} className={b} />` emits two `class="..."` attributes instead of one merged value. To keep behavior identical, the standard transform no longer merges them either — use a single prop.

## Async components, natively

Every component can be `async`. Promise children work too. The renderer resolves everything concurrently — no sequential waterfall.

```tsx
import { renderToString } from "@cjean-fr/jsx-string";

const UserCard = async ({ id }: { id: string }) => {
  const user = await db.users.find(id);
  return (
    <div class="card">
      <h2>{user.name}</h2>
      <p>{user.bio}</p>
    </div>
  );
};

const html = await renderToString(<UserCard id="42" />);
```

## Concurrent-safe context

Pass data through the render tree without prop drilling. Each render gets its own isolated scope, backed by Node's `AsyncLocalStorage`. Two concurrent requests never bleed into each other.

> **`withScope` is only needed when you use `context()` / `setContext()` / `useContext()`.** For pure rendering without context, call `renderToString()` directly — concurrent `Promise.all(renderToString(...), renderToString(...))` works fine out of the box.

```ts
// Define a typed token — once, anywhere
export const RequestContext = context<{ locale: string; userId: string }>();
```

```tsx
// Read it anywhere in the tree, no prop drilling
const Header = () => {
  const { locale } = useContext(RequestContext);
  return <header lang={locale}>...</header>;
};

// Each request gets its own isolated scope
const html = await withScope(async () => {
  setContext(RequestContext, { locale: "fr", userId: "42" });
  return renderToString(<Page />);
});
```

`useContext` throws immediately if called outside a scope or if the value was never set — no silent `undefined`.

Sub-scopes can inherit parent data via `snapshot()`:

```ts
await withScope(async () => {
  setContext(AuthContext, { user: "Alice" });

  // Isolated child scope with parent data
  await withScope(
    async () => {
      useContext(AuthContext).user; // ✅ "Alice"
      setContext(AuthContext, { user: "Child" }); // local only
    },
    { seed: snapshot() },
  );

  useContext(AuthContext).user; // ✅ still "Alice"
});
```

## Secure by default

Every output is OWASP-aligned. No opt-in required.

- Text content escaped (`<`, `>`, `&`)
- Attribute values escaped, names validated
- URL attributes (`href`, `src`, `action`…) block `javascript:` and `vbscript:`
- Inline `style` values filtered for unsafe CSS expressions

```tsx
<div>{"<script>alert(1)</script>"}</div>
// => <div>&lt;script&gt;alert(1)&lt;/script&gt;</div>

<a href="javascript:alert(1)">click</a>
// => <a href="#blocked">click</a>
```

Trusted HTML when you need it:

```tsx
import { raw } from "@cjean-fr/jsx-string";

<div>{raw(trustedHtml)}</div>
// or
<div dangerouslySetInnerHTML={{ __html: trustedHtml }} />
```

## API

| Export                     | Description                                                                                                                                                                      |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `renderToString(node)`     | Renders a JSX tree to an HTML string. **Always returns `Promise<string>`** — even for synchronous components.                                                                    |
| `raw(string)`              | Injects trusted HTML without escaping                                                                                                                                            |
| `Fragment`                 | Standard JSX Fragment (`<>...</>`)                                                                                                                                               |
| `context<T>()`             | Creates a typed context token                                                                                                                                                    |
| `setContext(token, value)` | Writes a value to the current scope                                                                                                                                              |
| `useContext(token)`        | Reads a value — throws if absent or outside scope                                                                                                                                |
| `withScope(fn, options?)`  | Creates an isolated async scope. **Only needed when using `context()` / `setContext()` / `useContext()`.** For pure rendering without context, call `renderToString()` directly. |
| `snapshot()`               | Captures current scope state for seeding sub-scopes                                                                                                                              |

## When NOT to use

- **Client-side rendering or hydration** — this library is server-only. Use Preact, Solid, or Astro for rich client-side interactivity.
- **Existing React component ecosystems** — component libraries (MUI, Radix, etc.) and hooks (React Query, React Hook Form) require React's runtime and won't work here.
- **Next.js App Router / React Server Components** — jsx-string is not RSC-aware and cannot run inside Next.js's async server component model.
- **Teams not ready for component-level data fetching** — async components shift data ownership into the render tree, which is a different mental model than loaders or middleware.

## Ecosystem

- **`@cjean-fr/jsx-string-island`** 🚧 *Early / v0.1.0*: Streaming and partial hydration via the islands pattern. The `<Island />` component defers heavy rendering — the initial HTML ships a placeholder, then each island is rendered concurrently and delivered to the client via Turbo Streams, HTMX, or the browser's native Declarative Partial Updates API.

## License

MIT © Christophe Jean
