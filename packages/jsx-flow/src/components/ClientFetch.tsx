import { useFlowContext } from "./shared.js";
import type { JSX } from "@cjean-fr/jsx-string";

// ClientFetch fetches an HTML fragment, so its `src` is a strict whitelist:
// http(s) or a relative path only. A scheme is the text before the first ':' —
// unless a '/', '?' or '#' precedes it, in which case the colon sits inside a
// path and the URL is relative.
type SchemeOf<S extends string> = S extends `${infer Head}:${string}`
  ? Head extends `${string}${"/" | "?" | "#"}${string}`
    ? null
    : Head extends ""
      ? null
      : Head
  : null;

type FetchUrl<S extends string> =
  SchemeOf<S> extends null
    ? S
    : Lowercase<SchemeOf<S> & string> extends "http" | "https"
      ? S
      : {
          __error: "ClientFetch needs an HTML URL — only http(s): or a relative path";
        };

export interface ClientFetchProps<S extends string = string> {
  /**
   * URL of the HTML fragment to fetch on the client. Restricted to a whitelist
   * — `http(s):` or a relative path — so `javascript:`, `data:`, `mailto:` and
   * every other scheme are a compile-time error for string literals. Dynamic
   * `string` values pass through.
   */
  src: S & FetchUrl<S>;
}

export function ClientFetch<const S extends string>(
  props: ClientFetchProps<S>,
): JSX.Element | null {
  const { adapter, nextId } = useFlowContext();
  const id = nextId();

  return adapter.Placeholder({
    id,
    src: props.src,
    children: null,
  }) as JSX.Element | null;
}
