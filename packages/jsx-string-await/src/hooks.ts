import type { AwaitEntry, IdGenerator } from "./types.js";
import { useContext } from "@cjean-fr/jsx-string";

export class SequentialIdGenerator implements IdGenerator {
  private counter = 0;
  private prefix: string;

  constructor(prefix: string = "await") {
    this.prefix = prefix;
  }

  next(): string {
    this.counter += 1;
    return `${this.prefix}-${this.counter}`;
  }
}

export function useAwaitEntries(): AwaitEntry[] {
  const ctx = useContext();
  if (!ctx.await) {
    ctx.await = [];
  }
  return ctx.await;
}

export function useIdGenerator(): IdGenerator {
  const ctx = useContext();
  if (!ctx.idGenerator) {
    ctx.idGenerator = new SequentialIdGenerator("await");
  }
  return ctx.idGenerator;
}
