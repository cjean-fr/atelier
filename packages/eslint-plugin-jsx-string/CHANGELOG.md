# Changelog

## 0.1.1

### Fixed

- **`no-react-hooks`**: Changed from a generic `use*` prefix check to an
  explicit set of 17 React hooks. Non-React `use*` identifiers (like
  `useContext` from jsx-string) are no longer flagged.
- **`no-context`**: `.Provider` detection now tracks the variable the context
  was assigned to; `<Foo.Provider />` is only flagged when `Foo` was created
  by `createContext()` or `React.createContext()`.
- **`no-unsafe-event-handlers`**: Regex expanded from `/^on[A-Z]/` to
  `/^on[A-Za-z]/` — lowercase event names like `onmouseover` are now caught.
- **Added `engines` field** to package.json.

### Changed

- **ESM port**: All imports now use `.js` extensions for strict ESM compliance.

### Added

- **Full test suite**: Added `index.test.ts` (plugin structure + recommended
  config) plus per-rule tests (`no-react-imports`, `no-react-hooks`,
  `no-context`, `no-refs`, `no-unsafe-event-handlers`, `no-javascript-urls`),
  moved from the old `tests/` directory into `src/rules/`.

## 0.1.0

### Added

- **Initial Release**: Basic rules to ensure compatibility with `@cjean-fr/jsx-string`.
  - `no-react-imports`: Disallow React and React-DOM imports.
  - `no-react-hooks`: Disallow React hooks usage.
  - `no-unsafe-event-handlers`: Warn about event handlers.
  - `no-javascript-urls`: Disallow `javascript:` URLs.
  - `no-context`: Disallow React Context usage.
  - `no-refs`: Disallow React refs usage.
- **Recommended Config**: Pre-configured rule set for easy setup.
