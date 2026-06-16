import { renderToStatic, NativeAdapter } from "@cjean-fr/jsx-flow";

// Pages use <Defer>: emit fragment files after rendering all pages.
await renderToStatic(
  async (ctx) => {
    for (const page of pages) {
      const html = await ctx.renderPage(() => <page.Component />);
      await Bun.write(page.out, "<!DOCTYPE html>\n" + html);
    }

    // One .html file per deferred fragment — already Frame-wrapped, ready to write.
    await ctx.emitFragments((_id, url, html) =>
      Bun.write("./dist" + url, html),
    );
  },
  { adapter: NativeAdapter },
);
