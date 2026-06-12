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
 * CSS Properties — any valid CSS property, including CSS variables.
 */
export interface CSSProperties {
  [key: string]: string | number | undefined;
}

/**
 * Renderable JSX node value.
 */
export type JSXNode =
  | string
  | number
  | boolean
  | null
  | undefined
  | JSXElement
  | Promise<JSXNode>
  | JSXNode[]
  | Iterable<JSXNode>
  | AsyncIterable<JSXNode>;

/**
 * Base attributes shared by all HTML elements.
 *
 * Standard HTML attrs and camelCase aliases are accepted via `[key: string]: unknown`.
 * Declare custom elements via JSX namespace augmentation:
 * ```ts
 * declare module "@cjean-fr/jsx-string/jsx-runtime" {
 *   namespace JSX {
 *     interface IntrinsicElements {
 *       "my-element": HTMLAttributes & { "my-prop"?: string };
 *     }
 *   }
 * }
 * ```
 */
export interface HTMLAttributes {
  id?: string;
  class?: string;
  className?: string;
  lang?: string;
  dir?: "ltr" | "rtl" | "auto";
  title?: string;
  hidden?: boolean | string;
  tabindex?: number | string;
  role?: string;
  slot?: string;
  contenteditable?: boolean | "plaintext-only" | "inherit";
  spellcheck?: boolean | "true" | "false";
  translate?: "yes" | "no";
  draggable?: boolean | "true" | "false" | "auto";
  style?: string | CSSProperties | Promise<string | CSSProperties>;
  children?: JSXNode;
  dangerouslySetInnerHTML?: {
    __html: string | null | undefined | Promise<string | null | undefined>;
  };
  [key: `aria-${string}`]: string | undefined;
  [key: `data-${string}`]: string | undefined;
  [key: `on${string}`]: string | undefined;
  [key: string]: unknown;
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

// ─── Element-specific attribute extensions ────────────────────────────────────

type ElementOverrides = {
  a: {
    href?: string;
    target?: string;
    rel?: string;
    download?: boolean | string;
    hreflang?: string;
  };
  area: {
    href?: string;
    target?: string;
    rel?: string;
    shape?: string;
    coords?: string;
    alt?: string;
  };
  audio: {
    src?: string;
    controls?: boolean;
    autoplay?: boolean;
    loop?: boolean;
    muted?: boolean;
    preload?: "none" | "metadata" | "auto";
    crossorigin?: string;
  };
  base: { href?: string; target?: string };
  blockquote: { cite?: string };
  button: {
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    name?: string;
    value?: string;
    form?: string;
  };
  canvas: { width?: number | string; height?: number | string };
  col: { span?: number };
  colgroup: { span?: number };
  data: { value?: string };
  details: { open?: boolean };
  dialog: { open?: boolean };
  embed: {
    src?: string;
    type?: string;
    width?: number | string;
    height?: number | string;
  };
  fieldset: { disabled?: boolean; form?: string; name?: string };
  form: {
    action?: string;
    method?: "get" | "post" | "dialog";
    enctype?: string;
    novalidate?: boolean;
    target?: string;
    autocomplete?: "on" | "off";
  };
  iframe: {
    src?: string;
    srcdoc?: string;
    sandbox?: string;
    allow?: string;
    allowfullscreen?: boolean;
    loading?: "lazy" | "eager";
    width?: number | string;
    height?: number | string;
    name?: string;
    referrerpolicy?: string;
  };
  img: {
    src?: string;
    alt?: string;
    width?: number | string;
    height?: number | string;
    loading?: "lazy" | "eager";
    decoding?: "async" | "auto" | "sync";
    srcset?: string;
    sizes?: string;
    crossorigin?: string;
    fetchpriority?: "high" | "low" | "auto";
  };
  input: {
    type?: string;
    name?: string;
    value?: string | number;
    placeholder?: string;
    disabled?: boolean;
    checked?: boolean;
    required?: boolean;
    readonly?: boolean;
    min?: number | string;
    max?: number | string;
    maxlength?: number;
    step?: number | string;
    pattern?: string;
    autocomplete?: string;
    multiple?: boolean;
    accept?: string;
    list?: string;
    form?: string;
  };
  ins: { cite?: string; datetime?: string };
  del: { cite?: string; datetime?: string };
  label: { for?: string; form?: string };
  li: { value?: number };
  link: {
    href?: string;
    rel?: string;
    type?: string;
    as?: string;
    crossorigin?: string;
    integrity?: string;
    media?: string;
    hreflang?: string;
    fetchpriority?: "high" | "low" | "auto";
  };
  map: { name?: string };
  meta: {
    name?: string;
    content?: string;
    charset?: string;
    "http-equiv"?: string;
    property?: string;
  };
  meter: {
    value?: number;
    min?: number;
    max?: number;
    low?: number;
    high?: number;
    optimum?: number;
    form?: string;
  };
  object: {
    data?: string;
    type?: string;
    width?: number | string;
    height?: number | string;
    name?: string;
    form?: string;
  };
  ol: {
    reversed?: boolean;
    start?: number;
    type?: "1" | "a" | "A" | "i" | "I";
  };
  optgroup: { label?: string; disabled?: boolean };
  option: {
    value?: string;
    selected?: boolean;
    disabled?: boolean;
    label?: string;
  };
  output: { for?: string; form?: string; name?: string };
  progress: { value?: number; max?: number };
  q: { cite?: string };
  script: {
    src?: string;
    type?: string;
    async?: boolean;
    defer?: boolean;
    integrity?: string;
    crossorigin?: string;
    nonce?: string;
    nomodule?: boolean;
  };
  select: {
    name?: string;
    disabled?: boolean;
    multiple?: boolean;
    required?: boolean;
    size?: number;
    form?: string;
    autocomplete?: string;
  };
  source: {
    src?: string;
    type?: string;
    media?: string;
    srcset?: string;
    sizes?: string;
    width?: number | string;
    height?: number | string;
  };
  style: { media?: string; nonce?: string };
  table: { summary?: string };
  td: { colspan?: number; rowspan?: number; headers?: string };
  template: { shadowrootmode?: "open" | "closed"; htmlFor?: string };
  textarea: {
    name?: string;
    rows?: number;
    cols?: number;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    readonly?: boolean;
    maxlength?: number;
    form?: string;
    wrap?: "hard" | "soft" | "off";
    autocomplete?: string;
  };
  th: {
    colspan?: number;
    rowspan?: number;
    scope?: "row" | "col" | "rowgroup" | "colgroup";
    abbr?: string;
    headers?: string;
  };
  time: { datetime?: string };
  track: {
    src?: string;
    kind?: "subtitles" | "captions" | "descriptions" | "chapters" | "metadata";
    label?: string;
    srclang?: string;
    default?: boolean;
  };
  video: {
    src?: string;
    controls?: boolean;
    autoplay?: boolean;
    loop?: boolean;
    muted?: boolean;
    preload?: "none" | "metadata" | "auto";
    width?: number | string;
    height?: number | string;
    poster?: string;
    crossorigin?: string;
    playsinline?: boolean;
  };
};

// ─── Inline SVG shape elements ─────────────────────────────────────────────────

interface SVGShapeAttrs extends HTMLAttributes {
  fill?: string;
  stroke?: string;
  "stroke-width"?: string | number;
  "stroke-linecap"?: "butt" | "round" | "square";
  "stroke-linejoin"?: "miter" | "round" | "bevel";
  opacity?: number | string;
  transform?: string;
}

interface SvgIntrinsicElements {
  svg: HTMLAttributes & {
    viewBox?: string;
    xmlns?: string;
    width?: number | string;
    height?: number | string;
    fill?: string;
    stroke?: string;
    "stroke-width"?: string | number;
  };
  path: SVGShapeAttrs & { d?: string };
  circle: SVGShapeAttrs & {
    cx?: number | string;
    cy?: number | string;
    r?: number | string;
  };
  rect: SVGShapeAttrs & {
    x?: number | string;
    y?: number | string;
    width?: number | string;
    height?: number | string;
    rx?: number | string;
    ry?: number | string;
  };
  line: SVGShapeAttrs & {
    x1?: number | string;
    y1?: number | string;
    x2?: number | string;
    y2?: number | string;
  };
  polyline: SVGShapeAttrs & { points?: string };
  polygon: SVGShapeAttrs & { points?: string };
  ellipse: SVGShapeAttrs & {
    cx?: number | string;
    cy?: number | string;
    rx?: number | string;
    ry?: number | string;
  };
  g: SVGShapeAttrs;
  text: SVGShapeAttrs & {
    x?: number | string;
    y?: number | string;
    "font-size"?: string | number;
    "text-anchor"?: string;
    "dominant-baseline"?: string;
  };
  tspan: SVGShapeAttrs & {
    x?: number | string;
    y?: number | string;
    dx?: number | string;
    dy?: number | string;
  };
  defs: HTMLAttributes;
  use: HTMLAttributes & {
    href?: string;
    x?: number | string;
    y?: number | string;
    width?: number | string;
    height?: number | string;
  };
  symbol: HTMLAttributes & {
    viewBox?: string;
    width?: number | string;
    height?: number | string;
  };
  clipPath: HTMLAttributes & { clipPathUnits?: string };
  mask: SVGShapeAttrs & { maskUnits?: string };
  linearGradient: HTMLAttributes & {
    x1?: string;
    y1?: string;
    x2?: string;
    y2?: string;
    gradientUnits?: string;
    gradientTransform?: string;
    spreadMethod?: string;
  };
  radialGradient: HTMLAttributes & {
    cx?: string;
    cy?: string;
    r?: string;
    fx?: string;
    fy?: string;
    gradientUnits?: string;
    spreadMethod?: string;
  };
  stop: HTMLAttributes & {
    offset?: string;
    "stop-color"?: string;
    "stop-opacity"?: number | string;
  };
  pattern: HTMLAttributes & {
    x?: number | string;
    y?: number | string;
    width?: number | string;
    height?: number | string;
    patternUnits?: string;
    patternTransform?: string;
  };
  filter: HTMLAttributes & {
    x?: string;
    y?: string;
    width?: string;
    height?: string;
    filterUnits?: string;
  };
  feGaussianBlur: HTMLAttributes & {
    in?: string;
    stdDeviation?: number | string;
    result?: string;
  };
  feMerge: HTMLAttributes;
  feMergeNode: HTMLAttributes & { in?: string };
  animate: HTMLAttributes & {
    attributeName?: string;
    values?: string;
    dur?: string;
    repeatCount?: string | number;
    from?: string;
    to?: string;
    begin?: string;
    end?: string;
    fill?: "freeze" | "remove";
  };
}

// ─── Full element map ─────────────────────────────────────────────────────────

type HtmlIntrinsicElements = {
  [K in keyof ElementOverrides & keyof HTMLElementTagNameMap]: HTMLAttributes &
    ElementOverrides[K];
} & {
  [K in Exclude<
    keyof HTMLElementTagNameMap,
    keyof ElementOverrides
  >]: HTMLAttributes;
};

// ─── JSX namespace ────────────────────────────────────────────────────────────

export namespace JSX {
  export type Element = RawString | Promise<RawString>;
  export interface IntrinsicElements
    extends HtmlIntrinsicElements, SvgIntrinsicElements {}
  export interface IntrinsicAttributes {
    key?: string | number | null | undefined;
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
    type Element = RawString | Promise<RawString>;
    interface IntrinsicElements
      extends HtmlIntrinsicElements, SvgIntrinsicElements {}
    interface IntrinsicAttributes {
      key?: string | number | null | undefined;
    }
  }
}

export type Component<P = {}> = (props: P & HTMLAttributes) => JSXNode;
