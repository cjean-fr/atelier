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

describe("ICU messages (depth-aware extraction)", () => {
  it("extracts only the argument name from a plural message", () => {
    type Params =
      ExtractParams<"You have {count, plural, one {one item} other {# items}}">;
    const param: Params = "count";

    // @ts-expect-error - branch text is not a param
    const branchText: Params = "# items";

    expect(param).toBe("count");
  });

  it("ignores single-word branch literals", () => {
    type Params =
      ExtractParams<"You have {count, plural, one {item} other {items}}">;
    const param: Params = "count";

    // @ts-expect-error - {items} as a branch literal is not a param
    const branchWord: Params = "items";

    expect(param).toBe("count");
  });

  it("collects real params nested inside branches", () => {
    type Params =
      ExtractParams<"{count, plural, one {{name} got one} other {{name} got #}}">;
    const count: "count" extends Params ? "count" : never = "count";
    const name: "name" extends Params ? "name" : never = "name";
    const exact: Params extends "count" | "name"
      ? "count" | "name" extends Params
        ? true
        : false
      : false = true;

    expect(count).toBe("count");
    expect(name).toBe("name");
    expect(exact).toBe(true);
  });

  it("accepts ICU plural through createTypedTranslator", () => {
    type Spec = { plural: readonly ["count"] };

    const t = createTypedTranslator<Spec>()({
      plural: "You have {count, plural, one {one item} other {# items}}",
    });

    expect(t("plural", { count: 5 })).toBe(
      "You have {count, plural, one {one item} other {# items}}",
    );
  });

  it("accepts an accented French plural through createTypedTranslator", () => {
    type Spec = { factures: readonly ["count"] };

    const t = createTypedTranslator<Spec>()({
      factures:
        "Vous avez {count, plural,=0 {aucune facture} one {# facture} other {# factures}}",
    });

    expect(t("factures", { count: 2 })).toContain("{count, plural");
  });

  it("rejects a wrong placeholder inside an ICU message", () => {
    type Spec = { plural: readonly ["count"] };

    const t = createTypedTranslator<Spec>()({
      // @ts-expect-error - {nom} ne correspond pas à 'count'
      plural: "Tu as {nom, plural, un {un élément} autre {# éléments}}",
    });

    expect(t).toBeDefined();
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

describe("createTypedTranslator contract validation", () => {
  type Spec = {
    welcome: readonly ["name", "company"];
    logout: readonly [];
  };

  it("rejects a missing translation key", () => {
    // @ts-expect-error - logout is required by Spec
    const t = createTypedTranslator<Spec>()({
      welcome: "Welcome {name} to {company}",
    });

    expect(t).toBeDefined();
  });

  it("rejects a missing placeholder", () => {
    const t = createTypedTranslator<Spec>()({
      // @ts-expect-error - company is required by Spec
      welcome: "Welcome {name}",
      logout: "Log out",
    });

    expect(t).toBeDefined();
  });

  it("rejects an unexpected placeholder", () => {
    const t = createTypedTranslator<Spec>()({
      // @ts-expect-error - role is not declared by Spec
      welcome: "Welcome {name} to {company} as {role}",
      logout: "Log out",
    });

    expect(t).toBeDefined();
  });

  it("rejects a missing ICU argument", () => {
    type IcuSpec = { summary: readonly ["count", "name"] };

    const t = createTypedTranslator<IcuSpec>()({
      // @ts-expect-error - name is required by IcuSpec
      summary: "{count, plural, one {one item} other {# items}}",
    });

    expect(t).toBeDefined();
  });
});
