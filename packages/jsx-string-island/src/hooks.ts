import type { IslandEntry, IdGenerator } from "./types.js";
import { useContext } from "@cjean-fr/jsx-string";

export class SequentialIdGenerator implements IdGenerator {
  private counter = 0;
  private prefix: string;

  constructor(prefix: string = "island") {
    this.prefix = prefix;
  }

  next(): string {
    this.counter += 1;
    return `${this.prefix}-${this.counter}`;
  }
}

export function useIslandEntries(): IslandEntry[] {
  const ctx = useContext();
  if (!ctx.islands) {
    ctx.islands = [];
  }
  return ctx.islands;
}

export function useIdGenerator(): IdGenerator {
  const ctx = useContext();
  if (!ctx.idGenerator) {
    ctx.idGenerator = new SequentialIdGenerator("island");
  }
  return ctx.idGenerator;
}
