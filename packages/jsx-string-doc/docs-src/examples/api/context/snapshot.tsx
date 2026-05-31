// Capture current context values and pass them to a child scope
const seed = snapshot();

const childHtml = await withScope(
  async () => {
    // Inherits all values from the parent scope
    const theme = useContext(themeCtx); // still works
    return renderToString(<ChildPage />);
  },
  { seed },
);
