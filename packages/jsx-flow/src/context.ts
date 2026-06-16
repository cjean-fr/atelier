// @jsxImportSource @cjean-fr/jsx-string
import type { FlowConfig, OnError } from "./flow-options.js";
import { assertFragmentId } from "./fragmentId.js";
import type { DeferContent, MergeType } from "./protocol.js";
import {
  context,
  setContext,
  useContext,
  withScope,
  type Context,
} from "@cjean-fr/jsx-string";

export type { FlowConfig } from "./flow-options.js";

/**
 * A unit of deferred work, keyed by its target DOM `id`. The renderer decides
 * at drain time whether `content` is a one-shot patch or a live stream — see
 * `streamFlow`. `factory` content receives an `AbortSignal` combining the
 * request signal with this entry's own `timeout` (if any).
 */
export type Pending = {
  content: DeferContent;
  merge: MergeType;
  /** Per-fragment render timeout in ms. Falls back to FlowOptions.defaultTimeout. */
  timeout?: number;
  /** Per-fragment error handler, overriding FlowOptions.onError. */
  onError?: OnError;
};

/**
 * Internal storage for pending deferred work.
 *
 * Hides the `Map` implementation behind a narrow interface so callers don't
 * depend on the storage primitive. Iteration logic (filtering processed ids)
 * lives here rather than in `streamFlow`.
 */
export type PendingStore = {
  /** Register or overwrite a deferred entry for `id`. Validates merge support. */
  defer(id: string, entry: Pending): void;
  /** Entries whose id is not in `processed`. */
  pending(processed: Set<string>): Array<[string, Pending]>;
  /** True when at least one entry is not in `processed`. */
  hasPending(processed: Set<string>): boolean;
  /** Total registered entries (including processed ones). */
  readonly size: number;
  /** Purge all entries to eagerly release closures and references. */
  clear(): void;
};

const storeMaps = new WeakMap<PendingStore, Map<string, Pending>>();

export function createPendingStore(config: FlowConfig): PendingStore {
  const map = new Map<string, Pending>();
  const { merges } = config.adapter.capabilities;
  const store: PendingStore = {
    defer(id, entry) {
      assertFragmentId(id, "Defer");
      if (!merges.includes(entry.merge)) {
        throw new Error(
          `Defer: merge="${entry.merge}" is not supported by this adapter ` +
            `(supports: ${merges.join(", ")}).`,
        );
      }
      map.set(id, entry);
    },
    pending(processed) {
      return [...map].filter(([id]) => !processed.has(id));
    },
    hasPending(processed) {
      return [...map.keys()].some((id) => !processed.has(id));
    },
    get size() {
      return map.size;
    },
    clear() {
      map.clear();
    },
  };
  storeMaps.set(store, map);
  return store;
}

export function debugStore(store: PendingStore): {
  get(id: string): Pending | undefined;
  has(id: string): boolean;
  keys(): IterableIterator<string>;
  entries(): IterableIterator<[string, Pending]>;
} {
  const map = storeMaps.get(store);
  if (!map) throw new Error("debugStore: not a valid PendingStore");
  return {
    get(id) {
      return map.get(id);
    },
    has(id) {
      return map.has(id);
    },
    keys() {
      return map.keys();
    },
    entries() {
      return map.entries();
    },
  };
}

export interface FlowContext {
  config: FlowConfig;
  /** Internal deferred-work store. */
  pendingStore: PendingStore;
  nextId: () => string;
  /**
   * Register deferred work to render into the DOM element with this `id`.
   * Validates the id and that `merge` is supported by the active adapter.
   */
  defer(id: string, entry: Pending): void;
}

export const Flow: Context<FlowContext> = context<FlowContext>(
  "@cjean-fr/jsx-flow:flow",
);

export function initFlow(config: FlowConfig): void {
  let counter = 0;
  const store = createPendingStore(config);
  setContext(Flow, {
    config,
    pendingStore: store,
    nextId: () => `${config.idPrefix ?? "fragment-"}${++counter}`,
    defer(id, entry) {
      store.defer(id, entry);
    },
  });
}

export function withFlow<T>(
  handler: (ctx: FlowContext) => T,
  config: FlowConfig,
): Promise<T> {
  return withScope(async function () {
    initFlow(config);
    return handler(useContext(Flow));
  });
}
