import type { IslandAdapter } from "./adapters";
import { useContext, type JSXChild } from "@cjean-fr/jsx-string";

export type Config =
  | {
      adapter: IslandAdapter;
      mode: "streaming";
      generatePath?: never;
      idPrefix?: string;
    }
  | {
      adapter: IslandAdapter;
      mode: "static";
      generatePath: (id: string) => string;
      idPrefix?: string;
    };

export interface IslandsPluginContext {
  config: Config;
  collected: Map<string, () => JSXChild>;
  nextId: () => string;
}

const ISLANDS_CONTEXT_KEY = "@jsx-string-island";

declare module "@cjean-fr/jsx-string" {
  interface Context {
    [ISLANDS_CONTEXT_KEY]?: IslandsPluginContext;
  }
}

export function useIslandsContext(): IslandsPluginContext {
  const ctx = useContext();
  if (!ctx[ISLANDS_CONTEXT_KEY]) {
    throw new Error(
      "Islands plugin not initialized. Call withIslandsPlugin(config) before renderToStringAsync.",
    );
  }
  return ctx[ISLANDS_CONTEXT_KEY]!;
}

export function withIslandsPlugin(config: Config): void {
  const ctx = useContext();
  ctx[ISLANDS_CONTEXT_KEY] = {
    config,
    collected: new Map(),
    nextId: (function () {
      let id = 0;
      return () => `${config.idPrefix ?? "island-"}${++id}`;
    })(),
  };
}
