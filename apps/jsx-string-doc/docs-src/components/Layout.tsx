/** @jsxImportSource @cjean-fr/jsx-string */
import { useDocs } from "../context.js";
import { Nav } from "./Nav.js";
import { NavToggle } from "./NavToggle.js";
import { PageFooter } from "./PageFooter.js";
import { TableOfContents } from "./TableOfContents.js";
import { themeInitScript } from "./ThemeToggle.js";
import type { JSXNode } from "@cjean-fr/jsx-string";
import { Asset } from "@cjean-fr/jsx-vite";

export function Layout({ children }: { children: JSXNode }) {
  const { config, meta, currentPage } = useDocs();
  const title = meta.title ? `${meta.title} — ${config.title}` : config.title;
  const description = meta.description ?? config.description;
  const image = meta.image ?? config.image;
  const canonical = config.site ? config.site + currentPage : null;

  return (
    <html lang="en" class="docs-html">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
        {canonical && <link rel="canonical" href={canonical} />}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        {description && (
          <meta property="og:description" content={description} />
        )}
        {canonical && <meta property="og:url" content={canonical} />}
        {image && <meta property="og:image" content={image} />}
        <meta
          name="twitter:card"
          content={image ? "summary_large_image" : "summary"}
        />
        <meta name="twitter:title" content={title} />
        {description && (
          <meta name="twitter:description" content={description} />
        )}
        {image && <meta name="twitter:image" content={image} />}
        {themeInitScript}
        <Asset entry="docs-src/client.ts" />
      </head>
      <body class="docs-body bg-white text-gray-900 antialiased dark:bg-gray-950 dark:text-gray-100">
        <a href="#docs-main" class="docs-skip-link">
          Skip to content
        </a>
        <NavToggle />
        <div
          data-docs-nav-backdrop
          class="docs-nav-backdrop fixed inset-0 z-30 bg-gray-900/40 opacity-0 backdrop-blur-sm data-[open]:opacity-100 md:hidden dark:bg-black/60"
        />
        <div class="docs-shell mx-auto flex min-h-screen max-w-7xl gap-8 px-6">
          <Nav />
          <main
            id="docs-main"
            class="docs-main min-w-0 flex-1 py-8"
            tabindex={-1}
          >
            {children}
            <PageFooter />
          </main>
          <div class="docs-toc-column hidden w-48 shrink-0 py-8 xl:block">
            <TableOfContents />
          </div>
        </div>
      </body>
    </html>
  );
}
