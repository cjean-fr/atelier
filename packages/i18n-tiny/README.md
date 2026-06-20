# @cjean-fr/i18n-tiny

[![CI](https://github.com/cjean-fr/atelier/actions/workflows/ci.yml/badge.svg)](https://github.com/cjean-fr/atelier/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@cjean-fr/i18n-tiny)](https://www.npmjs.com/package/@cjean-fr/i18n-tiny)
[![gzip size](https://img.badgesize.io/https://unpkg.com/@cjean-fr/i18n-tiny/dist/index.js?compression=gzip&label=gzip)](https://unpkg.com/@cjean-fr/i18n-tiny/dist/index.js)

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
import {
  createTranslator,
  createTranslationBuilder,
} from "@cjean-fr/i18n-tiny";

export type AppTranslationSpec = {
  welcome: readonly ["name"]; // Requires 'name'
  notifications: readonly ["count"]; // Requires 'count'
  logout: readonly []; // No parameters
  "user-profile": readonly ["id"]; // Supports dashes in keys
};
```

### 2. Implement Languages

Create a domain-specific builder with `createTranslationBuilder`, then use it to enforce keys AND inline placeholders. This is the **most bulletproof** way to catch typos like `{nom}` instead of `{name}` at compile time.

```typescript
const defineAppLocale = createTranslationBuilder<AppTranslationSpec>();

export const en = defineAppLocale({
  welcome: "Welcome back, {name}!",
  notifications: "You have {count} new messages.",
  logout: "Log out",
  "user-profile": "User profile #{id}",
});

// A typo in a placeholder will trigger a TypeScript error!
// export const fr = defineAppLocale({
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
import {
  type InferSpec,
  createTranslationBuilder,
  createTranslator,
} from "@cjean-fr/i18n-tiny";

// 1. Define base language (must use `as const`)
const baseEn = {
  welcome: "Welcome {name}",
  logout: "Log out",
} as const;

// 2. Infer the Spec automatically
type AppSpec = InferSpec<typeof baseEn>;

// 3. Create a domain builder and keep other languages strictly typed
const defineAppLocale = createTranslationBuilder<AppSpec>();

const fr = defineAppLocale({
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

> ⚠️ The default interpolator **only** replaces simple `{name}` placeholders. Richer ICU constructs such as `{count, plural, ...}` are **passed through unchanged** — wire up a [custom interpolator](#advanced-custom-interpolator-icu-etc) to handle them. A missing parameter leaves its `{placeholder}` in place.

## Advanced: Custom Result Types (JSX, etc.)

By default, the translator returns a `string`. Pass the return type as the second type argument to `createTranslator` to integrate with UI libraries like React — you then also accept that type as a parameter. Supply an `interpolate` that knows how to weave the nodes together (the default one stringifies, which would turn a JSX element into `"[object Object]"`).

```tsx
import { createTranslator } from "@cjean-fr/i18n-tiny";
import type { ReactNode } from "react";

type Spec = { welcome: readonly ["name"] };

// Return ReactNode, and accept ReactNode params — no casts needed.
const tx = createTranslator<Spec, ReactNode>(
  { welcome: "Hello {name}!" },
  {
    interpolate: (template, params) =>
      // split on {placeholders}; odd indices are the captured keys
      template
        .split(/\{(\w+)\}/)
        .map((part, i) => (i % 2 === 0 ? part : params[part])),
  },
);

// Now you can pass JSX elements as parameters!
const element = tx("welcome", { name: <strong>Alice</strong> });
```

## Advanced: Custom Interpolator (ICU, etc.)

By default, the library uses simple regex string replacement, which **does not understand ICU syntax** — `{count, plural, ...}` would be emitted verbatim. To get plurals, gender, etc., plug in a real interpolator like **ICU MessageFormat** by passing an `interpolate` function in the config. The types accept ICU placeholders, so this wiring is required, not optional, when you use them.

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
npx skills add cjean-fr/atelier --skill i18n-tiny
```

## Security

⚠️ **This library does NOT sanitize inputs.**

The `interpolate` function performs simple string replacement. This is deliberate: the output is type-agnostic (plain `string` or a UI node), so escaping belongs to whoever renders it, not here.

- ✅ **With [`@cjean-fr/jsx-string`](https://github.com/cjean-fr/atelier/tree/main/packages/jsx-string)**, translator output passed as a JSX child is HTML-escaped automatically — the safe default. No extra work.
- ⚠️ **Do not** feed the output to `innerHTML` / `dangerouslySetInnerHTML` / `raw()` when parameters contain user-generated content — those bypass escaping. Escape it yourself first (or pass it through jsx-string).

## License

MIT © Christophe Jean

---

<p align="center">Made with ❤️ in Paris</p>
