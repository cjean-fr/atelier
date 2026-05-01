import { AsyncLocalStorage } from "node:async_hooks";

// Extensible interface — plugins (e.g. jsx-string-await) augment this via module augmentation
export interface Context {}

/**
 * Shim for AsyncContext.Variable — future migration path to TC39 AsyncContext
 */
export class ContextVariable<T = Context> {
  private als = new AsyncLocalStorage<T>();

  run<R>(value: T, callback: () => R | Promise<R>): Promise<R> {
    return this.als.run(value as any, callback) as Promise<R>;
  }

  get(): T | undefined {
    return this.als.getStore() as T;
  }
}

// Singleton rendering context variable
export const context: ContextVariable<Context> = new ContextVariable<Context>();

/**
 * Initializes a new isolated context scope and runs the callback inside it.
 */
export async function withContext<T>(cb: () => T | Promise<T>): Promise<T> {
  return context.run({}, cb);
}

/**
 * Returns the current context — throws if called outside a withContext() scope.
 */
export function useContext(): Context {
  const ctx = context.get();
  if (!ctx) {
    throw new Error(
      "[jsx-string] useContext() called outside of a withContext() scope.",
    );
  }
  return ctx;
}
