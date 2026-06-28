# @cjean-fr/i18n-tiny

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

## 1.1.0

### Minor Changes

- replace `defineTranslations` by `createTranslationBuilder` to prevent double invocation
- add SKILL for AI agents
