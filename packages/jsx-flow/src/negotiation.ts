import type { Adapter } from "./adapters.js";

/**
 * HTTP negotiation result: hints extracted from the incoming request that an
 * adapter uses to decide how to encode the response.
 */
export interface Negotiation {
  headers?: HeadersInit;
  mode?: "full" | "fragment";
  target?: string;
  failTarget?: string;
}

/** Request → rendering hints. Decoupled from the wire format (the adapter). */
export type Negotiate = (req: Request) => Negotiation;

/** Map of named negotiation strategies. */
export type NegotiationMap = Record<string, Negotiate>;

/** An adapter whose wire format can carry a live stream. */
export type StreamingAdapter = Adapter & {
  capabilities: { streaming: true };
};
