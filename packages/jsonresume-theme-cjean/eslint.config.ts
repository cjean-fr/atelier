import jsxString from "@cjean-fr/eslint-plugin-jsx-string";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";

export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      "@cjean-fr/jsx-string": jsxString,
    },
    rules: {
      ...jsxString.configs.recommended.rules,
    },
  },
];
