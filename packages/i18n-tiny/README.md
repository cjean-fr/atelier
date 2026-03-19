# @cjean-fr/i18n-tiny

**Zero-dependency, type-safe, minimalist internationalization library.**

Provides a simple way to manage translations with **strict TypeScript inference**, ensuring you never miss a translation key or a required parameter.

## Features

- 📦 **Tiny**: Minimal footprint, zero external dependencies.
- 🔒 **Type-Safe**: Autocompletion for keys and validation for required parameters.
- 🚀 **Fast**: Simple string interpolation.
- 🛠 **Flexible**: "Define Spec First" approach.
- 🤖 **AI-Friendly**: Built-in [skill](./skills/i18n-tiny/SKILL.md) for agentic adoption.

## Installation

```bash
bun add @cjean-fr/i18n-tiny
# or
npm install @cjean-fr/i18n-tiny
```

## Usage

### 1. Define your Translation Specification

Define the structure of your translations (Keys -> List of required params). It's recommended to define a `type` with `readonly` arrays.

```typescript
import { createTranslator, defineTranslations } from "@cjean-fr/i18n-tiny";

export type AppTranslationSpec = {
  welcome: readonly ["name"]; // Requires 'name'
  notifications: readonly ["count"]; // Requires 'count'
  logout: readonly []; // No parameters
  "user-profile": readonly ["id"]; // Supports dashes in keys
};
```

### 2. Implement Languages

Use the `defineTranslations` helper to strictly enforce keys AND inline placeholders. This is the **most bulletproof** way to catch typos like `{nom}` instead of `{name}` at compile time.

```typescript
export const en = defineTranslations<AppTranslationSpec>()({
  welcome: "Welcome back, {name}!",
  notifications: "You have {count} new messages.",
  logout: "Log out",
  "user-profile": "User profile #{id}",
});

// A typo in a placeholder will trigger a TypeScript error!
// export const fr = defineTranslations<AppTranslationSpec>()({
//   welcome: "Bienvenue {nom} !", // ❌ Error: Type '"Bienvenue {nom} !"' is not assignable...
//   ...
// });
```

### 3. Create the Translator

```typescript
const t = createTranslator<AppTranslationSpec>(en);

// ✅ Correct usage
console.log(t("welcome", { name: "Alice" })); // "Welcome back, Alice!"
console.log(t("logout")); // "Log out"
```

### Alternative: Auto-Infer The Specification

If you prefer to write your translations first, you can use `InferSpec` to automatically generate the specification from a base language.

```typescript
import { type InferSpec, defineTranslations, createTranslator } from "@cjean-fr/i18n-tiny";

// 1. Define base language (must use `as const`)
const baseEn = {
  welcome: "Welcome {name}",
  logout: "Log out",
} as const; 

// 2. Infer the Spec automatically
type AppSpec = InferSpec<typeof baseEn>;

// 3. Keep other languages strictly typed based on the inferred spec
const fr = defineTranslations<AppSpec>()({
  welcome: "Bienvenue {name}",
  logout: "Se déconnecter",
});

const t = createTranslator<AppSpec>(baseEn);
```

### Interpolation

The library uses a regex-based interpolation. Supported placeholders: `{variable}`, `{user_name}`, `{my-variable}`.

```typescript
import { interpolate } from "@cjean-fr/i18n-tiny";

interpolate("Hello {name}", { name: "Bob" }); // "Hello Bob"
```

## Advanced: Custom Result Types (JSX, etc.)

By default, the translator returns a `string`. You can customize the return type (and allowed parameter types) to integrate with UI libraries like React.

```tsx
import { type Translator } from "@cjean-fr/i18n-tiny";
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

## Advanced: Custom Interpolator (ICU, etc.)

By default, the library uses simple regex string replacement. You can easily plug in a more powerful interpolator like **ICU MessageFormat** (useful for plurals, gender, etc.) by passing an `interpolate` function in the config.

```typescript
import { createTranslator } from "@cjean-fr/i18n-tiny";
import IntlMessageFormat from "intl-messageformat";

const translations = {
  cart: "{count, plural, =0 {No items} one {1 item} other {{count} items}} in your cart.",
} as const;

type Spec = {
  cart: readonly ["count"];
};

const t = createTranslator<Spec>(translations, {
  locale: "en-US",
  interpolate: (template, params, { locale }) => {
    return new IntlMessageFormat(template, locale).format(params) as string;
  },
});

console.log(t("cart", { count: 1 })); // "1 item in your cart."
```

## AI-Friendly

`@cjean-fr/i18n-tiny` is designed with AI-first development in mind. The strict Type-safety and **Spec-First** approach make it easy for AI agents to write correct translations.

It includes a dedicated **Skill** that agents can consume to learn how to use the library optimally.

```bash
npx skills add @cjean-fr/i18n-tiny
```

## Security

⚠️ **This library does NOT sanitize inputs.**

The `interpolate` function performs simple string replacement. **Do not** use the output directly in HTML (e.g., `innerHTML`) if parameters contain user-generated content.

## License

MIT © Christophe Jean

---

<p align="center">Made with ❤️ in Paris</p>
