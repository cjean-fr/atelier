/**
 * Default document Layout. Reads config + meta from DocsContext, renders the
 * full HTML shell with nav + main content.
 *
 * Override with `defineConfig({ components: { Layout: MyLayout } })`. The
 * replacement receives the same `{ children }` prop and reads the same
 * context for everything else.
 */
import { useDocs } from "../context.js";
import type { LayoutProps } from "../types.js";
import { Nav } from "./Nav.js";
import { NavToggle } from "./NavToggle.js";
import { PageFooter } from "./PageFooter.js";
import { TableOfContents } from "./TableOfContents.js";
import { themeInitScript } from "./ThemeToggle.js";
import { Asset } from "@cjean-fr/jsx-vite";

export function Layout({ children }: LayoutProps) {
  const { config, meta } = useDocs();
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
        <Asset entry={config.clientEntry} />
      </head>
      <body class="docs-body bg-white text-gray-900 antialiased dark:bg-gray-950 dark:text-gray-100">
        <NavToggle />
        <div class="docs-shell mx-auto flex min-h-screen max-w-6xl gap-8 px-6">
          <Nav />
          <main class="docs-main min-w-0 flex-1 py-8">
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
