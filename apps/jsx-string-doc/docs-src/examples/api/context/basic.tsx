import { context, renderToString } from "@cjean-fr/jsx-string";

// 1. Define a typed context token (module-level singleton)
const themeCtx = context<"light" | "dark">("my-app:theme");

// 2. A component that reads from context
function ThemedBox({ children }: { children: JSXNode }) {
  const theme = themeCtx.get();
  return (
    <div
      class={
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }
    >
      {children}
    </div>
  );
}

// 3. Bind the value at the render entry point.
// The factory form is required: JSX evaluates eagerly, so a pre-built
// node would run before the bindings are installed.
const html = await renderToString(() => <ThemedBox>Hello</ThemedBox>, {
  context: [themeCtx.with("dark")],
});
