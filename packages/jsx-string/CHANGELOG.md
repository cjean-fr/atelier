# Changelog

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
