// @jsxImportSource @cjean-fr/jsx-string
import type { FlowEvent, MergeType } from "./protocol.js";
import type { AdapterCapabilities } from "./protocol.js";
import { injectIntoHead } from "./utils.js";
import { raw, renderToString, type JSXNode } from "@cjean-fr/jsx-string";

export type Adapter = {
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
  /** What this wire format can express — gates streaming and validates merges. */
  capabilities: AdapterCapabilities;
  /**
   * Optional shell transformation applied before streaming fragments.
   * Use it to inject adapter-specific scripts or markup into the rendered shell HTML.
   * Applied exactly once, by the streaming or static renderer.
   */
  transformShell?(shell: string): string;
  /**
   * Encode semantic `FlowEvent` values into the wire format of this adapter.
   * Called by `renderStream` to produce the final string stream.
   * `shell`/`close` events pass through as-is (transformShell already applied).
   */
  encode(): TransformStream<FlowEvent, string>;
};

/**
 * Encode `FlowEvent`s by delegating the fragment wire format to the adapter's own
 * `Patch` component — a single source of truth shared by streaming and JSX.
 * `ev.html` is already-rendered (escaped) HTML, hence `raw()`.
 */
function encodeWith(
  adapter: Pick<Adapter, "Patch">,
): TransformStream<FlowEvent, string> {
  return new TransformStream<FlowEvent, string>({
    async transform(ev, c) {
      if (ev.type === "fragment") {
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

const ALL_MERGES = ["replace", "append", "prepend", "before", "after"] as const;

/** Default capabilities: full streaming, every merge type. */
const DEFAULT_CAPABILITIES: { streaming: true; merges: typeof ALL_MERGES } = {
  streaming: true,
  merges: ALL_MERGES,
};

/**
 * Adapter definition with `encode` and `capabilities` optional — `encode`
 * defaults to `encodeWith(Patch)`, `capabilities` to full streaming + all merges.
 */
type AdapterSpec<C extends AdapterCapabilities> = Omit<
  Adapter,
  "encode" | "capabilities"
> &
  Partial<Pick<Adapter, "encode">> & { capabilities?: C };

/**
 * Build an `Adapter` from a spec. When `encode` is omitted it defaults to
 * `encodeWith(adapter.Patch)`, so the common streaming path stays the adapter's
 * own `Patch` component with no self-referential boilerplate. The literal
 * `capabilities` type is preserved so streaming entry points can reject
 * non-streaming adapters at compile time.
 */
export function createAdapter<
  const C extends AdapterCapabilities = typeof DEFAULT_CAPABILITIES,
>(spec: AdapterSpec<C>): Adapter & { capabilities: C } {
  const adapter: Adapter & { capabilities: C } = {
    ...spec,
    capabilities: spec.capabilities ?? (DEFAULT_CAPABILITIES as unknown as C),
    encode: spec.encode ?? (() => encodeWith(adapter)),
  };
  return adapter;
}

// ── Turbo ────────────────────────────────────────────────────────────────

export const TurboAdapter = createAdapter({
  Placeholder: function ({ id, src, children }): JSXNode {
    return src ? (
      <turbo-frame id={id} src={src}>
        {children}
      </turbo-frame>
    ) : (
      <turbo-frame id={id}>{children}</turbo-frame>
    );
  },

  Patch: ({ id, children, merge }): JSXNode => (
    <turbo-stream action={merge} target={id}>
      <template>{children}</template>
    </turbo-stream>
  ),

  Frame: ({ id, children }): JSXNode => (
    <turbo-frame id={id}>{children}</turbo-frame>
  ),
});

// ── Native (inline polyfill) ─────────────────────────────────────────────

// Minimal MutationObserver polyfill for <template for> streaming support.
const POLYFILL = `(function(){function a(t){var n=t.getAttribute('for'),it=document.createNodeIterator(document.body||document.documentElement,128),nd,s=null,e=null;while((nd=it.nextNode())){if(!s&&nd.nodeValue==='?start name="'+n+'"'){s=nd;continue;}if(s&&nd.nodeValue==='?end'){e=nd;break;}}if(!s)return;var c=s.nextSibling;while(c&&c!==e){var x=c.nextSibling;c.remove();c=x;}s.after(t.content.cloneNode(true));t.remove();}new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeName==='TEMPLATE'&&n.getAttribute&&n.getAttribute('for'))a(n);});});}).observe(document.documentElement,{childList:true,subtree:true});})()`;

const ADJ: Record<Exclude<MergeType, "replace">, string> = {
  append: "beforeend",
  prepend: "afterbegin",
  before: "beforebegin",
  after: "afterend",
};

export const NativeAdapter = createAdapter({
  transformShell: (shell) =>
    injectIntoHead(shell, `<script>${POLYFILL}</script>`),

  Placeholder: function ({ id, src, children }): JSXNode {
    const open: JSXNode = raw(`<?start name="${id}">`);
    const close: JSXNode = raw(`<?end>`);
    if (src) {
      const safeJsonSrc = JSON.stringify(src).replace(/<\//g, "<\\/");
      const script = raw(
        `<script>(function(){fetch(${safeJsonSrc}).then(function(r){document.body.streamAppendHTML(r.body)})})();</script>`,
      );
      return [open, children, close, script];
    }
    return [open, children, close];
  },

  Patch: ({ id, children, merge }): JSXNode => {
    if (merge === "replace") {
      return <template htmlFor={id}>{children}</template>;
    }
    const tmplId = `patch-${id}`;
    const script = raw(
      `<script>(function(){var t=document.getElementById(${JSON.stringify(tmplId)});var el=document.getElementById(${JSON.stringify(id)});if(t&&el){el.insertAdjacentHTML(${JSON.stringify(ADJ[merge])},t.innerHTML);t.remove();}})();</script>`,
    );
    return [<template id={tmplId}>{children}</template>, script];
  },

  Frame: ({ id, children }): JSXNode => (
    <template htmlFor={id}>{children}</template>
  ),
});

// ── HTMX ─────────────────────────────────────────────────────────────────

const SWAP: Record<MergeType, string> = {
  replace: "outerHTML",
  append: "beforeend",
  prepend: "afterbegin",
  before: "beforebegin",
  after: "afterend",
};

export const HtmxAdapter = createAdapter({
  Placeholder: function ({ id, src, children }): JSXNode {
    return src ? (
      <div id={id} hx-get={src} hx-trigger="load" hx-swap="outerHTML">
        {children}
      </div>
    ) : (
      <div id={id}>{children}</div>
    );
  },

  Patch: ({ id, children, merge }): JSXNode => (
    <div id={id} hx-swap-oob={SWAP[merge]}>
      {children}
    </div>
  ),

  Frame: ({ id, children }): JSXNode => <div id={id}>{children}</div>,
});

// ── ESI (Edge Side Includes) ──────────────────────────────────────────────

export const EsiAdapter = createAdapter({
  // ESI is CDN-level composition: no live stream, replace-only semantics.
  capabilities: { streaming: false, merges: ["replace"] },

  Placeholder: ({ src, children }): JSXNode => {
    if (src) {
      const safeSrc = src.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
      return raw(`<esi:include src="${safeSrc}" />`);
    }
    return children;
  },

  Patch: ({ id, children }): JSXNode => {
    return [
      raw(`<esi:inline name="${id}" fetchable="yes">`),
      children,
      raw(`</esi:inline>`),
    ] as JSXNode;
  },

  Frame: ({ children }): JSXNode => children,

  // ESI has no meaningful streaming encode — it is CDN-level composition.
  // Calling encode() at runtime throws; use renderToStatic.emitFragments instead.
  encode(): TransformStream<FlowEvent, string> {
    throw new Error(
      "EsiAdapter.encode() is not supported — ESI is CDN-level. Use renderToStatic with emitFragments instead.",
    );
  },
});

// ── WebPlatform (WICG experimental) ──────────────────────────────────────
// https://github.com/WICG/declarative-partial-updates
// Kept on purpose even though the spec hasn't shipped: it is the zero-JS
// endgame — once browsers implement it, no polyfill and no inline scripts.
// NativeAdapter is the same wire format plus the interim polyfill; this
// adapter is the pure-spec subset (replace only, no injected script).

export const WebPlatformAdapter = createAdapter({
  // Pure WICG spec subset: streaming via <template for>, replace only.
  capabilities: { streaming: true, merges: ["replace"] },

  Placeholder: NativeAdapter.Placeholder,

  Patch: ({ id, children }): JSXNode => {
    return <template htmlFor={id}>{children}</template>;
  },

  Frame: NativeAdapter.Frame,
});
