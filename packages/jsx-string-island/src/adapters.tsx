import type { JSXChild } from "@cjean-fr/jsx-string";

export type IslandAdapter = {
  Placeholder({
    id,
    src,
    children,
  }: {
    id: string;
    src: string | null;
    children: JSXChild;
  }): any;
  Fragment({ id, children }: { id: string; children: JSXChild }): any;
};

export const TurboAdapter: IslandAdapter = {
  Placeholder: function ({ id, src, children }) {
    return src ? (
      <turbo-frame id={id} src={src}>
        {children}
      </turbo-frame>
    ) : (
      <turbo-frame id={id}>{children}</turbo-frame>
    );
  },

  Fragment: ({ id, children }) => (
    <turbo-stream action="replace" target={id}>
      <template>{children}</template>
    </turbo-stream>
  ),
};

export const HtmxAdapter: IslandAdapter = {
  Placeholder: function ({ id, src, children }) {
    return src ? (
      <div id={id} hx-get={src} hx-trigger="load" hx-swap="outerHTML">
        {children}
      </div>
    ) : (
      <div id={id}>{children}</div>
    );
  },
  Fragment: ({ id, children }) => (
    <div id={id} hx-swap-oob="true">
      {children}
    </div>
  ),
};
