export type {
  TranslationSpec,
  ValidTranslations,
  ExtractParams,
  InferSpec,
  InterpolateFn,
  TranslatorConfig,
  Translator,
} from "./spec.js";

export {
  interpolate,
  createTranslator,
  createTypedTranslator,
} from "./runtime.js";
