/**
 * Public entry of the search subsystem.
 *
 * Re-exports the `SearchAdapter` interface and ships factories for the
 * bundled adapters. Pagefind ships in Phase 3.
 */

export type {
  SearchAdapter,
  SearchBuildInput,
  SearchServeInput,
} from "../types.js";

export { builtin, type BuiltinSearchOptions } from "./builtin/adapter.js";
