---
title: Markdown Test
description: A page written in Markdown to validate the .md pipeline.
sidebar:
  group: Guide
  order: 99
---

# Markdown Test

This page is written in **Markdown**, not JSX. It demonstrates that
`@cjean-fr/docs` can mix `.tsx` and `.md` pages in the same site.

## Lists

- Item one
- Item two with `inline code`
- Item three with a [link](/guide/installation)

## Code

```ts
function greet(name: string): string {
  return `Hello, ${name}!`;
}
```

## Raw HTML

<div style="padding: 1rem; border: 1px solid #ccc;">
  Raw HTML is allowed inline.
</div>
