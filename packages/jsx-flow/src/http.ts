import { NativeAdapter, type PatchAdapter } from "./adapters.js";
import type { FlowOptions, Negotiation } from "./events.js";
import { renderToFlowEvents } from "./render.js";
import { type ContextBinding, type JSXNode } from "@cjean-fr/jsx-string";

export type { Negotiation };

/**
 * Create a `Response` from a page component and an adapter, using the
 * adapter's HTTP negotiation to pick encoding mode and response headers.
 *
 * @example
 * ```ts
 * Bun.serve({
 *   async fetch(req) {
 *     return flowResponse(req, () => <App />, TurboAdapter, {
 *       context: [Session.with(await getSession(req))],
 *     });
 *   },
 * });
 * ```
 */
export async function flowResponse(
  req: Request,
  page: (n: Negotiation) => JSXNode,
  adapter: PatchAdapter,
  opts?: FlowOptions & ResponseInit & { context?: readonly ContextBinding[] },
): Promise<Response> {
  const n = adapter.negotiate?.(req) ?? {};
  const body = renderToFlowEvents(() => page(n), adapter, {
    ...opts,
    mode: n.mode,
  })
    .pipeThrough(adapter.encode())
    .pipeThrough(new TextEncoderStream());
  // Defaults, then caller headers, then negotiation headers — the protocol
  // headers (X-Up-*, Vary…) must win over both.
  const headers = new Headers({ "content-type": "text/html; charset=utf-8" });
  for (const [k, v] of new Headers(opts?.headers ?? {})) headers.set(k, v);
  for (const [k, v] of new Headers(n.headers ?? {})) headers.set(k, v);
  return new Response(body, { ...opts, headers });
}

/**
 * Unpoly adapter for jsx-flow.
 *
 * Unpoly protocol: https://unpoly.com/up.protocol
 *
 * Two modes:
 * 1. Initial page load — uses NativeAdapter's polyfill for streaming.
 * 2. Navigation / form submit — `negotiate()` reads X-Up-* headers and returns
 *    hints. The app uses `n.target` / `n.failTarget` to decide which layer to render.
 */
export const UnpolyAdapter: PatchAdapter = {
  Placeholder: NativeAdapter.Placeholder,
  Patch: NativeAdapter.Patch,
  Frame: NativeAdapter.Frame,
  transformShell: NativeAdapter.transformShell,
  encode: NativeAdapter.encode,

  negotiate(req: Request): Negotiation {
    const target = req.headers.get("X-Up-Target") ?? undefined;
    const failTarget = req.headers.get("X-Up-Fail-Target") ?? undefined;
    // X-Up-Target present = fragment request: the client only needs patches.
    const mode = target ? ("patches-only" as const) : undefined;

    // Unpoly protocol: request headers that influenced the response must be
    // listed in Vary, and the resolved target is echoed back.
    const headers: Record<string, string> = {
      Vary: "X-Up-Target, X-Up-Fail-Target",
    };
    if (target) headers["X-Up-Target"] = target;
    if (failTarget) headers["X-Up-Fail-Target"] = failTarget;

    return { headers, mode, target, failTarget };
  },
};
