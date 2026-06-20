import { ESLintUtils } from "@typescript-eslint/utils";

// React's stateful/effect hooks, which have no meaning in static rendering.
// `useContext` is deliberately absent: it is part of @cjean-fr/jsx-string's own
// (synchronous, scope-based) public API, so flagging every `use*` identifier
// would reject idiomatic jsx-string code.
const REACT_HOOKS = new Set<string>([
  "useState",
  "useEffect",
  "useLayoutEffect",
  "useInsertionEffect",
  "useReducer",
  "useRef",
  "useImperativeHandle",
  "useCallback",
  "useMemo",
  "useTransition",
  "useDeferredValue",
  "useId",
  "useSyncExternalStore",
  "useDebugValue",
  "useActionState",
  "useFormStatus",
  "useOptimistic",
]);

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
          REACT_HOOKS.has(node.callee.name)
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
