import { useFlowContext } from "./shared.js";
import type { JSX } from "@cjean-fr/jsx-string";

export interface ClientFetchProps {
  src: string;
}

export function ClientFetch(props: ClientFetchProps): JSX.Element | null {
  const { adapter, nextId } = useFlowContext();
  const id = nextId();

  return adapter.Placeholder({
    id,
    src: props.src,
    children: null,
  }) as JSX.Element | null;
}
