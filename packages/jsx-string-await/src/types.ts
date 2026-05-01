export interface IdGenerator {
  next(): string;
}

export interface RenderStrategy {
  wrapFallback(id: string, fallback: string): string;
  wrapResolved(id: string, content: string): string;
  wrapError(id: string, errorFallback: string): string;
}

export interface AwaitEntry {
  id: string;
  promise: Promise<unknown>;
  render: () => Promise<string>;
  errorFallback?: () => string;
  status: "pending" | "resolved" | "rejected";
  result?: string;
  error?: Error;
  onTimeout?: () => void;
  onError?: (error: Error) => void;
}

declare module "@cjean-fr/jsx-string" {
  interface Context {
    await?: AwaitEntry[];
    idGenerator?: IdGenerator;
    strategy?: RenderStrategy;
  }
}
