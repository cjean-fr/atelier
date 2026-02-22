# @cjean-fr/i18n-tiny

**Zero-dependency, type-safe, minimalist internationalization library.**

Provides a simple way to manage translations with **strict TypeScript inference**, ensuring you never miss a translation key or a required parameter.

## Features

- 📦 **Tiny**: Minimal footprint, zero external dependencies.
- 🔒 **Type-Safe**: Autocompletion for keys and validation for required parameters.
- 🚀 **Fast**: Simple string interpolation.
- 🛠 **Flexible**: "Define Spec First" approach.

## Installation

```bash
bun add @cjean/i18n-tiny
# or
npm install @cjean/i18n-tiny
```

## Usage

### 1. Define your Translation Specification

Define the structure of your translations (Keys -> List of required params).

```typescript
import { createTranslator, type ValidTranslations } from "@cjean/i18n-tiny";

type AppTranslationSpec = {
  welcome: readonly ["name"]; // Requires 'name'
  notifications: readonly ["count"]; // Requires 'count'
  logout: readonly []; // No parameters
  "user-profile": readonly ["id"]; // Supports dashes in keys
};
```

### 2. Implement a Language

Create a translation object that satisfies your specification.

```typescript
const enParams = {
  welcome: "Welcome back, {name}!",
  notifications: "You have {count} new messages.",
  logout: "Log out",
  "user-profile": "User profile #{id}",
} satisfies ValidTranslations<AppTranslationSpec>;
```

### 3. Create the Translator

```typescript
const t = createTranslator<AppTranslationSpec>(enParams);

// ✅ Correct usage
console.log(t("welcome", { name: "Alice" })); // "Welcome back, Alice!"
console.log(t("logout")); // "Log out"
```

### Interpolation

The library uses a regex-based interpolation. Supported placeholders: `{variable}`, `{user_name}`, `{my-variable}`.

```typescript
import { interpolate } from "@cjean/i18n-tiny";

interpolate("Hello {name}", { name: "Bob" }); // "Hello Bob"
```

## Advanced: Custom Result Types (JSX, etc.)

By default, the translator returns a `string`. You can customize the return type (and allowed parameter types) to integrate with UI libraries like React.

```tsx
import { type Translator } from "@cjean/i18n-tiny";
import type { ReactNode } from "react";

// Define tx returning ReactNode and accepting ReactNode as parameters
const tx: Translator<AppTranslationSpec, ReactNode> = (key, ...args) => {
  return t(key, ...(args as any));
};

// Now you can pass JSX elements as parameters!
const element = tx("welcome", {
  name: <strong>Alice</strong>,
});
```

## Security

⚠️ **This library does NOT sanitize inputs.**

The `interpolate` function performs simple string replacement. **Do not** use the output directly in HTML (e.g., `innerHTML`) if parameters contain user-generated content.

## License

MIT © Christophe Jean

---

<p align="center">Made with ❤️ in Paris</p>
