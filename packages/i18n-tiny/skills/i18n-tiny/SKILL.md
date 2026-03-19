---
name: i18n-tiny
description: Minimalist, type-safe internationalization library. Use this skill to implement and manage translations with strict TypeScript inference.
---

# i18n-tiny Skill

This skill provides a complete guide for an AI to implement, extend, and maintain internationalization using the `@cjean-fr/i18n-tiny` library. This library is centered around **type safety**, **minimalism**, and an adaptable workflow (either spec-first or inference-first).

## Core Concepts

The `@cjean-fr/i18n-tiny` library relies heavily on TypeScript's type system to ensure that translations are complete, parameters are correct, and placeholders exactly match expected variables.

1.  **Specification (`TranslationSpec`)**: A type or object where keys map to an array of the exact parameter names they require.
2.  **Translations**: An object containing the localized strings. Must satisfy the spec (correct keys). Placeholders in the string (like `{name}`) are strictly checked against the spec parameters.
3.  **Translator (`createTranslator`)**: A strongly-typed function that takes a translation key and enforces passing of its required parameters.

## Workflows

You can adopt one of two main workflows: **Spec-First** (recommended for clarity) or **Translation-First** (quickest setup).

### Workflow A: Spec-First (Recommended)

#### 1. Define the Translation Specification

Create a `TranslationSpec` type. Use `readonly ["paramName"]` for parameter lists to allow strong inference.

```typescript
// types/i18n.ts
export type AppTranslationSpec = {
  welcome: readonly ["name"]; // Requires { name }
  "items-count": readonly ["count"]; // Requires { count }
  logout: readonly []; // No parameters
};
```

#### 2. Implement Languages

For strict type-checking of both the keys AND the inline placeholders (`{name}`), it's best to use the `defineTranslations` helper. It catches mismatches immediately.

```typescript
// locales/en.ts
import { defineTranslations } from "@cjean-fr/i18n-tiny";
import type { AppTranslationSpec } from "../types/i18n";

export const en = defineTranslations<AppTranslationSpec>()({
  welcome: "Welcome back, {name}!",
  "items-count": "You have {count} items.",
  logout: "Sign Out",
});

export const fr = defineTranslations<AppTranslationSpec>()({
  welcome: "Bienvenue, {name} !",
  "items-count": "Vous avez {count} articles.",
  logout: "Se déconnecter",
  // ⚠️ If you typed "Bienvenue, {nom} !", TypeScript would throw an error
  // because `{nom}` does not match the `["name"]` spec!
});
```

#### 3. Create the Translator

Use `createTranslator<Spec>(translations)` to create your `t` function.

```typescript
import { createTranslator } from "@cjean-fr/i18n-tiny";
import { en } from "./locales/en";
import type { AppTranslationSpec } from "./types/i18n";

const t = createTranslator<AppTranslationSpec>(en);

// Type-safe usage:
t("welcome", { name: "Alice" }); // "Welcome back, Alice!"
t("logout"); // "Sign Out"
```

### Workflow B: Translation-First (Auto-inference)

If you prefer writing your base localization first and automatically inferring the Spec, use `InferSpec`:

```typescript
import { createTranslator, type InferSpec, defineTranslations } from "@cjean-fr/i18n-tiny";

// 1. Define base language with `as const`
export const enBase = {
  welcome: "Welcome {name}",
  logout: "Logout",
} as const; // <-- Important: as const

// 2. Automatically infer the Specification!
export type AppSpec = InferSpec<typeof enBase>;

// 3. Keep other languages strictly typed based on inferred spec
export const fr = defineTranslations<AppSpec>()({
  welcome: "Bienvenue {name}",
  logout: "Se déconnecter",
});

// 4. Create your translator
const t = createTranslator<AppSpec>(enBase);
```

## Advanced Usage

### React / JSX Support

By default, the translator returns a `string`. You can customize the return type (and allowed parameter type) for React components.

```tsx
import { type Translator } from "@cjean-fr/i18n-tiny";
import type { ReactNode } from "react";

// `tx` will return ReactNode and accept ReactNode as parameter values
const tx: Translator<AppTranslationSpec, ReactNode> = (key, ...args) => {
  return t(key, ...(args as any));
};

// Now you can safely pass JSX elements as parameters!
const element = tx("welcome", {
  name: <strong>Alice</strong>,
});
```

### ICU MessageFormat (Plurals, Gender)

For advanced interpolations like plurals, plug an external custom interpolator via the config.

```typescript
import { createTranslator } from "@cjean-fr/i18n-tiny";
import IntlMessageFormat from "intl-messageformat";

const t = createTranslator<AppTranslationSpec>(translations, {
  locale: "en-US",
  interpolate: (template, params, { locale }) => {
    return new IntlMessageFormat(template, locale).format(params) as string;
  },
});

// Assuming your string is: "{count, plural, =0 {Empty} one {1 item} other {{count} items}}"
t("items-count", { count: 1 }); // "1 item"
```

## Guidelines for AI Agents

- **Types Over Constants**: Defining the spec as a `type Spec = { key: readonly ["param"] }` is currently preferred over creating a runtime object for the spec.
- **Always prioritize `defineTranslations<Spec>()({ ... })`** when implementing translation objects. This is critical because `satisfies ValidTranslations<Spec>` only validates keys uniformly across languages, while `defineTranslations` natively catches inline placeholder typo errors (`{nom}` vs expected `{name}`).
- **Adding Keys**: If the project uses a `TranslationSpec` type, you **must** add any new key directly to the spec type before adding it to localized objects.
- **Interpolators**: `@cjean-fr/i18n-tiny` default string interpolation is basic (`{variable}`). If you encounter a project using ICU features (`plural`, `select`), ensure custom `interpolate` logic via `intl-messageformat` is configured.
