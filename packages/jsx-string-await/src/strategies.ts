import type { RenderStrategy } from "./types.js";

export const htmxStrategy: RenderStrategy = {
  wrapFallback(id: string, fallback: string): string {
    return `<div id="${id}">${fallback}</div>`;
  },
  wrapResolved(id: string, content: string): string {
    return `<div id="${id}" hx-swap-oob="true">${content}</div>`;
  },
  wrapError(id: string, errorFallback: string): string {
    return `<div id="${id}" hx-swap-oob="true">${errorFallback}</div>`;
  },
};

export const hotwireStrategy: RenderStrategy = {
  wrapFallback(id: string, fallback: string): string {
    return `<div id="${id}">${fallback}</div>`;
  },
  wrapResolved(id: string, content: string): string {
    return `<turbo-stream action="replace" target="${id}"><template>${content}</template></turbo-stream>`;
  },
  wrapError(id: string, errorFallback: string): string {
    return `<turbo-stream action="replace" target="${id}"><template>${errorFallback}</template></turbo-stream>`;
  },
};
