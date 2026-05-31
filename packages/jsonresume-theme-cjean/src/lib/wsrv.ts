type WSRVOptions = {
  w?: number;
  h?: number;
  fit?: "cover" | "contain" | "fill" | "inside" | "outside";
  a?:
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "center"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "entropy"
    | "attention";
  output?: "webp" | "avif" | "png" | "jpg";
  encoding?: "base64" | null;
};

/**
 * Generate a URL for the WSRV CDN.
 * @param url The URL to proxy.
 * @param options The WSRV options.
 * @returns The WSRV URL.
 */
export function generateWSRVUrl(
  url: string,
  options: WSRVOptions = {},
): string {
  const wsrvUrl = new URL("https://wsrv.nl/");
  wsrvUrl.searchParams.set("url", url);
  if (options.w) wsrvUrl.searchParams.set("w", options.w.toString());
  if (options.h) wsrvUrl.searchParams.set("h", options.h.toString());
  if (options.output) wsrvUrl.searchParams.set("output", options.output);
  if (options.encoding) wsrvUrl.searchParams.set("encoding", options.encoding);
  if (options.fit) wsrvUrl.searchParams.set("fit", options.fit);
  if (options.a) wsrvUrl.searchParams.set("a", options.a);
  return wsrvUrl.toString();
}
