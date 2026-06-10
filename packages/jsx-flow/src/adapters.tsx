// @jsxImportSource @cjean-fr/jsx-string
import { injectIntoHead } from "./utils.js";
import { raw, renderToString, type JSXNode } from "@cjean-fr/jsx-string";
import type { FlowEvent, MergeType, Negotiation } from "./events.js";

/** Re-export for consumers. */
export type { MergeType };

export type PatchAdapter = {
  /** Renders the placeholder in the shell (both streaming and SSG). */
  Placeholder(props: {
    id: string;
    src: string | null;
    children: JSXNode;
  }): JSXNode;
  /** Renders a fragment for inline streaming — arrives in the same HTTP response as the shell. */
  Patch(props: { id: string; children: JSXNode; merge: MergeType }): JSXNode;
  /** Renders a fragment as a standalone file response for SSG lazy-loading. */
  Frame(props: { id: string; children: JSXNode }): JSXNode;
  /**
   * Optional shell transformation applied before streaming fragments.
   * Use it to inject adapter-specific scripts or markup into the rendered shell HTML.
   * Applied exactly once, by `renderToFlowEvents` (streaming) or `renderPage` (static).
   */
  transformShell?(shell: string): string;
  /**
   * Encode semantic `FlowEvent` values into the wire format of this adapter.
   * Called by `renderToReadableStream` to produce the final string stream.
   * `shell`/`close` events pass through as-is (transformShell already applied).
   */
  encode(): TransformStream<FlowEvent, string>;
  /**
   * Optional HTTP negotiation: extract hints from an incoming Request to
   * decide encoding mode, headers, and target element.
   */
  negotiate?(req: Request): Negotiation;
};

/**
 * Encode `FlowEvent`s by delegating the patch wire format to the adapter's own
 * `Patch` component — a single source of truth shared by streaming and JSX.
 * `ev.html` is already-rendered (escaped) HTML, hence `raw()`.
 */
function encodeWith(
  adapter: Pick<PatchAdapter, "Patch">,
): TransformStream<FlowEvent, string> {
  return new TransformStream<FlowEvent, string>({
    async transform(ev, c) {
      if (ev.type === "patch") {
        const wire = await renderToString(
          adapter.Patch({ id: ev.id, children: raw(ev.html), merge: ev.merge }),
        );
        c.enqueue(wire + "\n");
      } else {
        c.enqueue(ev.html + "\n");
      }
    },
  });
}

// ── Turbo ────────────────────────────────────────────────────────────────

export const TurboAdapter: PatchAdapter = {
  Placeholder: function ({ id, src, children }) {
    return src ? (
      <turbo-frame id={id} src={src}>
        {children}
      </turbo-frame>
    ) : (
      <turbo-frame id={id}>{children}</turbo-frame>
    );
  },

  Patch: ({ id, children, merge }) => (
    <turbo-stream action={merge} target={id}>
      <template>{children}</template>
    </turbo-stream>
  ),

  Frame: ({ id, children }) => <turbo-frame id={id}>{children}</turbo-frame>,

  encode: () => encodeWith(TurboAdapter),
};

// ── Native (inline polyfill) ─────────────────────────────────────────────

// Minimal MutationObserver polyfill for <template for> streaming support.
const POLYFILL = `(function(){function a(t){var n=t.getAttribute('for'),it=document.createNodeIterator(document.body||document.documentElement,128),nd,s=null,e=null;while((nd=it.nextNode())){if(!s&&nd.nodeValue==='?start name="'+n+'"'){s=nd;continue;}if(s&&nd.nodeValue==='?end'){e=nd;break;}}if(!s)return;var c=s.nextSibling;while(c&&c!==e){var x=c.nextSibling;c.remove();c=x;}s.after(t.content.cloneNode(true));t.remove();}new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeName==='TEMPLATE'&&n.getAttribute&&n.getAttribute('for'))a(n);});});}).observe(document.documentElement,{childList:true,subtree:true});})()`;

const ADJ: Record<Exclude<MergeType, "replace">, string> = {
  append: "beforeend",
  prepend: "afterbegin",
  before: "beforebegin",
  after: "afterend",
};

export const NativeAdapter: PatchAdapter = {
  transformShell: (shell) =>
    injectIntoHead(shell, `<script>${POLYFILL}</script>`),

  Placeholder: function ({ id, src, children }) {
    const open = raw(`<?start name="${id}">`);
    const close = raw(`<?end>`);
    if (src) {
      const safeJsonSrc = JSON.stringify(src).replace(/<\//g, "<\\/");
      const script = raw(
        `<script>(function(){fetch(${safeJsonSrc}).then(function(r){document.body.streamAppendHTML(r.body)})})();</script>`,
      );
      return [open, children, close, script];
    }
    return [open, children, close];
  },

  Patch: ({ id, children, merge }) => {
    if (merge === "replace") {
      return <template htmlFor={id}>{children}</template>;
    }
    const tmplId = `patch-${id}`;
    const script = raw(
      `<script>(function(){var t=document.getElementById(${JSON.stringify(tmplId)});var el=document.getElementById(${JSON.stringify(id)});if(t&&el){el.insertAdjacentHTML(${JSON.stringify(ADJ[merge])},t.innerHTML);t.remove();}})();</script>`,
    );
    return [<template id={tmplId}>{children}</template>, script];
  },

  Frame: ({ id, children }) => <template htmlFor={id}>{children}</template>,

  encode: () => encodeWith(NativeAdapter),
};

// ── HTMX ─────────────────────────────────────────────────────────────────

const SWAP: Record<MergeType, string> = {
  replace: "outerHTML",
  append: "beforeend",
  prepend: "afterbegin",
  before: "beforebegin",
  after: "afterend",
};

export const HtmxAdapter: PatchAdapter = {
  Placeholder: function ({ id, src, children }) {
    return src ? (
      <div id={id} hx-get={src} hx-trigger="load" hx-swap="outerHTML">
        {children}
      </div>
    ) : (
      <div id={id}>{children}</div>
    );
  },

  Patch: ({ id, children, merge }) => {
    return (
      <div id={id} hx-swap-oob={SWAP[merge]}>
        {children}
      </div>
    );
  },

  Frame: ({ id, children }) => <div id={id}>{children}</div>,

  encode: () => encodeWith(HtmxAdapter),

  negotiate(req: Request): Negotiation {
    const target = req.headers.get("HX-Target") ?? undefined;
    // Vary on the headers this negotiation actually reads, so shared caches
    // never serve a fragment response to a full-page navigation.
    return { headers: { Vary: "HX-Target" }, target, mode: "full" };
  },
};

// ── ESI (Edge Side Includes) ──────────────────────────────────────────────

export const EsiAdapter: PatchAdapter = {
  Placeholder: ({ src, children }) => {
    if (src) {
      const safeSrc = src.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
      return raw(`<esi:include src="${safeSrc}" />`);
    }
    return children;
  },

  Patch: ({ id, children, merge }) => {
    if (merge !== "replace") {
      throw new Error(
        `EsiAdapter only supports "replace" — ESI has no insert/append/prepend semantics.`,
      );
    }
    return [
      raw(`<esi:inline name="${id}" fetchable="yes">`),
      children,
      raw(`</esi:inline>`),
    ] as JSXNode;
  },

  Frame: ({ children }) => children,

  // ESI has no meaningful streaming encode — it is CDN-level composition.
  // Calling encode() at runtime throws; use renderToStatic.emitFragments instead.
  encode(): TransformStream<FlowEvent, string> {
    throw new Error(
      "EsiAdapter.encode() is not supported — ESI is CDN-level. Use renderToStatic with emitFragments instead.",
    );
  },
};

// ── WebPlatform (WICG experimental) ──────────────────────────────────────
// https://github.com/WICG/declarative-partial-updates
// Kept on purpose even though the spec hasn't shipped: it is the zero-JS
// endgame — once browsers implement it, no polyfill and no inline scripts.
// NativeAdapter is the same wire format plus the interim polyfill; this
// adapter is the pure-spec subset (replace only, no injected script).

export const WebPlatformAdapter: PatchAdapter = {
  Placeholder: NativeAdapter.Placeholder,

  Patch: ({ id, children, merge }) => {
    if (merge !== "replace") {
      throw new Error(
        `WebPlatformAdapter only supports "replace" (WICG spec). Use NativeAdapter for other merge types.`,
      );
    }
    return <template htmlFor={id}>{children}</template>;
  },

  Frame: NativeAdapter.Frame,

  encode: () => encodeWith(WebPlatformAdapter),
};
