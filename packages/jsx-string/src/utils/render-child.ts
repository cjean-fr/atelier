import type { JSXNode } from "../core/types.js";
import { RawString } from "../core/types.js";
import { escapeContent } from "./escape.js";

function renderArrayAsync(
  arr: unknown[],
  startIndex: number,
  prefix: string,
  pending: Promise<string>,
): Promise<string> {
  const remaining = arr.length - startIndex;
  const tail: (string | Promise<string>)[] = new Array(remaining);
  tail[0] = pending;
  for (let i = 1; i < remaining; i++) {
    tail[i] = toRenderString(arr[startIndex + i]);
  }
  return Promise.all(tail).then((parts) => {
    let out = prefix;
    for (let i = 0; i < parts.length; i++) out += parts[i];
    return out;
  });
}

function renderArray(arr: unknown[]): string | Promise<string> {
  let out = "";
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (item instanceof RawString) {
      out += item.value;
      continue;
    }
    if (typeof item === "string") {
      out += escapeContent(item);
      continue;
    }
    if (typeof item === "number") {
      out += item;
      continue;
    }
    if (item == null || item === true || item === false) continue;
    const r = toRenderString(item);
    if (typeof r === "string") out += r;
    else return renderArrayAsync(arr, i, out, r);
  }
  return out;
}

async function renderAsyncIterable(
  iterable: AsyncIterable<unknown>,
): Promise<string> {
  let out = "";
  for await (const item of iterable) out += await toRenderString(item);
  return out;
}

export function toRenderString(value: unknown): string | Promise<string> {
  if (value == null || value === true || value === false) return "";
  if (typeof value === "string") return escapeContent(value);
  if (typeof value === "number") return String(value);
  if (value instanceof RawString) return value.value;
  if (Array.isArray(value)) return renderArray(value);
  if (value instanceof Promise) return value.then(toRenderString);
  if (typeof (value as any)[Symbol.iterator] === "function")
    return toRenderString(Array.from(value as Iterable<unknown>));
  if (typeof (value as any)[Symbol.asyncIterator] === "function")
    return renderAsyncIterable(value as AsyncIterable<unknown>);
  return escapeContent(String(value));
}

export function renderChild(child: JSXNode): string | Promise<string> {
  return toRenderString(child);
}
