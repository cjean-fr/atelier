/**
 * Generate a Google favicon URL.
 * @param url The URL to generate a favicon for.
 * @param size The size of the favicon.
 * @returns The Google favicon URL.
 */
export function generateGoogleFaviconUrl(
  url: string,
  size: number = 64,
): string {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(url)}&sz=${size}`;
}
