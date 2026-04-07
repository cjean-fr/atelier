import type { SafeString } from "../utils/html.js";

/**
 * Support for React type augmentation.
 */
declare module "react" {
  interface HTMLAttributes<T> {
    class?: string;
    children?: any;
    [key: `on${string}`]: SafeString | undefined;
  }
  interface SVGAttributes<T> {
    class?: string;
    children?: any;
    [key: `on${string}`]: SafeString | undefined;
  }
  interface CSSProperties {
    [key: string]: any;
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
 * Base attributes shared by all HTML elements.
 */
export interface HTMLAttributes extends Omit<
  React.HTMLAttributes<any>,
  "children" | "style"
> {
  children?: JSXChild;
  class?: string;
  className?: string;
  id?: string;
  style?: string | CSSProperties | any;
  dangerouslySetInnerHTML?: { __html: string };
  /** Event handlers must be SafeStrings for security and clarity in @cjean-fr/jsx-string. */
  [key: `on${string}`]: SafeString | undefined;
  /** Catch-all for other HTML attributes */
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
) => any;

/**
 * JSX Namespace for the internal factory.
 */
export namespace JSX {
  export type Element = any;
  export interface IntrinsicElements extends React.JSX.IntrinsicElements {
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
    interface Element extends JSXElement {}
    interface IntrinsicElements extends React.JSX.IntrinsicElements {
      [key: string]: any;
    }
    interface IntrinsicAttributes extends React.Attributes, StandardAttributes {
      key?: string | number | any;
    }
  }
}

export type StandardAttributes = HTMLAttributes;
