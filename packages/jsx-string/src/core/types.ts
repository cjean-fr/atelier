// Augment React's types when @types/react is installed,
// so jsx-string attributes (class, string event handlers) are accepted there too.
declare module "react" {
  interface HTMLAttributes<T> {
    class?: string;
    [key: `on${string}`]: any;
  }
  interface SVGAttributes<T> {
    class?: string;
    [key: `on${string}`]: any;
  }
}

/**
 * Trusted, already-escaped HTML.
 */
export class RawString {
  readonly value: string;
  constructor(value: string) {
    this.value = value;
  }
  toString(): string {
    return this.value;
  }
}

/**
 * Mark an HTML string as trusted: it will be rendered verbatim without HTML
 * escaping. Use this for HTML you generated yourself or from a source you
 * fully trust — typically a Markdown renderer's output or a templating helper.
 *
 * **Common mistake — `raw()` is *not* for rendering user text.** If you have
 * a string and just want it to appear on the page (with `<`, `>`, `&`
 * displayed as characters), embed it directly — the default behavior already
 * HTML-escapes for you:
 *
 * ```tsx
 * <p>{userText}</p>   // ✅ safe — `<`/`>`/`&` shown as text
 * <p>{raw(userText)}</p>  // ❌ XSS if userText contains <script>...
 * ```
 *
 * ⚠️ **For untrusted HTML that must render *as HTML*** (e.g. forum posts
 * that allow basic formatting), escaping alone is not enough — you need an
 * HTML *sanitizer* (a different tool: it strips dangerous tags/attrs
 * structurally, instead of encoding them). Use
 * [`DOMPurify`](https://github.com/cure53/DOMPurify) or
 * [`sanitize-html`](https://github.com/apostrophecms/sanitize-html) and pass
 * their output to `raw()`.
 *
 * @example
 * ```tsx
 * import { raw } from "@cjean-fr/jsx-string";
 *
 * // Trusted source: server-side Markdown renderer.
 * const html = await renderMarkdown(post.body);
 * return <article>{raw(html)}</article>;
 * ```
 */
export const raw = (value: string): RawString => new RawString(value);

export type RenderResult = RawString | Promise<RawString>;

interface JSXElement {
  toString(): string;
}

/**
 * CSS Properties that allow any property name, including CSS variables.
 * When @types/react is installed, style autocompletion comes from React.CSSProperties
 * via the normal tsconfig jsxImportSource chain — no extra setup needed.
 */
export interface CSSProperties {
  [key: string]: string | number | undefined;
}

/**
 * Event handlers expressed as static strings instead of functions.
 * Common handlers are listed explicitly for dot-notation access;
 * all others are covered by the [key: string]: any index signature on HTMLAttributes.
 */
export type StringEventHandlers = {
  onClick?: string;
  onChange?: string;
  onInput?: string;
  onSubmit?: string;
  onFocus?: string;
  onBlur?: string;
  onKeyDown?: string;
  onKeyUp?: string;
  onKeyPress?: string;
  onMouseEnter?: string;
  onMouseLeave?: string;
  onMouseOver?: string;
  onMouseOut?: string;
  onMouseMove?: string;
  onMouseDown?: string;
  onMouseUp?: string;
  onTouchStart?: string;
  onTouchEnd?: string;
  onTouchMove?: string;
  onPaste?: string;
  onCopy?: string;
  onCut?: string;
  onScroll?: string;
  onLoad?: string;
  onError?: string;
  onSelect?: string;
  onDrag?: string;
  onDrop?: string;
  onDragOver?: string;
  onDragStart?: string;
  onDragEnd?: string;
  onContextMenu?: string;
  onDoubleClick?: string;
  onWheel?: string;
  onResize?: string;
  onAbort?: string;
  onCanPlay?: string;
  onPlay?: string;
  onPause?: string;
  onEnded?: string;
};

/**
 * Strip event handlers and layout props from T, then reattach them as static-friendly versions.
 * Works standalone — does not require @types/react.
 */
export type ToStatic<T = {}> = {
  [K in keyof T as K extends
    | `on${string}`
    | "children"
    | "style"
    | "class"
    | "className"
    ? never
    : K]: T[K];
} & {
  class?: string;
  className?: string;
  style?: string | CSSProperties | Promise<string | CSSProperties>;
  children?: JSXNode;
  dangerouslySetInnerHTML?: { __html: string };
} & StringEventHandlers;

/**
 * Base attributes shared by all HTML elements.
 * Permissive by default: [key: string]: any allows any valid HTML attribute.
 * When @types/react is installed, ToStatic<React.HTMLAttributes<any>> gives richer autocomplete.
 */
export interface HTMLAttributes extends ToStatic {
  id?: string;
  class?: string;
  className?: string;
  style?: string | CSSProperties | Promise<string | CSSProperties>;
  children?: JSXNode;
  dangerouslySetInnerHTML?: { __html: string };
  lang?: string;
  dir?: "ltr" | "rtl" | "auto";
  role?: string;
  tabIndex?: number;
  tabindex?: number;
  title?: string;
  hidden?: boolean | string;
  slot?: string;
  /** Catch-all for any other HTML or data attribute */
  [key: string]: any;
}

/**
 * Base attributes shared by all SVG elements.
 */
export interface SVGAttributes extends HTMLAttributes {
  viewBox?: string;
  xmlns?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: string | number;
  width?: string | number;
  height?: string | number;
  d?: string;
  cx?: string | number;
  cy?: string | number;
  r?: string | number;
  x?: string | number;
  y?: string | number;
}

/**
 * Types of children that can be passed to a JSX element.
 */
export type JSXNode =
  | string
  | number
  | boolean
  | null
  | undefined
  | JSXElement
  | Promise<JSXNode>
  | JSXNode[];

export type Component<P = {}> = (
  props: P & HTMLAttributes & { children?: JSXNode },
) => JSXNode;

/**
 * JSX Namespace for the internal factory.
 * IntrinsicElements is permissive ([tag: string]: HTMLAttributes).
 * Per-element attribute checking (img → src, a → href, …) is available
 * automatically when @types/react is installed, via the jsxImportSource chain.
 */
export namespace JSX {
  export type Element = RawString | Promise<RawString>;
  export interface IntrinsicElements {
    [tag: string]: HTMLAttributes;
  }
  export interface IntrinsicAttributes {
    key?: string | number | null | undefined;
    [key: string]: any;
  }
  export interface ElementAttributesProperty {
    props: {};
  }
  export interface ElementChildrenAttribute {
    children: {};
  }
}

declare global {
  namespace JSX {
    interface Element extends RawString {}
    interface IntrinsicElements {
      [tag: string]: HTMLAttributes;
    }
    interface IntrinsicAttributes {
      key?: string | number | null | undefined;
      [key: string]: any;
    }
  }
}
