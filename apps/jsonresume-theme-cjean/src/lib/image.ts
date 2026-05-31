import { generateGoogleFaviconUrl } from "./google.js";
import { emailToHash, generateGravatarUrl } from "./gravatar.js";
import { generateWSRVUrl } from "./wsrv.js";

/**
 * Get the company logo from an URL.
 * @param url The URL to get the logo from
 * @param size The size of the logo
 * @returns The optimized logo
 */
export async function getLogoFromUrl(
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
      console.warn(
        `Error while fetching logo from ${url}: ${response.statusText}`,
      );
      return undefined;
    }

    return await response.text();
  } catch (e) {
    return undefined;
  }
}

export async function getPictureFromEmail(
  email: string,
  size: number = 200,
): Promise<string | undefined> {
  const hash = await emailToHash(email);

  try {
    const gravatarUrl = generateGravatarUrl(hash, {
      size,
      d: "404",
    });

    const cdnUrl = generateWSRVUrl(gravatarUrl, {
      w: size,
      h: size,
      output: "webp",
      encoding: "base64",
    });

    const response = await fetch(cdnUrl);
    if (!response.ok) {
      console.warn(
        `Error while fetching gravatar from ${email}: ${response.statusText}`,
      );
      return undefined;
    }

    return await response.text();
  } catch (e) {
    return undefined;
  }
}
