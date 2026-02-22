import {
  createTranslator,
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

describe("i18n-tiny Translation System", () => {
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
});
