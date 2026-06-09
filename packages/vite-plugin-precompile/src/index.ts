import type { Plugin, ResolvedConfig } from "vite";
import precompileTransform, {
  type PluginConfig,
  type RenderAttr,
} from "./transformer.js";
import { RUNTIME_SOURCE } from "@cjean-fr/precompile-core";

export type { PluginConfig };

export default function vitePrecompile(config?: PluginConfig): Plugin {
  let rs: string | null = null;
  let renderAttr: RenderAttr | null = null;

  return {
    name: "@cjean-fr/vite-plugin-precompile",
    enforce: "pre",

    configResolved(resolvedConfig: ResolvedConfig) {
      if (config?.runtimeSource) {
        rs = config.runtimeSource;
        return;
      }
      const src = (resolvedConfig.esbuild as { jsxImportSource?: string })
        ?.jsxImportSource;
      if (src) {
        rs = src + "/jsx-runtime";
        return;
      }
      rs = RUNTIME_SOURCE;
    },

    async buildStart() {
      if (!config?.secure) return;
      // Secure mode sanitizes static attributes at build time using the
      // runtime's own jsxAttr, so there is no duplicated security logic and no
      // runtime cost. The runtime module is the one the app already depends on.
      const source = rs ?? RUNTIME_SOURCE;
      try {
        const mod = (await import(/* @vite-ignore */ source)) as {
          jsxAttr?: RenderAttr;
        };
        if (typeof mod.jsxAttr === "function") {
          renderAttr = mod.jsxAttr;
        } else {
          this.warn(
            `secure mode: "${source}" has no "jsxAttr" export; ` +
              `static attributes will be inlined without sanitization`,
          );
        }
      } catch (err) {
        this.warn(
          `secure mode: failed to load "${source}" (${String(err)}); ` +
            `static attributes will be inlined without sanitization`,
        );
      }
    },

    transform(code: string, id: string) {
      if (!id.endsWith(".tsx") && !id.endsWith(".jsx")) return;
      if (id.includes("node_modules")) return;
      if (!code.includes("<")) return;

      const result = precompileTransform(
        code,
        id,
        { runtimeSource: rs!, secure: config?.secure },
        renderAttr ?? undefined,
      );

      if (!result || result.code === code) return;
      return { code: result.code };
    },
  };
}
