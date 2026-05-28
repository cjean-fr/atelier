// @jsxImportSource @cjean-fr/jsx-string
import { raw, type JSXNode } from "@cjean-fr/jsx-string";
import { injectIntoHead } from "./utils.js";

export type MergeType = "replace" | "append" | "prepend" | "before" | "after";

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
   */
  transformShell?(shell: string): string;
};

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

  // Inline streaming: <turbo-stream> tells Turbo how to patch the live DOM.
  Patch: ({ id, children, merge }) => (
    <turbo-stream action={merge} target={id}>
      <template>{children}</template>
    </turbo-stream>
  ),

  // SSG lazy-load: Turbo fetches src and looks for a matching <turbo-frame> in the response.
  Frame: ({ id, children }) => <turbo-frame id={id}>{children}</turbo-frame>,
};

// https://github.com/WICG/declarative-partial-updates
// Pure spec adapter — replace only, zero JS.
// ⚠️  Experimental: requires chrome://flags/#enable-experimental-web-platform-features.
// Add a polyfill in your shell component (e.g. template-for-polyfill) or use NativeAdapter
// which bundles a minimal inline polyfill and supports all merge types.
export const WebPlatformAdapter: PatchAdapter = {
  Placeholder: function ({ id, src, children }) {
    // <?start> and <?end> are processing instructions that JSX syntax cannot express
    // (tag names starting with "?" are rejected by the parser). They are injected via
    // raw() — id is guaranteed safe by assertFragmentId in Island and Patch.
    const open = raw(`<?start name="${id}">`);
    const close = raw(`<?end>`);
    if (src) {
      const safeJsonSrc = JSON.stringify(src).replace(/<\//g, "<\\/");
      // patchsrc="..." would be the declarative equivalent (future potential addition to
      // the spec — not yet in template-for-polyfill). Until then, a fetch script is needed.
      const script = raw(
        `<script>(function(){fetch(${safeJsonSrc}).then(function(r){document.body.streamAppendHTML(r.body)})})();</script>`,
      );
      return [open, children, close, script];
    }
    return [open, children, close];
  },

  // Inline streaming: <template for> applied by the HTML parser (or external polyfill).
  Patch: ({ id, children, merge }) => {
    if (merge !== "replace") {
      throw new Error(
        `WebPlatformAdapter only supports "replace" (WICG spec). Use NativeAdapter for other merge types.`,
      );
    }
    return <template htmlFor={id}>{children}</template>;
  },

  Frame: ({ id, children }) => <template htmlFor={id}>{children}</template>,
};

// Minimal MutationObserver polyfill for <template for> streaming support.
// Watches for <template for="id"> elements added by the streaming HTML parser
// and applies them to the <?start name="id">…<?end> regions.
// HTML5 parses <?start name="id"> as a Comment with nodeValue `?start name="id"`.
const POLYFILL = `(function(){function a(t){var n=t.getAttribute('for'),it=document.createNodeIterator(document.body||document.documentElement,128),nd,s=null,e=null;while((nd=it.nextNode())){if(!s&&nd.nodeValue==='?start name="'+n+'"'){s=nd;continue;}if(s&&nd.nodeValue==='?end'){e=nd;break;}}if(!s)return;var c=s.nextSibling;while(c&&c!==e){var x=c.nextSibling;c.remove();c=x;}s.after(t.content.cloneNode(true));t.remove();}new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeName==='TEMPLATE'&&n.getAttribute&&n.getAttribute('for'))a(n);});});}).observe(document.documentElement,{childList:true,subtree:true});})()`;

const ADJ: Record<Exclude<MergeType, "replace">, string> = {
  append: "beforeend",
  prepend: "afterbegin",
  before: "beforebegin",
  after: "afterend",
};

// Self-contained adapter: bundles the minimal polyfill and supports all merge types
// via insertAdjacentHTML for non-replace cases.
export const NativeAdapter: PatchAdapter = {
  // Inject the minimal polyfill into <head> — no external CDN required.
  transformShell: (shell) => injectIntoHead(shell, `<script>${POLYFILL}</script>`),

  Placeholder: WebPlatformAdapter.Placeholder,

  Patch: ({ id, children, merge }) => {
    if (merge === "replace") {
      return <template htmlFor={id}>{children}</template>;
    }
    // insertAdjacentHTML for merge types not yet supported by the WICG spec.
    const tmplId = `patch-${id}`;
    const script = raw(
      `<script>(function(){var t=document.getElementById(${JSON.stringify(tmplId)});var el=document.getElementById(${JSON.stringify(id)});if(t&&el){el.insertAdjacentHTML(${JSON.stringify(ADJ[merge])},t.innerHTML);t.remove();}})();</script>`,
    );
    return [<template id={tmplId}>{children}</template>, script];
  },

  Frame: ({ id, children }) => <template htmlFor={id}>{children}</template>,
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

  // Inline streaming: OOB swap patches the live DOM without a round-trip.
  Patch: ({ id, children, merge }) => {
    const swap: Record<MergeType, string> = {
      replace: "outerHTML",
      append: "beforeend",
      prepend: "afterbegin",
      before: "beforebegin",
      after: "afterend",
    };
    return (
      <div id={id} hx-swap-oob={swap[merge]}>
        {children}
      </div>
    );
  },

  // SSG lazy-load: hx-get fetches and replaces the placeholder via hx-swap="outerHTML".
  Frame: ({ id, children }) => <div id={id}>{children}</div>,
};
