type GravatarOptions = {
  size?: number;
  rating?: "g" | "pg" | "r" | "x";
  d?:
    | "404"
    | "mp"
    | "identicon"
    | "monsterid"
    | "wavatar"
    | "retro"
    | "robohash"
    | "blank";
};

/**
 * Convert an email to a SHA-256 hash.
 * @param email The email to convert.
 * @returns The SHA-256 hash of the email.
 */
export async function emailToHash(email: string): Promise<string> {
  const hashBuffer = await crypto.subtle.digest(
    "sha-256",
    new TextEncoder().encode(email.trim().toLowerCase()),
  );
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Generate a gravatar URL from an email hash.
 * @param hash The email hash.
 * @param options The gravatar options.
 * @returns The gravatar picture.
 */
export function generateGravatarUrl(
  hash: string,
  options: GravatarOptions = {},
): string {
  const gravatarUrl = new URL(`https://www.gravatar.com/avatar/${hash}`);
  if (options.size) gravatarUrl.searchParams.set("s", options.size.toString());
  if (options.rating) gravatarUrl.searchParams.set("r", options.rating);
  if (options.d) gravatarUrl.searchParams.set("d", options.d);
  return gravatarUrl.toString();
}
