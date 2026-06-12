import { ESLintUtils } from "@typescript-eslint/utils";

export const noDuplicateClass = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow using both `class` and `className` on the same JSX element.",
    },

    schema: [],
    messages: {
      noDuplicateClass:
        "Both `class` and `className` on the same element. The runtime merges them, but pick one spelling.",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXOpeningElement(node) {
        let classAttr = null;
        let classNameAttr = null;
        for (const attr of node.attributes) {
          if (attr.type !== "JSXAttribute") continue;
          if (attr.name.type !== "JSXIdentifier") continue;
          if (attr.name.name === "class") classAttr = attr;
          else if (attr.name.name === "className") classNameAttr = attr;
        }
        if (classAttr && classNameAttr) {
          context.report({
            node: classNameAttr,
            messageId: "noDuplicateClass",
          });
        }
      },
    };
  },
});
