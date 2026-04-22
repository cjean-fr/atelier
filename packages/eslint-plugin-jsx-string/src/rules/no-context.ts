import { ESLintUtils } from '@typescript-eslint/utils';

export const noContext = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow React Context usage.',
    },

    schema: [],
    messages: {
      noContext: 'React Context is not compatible with @cjean-fr/jsx-string. Use props or a Registry.',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        if (node.callee.type === 'Identifier' && node.callee.name === 'createContext') {
          context.report({
            node,
            messageId: 'noContext',
          });
        }
      },
      JSXMemberExpression(node) {
        if (node.property.name === 'Provider') {
          context.report({
            node,
            messageId: 'noContext',
          });
        }
      },
    };
  },
});
