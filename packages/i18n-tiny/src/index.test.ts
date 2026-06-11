import {
  createTranslator,
  createTranslationBuilder,
  interpolate,
  type ValidTranslations,
  type TranslatorConfig,
  type InferSpec,
  type ExtractParams,
} from "./index";
import { describe, it, expect, mock } from "bun:test";

type UserSpec = {
  welcome: readonly ["name", "age"];
  goodbye: readonly [];
  "kebab-case-key": readonly ["user-name"];
  complex: readonly ["a", "b"];
  plural: readonly ["count"];
};

const validEnglish = {
  welcome: "Welcome {name}, you are {age} years old",
  goodbye: "Goodbye",
  "kebab-case-key": "Hello {user-name}",
  complex: "{a} and {b}",
  plural: "You have {count, plural, one {one item} other {# items}}",
} satisfies ValidTranslations<UserSpec>;

describe("translation system", () => {
  it("should create a valid translator and interpolate values", () => {
    const t = createTranslator<UserSpec>(validEnglish);

    expect(t("welcome", { name: "Alice", age: 25 })).toBe(
      "Welcome Alice, you are 25 years old",
    );
    expect(t("goodbye")).toBe("Goodbye");
  });

  it("should support dashes in variable names (kebab-case)", () => {
    const t = createTranslator<UserSpec>(validEnglish);
    expect(t("kebab-case-key", { "user-name": "Charlie" })).toBe(
      "Hello Charlie",
    );
  });

  it("should support ICU-like param extraction (static check mostly)", () => {
    const t = createTranslator<UserSpec>(validEnglish);
    // Explicitly checking that 'count' is accepted as a number
    expect(t("plural", { count: 5 })).toBe(
      "You have {count, plural, one {one item} other {# items}}",
    );
  });

  it("should use custom interpolator if provided", () => {
    const customInterpolate = mock(
      (template, params) => `Custom: ${template} (${JSON.stringify(params)})`,
    );
    const config: TranslatorConfig = {
      interpolate: customInterpolate,
    };

    const t = createTranslator<UserSpec>(validEnglish, config);
    const result = t("welcome", { name: "Bob", age: 30 });

    expect(result).toBe(
      'Custom: Welcome {name}, you are {age} years old ({"name":"Bob","age":30})',
    );
    expect(customInterpolate).toHaveBeenCalled();
  });

  it("should pass context to custom interpolator", () => {
    let capturedContext: any;
    const customInterpolate = (
      _template: string,
      _params: any,
      context: any,
    ) => {
      capturedContext = context;
      return "dummy";
    };

    const t = createTranslator<UserSpec>(validEnglish, {
      locale: "fr-FR",
      interpolate: customInterpolate,
    });

    t("goodbye"); // No params
    expect(capturedContext).toEqual({ locale: "fr-FR", key: "goodbye" });

    t("welcome", { name: "X", age: 10 });
    expect(capturedContext).toEqual({ locale: "fr-FR", key: "welcome" });
  });

  it("should support generic return types (e.g. Objects/JSX)", () => {
    // T is { text: string }
    const t = createTranslator<UserSpec, { text: string }>(validEnglish, {
      interpolate: (template) => ({ text: `Wrapped: ${template}` }),
    });

    const result = t("goodbye");
    expect(result).toEqual({ text: "Wrapped: Goodbye" });
  });

  it("should raise type errors (static verification only)", () => {
    const t = createTranslator<UserSpec>(validEnglish);

    // @ts-expect-error - missing parameter
    t("welcome", { name: "Alice" });

    // @ts-expect-error - invalid key
    t("invalid");
  });

  describe("interpolate() function", () => {
    it("should interpolate simple variables", () => {
      expect(interpolate("Hello {name}", { name: "Alice" })).toBe(
        "Hello Alice",
      );
    });

    it("should support dashes and underscores", () => {
      expect(interpolate("Val: {my-var}", { "my-var": "123" })).toBe(
        "Val: 123",
      );
      expect(interpolate("Val: {my_var}", { my_var: "456" })).toBe("Val: 456");
    });

    it("should leave unknown placeholders intact", () => {
      expect(interpolate("Hello {missing}", {})).toBe("Hello {missing}");
    });

    it("should handle multiple occurrences", () => {
      expect(interpolate("{a} - {a}", { a: "1" })).toBe("1 - 1");
    });

    it("should handle non-string values gracefully", () => {
      expect(interpolate("Count: {count}", { count: 42 })).toBe("Count: 42");
    });
  });

  describe("createTranslationBuilder & InferSpec", () => {
    it("doit inférer et valider une langue secondaire à partir d'une référence 'as const'", () => {
      const billingEn = {
        invoice_count: "You have {count} pending invoices.",
        pay_button: "Pay now",
      } as const;

      type BillingSpec = InferSpec<typeof billingEn>;

      const defineBillingLocale = createTranslationBuilder<BillingSpec>();

      const billingFr = defineBillingLocale({
        invoice_count: "Vous avez {count} factures en attente.",
        pay_button: "Payer maintenant",
      });

      expect(billingFr.pay_button).toBe("Payer maintenant");
    });

    it("doit lever une erreur de type si un paramètre est invalide ou manquant", () => {
      const base = { test: "Hello {name}" } as const;
      type Spec = InferSpec<typeof base>;
      const defineLocale = createTranslationBuilder<Spec>();

      defineLocale({
        // @ts-expect-error - {nom} ne correspond pas à 'name'
        test: "Bonjour {nom}",
      });
    });
  });

  describe("ExtractParams recursion (static verification only)", () => {
    it("doit extraire les paramètres d'un template long sans dépasser la limite de récursion", () => {
      // 80 placeholders : sans récursion terminale (accumulateur), ExtractParams
      // dépasse la limite (~50) des conditional types et tsc échoue avec TS2589.
      // Cette régression est détectée par `tsc --noEmit` (script check), pas par bun test.
      type Chunk = "{p1} {p2} {p3} {p4} {p5} {p6} {p7} {p8} {p9} {p10}";
      type LongTemplate =
        `${Chunk} ${Chunk} ${Chunk} ${Chunk} ${Chunk} ${Chunk} ${Chunk} ${Chunk}`;

      type Params = ExtractParams<LongTemplate>;
      const param: Params = "p10";

      // @ts-expect-error - "p11" n'existe pas dans le template
      const invalid: Params = "p11";

      expect(param).toBe("p10");
      expect(invalid).toBeDefined();
    });
  });

  describe("extensibility", () => {
    it("should support complex pluralization via custom interpolator", () => {
      const tFr = createTranslator<UserSpec>(validEnglish, {
        locale: "fr-FR",
        interpolate: (template, params) => {
          return template.replace(
            /\{(\w+), plural, one \{(.+?)\} other \{(.+?)\}\}/g,
            (_, key, one, other) => {
              const val = params[key];
              return val === 1 ? one : other.replace("#", val);
            },
          );
        },
      });

      expect(tFr("plural", { count: 1 })).toBe("You have one item");
      expect(tFr("plural", { count: 5 })).toBe("You have 5 items");
    });
  });
});
