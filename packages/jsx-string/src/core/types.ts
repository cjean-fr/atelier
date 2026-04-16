import type { SafeString } from "../utils/html.js";

/**
 * Support for React type augmentation.
 * We override standard attributes to allow strings/SafeStrings.
 */
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
 * Common interface for all JSX elements.
 */
export interface JSXElement {
  toString(): string;
}

/**
 * Truly autonomous CSSProperties that merges with React if present.
 */
export interface CSSProperties extends Record<string, any> {}
export interface CSSProperties extends React.CSSProperties {}

/**
 * Map React's functional event handlers to static strings or SafeStrings.
 */
export type StringEventHandlers = {
  [K in keyof React.DOMAttributes<any> as K extends `on${string}`
    ? K
    : never]?: string | SafeString;
};

/**
 * Transform a React attribute set into a static-friendly one.
 * Strips functional events, and adds back children/style/class.
 */
export type ToStatic<T> = Omit<
  T,
  keyof React.DOMAttributes<any> | "children" | "style" | "class" | "className"
> & {
  class?: string;
  className?: string;
  style?: string | CSSProperties | any;
  children?: JSXChild;
  dangerouslySetInnerHTML?: { __html: string };
} & StringEventHandlers;

/**
 * Base attributes shared by all HTML elements.
 */
export interface HTMLAttributes extends ToStatic<React.HTMLAttributes<any>> {
  /** Catch-all for other HTML attributes */
  [key: string]: any;
}

/**
 * Base attributes shared by all SVG elements.
 */
export interface SVGAttributes extends ToStatic<React.SVGAttributes<any>> {
  /** Catch-all for other SVG attributes */
  [key: string]: any;
}

/**
 * Types of children that can be passed to a JSX element.
 */
export type JSXChild =
  | string
  | number
  | boolean
  | null
  | undefined
  | JSXElement
  | Promise<any>
  | JSXChild[];

export type FunctionalComponent<P = {}> = (
  props: P & StandardAttributes & { children?: JSXChild },
) => JSXChild;

/**
 * Internal type for mapping React intrinsic elements to static ones.
 */
type StaticIntrinsicElements = {
  [K in keyof React.JSX.IntrinsicElements]: ToStatic<
    React.JSX.IntrinsicElements[K]
  >;
};

/**
 * JSX Namespace for the internal factory.
 */
export namespace JSX {
  /** The result of a JSX expression is a SafeString or a Promise thereof. */
  export type Element = SafeString | Promise<SafeString>;
  export interface IntrinsicElements extends StaticIntrinsicElements {
    [key: string]: any;
  }
  export interface IntrinsicAttributes
    extends React.Attributes, StandardAttributes {
    key?: string | number | any;
  }
  export interface ElementAttributesProperty {
    props: {};
  }
  export interface ElementChildrenAttribute {
    children: {};
  }
}

/**
 * Global merge for external tools/React.
 */
declare global {
  namespace JSX {
    interface Element extends SafeString {}
    interface IntrinsicElements extends StaticIntrinsicElements {
      [key: string]: any;
    }
    interface IntrinsicAttributes extends React.Attributes, StandardAttributes {
      key?: string | number | any;
    }
  }
}

export type StandardAttributes = HTMLAttributes;
