// Safe to call concurrently — scopes are fully isolated
const [pageA, pageB] = await Promise.all([
  renderToString(<PageA />),
  renderToString(<PageB />),
]);
