import { AsyncLocalStorage } from "node:async_hooks";

declare const __brand: unique symbol;

export interface Context<T> {
  readonly [__brand]: T;
}

export interface ScopeOptions {
  seed?: Map<Context<unknown>, unknown>;
}

type ScopeMap = Map<Context<unknown>, unknown>;

// Instances locales propres
const storage = new AsyncLocalStorage<ScopeMap>();
const namedContexts = new Map<string, symbol>();

/**
 * Create a typed context token, identified by a globally-unique string key.
 *
 * **Convention**: namespace the key with your package or app to avoid
 * collisions across libraries. Recommended forms:
 *
 *   `context<T>("@my-org/my-pkg:purpose")`
 *   `context<T>("my-app:theme")`
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
  let sym = namedContexts.get(globalKey);
  if (!sym) {
    sym = Symbol(globalKey);
    namedContexts.set(globalKey, sym);
  }
  return sym as unknown as Context<T>;
}

export function setContext<T>(ctx: Context<T>, value: T): void {
  const map = storage.getStore();
  if (!map) {
    throw new Error(
      "[jsx-string] setContext() called outside of a withScope() scope.",
    );
  }
  map.set(ctx as Context<unknown>, value);
}

export function useContext<T>(ctx: Context<T>): T {
  const map = storage.getStore();
  if (!map) {
    throw new Error(
      "[jsx-string] useContext() called outside of a withScope() scope.",
    );
  }
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
  return storage.run(new Map(options?.seed), fn);
}

export function snapshot(): Map<Context<unknown>, unknown> {
  const map = storage.getStore();
  if (!map) {
    throw new Error(
      "[jsx-string] snapshot() called outside of a withScope() scope.",
    );
  }
  return new Map(map);
}
