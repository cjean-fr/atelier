# Changelog

## 2.1.0

### Added

- **Error annotation**: Errors thrown inside components are now prefixed with
  `[ComponentName]` for easier debugging. The original error type and custom
  properties (e.g. `status` on an `HttpError`) are preserved — only `message`
  is wrapped.
- **`dangerouslySetInnerHTML` with `Promise<__html>`**: The `__html` value can
  now be a `Promise<string | null>`. When it resolves, the content is rendered
  as raw HTML; when it rejects, the promise propagates to `renderToString`.
- **`RawString` / `Promise<RawString>` in `renderToString`**: The top-level
  entry point now accepts `RawString` and `Promise<RawString>` directly, not
  just JSX elements.
- **`@cjean-fr/jsx-string/html` subpath**: Exposes low-level HTML primitives
  (`VOID_ELEMENTS`, `URL_ATTRIBUTES`, `escapeAttr`, `isValidAttrName`,
  `isValidTagName`, `ATTRIBUTE_NAME_MAP`) so compilers can reuse the runtime's
  exact functions.
- **`react-augment.d.ts`**: Augments `@types/react`'s `HTMLAttributes` and
  `SVGAttributes` to accept `class` and `on*` string event handlers when
  `@types/react` is installed.
- **Property-based fuzz tests**: `escape.fuzz.test.ts` runs 2000+ randomly
  generated adversarial strings through every escaping and URL-safety function,
  plus end-to-end angle-bracket-invariant assertions. Uses `fast-check`.

### Changed

- **Monolithic `html.ts` split** into `render-child.ts`, `render-attributes.ts`,
  `render-element.ts`, and `html-primitives.ts`. The public API is unchanged.
- **Attribute meta caching**: Name-based validation, camelCase→kebab remapping,
  event-handler detection, and URL/srcset classification are computed once per
  distinct attribute name and cached thereafter. Value-dependent work (escaping,
  URL/CSS safety) is never cached.
- **`renderAttributes` skips internal props upfront**: `children`,
  `dangerouslySetInnerHTML`, `key`, `ref` are filtered before the attribute
  loop instead of after `renderAttributeSync` returns, avoiding a full
  validation pass on every internal prop.
- **Precompile extracted to `precompile.ts`**: `jsxAttr`, `jsxEscape`,
  `jsxTemplate` now live in their own module. No API change.
- **`jsxEscape` deep Promise detection**: A `Promise` nested inside a sub-array
  is now awaited instead of being stringified to `"[object Promise]"`.
- **`WARNED_EVENT_HANDLERS` / `WARNED_TAGS` dedup**: Console warnings for
  function event handlers and invalid tag names are emitted at most once per
  attribute/tag name, not on every render.

### Fixed

- **`isValidAttrName` now rejects `<`**: The attribute-name validation regex
  was missing `<` in its structural-chars list. Added.
- **`REGEX_CAMEL_TO_KEBAB` g flag**: The `g` flag is present on the global
  regex (it was already fixed in v1.5.0; the regression check is preserved).

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
