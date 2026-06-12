import type { JSX } from "./types";

/**
 * TEST : IntrinsicElements Fusions
 */

export const testReactProps: JSX.IntrinsicElements["div"] = {
  onClick: "alert('clicked')",
  className: "from-react",
};

export const testOurProps: JSX.IntrinsicElements["div"] = {
  class: "from-us",
  style: {
    color: "red",
    "--my-var": "10px",
    anything: "allowed",
  },
};

export const testSvg: JSX.IntrinsicElements["svg"] = {
  viewBox: "0 0 10 10",
};

// Custom elements are no longer accepted by default — declare them explicitly:
// declare global { namespace JSX { interface IntrinsicElements { "custom-tag": HTMLAttributes } } }

declare const element: JSX.IntrinsicElements["div"];
element["onPaste"]; // Ok — index signature requires bracket notation (noPropertyAccessFromIndexSignature)
element.class; // Ok (JSX-String)
