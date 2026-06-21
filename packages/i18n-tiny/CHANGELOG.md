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

## 1.1.0

### Minor Changes

- replace `defineTranslations` by `createTranslationBuilder` to prevent double invocation
- add SKILL for AI agents
