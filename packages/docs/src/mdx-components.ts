/**
 * MDX component provider.
 *
 * Wired through the MDX plugin's `providerImportSource` option so `.mdx`
 * pages can use the built-in docs components (`<CodeExample>`, `<CodeBlock>`,
 * `<Tabs>`, `<Aside>`) without importing them in every file.
 *
 * MDX calls `useMDXComponents(props.components)` when building each page's
 * component map; we merge the built-ins under any runtime-provided overrides.
 * It's a plain object merge — no React context involved. Page-level `import`s
 * still take precedence, since those resolve via lexical scope, not this map.
 */
import { Aside } from "./components/Aside.js";
import { CodeBlock } from "./components/CodeBlock.js";
import { CodeExample } from "./components/CodeExample.js";
import { Tabs } from "./components/Tabs.js";

const base = { Aside, CodeBlock, CodeExample, Tabs };

export function useMDXComponents(
  components?: Readonly<Record<string, unknown>>,
): Record<string, unknown> {
  return { ...base, ...components };
}
