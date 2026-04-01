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
    },
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "react",
              message:
                "React imports are not compatible with @cjean-fr/jsx-string.",
            },
            {
              name: "react-dom",
              message:
                "React imports are not compatible with @cjean-fr/jsx-string.",
            },
          ],
        },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector: "CallExpression[callee.name='useState']",
          message:
            "useState is not compatible with @cjean-fr/jsx-string. Extract state as props.",
        },
        {
          selector: "CallExpression[callee.name='useEffect']",
          message:
            "useEffect is not compatible with @cjean-fr/jsx-string. Fetch data before render.",
        },
        {
          selector: "JSXAttribute[name.name=/^on[A-Z]/]",
          message:
            "Event handlers are ignored by @cjean-fr/jsx-string. It renders static HTML.",
        },
      ],
    },
  },
];
