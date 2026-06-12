/**
 * Context API — pass data through the tree without prop-drilling.
 * Bindings are installed declaratively at the render entry point; the
 * factory form (`() => <App />`) is required because JSX evaluates eagerly.
 *
 * Run: `bun examples/context.tsx`
 */
import { context, renderToString } from "@cjean-fr/jsx-string";

// Define context tokens once, at module level.
const Theme = context<"light" | "dark">("examples:theme");

function Box({ children }: { children: string }) {
  const theme = Theme.get();
  const cls =
    theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900";
  return <div class={cls}>{children}</div>;
}

const html = await renderToString(() => <Box>Hello from a dark theme.</Box>, {
  context: [Theme.with("dark")],
});

console.log(html);
