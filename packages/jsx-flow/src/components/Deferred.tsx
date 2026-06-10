import type { MergeType } from "../adapters.js";
import { Flow } from "../context.js";
import { assertFragmentId } from "../fragmentId.js";
import {
  useContext,
  type JSXNode,
  type HTMLAttributes,
} from "@cjean-fr/jsx-string";

interface DeferredBase extends HTMLAttributes {
  name?: string;
  fallback: JSXNode;
}

/** Server pushes the rendered content inline via the stream adapter. */
interface DeferredStreamed extends DeferredBase {
  // Factory, not a node — JSX evaluates eagerly; the thunk defers rendering to streaming time.
  children: () => JSXNode;
  merge?: MergeType;
  src?: never;
}

/** Client fetches the content from `src` after the shell is received. */
interface DeferredFetched extends DeferredBase {
  children?: never;
  src: string;
}

export type DeferredProps = DeferredStreamed | DeferredFetched;

/**
 * Renders a placeholder in the shell. After the shell is sent, the real content
 * is rendered (or fetched from `src`) and delivered to the placeholder as a DOM
 * patch via the active adapter. No client-side hydration — this is server-side
 * deferral.
 */
export function Deferred(props: DeferredProps): any {
  const { name, fallback, children, src } = props;
  const { config, nextId, patch } = useContext(Flow);

  const id = name ?? nextId();
  // The src branch never goes through patch(), so validate here: some adapters
  // interpolate the id into raw() markup that bypasses jsx-string escaping.
  assertFragmentId(id, "Deferred");

  if (src) {
    return config.adapter.Placeholder({ id, src, children: fallback });
  }

  if (!children) {
    throw new Error("Deferred must have children if src is not provided.");
  }

  const merge: MergeType =
    "merge" in props ? (props.merge ?? "replace") : "replace";
  patch(id, children, merge);

  if (config.mode === "streaming") {
    return config.adapter.Placeholder({ id, src: null, children: fallback });
  }

  return config.adapter.Placeholder({
    id,
    src: config.generatePath(id),
    children: fallback,
  });
}
