import type { DeferContent } from "../types.js";
import { assertFragmentId } from "../utils.js";
import { useFlowContext } from "./shared.js";
import type { JSX } from "@cjean-fr/jsx-string";

export interface SlotProps {
  name: string;
  children?: DeferContent;
}

export function Slot(props: SlotProps): JSX.Element | null {
  const { adapter, config, defer } = useFlowContext();
  const { name, children } = props;

  assertFragmentId(name, "Slot");

  if (children != null) {
    defer(name, {
      content: children,
      merge: "replace",
    });

    return adapter.Placeholder({
      id: name,
      src: config.mode === "static" ? config.generatePath(name) : null,
      children: null,
    }) as JSX.Element | null;
  }

  return adapter.Placeholder({
    id: name,
    src: null,
    children: null,
  }) as JSX.Element | null;
}
