// Each withScope call is completely isolated
const [lightHtml, darkHtml] = await Promise.all([
  withScope(async () => {
    setContext(themeCtx, "light");
    return renderToString(<Page />);
  }),
  withScope(async () => {
    setContext(themeCtx, "dark");
    return renderToString(<Page />);
  }),
]);
