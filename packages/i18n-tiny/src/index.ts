/**
 * Specification of translation keys and their required parameters.
 * Keys map to an array of parameter names.
 *
 * @example
 * type Spec = {
 *   hello: readonly ["name"]; // Requires { name: string }
 *   goodbye: readonly [];     // No params
 * };
 */
export type TranslationSpec = {
  [key: string]: readonly string[]; // liste des noms de paramètres requis
};

/**
 * Ensures that the implementation matches the specification.
 *
 * @example
 * const en = {
 *   hello: "Hello {name}!",
 *   goodbye: "Goodbye",
 * } satisfies ValidTranslations<Spec>;
 */
export type ValidTranslations<T extends TranslationSpec> = {
  readonly [K in keyof T]: string;
};

/**
 * Tente d'isoler le nom de la variable avant un séparateur (virgule/espace).
 * Si la logique devient instable, privilégier un retour simple du segment complet.
 */
type CleanKey<K extends string> = K extends `${infer Name}${"," | " "}${string}`
  ? Name
  : K;

/**
 * Extrait récursivement les noms de paramètres (ex: {name}) d'une string.
 * Supporte les formats ICU simples (ex: {v, plural, ...}) en extrayant "v".
 *
 * @example
 * type Params = ExtractParams<"Hello {name}!">;
 * // Params est de type "name"
 */
export type ExtractParams<S extends string> =
  S extends `${string}{${infer P}}${infer Rest}`
    ? CleanKey<P> | ExtractParams<Rest>
    : never;

/**
 * Génère automatiquement une TranslationSpec à partir d'un objet de traduction.
 *
 * @example
 * const spec = inferSpec({ hello: "Hello {name}!" });
 * // spec est de type { readonly hello: readonly ["name"]; }
 */
export type InferSpec<T> = {
  readonly [K in keyof T]: T[K] extends string
    ? readonly ExtractParams<T[K]>[]
    : never;
};

/**
 * Validates that a literal string only contains allowed placeholders.
 * Returns unknown if valid or if not a literal string.
 * Returns an error object if invalid placeholders are found.
 */
type CheckParams<S extends string, Allowed extends string> = string extends S
  ? unknown
  : ExtractParams<S> extends Allowed
    ? unknown
    : {
        error: "Invalid placeholder";
        found: Exclude<ExtractParams<S>, Allowed>;
      };

// Le type de retour T permet de supporter JSX, SafeString ou string
export type InterpolateFn<T = string> = (
  template: string,
  params: Record<string, any>,
  context: { locale?: string; key: string },
) => T;

export type TranslatorConfig<T = string> = {
  locale?: string;
  interpolate?: InterpolateFn<T>;
};

/**
 * A strongly-typed translator function.
 *
 * @template S - The TranslationSpec defining keys and params.
 * @template T - The return type (defaults to string). Also allows T as a parameter type.
 */
export type Translator<S extends TranslationSpec, T = string> = {
  <K extends keyof S>(
    key: K,
    ...args: [S[K][number]] extends [never]
      ? []
      : [params: Record<S[K][number], string | number | boolean | Date | T>]
  ): T;
};

/**
 * Replaces placeholders in a template string with values.
 *
 * @param template - The string with placeholders (e.g. "Hello {name}")
 * @param params - The values to inject (e.g. { name: "Alice" })
 * @returns The interpolated string.
 */
export function interpolate(
  template: string,
  params: Record<string, any> = {},
): string {
  return template.replace(/\{([\w-]+?)\}/g, (match, paramName) => {
    const value = params[paramName];
    return value !== undefined ? String(value) : match;
  });
}

/**
 * Creates a type-safe translator function.
 *
 * @param translations - The dictionary of translation strings.
 * @param config - Optional configuration for custom interpolation and locale.
 * @returns A translator function that enforces correct keys and params.
 *
 * @example
 * const spec = { hello: ["name"] } as const;
 * const t = createTranslator<typeof spec>({ hello: "Hello {name}" });
 * t("hello", { name: "World" }); // => "Hello World"
 */
export function createTranslator<
  S extends TranslationSpec,
  T = string,
  const V extends ValidTranslations<S> = ValidTranslations<S>,
>(
  translations: V & {
    [K in keyof S]: CheckParams<V[K] & string, S[K][number]>;
  },
  config?: TranslatorConfig<T>,
): Translator<S, T> {
  return (key, ...args) => {
    const template = translations[key as string] ?? (key as string);
    const params = (args[0] as Record<string, any>) || {};
    const context = { locale: config?.locale, key: key as string };

    if (config?.interpolate) {
      return config.interpolate(template, params, context);
    }

    // Si aucun paramètre n'est passé, on retourne le template brut (casté en T)
    if (args.length === 0) {
      return template as unknown as T;
    }

    return interpolate(template, params) as unknown as T;
  };
}

/**
 * Helper to define translations with strict placeholder validation.
 * Use this to catch errors at the definition point.
 */
export function defineTranslations<S extends TranslationSpec>(): <
  const V extends ValidTranslations<S>,
>(
  translations: V & {
    [K in keyof S]: CheckParams<V[K] & string, S[K][number]>;
  },
) => V {
  return (translations) => translations;
}
