// Each render's bindings are completely isolated
const [lightHtml, darkHtml] = await Promise.all([
  renderToString(() => <Page />, { context: [themeCtx.with("light")] }),
  renderToString(() => <Page />, { context: [themeCtx.with("dark")] }),
]);
