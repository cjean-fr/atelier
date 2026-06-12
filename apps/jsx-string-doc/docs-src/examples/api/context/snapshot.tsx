// Capture the bindings active right now; replay them later, anywhere —
// for work that escapes the current async call tree (a queue, a timer)
// but must still render under the bindings that scheduled it.
const restore = snapshot();

// …later, possibly long after the original scope ended:
const html = await restore(() => renderToString(() => <ChildPage />));
