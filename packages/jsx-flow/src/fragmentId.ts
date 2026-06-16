const FRAGMENT_ID = /^[a-zA-Z][a-zA-Z0-9_-]*$/;

// Validates that an id is safe for use as a DOM id, a CSS selector, and in
// raw HTML attributes like <?start name="id"> that bypass jsx-string escaping.
export function assertFragmentId(id: string, label: string): void {
  if (!FRAGMENT_ID.test(id)) {
    throw new Error(
      `${label}: "${id}" is not a valid fragment id. Use letters, digits, hyphens and underscores only, starting with a letter.`,
    );
  }
}
