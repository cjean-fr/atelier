import { renderToStatic, NativeAdapter } from "@cjean-fr/jsx-flow";

// Pages use <Deferred>: emit fragment files after rendering all pages.
await renderToStatic(
  async (ctx) => {
    for (const page of pages) {
      const html = await ctx.renderPage(() => <page.Component />);
      await Bun.write(page.out, "<!DOCTYPE html>\n" + html);
    }

    // Writes one .html file per deferred fragment.
    await ctx.emitFragments(async (_id, url, html) => {
      await Bun.write("./dist" + url, html);
    });
  },
  { adapter: NativeAdapter },
);
