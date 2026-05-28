import { Flow } from "../context.js";
import type { MergeType } from "../adapters.js";
import {
  useContext,
  type JSXNode,
  type HTMLAttributes,
} from "@cjean-fr/jsx-string";

interface IslandBase extends HTMLAttributes {
  name?: string;
  fallback: JSXNode;
}

/** Server pushes the rendered content inline via the stream adapter. */
interface IslandStreamed extends IslandBase {
  // Factory, not a node — JSX evaluates eagerly; the thunk defers rendering to streaming time.
  children: () => JSXNode;
  merge?: MergeType;
  src?: never;
}

/** Client fetches the content from `src` after the shell is received. */
interface IslandFetched extends IslandBase {
  children?: never;
  src: string;
}

export type IslandProps = IslandStreamed | IslandFetched;

export function Island(props: IslandProps): any {
  const { name, fallback, children, src } = props;
  const { config, nextId, enqueue } = useContext(Flow);

  const id = name ?? nextId();

  if (src) {
    return config.adapter.Placeholder({ id, src, children: fallback });
  }

  if (!children) {
    throw new Error("Island must have children if src is not provided.");
  }

  const merge: MergeType = "merge" in props ? (props.merge ?? "replace") : "replace";
  enqueue("fragment", id, children, merge);

  if (config.mode === "streaming") {
    return config.adapter.Placeholder({ id, src: null, children: fallback });
  }

  return config.adapter.Placeholder({
    id,
    src: config.generatePath(id),
    children: fallback,
  });
}
