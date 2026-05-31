# Christophe Jean - Atelier

Personal monorepo of high-performance, type-safe tools built around JSX-to-HTML rendering.

## Packages

### `jsx-string` stack

| Package | Description |
| :--- | :--- |
| [`@cjean-fr/jsx-string`](./packages/jsx-string) | JSX-to-HTML string renderer. Zero dependencies. |
| [`@cjean-fr/jsx-flow`](./packages/jsx-flow) | Orchestration layer for deferred fragments and DOM patching (`<Deferred>`, `<Patch>`, Turbo / HTMX / Native adapters). |
| [`@cjean-fr/jsx-vite`](./packages/jsx-vite) | Vite asset integration — `<Asset>`, `assetUrl`, manifest resolution. |
| [`@cjean-fr/build-core`](./packages/build-core) | SSG kernel shared by site builders: filesystem routing, markdown, TOC, sitemap, RSS, git last-modified, search adapters, CLI. |
| [`@cjean-fr/docs`](./packages/docs) | Documentation site builder on top of the jsx-string stack. |

### Other tools

| Package | Description |
| :--- | :--- |
| [`@cjean-fr/eslint-plugin-jsx-string`](./packages/eslint-plugin-jsx-string) | ESLint rules for safe jsx-string usage. |
| [`@cjean-fr/i18n-tiny`](./packages/i18n-tiny) | Zero-dependency, type-safe minimalist i18n. |
| [`jsonresume-theme-cjean`](./packages/jsonresume-theme-cjean) | Clean, print-optimized JSON Resume theme (Tailwind + TypeScript). |

### Apps (internal)

| App | Description |
| :--- | :--- |
| [`jsx-string-doc`](./apps/jsx-string-doc) | Documentation site for `@cjean-fr/jsx-string` — end-to-end consumer of the stack. |

## Development

Managed with **Bun workspaces** and **Turbo**.

```bash
bun install
bun run build    # Build all packages
bun run test     # Run all tests
bun run check    # Type-check everything
```

## License

MIT © Christophe Jean
