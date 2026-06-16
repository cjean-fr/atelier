import plugin from "./index.js";
import { describe, it, expect } from "bun:test";

describe("plugin index", () => {
  it("default exports the plugin object", () => {
    expect(plugin).toBeDefined();
    expect(typeof plugin).toBe("object");
  });

  it("has all 6 rules", () => {
    const ruleNames = Object.keys(plugin.rules).sort();
    expect(ruleNames).toEqual([
      "no-context",
      "no-javascript-urls",
      "no-react-hooks",
      "no-react-imports",
      "no-refs",
      "no-unsafe-event-handlers",
    ]);
  });

  it("each rule has meta, no schema, and at least one message", () => {
    for (const [, rule] of Object.entries(plugin.rules) as Array<
      [
        string,
        {
          meta?: {
            type?: string;
            schema?: Array<unknown>;
            messages?: Record<string, string>;
          };
        },
      ]
    >) {
      expect(rule.meta).toBeDefined();
      expect(rule.meta!.schema).toEqual([]);
      expect(rule.meta!.messages).toBeDefined();
      expect(Object.keys(rule.meta!.messages!).length).toBeGreaterThanOrEqual(
        1,
      );
    }
  });

  it("has recommended config", () => {
    expect(plugin.configs).toBeDefined();
    expect(plugin.configs.recommended).toBeDefined();
  });

  it("recommended config has all 6 rules with correct severities", () => {
    const recommended = plugin.configs.recommended.rules;
    expect(recommended).toEqual({
      "@cjean-fr/jsx-string/no-react-imports": "error",
      "@cjean-fr/jsx-string/no-react-hooks": "error",
      "@cjean-fr/jsx-string/no-unsafe-event-handlers": "warn",
      "@cjean-fr/jsx-string/no-javascript-urls": "error",
      "@cjean-fr/jsx-string/no-context": "error",
      "@cjean-fr/jsx-string/no-refs": "error",
    });
  });

  it("every rule in recommended config exists in rules map", () => {
    const prefix = "@cjean-fr/jsx-string/";
    const ruleKeys = Object.keys(plugin.rules);
    for (const key of Object.keys(plugin.configs.recommended.rules)) {
      const ruleName = key.startsWith(prefix) ? key.slice(prefix.length) : key;
      expect(ruleKeys).toContain(ruleName);
    }
  });

  it("recommended config references the plugin object itself", () => {
    expect(plugin.configs.recommended.plugins["@cjean-fr/jsx-string"]).toBe(
      plugin,
    );
  });
});
