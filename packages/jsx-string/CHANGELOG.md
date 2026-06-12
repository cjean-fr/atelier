# Changelog

## 3.0.0 (unreleased)

### Breaking changes

- **Context: declarative bindings replace the scope API.**
  `withScope`, `setContext` and `useContext` are removed. The token returned by
  `context(key)` now carries the whole API: `token.get()` reads, and
  `token.with(value)` builds a `ContextBinding` that you install through the
  `context` option of a render entry point. The scope is the render — there is
  nothing to open, order or clean up.

  ```tsx
  // Before (v2.x)
  const html = await withScope(async () => {
    setContext(Auth, { userId: "42" });
    return renderToString(<Page />);
  });

  // After (v3.0)
  const html = await renderToString(() => <Page />, {
    context: [Auth.with({ userId: "42" })],
  });
  ```

  The factory form (`() => <Page />`) is required with bindings: JSX evaluates
  eagerly, so a pre-built node would have run before the bindings were
  installed. Reads migrate mechanically: `useContext(Token)` → `Token.get()`.

- **`snapshot()` returns a replay function instead of a `Map`.**
  `snapshot()` captures the bindings active at call time and returns
  `restore(fn)`, which runs `fn` under them later. The `seed` option it used to
  feed is gone. Together with the new `withContext(bindings, fn)` plumbing,
  this is the renderer-author surface — jsx-flow uses both so deferred
  fragments render under the bindings captured at registration.

### Added

- **`withContext(bindings, fn)`** — installs bindings around `fn`, inheriting
  the enclosing scope. Nested renders see their surroundings plus their own
  bindings (child rebinding never leaks back).
- **`renderToString(factory, { context })`** — overload accepting a node
  factory plus bindings; the plain-node call is unchanged.
- The unbound-token error now includes the token key and the remedy
  (`renderToString(() => <App />, { context: [token.with(value)] })`).

## 2.0.0

### Breaking changes

- **`jsx`, `jsxs`, `jsxDEV` — children must live on `props.children`.**
  The automatic runtime signature is `(type, props, key?)` — the third argument
  is the JSX `key`, not a child. The old variadic form silently rendered the key
  as child content when `props.children` was absent. Standard TypeScript/Babel
  output is unaffected; only hand-written `jsx(...)` calls need updating.

  ```ts
  // Before (v1.x classic-style)
  jsx("div", { id: "p" }, jsx("span", {}, "1"), jsx("span", {}, "2"));

  // After (v2.0)
  jsx("div", {
    id: "p",
    children: [jsx("span", { children: "1" }), jsx("span", { children: "2" })],
  });
  ```

- **`context(key)` requires a non-empty string key.**
  The no-arg form is removed. Calling the same key twice returns the same token
  (deduplicated via a module-level Map). Convention: `"<scope>:<purpose>"`.

  ```ts
  // Before (v1.x)
  const Auth = context<{ userId: string }>();

  // After (v2.0)
  const Auth = context<{ userId: string }>("my-app:auth");
  ```

## 1.5.0

### Added

- **Deno `jsx: "precompile"` support**: New `jsxTemplate`, `jsxAttr`, `jsxEscape` exports on `/jsx-runtime`. Deno's compiler bakes static HTML into template strings at compile time and only calls these runtime helpers for dynamic slots — typically 7-20x faster than the standard transform. All security checks (URL scheme blocking, attribute escaping, name validation) and async semantics (Promise children, async components, concurrent resolution) carry over. Configure with `"jsx": "precompile"` + `"jsxImportSource": "@cjean-fr/jsx-string"` in `deno.json`.

### Changed

- **BREAKING — `class` / `className` no longer merged**: When both props are present on the same element, they now render as separate `class="..."` attributes instead of being merged into one (e.g. `<div class={a} className={b}>` → `<div class="a_value" class="b_value">`). This matches the precompile transform's per-attribute contract; the same behavior now applies in standard mode for parity. To migrate, use a single `class` (or `className`) prop with a pre-joined string.
- **`RawString` — removed `__isRawString` duck-typing**: The `__isRawString` public property and its fallback check in `isRawString()` have been removed. Trusted HTML detection now relies solely on `instanceof RawString`. This removes a spoofable escape hatch from the security boundary.
- **`context<T>()` — token backed by `Symbol`**: Context tokens are now created with `Symbol()` instead of `Object.create(null)`. Both use reference identity as Map keys with identical performance; `Symbol` is semantically correct for an opaque, unique, non-forgeable identifier.
- **`resolveNestedPromises` — single-pass**: Merged the former `hasNestedPromise` detection pass into `resolveNestedPromises`. The function now returns the original value synchronously when no promises are found, and a resolved `Promise<unknown>` otherwise. Removes one full tree traversal on the async path.
- **`data-*` / `aria-*` camelCase conversion removed**: Attribute names starting with `data-` or `aria-` are now passed through verbatim like all other unknown attributes. The conversion was unused in practice (JSX authors write `data-foo-bar` directly) and inconsistent with how React handles these attributes.

### Fixed

- **CSS camelCase conversion**: `REGEX_CAMEL_TO_KEBAB` was missing the `g` flag, causing multi-capital CSS property names (e.g. `borderTopColor`, `borderTopLeftRadius`) to be silently corrupted. Single-capital properties (e.g. `marginTop`, `zIndex`) were unaffected.
- **Tag name injection**: `renderElement` now validates tag names via a dedicated `isValidTagName` check. Invalid names (containing spaces, angle brackets, or starting with a digit) are skipped with a warning instead of being written verbatim into the HTML output.
- **`isRawString` parameter type**: Changed from `any` to `unknown` for stricter type safety.

## 1.4.1

### Fixed

- **Context Initialization**: Add fallback for AsyncContext in case it is not available.

## 1.4.0

### Added

- **Async Context API**: Added `withContext` and `useContext` for type-safe async context.

## 1.3.0

### Added

- **RawString Helper**: Introduced `raw(str)` to safely wrap strings that should be rendered without HTML escaping, preserving user-provided content like translated names or formatted text.

### Changed

- **`SafeString` to `RawString`**: Updated `SafeString` to `RawString` across the codebase to more accurately reflect its purpose: preserving content exactly as-is (raw) rather than guaranteeing safety (safe).

### Fixed

- **Type Compatibility**: Resolved TypeScript type issues preventing the seamless use of `JSXChild` with translators and JSX components by aligning type definitions with actual rendering behavior.

## 1.2.6

### Added

- **Asynchronous Rendering API**: Introduced `renderToStringAsync` to correctly resolve `Promise`-based asynchronous components, establishing a strict boundary where `renderToString` remains purely synchronous.
- **Selective Attribute Normalization**: Upgraded the HTML attribute mapping logic. React-specific mappings (like `className` to `class` and `htmlFor` to `for`) are evaluated correctly, while native HTML, `data-`, `aria-`, and SVG attributes (e.g., `viewBox`) are preserved faithfully with exact expected casings.

### Fixed

- **Persistent RegExp Status**: Fixed a state-retention bug involving the `lastIndex` property on `hasUnescapedChars` regex tests which caused inconsistent string escaping behaviors.
- **Attribute Security**: Refined event-handler filtering. Event handlers (`onclick`, etc.) are stripped natively, triggering a clearer developer warning unless wrapped specifically in a validated `SafeString`.
- **`JSXChild` Type Definitions**: Broadened type validation for `JSXChild` compatibility with standard React elements without compromising the strict, static-rendering guarantees.
- **Peer Dependencies Alignment**: Explicitly moved `@types/react` to an optional peer dependency to prevent intrusive TypeScript overlap for strictly zero-dependency consumers.

## 1.2.2

### Patch Changes

- Update packages.json data and README.md
- add SKILL for AI agents

## 1.2.0

### Added

- Preserve/translate React/SVG attribute names (e.g., `htmlFor`, `xlinkHref`, `viewBox`).
- `dangerouslySetInnerHTML.__html` now treats `null`/`undefined` as empty string.
- Inline event handlers are now always dropped during rendering.
- Unsafe CSS values are now always filtered, and Promises inside style objects are now awaited.

## 1.1.1

### Fixed

- Added missing `jsxs` and `jsxDEV` exports to the compiled bundle, enabling the automatic JSX runtime.

## 1.1.0

### Added

- Support for Classic JSX Runtime: the `jsx` factory now accepts children as additional arguments (e.g., `jsx(tag, props, ...children)`), following the historical React signature.
- Documentation in README for both Automatic and Classic JSX runtimes configuration in `tsconfig.json`.

### Changed

- Improved `jsx` factory to merge residual arguments into `props.children` when they are present.

## 1.0.0

- Initial release of `@cjean-fr/jsx-string`.
