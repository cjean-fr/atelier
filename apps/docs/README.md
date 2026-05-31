# @cjean-fr/docs

> 🚧 Early development — version 0.1.0.

Documentation site builder on top of [@cjean-fr/jsx-string](../jsx-string) +
[jsx-flow](../jsx-flow) + [jsx-vite](../jsx-vite).

Status: **Phases 1–2** shipped. See [`DOCS_SPEC.md`](../DOCS_SPEC.md) for the
full design.

## Tailwind 4 setup

If your project uses Tailwind 4 (the recommended default), your
`styles/main.css` needs three things:

```css
@import "tailwindcss";

/* Make the `dark:` variant follow the `.dark` class on <html>, so the
 * ThemeToggle button can switch modes (instead of relying only on
 * prefers-color-scheme). */
@custom-variant dark (&:where(.dark, .dark *));

/* CSS variables + Shiki multi-theme switching rules. Required for syntax
 * highlighting colors to react to dark/light mode. */
@import "@cjean-fr/docs/tokens.css";
@import "@cjean-fr/docs/shiki.css";

/* Scan @cjean-fr/docs bundled JS so its Tailwind utility classes get
 * generated (component templates + injected TOC HTML). Adjust the relative
 * path to your `node_modules`. */
@source "../node_modules/@cjean-fr/docs/dist/**/*.js";
```

Without `@custom-variant dark`, the toggle changes state but nothing reacts.
Without `shiki.css`, code blocks render but have no colors.
Without `@source`, the components ship without their utility classes.

## Non-Tailwind setup

Import the bundled `style.css` instead — it includes everything in a single
file (tokens, Shiki rules, structural layout):

```css
@import "@cjean-fr/docs/style.css";
```

## License

MIT © Christophe Jean
