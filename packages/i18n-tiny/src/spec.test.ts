import {
  createTranslator,
  createTypedTranslator,
  type ValidTranslations,
  type InferSpec,
  type ExtractParams,
} from "./index";
import { describe, it, expect } from "bun:test";

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

describe("type system", () => {
  it("accepts every valid key (autocomplete contract)", () => {
    const t = createTranslator<UserSpec>(validEnglish);

    expect(t("welcome", { name: "A", age: 1 })).toBe(
      "Welcome A, you are 1 years old",
    );
    expect(t("goodbye")).toBe("Goodbye");
    expect(t("kebab-case-key", { "user-name": "C" })).toBe("Hello C");
    expect(t("complex", { a: "x", b: "y" })).toBe("x and y");
    expect(t("plural", { count: 1 })).toBe(
      "You have {count, plural, one {one item} other {# items}}",
    );
  });

  it("rejects invalid keys at compile time", () => {
    const t = createTranslator<UserSpec>(validEnglish);

    // @ts-expect-error - "nonexistent" is not a key of UserSpec
    t("nonexistent");
  });

  it("rejects missing required params at compile time", () => {
    const t = createTranslator<UserSpec>(validEnglish);

    // @ts-expect-error - missing required param 'age'
    t("welcome", { name: "Alice" });

    // @ts-expect-error - invalid key
    t("invalid");
  });
});

describe("ExtractParams recursion (static verification only)", () => {
  it("extracts params from long template without recursion limit", () => {
    type Chunk = "{p1} {p2} {p3} {p4} {p5} {p6} {p7} {p8} {p9} {p10}";
    type LongTemplate =
      `${Chunk} ${Chunk} ${Chunk} ${Chunk} ${Chunk} ${Chunk} ${Chunk} ${Chunk}`;

    type Params = ExtractParams<LongTemplate>;
    const param: Params = "p10";

    // @ts-expect-error - "p11" n'existe pas dans le template
    const invalid: Params = "p11";

    expect(param).toBe("p10");
  });
});

describe("workflow: InferSpec", () => {
  it("infers and validates a secondary locale via InferSpec", () => {
    const billingEn = {
      invoice_count: "You have {count} pending invoices.",
      pay_button: "Pay now",
    } as const;

    type BillingSpec = InferSpec<typeof billingEn>;

    const t = createTypedTranslator<BillingSpec>()({
      invoice_count: "Vous avez {count} factures en attente.",
      pay_button: "Payer maintenant",
    });

    expect(t("pay_button")).toBe("Payer maintenant");
  });

  it("raises type error on invalid placeholder", () => {
    const base = { test: "Hello {name}" } as const;
    type Spec = InferSpec<typeof base>;

    const t = createTypedTranslator<Spec>()({
      // @ts-expect-error - {nom} ne correspond pas à 'name'
      test: "Bonjour {nom}",
    });

    expect(t).toBeDefined();
  });
});
