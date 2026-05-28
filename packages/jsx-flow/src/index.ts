/**
 * jsx-flow — HTML document orchestration layer for @cjean-fr/jsx-string
 *
 * @module
 */

export { Island } from "./components/Island.js";
export { Patch } from "./components/Patch.js";
export { assertFragmentId } from "./fragmentId.js";
export type { PatchProps } from "./components/Patch.js";
export { initFlow, Flow } from "./context.js";
export type { ChannelType, FragmentEffect, FlowContext, Config } from "./context.js";
export { streamFragments } from "./streamFragments.js";
export { renderToReadableStream, renderToStatic } from "./render.js";
export type { StaticContext } from "./render.js";
export {
  type MergeType,
  type PatchAdapter,
  TurboAdapter,
  HtmxAdapter,
  NativeAdapter,
  WebPlatformAdapter,
} from "./adapters.js";
