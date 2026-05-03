# Christophe Jean - Atelier

Personal collection of high-performance, type-safe tools and themes.

## Packages

### `jsx-string` Ecosystem

| Package                                                                     | Description                                                 |
| :-------------------------------------------------------------------------- | :---------------------------------------------------------- |
| [`@cjean-fr/jsx-string`](./packages/jsx-string)                             | High-performance, secure JSX-to-HTML string renderer.       |
| [`@cjean-fr/jsx-string-island`](./packages/jsx-string-island)                 | Async streaming and defer plugin for jsx-string.            |
| [`@cjean-fr/eslint-plugin-jsx-string`](./packages/eslint-plugin-jsx-string) | ESLint rules for secure and valid jsx-string usage.         |

### Other Tools

| Package                                                       | Description                                 |
| :------------------------------------------------------------ | :------------------------------------------ |
| [`@cjean-fr/i18n-tiny`](./packages/i18n-tiny)                 | Zero-dependency, type-safe minimalist i18n. |
| [`jsonresume-theme-cjean`](./packages/jsonresume-theme-cjean) | Modern, print-optimized JSON Resume theme.  |

## Development

This is a monorepo managed with **Bun** and **Turbo**.

```bash
bun install
bun run build    # Build all packages
bun run test     # Run all tests
bun run check    # Type-check everything
```

## License

MIT © Christophe Jean
