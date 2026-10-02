# Christophe Jean - Atelier

Personal monorepo of high-performance, type-safe tools built around JSX-to-HTML rendering.

## Packages

`@cjean-fr/jsx-string`, `@cjean-fr/eslint-plugin-jsx-string`, and `@cjean-fr/vite-plugin-precompile` are deprecated in favor of [Vincle](https://github.com/cjean-fr/vincle). Their replacements are `@vincle/core`, `@vincle/eslint-plugin`, and `@vincle/precompile/vite`, respectively.

### `jsx-string` stack

| Package                                         | Description                                                          |
| :---------------------------------------------- | :------------------------------------------------------------------- |
| [`@cjean-fr/jsx-string`](./packages/jsx-string) | JSX-to-HTML string renderer. Zero dependencies.                      |
| [`@cjean-fr/jsx-vite`](./packages/jsx-vite)     | Vite asset integration — `<Asset>`, `assetUrl`, manifest resolution. |

### Other tools

| Package                                                                     | Description                                                             |
| :-------------------------------------------------------------------------- | :---------------------------------------------------------------------- |
| [`@cjean-fr/eslint-plugin-jsx-string`](./packages/eslint-plugin-jsx-string) | ESLint rules for safe jsx-string usage.                                 |
| [`@cjean-fr/i18n-tiny`](./packages/i18n-tiny)                               | Zero-dependency, type-safe minimalist i18n.                             |
| [`@cjean-fr/precompile-core`](./packages/precompile-core)                   | JSX precompilation shared by build integrations.                        |
| [`@cjean-fr/vite-plugin-precompile`](./packages/vite-plugin-precompile)     | Vite plugin for JSX precompilation.                                     |
| [`jsonresume-theme-cjean`](./packages/jsonresume-theme-cjean)               | Clean, print-optimized JSON Resume theme (Tailwind + TypeScript + JSX). |

## Development

Managed with **Bun workspaces** and **Turbo**.

```bash
bun install
bun run build    # Build all packages
bun run test     # Run all tests (unit + fuzz/property-based)
bun run check    # Type-check everything
```

Security-sensitive modules are reinforced with **property-based (fuzz) testing** via `fast-check` — thousands of adversarial inputs (control chars, astral codepoints, scheme obfuscations) are generated per run to verify XSS invariants hold for every possible input, not just hand-picked examples.

## License

MIT © Christophe Jean
