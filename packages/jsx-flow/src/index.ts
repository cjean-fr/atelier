/**
 * jsx-flow — HTML document orchestration layer for @cjean-fr/jsx-string
 *
 * @module
 */

export { Deferred } from "./components/Deferred.js";
export { Patch } from "./components/Patch.js";
export { Slot, type SlotProps } from "./components/Slot.js";
export { assertFragmentId } from "./fragmentId.js";
export type { PatchProps } from "./components/Patch.js";
export { initFlow, Flow } from "./context.js";
export type { FragmentEffect, FlowContext, Config } from "./context.js";
export { streamFragments } from "./streamFragments.js";
export { renderToReadableStream, renderToStatic } from "./render.js";
export type { StaticContext, StaticOptions } from "./render.js";
export {
  type MergeType,
  type PatchAdapter,
  NativeAdapter,
  TurboAdapter,
  HtmxAdapter,
  WebPlatformAdapter,
  EsiAdapter,
} from "./adapters.js";
