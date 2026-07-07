import type {
  TranslationSpec,
  ValidTranslations,
  CheckParams,
  TranslatorConfig,
  Translator,
  InterpolateFn,
} from "./spec";

export function interpolate(
  template: string,
  params: Record<string, unknown> = {},
  locale?: string,
): string {
  return template.replace(/\{([\p{L}\p{N}_-]+?)\}/gu, (match, paramName) => {
    const value = params[paramName];
    if (value instanceof Date) return value.toLocaleString(locale);
    return value !== undefined ? String(value) : match;
  });
}

type RequiresInterpolate<T extends string> = string extends T
  ? TranslatorConfig<T>
  : TranslatorConfig<T> & { interpolate: InterpolateFn<T> };

function handleTranslation<T>(
  translations: Record<string, string | undefined>,
  key: string,
  params: Record<string, unknown>,
  config?: TranslatorConfig<T>,
): T {
  const rawTemplate = translations[key];

  if (rawTemplate === undefined && config?.onMissingKey) {
    const fallback = config.onMissingKey(key, config.locale);
    if (fallback !== undefined) return fallback;
  }

  const template: string = rawTemplate ?? key;

  if (config?.interpolate) {
    return config.interpolate(template, params, { locale: config.locale, key });
  }

  // Safe: RequiresInterpolate<T> enforces interpolate for any T narrower than string.
  // When we reach here, T is guaranteed to be exactly string.
  if (Object.keys(params).length === 0) {
    return template as T;
  }

  return interpolate(template, params, config?.locale) as T;
}

export function createTranslator<
  S extends TranslationSpec,
  T extends string = string,
  const V extends ValidTranslations<S> = ValidTranslations<S>,
>(
  translations: V & {
    [K in keyof S]: CheckParams<V[K] & string, S[K][number]>;
  },
  config?: RequiresInterpolate<T>,
): Translator<S, T> {
  const map = translations as Record<string, string | undefined>;
  const cfg = config as TranslatorConfig<T> | undefined;

  return (key: string, ...args: unknown[]) =>
    handleTranslation(
      map,
      key,
      (args[0] ?? {}) as Record<string, unknown>,
      cfg,
    );
}

export function createTypedTranslator<
  S extends TranslationSpec,
  T extends string = string,
>() {
  return <const V extends ValidTranslations<S>>(
    translations: V & {
      [K in keyof S]: CheckParams<V[K] & string, S[K][number]>;
    },
    config?: RequiresInterpolate<T>,
  ): Translator<S, T> =>
    createTranslator(translations, config) as unknown as Translator<S, T>;
}
