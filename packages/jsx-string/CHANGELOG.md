# Changelog

## 2.0.0

### Fixed

- **`RawString` class is now a `globalThis` singleton.** Backed by
  `Symbol.for("@cjean-fr/jsx-string.RawString")`. Previously, when jsx-string
  was loaded multiple times in the same process (typical setup: Vite dev
  server SSR-loads user pages with its own jsx-string instance, while a
  Node-loaded plugin holds another), the two instances had distinct
  `RawString` classes. `child instanceof RawString` then failed across
  instances, sending trusted HTML through the untrusted-text escape path —
  the rendered page came out with literal `&lt;html&gt;…` in the body. The
  class is now resolved once per process, mirroring the existing fixes for
  `AsyncLocalStorage` and context tokens.

### Changed

- **BREAKING — `jsx`, `jsxs`, `jsxDEV` no longer accept variadic positional
  children.** The automatic runtime spec is `(type, props, key?)`; the third
  argument is the JSX `key` (diagnostic), never a child. The old variadic
  overload silently rendered the `key` string as child content whenever an
  element had no `props.children` — e.g. `jsx("div", { id: "p" }, "k")` used
  to produce `<div id="p">k</div>`. It now produces `<div id="p"></div>`.
  Children must live on `props.children`.

  ```ts
  // Before (v1.x classic-style)
  jsx("div", { id: "p" }, jsx("span", {}, "1"), jsx("span", {}, "2"));

  // After (v2.0)
  jsx("div", {
    id: "p",
    children: [jsx("span", { children: "1" }), jsx("span", { children: "2" })],
  });
  ```

  Code emitted by the standard TypeScript/Babel automatic JSX transform is
  unaffected — it already passes children via `props.children`. Only hand-written
  `jsx(...)` calls using the legacy classic-style variadic form need to migrate.

- **BREAKING — `context(key)` now requires a non-empty string key.** Old
  `context<T>()` no-arg form is removed. The key must be a globally-unique
  namespaced string (e.g. `"@my-org/my-pkg:purpose"`), used as
  `Symbol.for(...)` lookup. This makes context tokens stable across module
  duplications — Vite plugin loaded by Node + user pages loaded by Vite SSR
  no longer end up with mismatched `Symbol`s; same for web workers,
  microfrontends, edge re-init, federated bundles. The previous no-arg form
  silently broke in those scenarios.
- **`AsyncLocalStorage` is now a `globalThis` singleton.** Backed by
  `Symbol.for("@cjean-fr/jsx-string.storage")`. Multiple loaded instances of
  jsx-string share one storage. No API change beyond the context key
  requirement above.

### Migration

```ts
// Before (v1.x)
const Auth = context<{ userId: string }>();

// After (v2.0)
const Auth = context<{ userId: string }>("my-app:auth");
```

The key is up to you — convention is `"<scope>:<purpose>"` to avoid
collisions. Two callers with the same key share the same Symbol (by design,
for cross-instance sharing).

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
