import { useIslandsContext } from "../context.js";
import type { JSXChild, StandardAttributes } from "@cjean-fr/jsx-string";

interface IslandBase extends StandardAttributes {
  name?: string;
  fallback: JSXChild;
}

interface IslandWithChildren extends IslandBase {
  children: () => JSXChild;
  src?: never;
}
interface IslandWithSrc extends IslandBase {
  children?: never;
  src: string;
}

export type IslandProps = IslandWithChildren | IslandWithSrc;

export function Island({ name, fallback, children, src }: IslandProps): any {
  const { config, nextId, collected } = useIslandsContext();

  const id = name ?? nextId();

  if (src) {
    return config.adapter.Placeholder({ id, src, children: fallback });
  }

  if (!children) {
    throw new Error("Island must have children if src is not provided.");
  }

  collected.set(id, children);

  if (config.mode === "streaming") {
    return config.adapter.Placeholder({ id, src: null, children: fallback });
  }

  return config.adapter.Placeholder({
    id,
    src: config.generatePath(id),
    children: fallback,
  });
}
