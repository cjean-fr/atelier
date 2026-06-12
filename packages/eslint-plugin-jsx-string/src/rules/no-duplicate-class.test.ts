import { noDuplicateClass } from "./no-duplicate-class";
import * as parser from "@typescript-eslint/parser";
import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester({
  languageOptions: {
    parser,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
});

ruleTester.run("no-duplicate-class", noDuplicateClass, {
  valid: [
    '<div class="a" />',
    '<div className="b" />',
    '<div class="a"><span className="b" /></div>',
    '<div class="a" {...props} />',
  ],
  invalid: [
    {
      code: '<div class="a" className="b" />',
      errors: [{ messageId: "noDuplicateClass" }],
    },
    {
      code: '<div className={cls} class="a" />',
      errors: [{ messageId: "noDuplicateClass" }],
    },
  ],
});
