import { Docs } from "../context.js";
import { Nav } from "./Nav.js";
import { NavToggle } from "./NavToggle.js";
import { PageFooter } from "./PageFooter.js";
import { TableOfContents } from "./TableOfContents.js";
import { themeInitScript } from "./ThemeToggle.js";
import type { JSXNode } from "@cjean-fr/jsx-string";
import { Asset } from "@cjean-fr/jsx-vite";

export function Layout({ children }: { children: JSXNode }) {
  const { config, meta } = Docs.get();
  const title = meta.title ? `${meta.title} — ${config.title}` : config.title;
  const description = meta.description ?? config.description;

  return (
    <html lang="en" class="docs-html">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
        {themeInitScript}
        <Asset entry="docs-src/client.ts" />
      </head>
      <body class="docs-body bg-white text-gray-900 antialiased dark:bg-gray-950 dark:text-gray-100">
        <NavToggle />
        <div
          data-docs-nav-backdrop
          class="docs-nav-backdrop fixed inset-0 z-30 hidden bg-gray-900/40 backdrop-blur-sm data-[open]:block md:hidden dark:bg-black/60"
        />
        <div class="docs-shell mx-auto flex min-h-screen max-w-6xl gap-8 px-6">
          <Nav />
          <main id="docs-main" class="docs-main min-w-0 flex-1 py-8">
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
