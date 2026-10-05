export type TranslationSpec = {
  [key: string]: readonly string[];
};

export type ValidTranslations<T extends TranslationSpec> = {
  readonly [K in keyof T]: string;
};

type NameRead<
  S extends string,
  Name extends string = "",
> = S extends `${infer C}${infer Rest}`
  ? C extends "}" | ","
    ? { name: Name; term: C; rest: Rest }
    : C extends "{"
      ? { name: Name; term: "open"; rest: S }
      : C extends " " | "\n" | "\r" | "\t" | "#"
        ? { name: Name; term: "x"; rest: S }
        : NameRead<Rest, `${Name}${C}`>
  : { name: Name; term: "eof"; rest: "" };

type Even<L extends 0[]> = L extends []
  ? true
  : L extends [0, 0, ...infer R extends 0[]]
    ? Even<R>
    : false;

/** Close groups before the next opening brace, skipping literal text in one step. */
type CloseGroups<
  S extends string,
  Depth extends 0[],
> = S extends `${string}}${infer Rest}`
  ? CloseGroups<Rest, Depth extends [0, ...infer Tail] ? Tail : []>
  : Depth;

/**
 * Extract simple and ICU parameter names. Jump between opening braces so long
 * prose does not consume TypeScript's recursion budget character by character.
 * ICU branch bodies sit at odd depth; placeholders inside them sit at even depth.
 */
export type ExtractParams<
  S extends string,
  Acc extends string = never,
  Depth extends 0[] = [],
> = S extends `${infer Text}{${infer Rest}`
  ? FromGroup<Rest, Acc, CloseGroups<Text, Depth>>
  : Acc;

type FromGroup<S extends string, Acc extends string, Depth extends 0[]> =
  NameRead<S> extends {
    name: infer N extends string;
    term: infer T;
    rest: infer R extends string;
  }
    ? T extends ","
      ? ExtractParams<R, N extends "" ? Acc : Acc | N, [...Depth, 0]>
      : T extends "open" | "x"
        ? ExtractParams<R, Acc, [...Depth, 0]>
        : T extends "}"
          ? ExtractParams<
              R,
              Even<Depth> extends true ? (N extends "" ? Acc : Acc | N) : Acc,
              Depth
            >
          : Acc
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
  : [ExtractParams<S>] extends [Allowed]
    ? [Allowed] extends [ExtractParams<S>]
      ? unknown
      : {
          error: "Missing placeholder";
          expected: Allowed;
          missing: Exclude<Allowed, ExtractParams<S>>;
        }
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
