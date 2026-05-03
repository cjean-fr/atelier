import type { RawString } from "../utils/html.js";

/**
 * Support for React type augmentation.
 * We override standard attributes to allow strings/RawStrings.
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
 * CSS Properties that allow any property name, including CSS variables,
 * while still providing autocomplete for standard properties.
 */
export interface CSSProperties extends React.CSSProperties {
  [key: string]: any;
}

/**
 * Map React's functional event handlers to static strings.
 */
export type StringEventHandlers = {
  [K in keyof React.DOMAttributes<any> as K extends `on${string}`
    ? K
    : never]?: string;
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
  style?: string | CSSProperties | Promise<string | CSSProperties>;
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
  | Promise<JSXChild>
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
  /** The result of a JSX expression is a RawString or a Promise thereof. */
  export type Element = RawString | Promise<RawString>;
  export interface IntrinsicElements extends StaticIntrinsicElements {
    [key: string]: any;
  }
  export interface IntrinsicAttributes
    extends React.Attributes, StandardAttributes {
    key?: string | number | null | undefined;
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
    interface Element extends RawString {}
    interface IntrinsicElements extends StaticIntrinsicElements {
      [key: string]: any;
    }
    interface IntrinsicAttributes extends React.Attributes, StandardAttributes {
      key?: string | number | null | undefined;
    }
  }
}

export type StandardAttributes = HTMLAttributes;
