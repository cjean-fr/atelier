import {
  context,
  setContext,
  useContext,
  withScope,
  snapshot,
} from "@cjean-fr/jsx-string";

// Create a typed context key — `key` must be a non-empty namespaced string
// (e.g. "@org/pkg:purpose"). Same key → same Symbol across module instances.
function context<T>(key: string): Context<T>;

// Provide a value inside a withScope
function setContext<T>(ctx: Context<T>, value: T): void;

// Read a value set by setContext
function useContext<T>(ctx: Context<T>): T;

// Create an isolated async scope
async function withScope<T>(
  fn: () => T | Promise<T>,
  options?: { seed?: Map<Context<unknown>, unknown> },
): Promise<T>;

// Capture current scope values for passing to child scopes
function snapshot(): Map<Context<unknown>, unknown>;
