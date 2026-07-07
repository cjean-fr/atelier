# @cjean-fr/i18n-tiny

[![CI](https://github.com/cjean-fr/atelier/actions/workflows/ci.yml/badge.svg)](https://github.com/cjean-fr/atelier/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@cjean-fr/i18n-tiny)](https://www.npmjs.com/package/@cjean-fr/i18n-tiny)
[![gzip size](https://img.badgesize.io/https://unpkg.com/@cjean-fr/i18n-tiny/dist/index.js?compression=gzip&label=gzip)](https://unpkg.com/@cjean-fr/i18n-tiny/dist/index.js)

**Zero-dependency, type-safe, minimalist internationalization for TypeScript.**

Define your translation contract once. Get autocomplete for keys and a compile-time error when a placeholder is misspelled.

```typescript
import { createTypedTranslator } from "@cjean-fr/i18n-tiny";

type AppSpec = {
  welcome: readonly ["name"];
  logout: readonly [];
};

const t = createTypedTranslator<AppSpec>()({
  welcome: "Welcome back, {name}!",
  logout: "Log out",
}, { locale: "en" });

t("welcome", { name: "Alice" }); // "Welcome back, Alice!"
t("logout");                     // "Log out"

// ❌ Typo in placeholder → TypeScript error at compile time
// const t2 = createTypedTranslator<AppSpec>()({
//   welcome: "Bienvenue {nom} !", // Error: Type '"nom"' is not assignable to '"name"'
//   logout: "Déconnexion",
// });
```

## Installation

```bash
npm install @cjean-fr/i18n-tiny
# or
bun add @cjean-fr/i18n-tiny
```

## Features

- **Zero-dependency**: ~350 bytes gzip — see badge above.
- **Type-safe**: Autocomplete keys, validate every `{placeholder}` at compile time.
- **Spec-First**: Define your translation contract once. Guarantee every locale implements it.

## Usage

Pick the method that fits your workflow:

| Method | Best for |
|---|---|
| `createTypedTranslator` | Single locale, translations co-located. Catches typos in one shot. |
| `createTranslator` | Multi-locale. Separate files per language, cross-validated against the same spec. |
| `InferSpec` | Prototyping / migrating existing JSON. Derives the spec automatically. |

### Spec-First with `createTypedTranslator`

Define the spec as a type. Pass translations inline — TypeScript validates every `{placeholder}` against it.

```typescript
import { createTypedTranslator } from "@cjean-fr/i18n-tiny";

type AppTranslationSpec = {
  welcome: readonly ["name"];
  notifications: readonly ["count"];
  logout: readonly [];
  "user-profile": readonly ["id"];
};

const t = createTypedTranslator<AppTranslationSpec>()({
  welcome: "Welcome back, {name}!",
  notifications: "You have {count} new messages.",
  logout: "Log out",
  "user-profile": "User profile #{id}",
}, { locale: "en" });

t("welcome", { name: "Alice" }); // "Welcome back, Alice!"
t("logout");                     // "Log out"
```

### Multi-Locale with `createTranslator`

Keep translations in separate files. Validate each locale against the same spec with `satisfies ValidTranslations`.

```typescript
import { createTranslator, type ValidTranslations } from "@cjean-fr/i18n-tiny";

const en = {
  welcome: "Welcome back, {name}!",
  notifications: "You have {count} new messages.",
  logout: "Log out",
  "user-profile": "User profile #{id}",
} satisfies ValidTranslations<AppTranslationSpec>;

const t = createTranslator<AppTranslationSpec>(en);
```

### Prototyping with `InferSpec`

Derive the spec automatically from your source translation. Great for rapid prototyping or migrating existing JSON. Promote to an explicit `type Spec` once stable.

```typescript
import {
  type InferSpec,
  createTypedTranslator,
} from "@cjean-fr/i18n-tiny";

const baseEn = {
  welcome: "Welcome {name}",
  logout: "Log out",
} as const;

type AppSpec = InferSpec<typeof baseEn>;

const t = createTypedTranslator<AppSpec>()(baseEn);
```

> **Note**: `InferSpec` validates placeholders against the inferred spec but cannot catch a missing placeholder in the source language itself. The explicit Spec-First approach is safer for production.

### Interpolation

Simple string replacement for `{variable}`, `{user_name}`, `{my-variable}` placeholders.

```typescript
import { interpolate } from "@cjean-fr/i18n-tiny";

interpolate("Hello {name}", { name: "Bob" }); // "Hello Bob"
```

## Advanced

### Custom Result Types (JSX, etc.)

Pass a generic return type and supply a custom `interpolate` function that returns nodes instead of strings.

```tsx
import { createTranslator } from "@cjean-fr/i18n-tiny";
import type { ReactNode } from "react";

type Spec = { welcome: readonly ["name"] };

const tx = createTranslator<Spec, ReactNode>(
  { welcome: "Hello {name}!" },
  {
    interpolate: (template, params) =>
      template
        .split(/\{(\w+)\}/)
        .map((part, i) => (i % 2 === 0 ? part : params[part])),
  },
);

const element = tx("welcome", { name: <strong>Alice</strong> });
```

### Custom Interpolator (ICU, etc.)

The default interpolator does not understand ICU syntax. Pass your own `interpolate` function to handle it.

```typescript
import { createTranslator } from "@cjean-fr/i18n-tiny";
import IntlMessageFormat from "intl-messageformat";

const translations = {
  cart: "{count, plural, =0 {No items} one {1 item} other {{count} items}} in your cart.",
} as const;

type Spec = { cart: readonly ["count"] };

const t = createTranslator<Spec>(translations, {
  locale: "en-US",
  interpolate: (template, params, { locale }) => {
    return new IntlMessageFormat(template, locale).format(params) as string;
  },
});

t("cart", { count: 1 }); // "1 item in your cart."
```

## Gotchas

- **ICU is not built in.** The default interpolator handles `{name}` only. ICU constructs like `{count, plural, ...}` pass through unchanged — wire up a [custom interpolator](#custom-interpolator-icu-etc).
- **Missing parameters** leave their `{placeholder}` in the output rather than throwing.

## AI-Friendly

Includes a [skill](./skills/i18n-tiny/SKILL.md) for agentic adoption.
`npx skills add cjean-fr/atelier --skill i18n-tiny`

## Security

This library does not sanitize inputs. The interpolator performs string replacement only — escaping belongs to the render layer.

## License

MIT © Christophe Jean
