---
name: jsx-string
description: Lightweight, secure, and async-capable library to render JSX to HTML strings. Use this skill to craft SSR or SSG apps, Emails, or PDF templates without a virtual DOM.
---

# jsx-string Skill

This skill provides a complete guide for an AI to implement, extend, and maintain HTML rendering systems using the `@cjean-fr/jsx-string` library. This library is designed to evaluate JSX as pure HTML output, optimized for speed, security, and developer experience.

## Core Concepts

The `@cjean-fr/jsx-string` library converts JSX trees straight to strings. It is **not** a frontend framework (no Virtual DOM, no state, no reactivity).

1.  **Hybrid Rendering**: The `renderToString` function computes synchronously if the tree only has standard components, but natively upgrades to a `Promise<string>` if it encounters an `async` component or `Promise` as a child.
2.  **Security by Default**: Content is strictly escaped using OWASP rules. Unsafe links (`javascript:`) are neutered, and `on*` event handlers are intentionally stripped since the result is plain HTML.
3.  **No Hooks**: Since there is no VDOM or browser hydration, React hooks (`useState`, `useEffect`, etc.) **do not exist** and must not be used.

## Workflow

### 1. Write Functional Components

Create standard functional components. They can be standard functions or `async` functions fetching data.

```tsx
// components/UserProfile.tsx
export type UserProps = {
  id: string;
  name: string;
};

// Standard synchronous component
export function UserProfile({ name }: UserProps) {
  return (
    <div className="user-profile">
      <h1>Hello {name}</h1>
      <p>Welcome to your dashboard.</p>
    </div>
  );
}
```

### 2. Async Components

You can perform data fetching directly inside an `async` component.

```tsx
// components/AsyncDashboard.tsx
export async function AsyncDashboard({ id }: { id: string }) {
  // Fetch data directly inside the component
  const data = await fetchUserData(id);

  return (
    <section>
      <h2>Dashboard for {data.name}</h2>
      {/* Promises can be nested naturally */}
      {Promise.resolve(<span>Loaded!</span>)}
    </section>
  );
}
```

### 3. Rendering to HTML

Use the `renderToString` function. Always respect its hybrid return type.

```tsx
import { AsyncDashboard } from "./components/AsyncDashboard";
import { UserProfile } from "./components/UserProfile";
import { renderToString } from "@cjean-fr/jsx-string";

// Synchronous rendering
const html = renderToString(<UserProfile name="Alice" />);
// -> '<div class="user-profile"><h1>Hello Alice</h1>...</div>'

// Asynchronous rendering
const asyncHtml = await renderToString(<AsyncDashboard id="123" />);
// -> '<section><h2>Dashboard for Alice</h2><span>Loaded!</span></section>'
```

## Advanced Usage

### Injecting Raw / Unescaped HTML

By default, everything is escaped. To inject raw HTML (e.g., from an external Markdown parser or a trusted template), you have two valid approaches:

**Approach 1: `SafeString` Wrapper**

```tsx
import { renderToString, SafeString } from "@cjean-fr/jsx-string";

const safeContent = new SafeString("<strong>I am trusted</strong>");
renderToString(<div>{safeContent}</div>);
```

**Approach 2: `dangerouslySetInnerHTML`**

```tsx
import { renderToString } from "@cjean-fr/jsx-string";

const rawHtml = "<strong>I am trusted</strong>";
renderToString(<div dangerouslySetInnerHTML={{ __html: rawHtml }} />);
```

## Guidelines for AI Agents

- **No React Hooks**: Do **not** use `useState`, `useEffect`, `useContext`, or `useRef`. The library performs one-pass rendering. If you need state or effects, rethink the architecture as a backend SSR/SSG flow.
- **Top-Level Await**: Because `renderToString` can return a `Promise<string>`, you should generally assume `await renderToString(...)` is required if building asynchronous trees.
- **Event Handlers**: Do not attempt to attach `onClick` or `onLoad` handlers to JSX elements. They will be ignored. If you need interactivity, attach scripts separately or use HTMX or Alpine.js.
- **Class vs ClassName**: The library supports both `class` and `className` props interchangeably for convenience.
- **Configuration**: If you create a new package using this library, ensure `tsconfig.json` contains `"jsx": "react-jsx"` and `"jsxImportSource": "@cjean-fr/jsx-string"`.
