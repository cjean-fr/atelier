/**
 * Default document Layout. Reads config + meta from DocsContext, renders the
 * full HTML shell with nav + main content.
 *
 * Override with `defineDocs({ components: { Layout: MyLayout } })`. The
 * replacement receives the same `{ children }` prop and reads the same
 * context for everything else.
 */

import { Asset } from "@cjean-fr/jsx-vite";
import { useDocs } from "../context.js";
import type { LayoutProps } from "../types.js";
import { Nav } from "./Nav.js";
import { NavToggle } from "./NavToggle.js";
import { PageFooter } from "./PageFooter.js";
import { TableOfContents } from "./TableOfContents.js";
import { themeInitScript } from "./ThemeToggle.js";

export function Layout({ children }: LayoutProps) {
  const { config, meta } = useDocs();
  const title = meta.title
    ? `${meta.title} — ${config.title}`
    : config.title;
  const description = meta.description ?? config.description;

  return (
    <html lang="en" class="docs-html">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
        {themeInitScript}
        <Asset entry={config.clientEntry} />
      </head>
      <body class="docs-body bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased">
        <NavToggle />
        <div class="docs-shell max-w-6xl mx-auto px-6 flex gap-8 min-h-screen">
          <Nav />
          <main class="docs-main flex-1 py-8 min-w-0">
            {children}
            <PageFooter />
          </main>
          <div class="docs-toc-column hidden xl:block w-48 shrink-0 py-8">
            <TableOfContents />
          </div>
        </div>
      </body>
    </html>
  );
}
