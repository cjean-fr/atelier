# @cjean-fr/build-core

> 🚧 Early development — version 0.1.0.

Kernel for static-site builders on top of [@cjean-fr/jsx-string](../jsx-string).
Shared by [@cjean-fr/docs](../../apps/docs) (documentation sites) and the
future `@cjean-fr/blog`.

You usually don't install this directly — pick a distro (`@cjean-fr/docs`,
`@cjean-fr/blog`) instead. Use this package only if you're building your
own distro.

## What it provides

- **Filesystem routing** — `discoverPages(config)` walks a pages directory,
  imports each module, normalizes `meta` + URL.
- **Sitemap + RSS** — `generateSitemap()`, `generateRss()` from page metadata.
- **Last modified** — `getLastModified(file)` / `preloadLastModified(files)` —
  batched `git log` lookup.
- **TOC injection** — `injectToc(html)` finds `<h2>`/`<h3>` and emits a
  table-of-contents fragment.
- **Search adapter contract** — `SearchAdapter` interface + bundled `builtin()`
  factory (substring index, JSON storage, tiny client).
- **Edit URL resolution** — `resolveEditUrl(template, file)`.

## What it does NOT provide

- A Layout, components, or theme — distros own that.
- A CLI binary — distros expose `docs build`, `blog build`, etc.
- A Vite plugin — currently lives in `@cjean-fr/docs`; extraction planned
  when the second distro emerges.

## License

MIT © Christophe Jean
