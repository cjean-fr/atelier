import { ESLintUtils } from "@typescript-eslint/utils";

export const noReactHooks = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    type: "problem",
    docs: {
      description: "Disallow React hooks usage.",
    },

    schema: [],
    messages: {
      noHook:
        "{{name}} is not compatible with @cjean-fr/jsx-string. Static rendering only.",
      useState:
        "useState is not compatible with @cjean-fr/jsx-string. Extract state as props.",
      useEffect:
        "useEffect is not compatible with @cjean-fr/jsx-string. Fetch data before render.",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        if (
          node.callee.type === "Identifier" &&
          node.callee.name.startsWith("use")
        ) {
          const name = node.callee.name;
          let messageId: "noHook" | "useState" | "useEffect" = "noHook";

          if (name === "useState") messageId = "useState";
          else if (name === "useEffect") messageId = "useEffect";

          context.report({
            node,
            messageId,
            data: {
              name,
            },
          });
        }
      },
    };
  },
});
