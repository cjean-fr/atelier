import type { RenderAdapter } from "../types.js";
import type { JSXChild } from "@cjean-fr/jsx-string";

const Fallback = ({ id, children }: { id: string; children: JSXChild }) => (
  <div id={id}>{children}</div>
);

const StreamReplace = ({
  target,
  children,
}: {
  target: string;
  children: JSXChild;
}) => (
  <turbo-stream action="replace" target={target}>
    <template>{children}</template>
  </turbo-stream>
);

export const hotwireAdapter: RenderAdapter = {
  wrapFallback: (id, fallback) => <Fallback id={id}>{fallback}</Fallback>,
  wrapResolved: (id, content) => (
    <StreamReplace target={id}>{content}</StreamReplace>
  ),
  wrapError: (id, errorFallback) => (
    <StreamReplace target={id}>{errorFallback}</StreamReplace>
  ),
};
