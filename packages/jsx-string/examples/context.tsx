/**
 * Context API — pass data through the tree without prop-drilling.
 * Each withScope() establishes an isolated AsyncLocalStorage store.
 *
 * Run: `bun examples/context.tsx`
 */

import {
  context,
  setContext,
  useContext,
  withScope,
  renderToString,
} from "@cjean-fr/jsx-string";

// Define context keys once, at module level.
const Theme = context<"light" | "dark">();

function Box({ children }: { children: string }) {
  const theme = useContext(Theme);
  const cls = theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900";
  return <div class={cls}>{children}</div>;
}

const html = await withScope(async () => {
  setContext(Theme, "dark");
  return renderToString(<Box>Hello from a dark theme.</Box>);
});

console.log(html);
