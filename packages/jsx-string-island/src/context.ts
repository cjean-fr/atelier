import type { IslandAdapter } from "./adapters.js";
import { context, setContext, type JSXNode } from "@cjean-fr/jsx-string";

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
  collected: Map<string, () => JSXNode>;
  nextId: () => string;
}

export const Islands = context<IslandsPluginContext>();

export function initIslands(config: Config): void {
  let id = 0;
  setContext(Islands, {
    config,
    collected: new Map(),
    nextId: () => `${config.idPrefix ?? "island-"}${++id}`,
  });
}
