import { renderToStatic } from "@cjean-fr/jsx-flow";

// Pure-static: no <Deferred>, no adapter needed.
await renderToStatic(async (ctx) => {
  for (const page of pages) {
    const html = await ctx.renderPage(() => <page.Component />);
    await Bun.write(page.out, "<!DOCTYPE html>\n" + html);
  }
});
