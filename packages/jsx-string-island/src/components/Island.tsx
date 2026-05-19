import { Islands } from "../context.js";
import {
  useContext,
  type JSXNode,
  type HTMLAttributes,
} from "@cjean-fr/jsx-string";

interface IslandBase extends HTMLAttributes {
  name?: string;
  fallback: JSXNode;
}

interface IslandWithChildren extends IslandBase {
  children: () => JSXNode;
  src?: never;
}
interface IslandWithSrc extends IslandBase {
  children?: never;
  src: string;
}

export type IslandProps = IslandWithChildren | IslandWithSrc;

export function Island({ name, fallback, children, src }: IslandProps): any {
  const { config, nextId, collected } = useContext(Islands);

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
