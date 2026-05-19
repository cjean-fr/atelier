import { AsyncLocalStorage } from "node:async_hooks";

declare const __brand: unique symbol;

export interface Context<T> {
  readonly [__brand]: T;
}

export interface ScopeOptions {
  seed?: Map<Context<unknown>, unknown>;
}

type ScopeMap = Map<Context<unknown>, unknown>;

let storage: AsyncLocalStorage<ScopeMap> | null = null;

export function context<T>(): Context<T> {
  return Symbol() as unknown as Context<T>;
}

export function setContext<T>(ctx: Context<T>, value: T): void {
  const map = storage?.getStore();
  if (!map)
    throw new Error(
      "[jsx-string] setContext() called outside of a withScope() scope.",
    );
  map.set(ctx as Context<unknown>, value);
}

export function useContext<T>(ctx: Context<T>): T {
  const map = storage?.getStore();
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
  if (!storage) storage = new AsyncLocalStorage();
  return storage.run(new Map(options?.seed), fn);
}

export function snapshot(): Map<Context<unknown>, unknown> {
  const map = storage?.getStore();
  if (!map)
    throw new Error(
      "[jsx-string] snapshot() called outside of a withScope() scope.",
    );
  return new Map(map);
}
