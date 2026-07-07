export type TranslationSpec = {
  [key: string]: readonly string[];
};

export type ValidTranslations<T extends TranslationSpec> = {
  readonly [K in keyof T]: string;
};

type CleanKey<K extends string> = K extends `${infer Name},${string}`
  ? Name
  : K extends "#"
    ? never
    : K;

export type ExtractParams<
  S extends string,
  Acc extends string = never,
> = S extends `${string}{${infer P}}${infer Rest}`
  ? ExtractParams<Rest, Acc | CleanKey<P>>
  : Acc;

export type InferSpec<T> = {
  readonly [K in keyof T]: T[K] extends string
    ? readonly ExtractParams<T[K]>[]
    : never;
};

export type CheckParams<
  S extends string,
  Allowed extends string,
> = string extends S
  ? unknown
  : ExtractParams<S> extends Allowed
    ? unknown
    : {
        error: "Invalid placeholder";
        expected: Allowed;
        found: Exclude<ExtractParams<S>, Allowed>;
      };

export type InterpolateFn<T = string> = (
  template: string,
  params: Record<string, unknown>,
  context: { locale?: string; key: string },
) => T;

export type TranslatorConfig<T = string> = {
  locale?: string;
  interpolate?: InterpolateFn<T>;
  onMissingKey?: (key: string, locale?: string) => T | void;
};

type KeyParams<S extends TranslationSpec, K extends keyof S, T = string> = [
  S[K][number],
] extends [never]
  ? []
  : [params: Record<S[K][number], string | number | Date | T>];

export type Translator<S extends TranslationSpec, T = string> = {
  <K extends keyof S & string>(key: K, ...args: KeyParams<S, K, T>): T;
};
