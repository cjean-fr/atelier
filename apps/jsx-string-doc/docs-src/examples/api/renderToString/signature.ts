import { renderToString } from "@cjean-fr/jsx-string";

// Plain node — render as-is
function renderToString(node: JSXNode): Promise<string>;

// Factory — required when binding context (JSX evaluates eagerly)
function renderToString(
  node: () => JSXNode,
  options?: { context?: readonly ContextBinding[] },
): Promise<string>;
