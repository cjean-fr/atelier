// @jsxImportSource @cjean-fr/jsx-string
import { NativeAdapter } from "./native.js";
import { createAdapter } from "./shared.js";

export const WebPlatformAdapter = createAdapter({
  capabilities: { streaming: true, merges: ["replace"] },

  Placeholder: NativeAdapter.Placeholder,

  Patch: ({ id, children }) => {
    return <template htmlFor={id}>{children}</template>;
  },

  Frame: NativeAdapter.Frame,
});
