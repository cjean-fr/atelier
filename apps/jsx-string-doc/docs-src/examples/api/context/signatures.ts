import { context, withContext, snapshot } from "@cjean-fr/jsx-string";

// Create a typed context token — `key` must be a non-empty namespaced string
// (e.g. "@org/pkg:purpose"). Same key → same token across calls.
function context<T>(key: string): Context<T>;

interface Context<T> {
  readonly key: string;
  // Read the value bound for the current render. Throws if unbound.
  get(): T;
  // Pair the token with a value — pass the binding to a render entry point.
  with(value: T): ContextBinding;
}

interface RenderOptions {
  context?: readonly ContextBinding[];
}

// Render entry point: bindings require the factory form.
function renderToString(
  node: () => JSXNode,
  options?: RenderOptions,
): Promise<string>;

// Plumbing for custom render entry points (jsx-flow uses both):
// run `fn` with bindings installed, inheriting the enclosing scope…
function withContext<T>(
  bindings: readonly ContextBinding[],
  fn: () => T | Promise<T>,
): Promise<T>;

// …and capture the active bindings as a replay function.
function snapshot(): <T>(fn: () => T) => T;
