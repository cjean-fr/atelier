import { planTimeoutSignal } from "./fragment-runner.js";
import { describe, it, expect } from "bun:test";

describe("planTimeoutSignal", () => {
  it("factory + entryTimeout + global signal → combined", () => {
    const p = planTimeoutSignal({
      isFactory: true,
      entryTimeout: 3000,
      defaultTimeout: undefined,
      hasGlobalSignal: true,
    });
    expect(p.usesTimer).toBe(true);
    expect(p.timerMs).toBe(3000);
    expect(p.signalSource).toBe("combined");
  });

  it("factory + defaultTimeout + global signal → combined", () => {
    const p = planTimeoutSignal({
      isFactory: true,
      entryTimeout: undefined,
      defaultTimeout: 5000,
      hasGlobalSignal: true,
    });
    expect(p.usesTimer).toBe(true);
    expect(p.timerMs).toBe(5000);
    expect(p.signalSource).toBe("combined");
  });

  it("factory + no timeout + no signal → none", () => {
    const p = planTimeoutSignal({
      isFactory: true,
      entryTimeout: undefined,
      defaultTimeout: undefined,
      hasGlobalSignal: false,
    });
    expect(p.usesTimer).toBe(false);
    expect(p.timerMs).toBeUndefined();
    expect(p.signalSource).toBe("none");
  });

  it("non-factory + entryTimeout + global signal → global, no timer", () => {
    const p = planTimeoutSignal({
      isFactory: false,
      entryTimeout: 3000,
      defaultTimeout: undefined,
      hasGlobalSignal: true,
    });
    expect(p.usesTimer).toBe(false);
    expect(p.timerMs).toBeUndefined();
    expect(p.signalSource).toBe("global");
  });

  it("non-factory + both timeouts + global signal → global, no timer", () => {
    const p = planTimeoutSignal({
      isFactory: false,
      entryTimeout: 3000,
      defaultTimeout: 5000,
      hasGlobalSignal: true,
    });
    expect(p.usesTimer).toBe(false);
    expect(p.timerMs).toBeUndefined();
    expect(p.signalSource).toBe("global");
  });

  it("factory + no global signal + entryTimeout → timer only", () => {
    const p = planTimeoutSignal({
      isFactory: true,
      entryTimeout: 1000,
      defaultTimeout: undefined,
      hasGlobalSignal: false,
    });
    expect(p.usesTimer).toBe(true);
    expect(p.timerMs).toBe(1000);
    expect(p.signalSource).toBe("timer");
  });

  it("factory + no global signal + defaultTimeout → timer only", () => {
    const p = planTimeoutSignal({
      isFactory: true,
      entryTimeout: undefined,
      defaultTimeout: 2000,
      hasGlobalSignal: false,
    });
    expect(p.usesTimer).toBe(true);
    expect(p.timerMs).toBe(2000);
    expect(p.signalSource).toBe("timer");
  });

  it("factory + global signal only (no timeout) → global passed through", () => {
    const p = planTimeoutSignal({
      isFactory: true,
      entryTimeout: undefined,
      defaultTimeout: undefined,
      hasGlobalSignal: true,
    });
    expect(p.usesTimer).toBe(false);
    expect(p.timerMs).toBeUndefined();
    expect(p.signalSource).toBe("global");
  });

  it("entryTimeout overrides defaultTimeout when both set", () => {
    const p = planTimeoutSignal({
      isFactory: true,
      entryTimeout: 100,
      defaultTimeout: 5000,
      hasGlobalSignal: false,
    });
    expect(p.timerMs).toBe(100);
    expect(p.signalSource).toBe("timer");
  });

  it("entryTimeout=0 is a valid timeout (fires immediately)", () => {
    const p = planTimeoutSignal({
      isFactory: true,
      entryTimeout: 0,
      defaultTimeout: undefined,
      hasGlobalSignal: true,
    });
    expect(p.usesTimer).toBe(true);
    expect(p.timerMs).toBe(0);
    expect(p.signalSource).toBe("combined");
  });

  it("description is populated for each signal source", () => {
    const combined = planTimeoutSignal({
      isFactory: true,
      entryTimeout: 100,
      defaultTimeout: undefined,
      hasGlobalSignal: true,
    });
    expect(combined.description).toContain("AbortSignal.any");

    const global = planTimeoutSignal({
      isFactory: true,
      entryTimeout: undefined,
      defaultTimeout: undefined,
      hasGlobalSignal: true,
    });
    expect(global.description).toContain("global signal");

    const timer = planTimeoutSignal({
      isFactory: true,
      entryTimeout: 100,
      defaultTimeout: undefined,
      hasGlobalSignal: false,
    });
    expect(timer.description).toContain("timer.signal");

    const none = planTimeoutSignal({
      isFactory: true,
      entryTimeout: undefined,
      defaultTimeout: undefined,
      hasGlobalSignal: false,
    });
    expect(none.description).toContain("no signal");
  });
});
