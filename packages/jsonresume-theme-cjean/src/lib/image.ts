/**
 * Generate a Google favicon URL.
 * @param url The URL to generate a favicon for.
 * @param size The size of the favicon.
 * @returns The Google favicon URL.
 */
function generateGoogleFaviconUrl(url: string, size: number = 64): string {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(url)}&sz=${size}`;
}

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

/**
 * Get an optimized base64 image from a URL.
 * @param url The URL to get an image from.
 * @param size The size of the image.
 * @returns The optimized base64 image.
 */
export async function getOptimizedBase64Image(
  url?: string,
  size: number = 64,
): Promise<string | undefined> {
  if (!url) return undefined;

  try {
    const googleFaviconUrl = generateGoogleFaviconUrl(url, size);
    const cdnUrl = generateWSRVUrl(googleFaviconUrl, {
      w: size,
      h: size,
      output: "webp",
      encoding: "base64",
    });

    const response = await fetch(cdnUrl);
    if (!response.ok) {
      console.warn(cdnUrl, response);
      return undefined;
    }

    return await response.text();
  } catch (e) {
    return undefined;
  }
}
