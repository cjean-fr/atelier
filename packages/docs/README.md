# @cjean-fr/docs

> 🚧 Early development — version 0.1.0.

Documentation site builder on top of [@cjean-fr/jsx-string](../jsx-string) +
[jsx-flow](../jsx-flow) + [jsx-vite](../jsx-vite).

Status: **Phases 1–2** shipped. See [`DOCS_SPEC.md`](../DOCS_SPEC.md) for the
full design.

## Tailwind 4 setup

```css
@import "tailwindcss";
@import "@cjean-fr/docs/tailwind.css";
```

The bundled `tailwind.css` wires the `dark:` variant to the `.dark` class
on `<html>` (so the built-in ThemeToggle works), imports the theme tokens
and Shiki rules, and tells Tailwind to scan the docs JS bundles so utility
classes referenced by built-in components are generated.

## Non-Tailwind setup

```css
@import "@cjean-fr/docs/style.css";
```

Includes everything in a single file — tokens, Shiki rules, structural
layout — no Tailwind required.

## License

MIT © Christophe Jean
