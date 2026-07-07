import {
  createTranslator,
  createTypedTranslator,
  interpolate,
  type ValidTranslations,
  type TranslatorConfig,
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
    let capturedContext: { locale?: string; key: string } = { key: "" };
    const customInterpolate = (
      _template: string,
      _params: Record<string, unknown>,
      context: { locale?: string; key: string },
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

  it("should support branded string as generic return type", () => {
    type Wrapped = string & { readonly __brand: "Wrapped" };
    const t = createTranslator<UserSpec, Wrapped>(validEnglish, {
      interpolate: (template) => `Wrapped: ${template}` as Wrapped,
    });

    const result = t("goodbye");
    expect(result).toBe("Wrapped: Goodbye" as unknown as Wrapped);
  });

  describe("interpolation", () => {
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

    it("leaves ICU constructs untouched (they need a custom interpolator)", () => {
      // Documented footgun: the type system accepts `{count, plural, ...}` but
      // the default interpolator only matches simple `{name}` and passes ICU
      // through verbatim. README points users to a custom interpolator.
      const icu = "You have {count, plural, one {1 item} other {# items}}";
      expect(interpolate(icu, { count: 5 })).toBe(icu);
    });

    it("supports unicode parameter names like {prénom} and {nombre}", () => {
      expect(interpolate("Bonjour {prénom}", { prénom: "Alice" })).toBe(
        "Bonjour Alice",
      );
      expect(interpolate("Total : {nombre}", { nombre: 42 })).toBe(
        "Total : 42",
      );
    });

    it("formats Date with locale when provided", () => {
      const d = new Date(2024, 0, 15, 0, 0, 0);
      expect(interpolate("Date : {d}", { d }, "fr-FR")).toBe(
        `Date : ${d.toLocaleString("fr-FR")}`,
      );
      expect(interpolate("Date : {d}", { d }, "de-DE")).toBe(
        `Date : ${d.toLocaleString("de-DE")}`,
      );
    });

    it("handles null as 'null' string", () => {
      expect(interpolate("val: {x}", { x: null })).toBe("val: null");
    });

    it("leaves undefined placeholders intact", () => {
      expect(interpolate("val: {x}", { x: undefined })).toBe("val: {x}");
    });

    it("handles 0 (falsy but defined)", () => {
      expect(interpolate("val: {x}", { x: 0 })).toBe("val: 0");
    });

    it("handles empty string", () => {
      expect(interpolate("val: {x}", { x: "" })).toBe("val: ");
    });

    it("handles false as 'false' string", () => {
      expect(interpolate("val: {x}", { x: false })).toBe("val: false");
    });
  });

  describe("onMissingKey", () => {
    it("returns onMissingKey result directly (no interpolation)", () => {
      const t = createTranslator<UserSpec, string>(validEnglish, {
        onMissingKey: (key) => `raw:${key}`,
      });

      // @ts-expect-error - "unknown_key" is not a valid key; onMissingKey handles it at runtime
      expect(t("unknown_key")).toBe("raw:unknown_key");
    });

    it("falls back to key name when missing and no onMissingKey", () => {
      const t = createTranslator<UserSpec>(validEnglish);

      // @ts-expect-error - "nonexistent" is not a valid key; runtime fallback to key
      expect(t("nonexistent")).toBe("nonexistent");
    });

    it("does not affect existing keys", () => {
      const t = createTranslator<UserSpec>(validEnglish, {
        onMissingKey: () => "N/A",
      });

      expect(t("goodbye")).toBe("Goodbye");
      expect(t("welcome", { name: "Alice", age: 30 })).toBe(
        "Welcome Alice, you are 30 years old",
      );
    });

    it("falls back to key when onMissingKey returns undefined", () => {
      const t = createTranslator<UserSpec, string>(validEnglish, {
        onMissingKey: () => undefined,
      });

      // @ts-expect-error - "unknown_key" is not a valid key; onMissingKey handles it at runtime
      expect(t("unknown_key")).toBe("unknown_key");
    });
  });

  describe("extensibility", () => {
    it("supports custom interpolator with string-based markup", () => {
      type Spec = { welcome: readonly ["name"] };

      const tx = createTranslator<Spec>(
        { welcome: "Hello {name}!" },
        {
          interpolate: (template, params) =>
            template.replace(
              /\{(\w+)\}/g,
              (_, key) => `<strong>${String(params[key])}</strong>`,
            ),
        },
      );

      expect(tx("welcome", { name: "Alice" })).toBe(
        "Hello <strong>Alice</strong>!",
      );
    });

    it("should support complex pluralization via custom interpolator", () => {
      const tFr = createTranslator<UserSpec>(validEnglish, {
        locale: "fr-FR",
        interpolate: (template, params) => {
          return template.replace(
            /\{(\w+), plural, one \{(.+?)\} other \{(.+?)\}\}/g,
            (_, key, one, other) => {
              const val = Number(params[key]);
              return val === 1 ? one : other.replace("#", String(val));
            },
          );
        },
      });

      expect(tFr("plural", { count: 1 })).toBe("You have one item");
      expect(tFr("plural", { count: 5 })).toBe("You have 5 items");
    });
  });

  describe("workflow: createTypedTranslator", () => {
    it("merges builder + translator in one call", () => {
      type Spec = { welcome: readonly ["name"]; logout: readonly [] };

      const t = createTypedTranslator<Spec>()({
        welcome: "Hello {name}",
        logout: "Logout",
      });

      expect(t("welcome", { name: "Alice" })).toBe("Hello Alice");
      expect(t("logout")).toBe("Logout");
    });

    it("accepts a config and passes locale through", () => {
      type Spec = { hello: readonly ["name"] };

      const t = createTypedTranslator<Spec, string>()(
        { hello: "Hello {name}" },
        { locale: "en-GB" },
      );

      expect(t("hello", { name: "Bob" })).toBe("Hello Bob");
    });

    it("validates placeholders at compile time", () => {
      type Spec = { test: readonly ["name"] };

      const t = createTypedTranslator<Spec>()({
        // @ts-expect-error - {nom} ne correspond pas à 'name'
        test: "Bonjour {nom}",
      });

      expect(t).toBeDefined();
    });
  });
});
