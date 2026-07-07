# @cjean-fr/i18n-tiny

## 2.0.0

### Added

- **`createTypedTranslator<Spec>()`**: Merges builder + translator in one
  call. Replaces `createTranslationBuilder` with a simpler API.
  (Renamed from `createDomainTranslator` during RC to avoid domain bruit.)
- **Unicode support in `interpolate()`**: Regex now uses `\p{L}\p{N}` with the
  `u` flag, supporting accented parameter names like `{prénom}` and `{nombre}`.
- **Locale propagation for Date formatting**: `interpolate()` accepts an
   optional `locale` parameter, and `createTranslator` / `createTypedTranslator`
  pass `config.locale` through — `Date` values are now formatted in the correct
  locale instead of the OS default.
- **Edge case tests for `interpolate()`**: Covers `null`, `undefined`, `0`,
  empty string `""`, and `false` — ensuring falsy-yet-defined values are
  correctly stringified and `undefined` leaves placeholders intact.

### Changed

- **`createTranslator` generic `T` constrained to `string`**: The return type
  parameter `T` now requires `T extends string`, eliminating unsafe `as unknown
  as T` casts in the default interpolation path. Custom return types must extend
  `string` (use a branded string type). Non-string return types still work via
  `config.interpolate`.
- **`KeyParams` type narrowed**: Removed `boolean` from accepted placeholder
  value types — YAGNI: no realistic translation requires a `boolean` literal as
  a placeholder.
- **`CheckParams` error type now includes `expected`**: The constraint error
  shows both `expected` and `found` placeholder names, making compiler errors
  self-documenting.
- **`InterpolateFn.params` tightened to `unknown`** (from `any`). Custom
  interpolators now require explicit narrowing.
- **`onMissingKey` returns safely**: If the callback returns `undefined`, the
  fallback-to-key behaviour is preserved instead of returning `undefined`.
- **`Translator` key constraint narrowed to `keyof S & string`** — eliminates
  the `as string` casts in the implementation body. No user-facing impact.
- **Architecture separation**: `src/index.ts` organised into three clearly
  delimited sections (`Domain Types`, `Infrastructure Types`, `Runtime`) with
  comment markers, clarifying the layer boundaries without splitting files.

### Removed

- **`createTranslationBuilder` removed**: Replaced by `createTypedTranslator`.
   Migration: replace `const b = createTranslationBuilder<Spec>(); b({...})` with
   `createTypedTranslator<Spec>()({...})`.

## 1.3.0

### Added

- **`onMissingKey` callback** in `TranslatorConfig` — intercept missing keys
  at runtime to log, report to Sentry, or return a fallback string. The
  existing fallback-to-key behaviour remains the default.
- **Date formatting** in `interpolate()` — `Date` values are now formatted via
  `toLocaleString()` instead of `String()`.

### Changed

- **`InterpolateFn` params type tightened** from `Record<string, any>` to
  `Record<string, unknown>`. Custom interpolators now benefit from type-safe
  param access — access without narrowing is preserved, but the value type is
  `unknown` instead of `any`.
- **`CleanKey` now filters the ICU sigil `#`** so `ExtractParams` no
  longer produces spurious param name `"#"` from ICU plurals.

## 1.2.0

### Added

- **`createTranslationBuilder<Spec>()`**: New builder helper that returns a
  domain-specific translation function directly, eliminating the double
  invocation pattern of `defineTranslations<Spec>()({...})`.
- **`ExtractParams` tail-recursive accumulator**: Prevents `TS2589` (type
  instantiation exceeds limit) on templates with 50+ placeholders.
- **ICU passthrough doc + custom interpolator test**: The default interpolator
  passes ICU `{count, plural, ...}` constructs through unchanged; documented
  prominently in README. A custom ICU test validates the `interpolate` config.

### Changed

- **README overhaul**: Added CI/npm/gzip badges, full API examples for
  `createTranslationBuilder`, custom result types (JSX nodes), custom
  interpolator, and a dedicated Security section.
- **SKILL.md updated**: Reflects new `createTranslationBuilder` API and
  spec-first workflow guidance.

## 1.1.0

### Minor Changes

- replace `defineTranslations` by `createTranslationBuilder` to prevent double invocation
- add SKILL for AI agents
