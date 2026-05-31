import { Patch, renderToReadableStream, TurboAdapter } from "@cjean-fr/jsx-flow";

// Patches an existing DOM element — renders nothing in the shell.
function LiveBadge() {
  return (
    <Patch target="nav-count">
      {() => <span>42</span>}
    </Patch>
  );
}

// Merge types: "replace" (default) | "append" | "prepend" | "before" | "after"
function AppendLog() {
  return (
    <Patch target="log-list" merge="append">
      {() => <li>New entry</li>}
    </Patch>
  );
}
