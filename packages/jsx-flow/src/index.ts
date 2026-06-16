/**
 * jsx-flow — HTML document orchestration layer for @cjean-fr/jsx-string
 *
 * @module
 */

export { Defer, type DeferProps } from "./components/Defer.js";
export { Fill, type FillProps } from "./components/Fill.js";
export { Slot, type SlotProps } from "./components/Slot.js";
export {
  ClientFetch,
  type ClientFetchProps,
} from "./components/ClientFetch.js";
export { renderStream } from "./render.js";
export { renderToStatic } from "./static.js";
export type { StaticContext, StaticOptions } from "./static.js";
export type {
  AdapterCapabilities,
  MergeType,
  DeferContent,
} from "./protocol.js";
export type { Negotiation, StreamingAdapter } from "./negotiation.js";
export type { Adapter } from "./adapters.js";
export {
  createAdapter,
  NativeAdapter,
  TurboAdapter,
  HtmxAdapter,
  WebPlatformAdapter,
  EsiAdapter,
} from "./adapters.js";
export {
  serve,
  negotiateHtmx,
  negotiateUnpoly,
  type Negotiate,
} from "./http.js";
export { composeShell, injectIntoHead } from "./utils.js";
