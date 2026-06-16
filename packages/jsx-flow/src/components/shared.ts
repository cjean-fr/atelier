import { Flow } from "../context.js";
import { useContext } from "@cjean-fr/jsx-string";

export function useFlowContext() {
  const flow = useContext(Flow);
  return {
    config: flow.config,
    pendingStore: flow.pendingStore,
    adapter: flow.config.adapter,
    nextId: flow.nextId,
    defer: flow.defer,
  };
}
