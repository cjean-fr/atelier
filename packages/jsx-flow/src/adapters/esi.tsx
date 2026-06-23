// @jsxImportSource @cjean-fr/jsx-string
import type { FlowEvent } from "../types.js";
import { createAdapter } from "./shared.js";
import { raw, type JSXNode } from "@cjean-fr/jsx-string";

export const EsiAdapter = createAdapter({
  capabilities: { streaming: false, merges: ["replace"] },

  Placeholder: ({ src, children }) => {
    if (src) {
      const safeSrc = src.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
      return raw(`<esi:include src="${safeSrc}" />`);
    }
    return children;
  },

  Patch: ({ id, children }) => {
    return [
      raw(`<esi:inline name="${id}" fetchable="yes">`),
      children,
      raw(`</esi:inline>`),
    ] as JSXNode;
  },

  Frame: ({ children }) => children,

  encode(): TransformStream<FlowEvent, string> {
    throw new Error(
      "EsiAdapter.encode() is not supported — ESI is CDN-level. Use renderToStatic with emitFragments instead.",
    );
  },
});
