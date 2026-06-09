# @cjean-fr/babel-plugin-precompile

Babel plugin that precompiles lowercase (native HTML) JSX elements into Deno-style `jsxTemplate` tagged template literals.

Same logic as the Vite plugin's TypeScript transformer but for the Babel ecosystem (webpack, tsup via babel-loader, jest, etc.).

## Install

```sh
npm install @cjean-fr/babel-plugin-precompile
# or: bun add, yarn add, pnpm add
```

Requires `@babel/core` >= 7 as a peer dependency.

## Usage

### Via `.babelrc` / `babel.config.json`

```json
{
  "plugins": [
    ["@cjean-fr/babel-plugin-precompile", {
      "runtimeSource": "@cjean-fr/jsx-string/jsx-runtime"
    }]
  ]
}
```

### Via Vite + `@vitejs/plugin-react`

```ts
// vite.config.ts
import precompile from "@cjean-fr/babel-plugin-precompile";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [precompile],
      },
    }),
  ],
});
```

### Via tsup (with `babel-loader`)

```ts
// tsup.config.ts
import precompile from "@cjean-fr/babel-plugin-precompile";
import { defineConfig } from "tsup";

export default defineConfig({
  esbuildPlugins: [{
    name: "babel-precompile",
    setup(build) {
      build.onLoad({ filter: /\.[jt]sx$/ }, async (args) => {
        // apply Babel transform with precompile plugin
      });
    },
  }],
});
```

## API

### `BabelPluginConfig`

```ts
interface BabelPluginConfig {
  runtimeSource?: string;  // default: "@cjean-fr/jsx-string/jsx-runtime"
}
```

### Default export

```ts
import precompile from "@cjean-fr/babel-plugin-precompile";
// precompile is a Babel PluginObj — usable in plugins arrays or programmatic API
```

## How it works

Identical logic to the TS transformer:
- Visits `JSXElement` and `JSXFragment` nodes
- Only transforms lowercase (native HTML) elements
- Skips spread attributes and `dangerouslySetInnerHTML`
- Emits `jsxTemplate\`<div>\${jsxEscape(expr)}\</div>\`` with auto-imported runtime helpers
- Flattens nested static children into the parent template

## Test

```sh
bun test   # 27 tests (core + edge cases + attribute)
```

## License

MIT
