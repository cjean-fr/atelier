import { NativeAdapter } from "./adapters.js";
import { renderStream } from "./render.js";
import type {
  FlowOptions,
  Negotiate,
  Negotiation,
  StreamingAdapter,
} from "./types.js";
import type { JSXNode } from "@cjean-fr/jsx-string";

export type { Negotiate, Negotiation } from "./types.js";

// `Vary` is a comma-separated list, so later sources must union their tokens
// into it rather than overwrite — otherwise a negotiator's `Vary: HX-Target`
// would silently drop a caller's `Vary: Cookie`, corrupting shared-cache keys.
function appendVary(headers: Headers, value: string): void {
  const seen = new Set<string>();
  const tokens: string[] = [];
  const add = (list: string | null) => {
    if (!list) return;
    for (const raw of list.split(",")) {
      const tok = raw.trim();
      const key = tok.toLowerCase();
      if (tok && !seen.has(key)) {
        seen.add(key);
        tokens.push(tok);
      }
    }
  };
  add(headers.get("vary"));
  add(value);
  headers.set("vary", tokens.join(", "));
}

function mergeHeaders(
  defaults?: HeadersInit,
  caller?: HeadersInit,
  negotiation?: HeadersInit,
): Headers {
  const headers = new Headers(defaults);
  for (const source of [caller, negotiation]) {
    for (const [k, v] of new Headers(source ?? {})) {
      if (k === "vary") appendVary(headers, v);
      else headers.set(k, v);
    }
  }
  return headers;
}

function buildResponse(
  body: ReadableStream<Uint8Array> | string,
  init?: ResponseInit,
): Response {
  return new Response(body, init);
}

/**
 * Create a `Response` from a page component and an adapter.
 *
 * Negotiation is opt-in and orthogonal to the adapter: pass `negotiate` (e.g.
 * `negotiateHtmx` / `negotiateUnpoly`, or your own) to extract per-request hints
 * and headers. Without it, the full page is rendered — the client library
 * extracts its own target. `mode: "fragment"` (shell suppressed) is an
 * explicit opt-in; it only produces output when the targeted content is
 * expressed as `<Defer>` fragments.
 *
 * @example
 * Bun.serve({
 *   fetch: (req) =>
 *     serve(req, (n) => <App n={n} />, NativeAdapter, {
 *       negotiate: negotiateUnpoly,
 *     }),
 * });
 */
export async function serve(
  req: Request,
  page: (n: Negotiation) => JSXNode,
  adapter: StreamingAdapter = NativeAdapter,
  opts?: FlowOptions &
    ResponseInit & {
      negotiate?: Negotiate;
      mode?: "full" | "fragment";
    },
): Promise<Response> {
  const n = opts?.negotiate?.(req) ?? {};
  const body = renderStream(() => page(n), adapter, {
    ...opts,
    mode: opts?.mode ?? n.mode,
  }).pipeThrough(new TextEncoderStream());
  const headers = mergeHeaders(
    { "content-type": "text/html; charset=utf-8" },
    opts?.headers,
    n.headers,
  );
  return buildResponse(body, { ...opts, headers });
}

/**
 * HTMX negotiation: read `HX-Target`, and `Vary` on it so shared caches never
 * serve a fragment response to a full-page navigation.
 */
export function negotiateHtmx(req: Request): Negotiation {
  const target = req.headers.get("HX-Target") ?? undefined;
  return { headers: { Vary: "HX-Target" }, target };
}

/**
 * Unpoly negotiation (https://unpoly.com/up.protocol): read `X-Up-Target` /
 * `X-Up-Fail-Target`, echo them back, and `Vary` on them.
 *
 * Pairs with `NativeAdapter` (Unpoly's wire format is the Native one). It does
 * NOT force `"fragment"` — pass `mode: "fragment"` to `serve`
 * yourself, knowing the targeted content must be `<Defer>` fragments for the
 * shell-suppressed response to carry anything.
 */
export function negotiateUnpoly(req: Request): Negotiation {
  const target = req.headers.get("X-Up-Target") ?? undefined;
  const failTarget = req.headers.get("X-Up-Fail-Target") ?? undefined;
  // Unpoly protocol: request headers that influenced the response must be
  // listed in Vary, and the resolved target is echoed back.
  const headers: Record<string, string> = {
    Vary: "X-Up-Target, X-Up-Fail-Target",
  };
  if (target) headers["X-Up-Target"] = target;
  if (failTarget) headers["X-Up-Fail-Target"] = failTarget;
  return { headers, target, failTarget };
}
