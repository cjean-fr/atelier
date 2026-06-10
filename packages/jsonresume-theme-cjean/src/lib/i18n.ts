import {
  createTranslator,
  createTranslationBuilder,
  type ValidTranslations,
  type Translator,
} from "@cjean-fr/i18n-tiny";
import { raw, type JSXNode } from "@cjean-fr/jsx-string";

const defineThemeLocale = createTranslationBuilder<ThemeSpec>();

export type ThemeSpec = {
  work_experience: readonly [];
  projects: readonly [];
  education: readonly [];
  skills: readonly [];
  present: readonly [];
  contact_info: readonly [];
  phone_call: readonly [];
  email_send: readonly [];
  show_address: readonly [];
  portrait_alt: readonly ["name"];
  last_modified: readonly ["date"];
  profile_page_name: readonly ["name", "label"];
  theme_credit: readonly ["link"];
  skip_to_content: readonly [];
};

const en = defineThemeLocale({
  work_experience: "Work Experience",
  projects: "Projects",
  education: "Education",
  skills: "Skills",
  present: "Present",
  contact_info: "Contact Information",
  phone_call: "Call mobile phone",
  email_send: "Send email",
  show_address: "Show address",
  portrait_alt: "Portrait of {name}",
  last_modified: "Last updated on {date}",
  profile_page_name: "{name}'s resume - {label}",
  theme_credit: "Theme made with love by {link}",
  skip_to_content: "Skip to main content",
});

const fr = defineThemeLocale({
  work_experience: "Expériences professionnelles",
  projects: "Projets",
  education: "Formations",
  skills: "Compétences",
  present: "Présent",
  contact_info: "Informations de contact",
  phone_call: "Appeler sur le téléphone mobile",
  email_send: "Envoyer un email",
  show_address: "Afficher l'adresse",
  portrait_alt: "Portrait de {name}",
  last_modified: "Dernière mise à jour le {date}",
  profile_page_name: "CV de {name} - {label}",
  theme_credit: "Thème proposé avec amour par {link}",
  skip_to_content: "Aller au contenu principal",
});

const resources = {
  en,
  fr,
};

type Locale = keyof typeof resources;

let translator: Translator<ThemeSpec> | undefined = undefined;

let currentLocale: Locale = "en";

/**
 * Translate a key to the current locale.
 * @param key The key to translate.
 * @param args The arguments to pass to the translator.
 * @returns The translated string.
 */
export const t: Translator<ThemeSpec> = (key, ...args) => {
  if (!translator) {
    translator = createTranslator<ThemeSpec>(
      resources[currentLocale] satisfies ValidTranslations<ThemeSpec>,
    );
  }
  return translator(key, ...args);
};

/**
 * Translate a key to the current locale and return a RawString.
 * @param key The key to translate.
 * @param args The arguments to pass to the translator.
 * @returns The translated string as a RawString.
 */
export const tx: Translator<ThemeSpec, JSXNode> = (key, ...args) => {
  return raw(t(key, ...(args as any)));
};

/**
 * Initialize the translator with a specific locale.
 */
export function init(locale: Locale) {
  currentLocale = locale;
  translator = createTranslator(resources[locale]);
}

export type DateFormat = "year" | "month" | "date" | "iso";

export const dateFormatter = {
  normalize(date: Date | string): Date | null {
    const d = typeof date === "string" ? new Date(date) : date;
    return isNaN(d.getTime()) ? null : d;
  },
  format(date: Date | string, format: DateFormat): string {
    const d = this.normalize(date);
    if (!d) return "";

    const locales =
      typeof currentLocale !== "undefined" ? currentLocale : "fr-FR";

    switch (format) {
      case "month": // Ex: "février 2026"
        return new Intl.DateTimeFormat(locales, {
          month: "long",
          year: "numeric",
        }).format(d);

      case "year": // Ex: "2026"
        return d.getFullYear().toString();

      case "date": // Ex: "17/02/2026"
        return new Intl.DateTimeFormat(locales, {
          day: "numeric",
          month: "numeric",
          year: "numeric",
        }).format(d);

      case "iso": // Ex: "2026-02-17T..."
        return d.toISOString();

      default:
        throw new Error(`Unhandled date format: ${format}`);
    }
  },
  toISO(date: Date | string): string {
    return this.normalize(date)?.toISOString() ?? "";
  },
};
