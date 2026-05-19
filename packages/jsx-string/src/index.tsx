import type { JSXNode } from "./core/types.js";
import { escape } from "./utils/escape.js";
import { isRawString, renderChild } from "./utils/html.js";

export { raw } from "./utils/html.js";
export { Fragment } from "./jsx-runtime.js";
export * from "./core/types.js";
export {
  context,
  setContext,
  useContext,
  withScope,
  snapshot,
  type Context,
  type ScopeOptions,
} from "./core/context.js";

export async function renderToString(node: JSXNode): Promise<string> {
  const result = await renderChild(node);
  return isRawString(result) ? result.toString() : escape(String(result));
}
