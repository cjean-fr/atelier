# Changelog

## 1.4.2

### Fixed

- **CSS camelCase conversion**: `REGEX_CAMEL_TO_KEBAB` was missing the `g` flag, causing multi-capital CSS property names (e.g. `borderTopColor`, `borderTopLeftRadius`) to be silently corrupted. Single-capital properties (e.g. `marginTop`, `zIndex`) were unaffected.
- **Tag name injection**: `renderElement` now validates tag names via a dedicated `isValidTagName` check. Invalid names (containing spaces, angle brackets, or starting with a digit) are skipped with a warning instead of being written verbatim into the HTML output.
- **`isRawString` parameter type**: Changed from `any` to `unknown` for stricter type safety.

### Changed

- **`RawString` — removed `__isRawString` duck-typing**: The `__isRawString` public property and its fallback check in `isRawString()` have been removed. Trusted HTML detection now relies solely on `instanceof RawString`. This removes a spoofable escape hatch from the security boundary.
- **`context<T>()` — token backed by `Symbol`**: Context tokens are now created with `Symbol()` instead of `Object.create(null)`. Both use reference identity as Map keys with identical performance; `Symbol` is semantically correct for an opaque, unique, non-forgeable identifier.
- **`resolveNestedPromises` — single-pass**: Merged the former `hasNestedPromise` detection pass into `resolveNestedPromises`. The function now returns the original value synchronously when no promises are found, and a resolved `Promise<unknown>` otherwise. Removes one full tree traversal on the async path.
- **`data-*` / `aria-*` camelCase conversion removed**: Attribute names starting with `data-` or `aria-` are now passed through verbatim like all other unknown attributes. The conversion was unused in practice (JSX authors write `data-foo-bar` directly) and inconsistent with how React handles these attributes.

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
