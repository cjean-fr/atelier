# @cjean-fr/docs

> 🚧 Early development — version 0.1.0.

Documentation site builder on top of [@cjean-fr/jsx-string](../jsx-string) +
[jsx-flow](../jsx-flow) + [jsx-vite](../jsx-vite).

Status: **Phases 1–2** shipped. See [`DOCS_SPEC.md`](../DOCS_SPEC.md) for the
full design.

## Theming

Tailwind 4 is the theming layer. In your stylesheet:

```css
@import "tailwindcss";
@import "@cjean-fr/docs/main.css";
```

`main.css` ships as source — your Tailwind compiles it. It wires the
`dark:` variant to the `.dark` class on `<html>` (so the built-in
ThemeToggle works), imports the theme tokens and Shiki rules, and tells
Tailwind to scan the published docs JS bundles so utility classes
referenced by built-in components are generated. `docs init` sets this up
for you.

## License

MIT © Christophe Jean
