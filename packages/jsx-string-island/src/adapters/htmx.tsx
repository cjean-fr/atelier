import type { RenderAdapter } from "../types.js";
import type { JSXChild } from "@cjean-fr/jsx-string";

const Fallback = ({ id, children }: { id: string; children: JSXChild }) => (
  <div id={id}>{children}</div>
);

const Resolved = ({ id, children }: { id: string; children: JSXChild }) => (
  <div id={id} hx-swap-oob="true">
    {children}
  </div>
);

export const htmxAdapter: RenderAdapter = {
  wrapFallback: (id, fallback) => <Fallback id={id}>{fallback}</Fallback>,
  wrapResolved: (id, content) => <Resolved id={id}>{content}</Resolved>,
  wrapError: (id, errorFallback) => (
    <Resolved id={id}>{errorFallback}</Resolved>
  ),
};
