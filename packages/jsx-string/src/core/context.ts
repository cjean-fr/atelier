import { AsyncLocalStorage } from "node:async_hooks";

declare const __brand: unique symbol;

export interface Context<T> {
  readonly [__brand]: T;
}

export interface ScopeOptions {
  seed?: Map<Context<unknown>, unknown>;
}

type ScopeMap = Map<Context<unknown>, unknown>;

// ─────────────────────────────────────────────────────────────────────────────
// Module-duplication-safe state.
//
// Both `storage` and named contexts must be unique across instances of this
// module — otherwise a Vite plugin (loaded by Node) and user pages (loaded by
// Vite SSR), microfrontends, or any other setup that may resolve this package
// twice will end up with disjoint AsyncLocalStorage / Symbol identities and
// `setContext` / `useContext` won't see each other.
//
// We use `Symbol.for(...)` registry keys on `globalThis`. The first instance
// to load creates the singleton; subsequent ones reuse it.
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = Symbol.for("@cjean-fr/jsx-string.storage");
const CONTEXTS_KEY = Symbol.for("@cjean-fr/jsx-string.contexts");

type GlobalState = {
  [STORAGE_KEY]?: AsyncLocalStorage<ScopeMap>;
  [CONTEXTS_KEY]?: Map<string, symbol>;
};

function getStorage(): AsyncLocalStorage<ScopeMap> {
  const g = globalThis as unknown as GlobalState;
  if (!g[STORAGE_KEY]) g[STORAGE_KEY] = new AsyncLocalStorage<ScopeMap>();
  return g[STORAGE_KEY];
}

function getNamedContexts(): Map<string, symbol> {
  const g = globalThis as unknown as GlobalState;
  if (!g[CONTEXTS_KEY]) g[CONTEXTS_KEY] = new Map();
  return g[CONTEXTS_KEY];
}

/**
 * Create a typed context token, identified by a globally-unique string key.
 *
 * The key is mapped to `Symbol.for("@cjean-fr/jsx-string.context.{key}")` —
 * the same key always resolves to the same Symbol across module instances,
 * so libraries that may be loaded twice (Vite plugin + Vite SSR, web
 * workers, microfrontends, edge re-init…) still share context state.
 *
 * **Convention**: namespace the key with your package or app to avoid
 * collisions across libraries. Recommended forms:
 *
 *   `context<T>("@my-org/my-pkg:purpose")`
 *   `context<T>("my-app:theme")`
 *
 * Two different keys always return different Symbols. The same key always
 * returns the same Symbol — even after a hot reload.
 *
 * @example
 * const Theme = context<"light" | "dark">("my-app:theme");
 * const Flow = context<FlowContext>("@cjean-fr/jsx-flow:flow");
 */
export function context<T>(globalKey: string): Context<T> {
  if (typeof globalKey !== "string" || globalKey.length === 0) {
    throw new Error(
      "[jsx-string] context(key): a non-empty string key is required. " +
        'Use a namespaced form like `context<T>("@my-org/my-pkg:purpose")`.',
    );
  }
  const reg = getNamedContexts();
  const existing = reg.get(globalKey);
  if (existing) return existing as unknown as Context<T>;
  const sym = Symbol.for(`@cjean-fr/jsx-string.context.${globalKey}`);
  reg.set(globalKey, sym);
  return sym as unknown as Context<T>;
}

export function setContext<T>(ctx: Context<T>, value: T): void {
  const map = getStorage().getStore();
  if (!map)
    throw new Error(
      "[jsx-string] setContext() called outside of a withScope() scope.",
    );
  map.set(ctx as Context<unknown>, value);
}

export function useContext<T>(ctx: Context<T>): T {
  const map = getStorage().getStore();
  if (!map)
    throw new Error(
      "[jsx-string] useContext() called outside of a withScope() scope.",
    );
  if (!map.has(ctx as Context<unknown>)) {
    throw new Error(
      "[jsx-string] useContext() — context not found in current scope. Did you call setContext() in this withScope?",
    );
  }
  return map.get(ctx as Context<unknown>) as T;
}

export async function withScope<T>(
  fn: () => T | Promise<T>,
  options?: ScopeOptions,
): Promise<T> {
  return getStorage().run(new Map(options?.seed), fn);
}

export function snapshot(): Map<Context<unknown>, unknown> {
  const map = getStorage().getStore();
  if (!map)
    throw new Error(
      "[jsx-string] snapshot() called outside of a withScope() scope.",
    );
  return new Map(map);
}
