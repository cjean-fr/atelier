import { AsyncLocalStorage } from "node:async_hooks";

// TC39 Async Context proposal (Stage 2, 2025-09)
// https://github.com/tc39/proposal-async-context
// When native (≈ ES2028+), the mapping is direct:
//   token.get()              → AsyncContext.Variable#get
//   withContext(b, fn)       → AsyncContext.Variable#run (composed over bindings)
//   snapshot()               → AsyncContext.Snapshot (capture) + Snapshot#run (replay)

type ScopeMap = Map<Context<unknown>, unknown>;

// Instances locales propres
const storage = new AsyncLocalStorage<ScopeMap>();
const namedContexts = new Map<string, Context<unknown>>();

/**
 * A value paired with its context token, ready to be installed by a render
 * entry point. Produced by `token.with(value)` — the only place where the
 * token/value types are checked against each other.
 */
export interface ContextBinding {
  readonly context: Context<unknown>;
  readonly value: unknown;
}

/**
 * A typed context token. Reading happens anywhere below a render entry point
 * via `get()`; writing happens declaratively, by passing `with(value)` to the
 * entry point's `context` option:
 *
 * ```tsx
 * const Theme = context<"light" | "dark">("my-app:theme");
 *
 * const html = await renderToString(() => <App />, {
 *   context: [Theme.with("dark")],
 * });
 * ```
 */
export interface Context<T> {
  /** The globally-unique key this token was created with. */
  readonly key: string;
  /** Read the value bound for the current render. Throws if unbound. */
  get(): T;
  /** Pair this token with a value — pass the result to a render entry point. */
  with(value: T): ContextBinding;
}

/**
 * Create a typed context token, identified by a globally-unique string key.
 *
 * **Convention**: namespace the key with your package or app to avoid
 * collisions across libraries. Recommended forms:
 *
 *   `context<T>("@my-org/my-pkg:purpose")`
 *   `context<T>("my-app:theme")`
 *
 * Calling `context()` twice with the same key returns the same token.
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
  let token = namedContexts.get(globalKey);
  if (!token) {
    token = createToken(globalKey);
    namedContexts.set(globalKey, token);
  }
  return token as Context<T>;
}

function createToken(key: string): Context<unknown> {
  const token: Context<unknown> = {
    key,
    get() {
      const map = storage.getStore();
      if (!map || !map.has(token)) {
        throw new Error(
          `[jsx-string] context "${key}" is not bound. Pass it to your render ` +
            `entry point: renderToString(() => <App />, { context: [token.with(value)] }).`,
        );
      }
      return map.get(token);
    },
    with(value) {
      return Object.freeze({ context: token, value });
    },
  };
  return Object.freeze(token);
}

/**
 * Run `fn` with `bindings` installed, inheriting any bindings already active
 * in the calling scope. Bindings are scoped to `fn`'s async call tree: nothing
 * leaks to the caller, and concurrent calls are isolated.
 *
 * This is the plumbing under the `context` render option — reach for it only
 * when building a custom render entry point (jsx-flow does).
 */
export function withContext<T>(
  bindings: readonly ContextBinding[],
  fn: () => T | Promise<T>,
): Promise<T> {
  const map: ScopeMap = new Map(storage.getStore());
  for (const b of bindings) map.set(b.context, b.value);
  return storage.run(map, async () => fn());
}

/**
 * Capture the bindings active right now and return a replay function:
 * `restore(fn)` runs `fn` under the captured bindings, whenever it is called.
 *
 * Useful when work escapes the current async call tree (a queue, a timer, an
 * event handler) but must still render under the bindings of the scope that
 * scheduled it.
 */
export function snapshot(): <T>(fn: () => T) => T {
  const map: ScopeMap = new Map(storage.getStore());
  return (fn) => storage.run(map, fn);
}
