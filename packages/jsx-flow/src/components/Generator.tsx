import type { MergeType } from "../adapters.js";
import { Flow } from "../context.js";
import { useContext, type JSXNode } from "@cjean-fr/jsx-string";

export interface GeneratorProps {
  /** Id of the existing DOM element each item is patched into. */
  target: string;
  /**
   * Factory returning the sequence to stream — a sync or async iterable
   * (array, Set, generator, async generator, …). A factory (not the iterable
   * itself) so consumption is deferred to streaming time, like `<Deferred>`.
   */
  source: () => Iterable<unknown> | AsyncIterable<unknown>;
  /**
   * Optional transform applied to each item before rendering. Use it when the
   * source yields raw data; omit it when it already yields JSX nodes.
   */
  map?: (item: any) => JSXNode;
  /** How each rendered item is applied to `target`. Default `"append"`. */
  merge?: MergeType;
}

/**
 * Streams a sequence into an existing DOM element: every item produced by
 * `source` is rendered (optionally through `map`) and delivered as a patch to
 * `target` as soon as it is available. Renders nothing in the shell itself —
 * point `target` at a container you already rendered (e.g. `<ul id="feed">`).
 *
 * @example
 * <ul id="feed"><li>Loading…</li></ul>
 * <Generator target="feed" source={() => streamRows()} map={Row} />
 */
export function Generator({
  target,
  source,
  map,
  merge = "append",
}: GeneratorProps): null {
  const { stream } = useContext(Flow);
  stream({ target, source, map, merge });
  return null;
}
