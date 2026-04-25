# @cjean-fr/eslint-plugin-jsx-string

ESLint plugin for `@cjean-fr/jsx-string` to ensure compatibility with static rendering.

## Installation

```bash
bun add -D @cjean-fr/eslint-plugin-jsx-string
# or
npm install --save-dev @cjean-fr/eslint-plugin-jsx-string
```

## Usage (Flat Config)

Add the plugin to your `eslint.config.js`:

```javascript
import jsxString from "@cjean-fr/eslint-plugin-jsx-string";

export default [
  jsxString.configs.recommended,
  {
    rules: {
      // You can override rules if needed
      "@cjean-fr/jsx-string/no-unsafe-event-handlers": "warn",
    },
  },
];
```

## Rules

| Rule                       | Description                                                | Default |
| -------------------------- | ---------------------------------------------------------- | ------- |
| `no-react-imports`         | Disallow React and React-DOM imports.                      | `error` |
| `no-react-hooks`           | Disallow React hooks usage (useState, useEffect, etc).     | `error` |
| `no-unsafe-event-handlers` | Warn about event handlers which might be unsafely handled. | `warn`  |
| `no-javascript-urls`       | Disallow `javascript:` URLs in href attributes.            | `error` |
| `no-context`               | Disallow React Context usage.                              | `error` |
| `no-refs`                  | Disallow React refs usage.                                 | `error` |

## License

MIT © Christophe Jean

---

<p align="center">Made with ❤️ in Paris</p>
