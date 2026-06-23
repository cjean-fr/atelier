import { useFlowContext } from "../context.js";
import type { JSXNode } from "@cjean-fr/jsx-string";
import type { JSX } from "@cjean-fr/jsx-string";

export interface SlotProps {
  name: string;
  children?: JSXNode;
}

export function Slot(props: SlotProps): JSX.Element | null {
  const { adapter, config } = useFlowContext();
  const { name, children } = props;

  return adapter.Placeholder({
    id: name,
    src: config.mode === "static" ? config.generatePath(name) : null,
    children: children ?? null,
  }) as JSX.Element | null;
}
