import { z } from "zod/v4/mini";

export const ThemeConfigSchema = z.object({
  ui: z.prefault(
    z.object({
      primary: z._default(z.string(), "#255b8f"),
      headerFrom: z._default(z.string(), "#ccc074"),
      headerTo: z._default(z.string(), "#4971af"),
      footerFrom: z._default(z.string(), "#463932"),
      footerTo: z._default(z.string(), "#7fbdbc"),
      backgroundTilesSeed: z._default(z.number(), 1),
      showLogos: z._default(z.boolean(), true),
      cta: z.optional(
        z.object({
          text: z.string(),
          url: z.string(),
          icon: z._default(
            z.optional(z.string().check(z.regex(/^[a-z]+:[a-z-]+$/))),
            "tabler:message-circle",
          ),
        }),
      ),
      links: z._default(z.array(z.string()), [
        "phone",
        "email",
        "location",
        "profiles",
      ]),
    }),
    {},
  ),
  seo: z.prefault(
    z.object({
      title: z.optional(z.string()),
      description: z.optional(z.string()),
      canonical: z.optional(z.url()),
      favicon: z.optional(z.string()),
      ogImage: z.optional(z.url()),
      twitterImage: z.optional(z.url()),
      firstName: z.optional(z.string()),
      lastName: z.optional(z.string()),
      robots: z._default(z.optional(z.string()), "index, follow"),
    }),
    {},
  ),
  modest: z._default(z.boolean(), false),
});

export const WorkSchema = z.pipe(
  z
    .looseObject({
      name: z.optional(z.string()),
      company: z.optional(z.string()),
      location: z.optional(z.string()),
      description: z.optional(z.string()),
      position: z.optional(z.string()),
      url: z.optional(z.url()),
      website: z.optional(z.url()),
      startDate: z.string(),
      endDate: z.optional(z.string()),
      summary: z.optional(z.string()),
      highlights: z.optional(z.array(z.string())),
      logo: z.optional(z.url()),
    })
    .check(
      z.refine(({ name, company }) => Boolean(name || company), {
        path: ["name"],
        message: "Either 'name' or 'company' must be provided.",
      }),
    ),
  z.transform(({ company, name, url, website, ...rest }) => {
    return {
      ...rest,
      name: name ?? company,
      ...(url || website ? { url: url ?? website } : {}),
    };
  }),
);

export const ProfileSchema = z.looseObject({
  network: z.string(),
  username: z.optional(z.string()),
  url: z.optional(z.url()),
});

export const LocationSchema = z.looseObject({
  address: z.optional(z.string()),
  postalCode: z.optional(z.string()),
  city: z.optional(z.string()),
  countryCode: z.optional(z.string().check(z.length(2))),
  region: z.optional(z.string()),
});

export const BasicsSchema = z.looseObject({
  name: z.string(),
  label: z.optional(z.string()),
  image: z.optional(z.url()),
  email: z.optional(z.email()),
  phone: z.optional(z.string()),
  birthDate: z.optional(z.string()),
  url: z.optional(z.url()),
  summary: z.optional(z.string()),
  location: z.optional(LocationSchema),
  profiles: z.optional(z.array(ProfileSchema)),
});

export const EducationSchema = z.object({
  institution: z.string(),
  url: z.optional(z.url()),
  area: z.optional(z.string()),
  studyType: z.optional(z.string()),
  startDate: z.string(),
  endDate: z.optional(z.string()),
  score: z.optional(z.string()),
  courses: z.optional(z.array(z.string())),
});

export const CertificatesSchema = z.object({
  name: z.string(),
  date: z.optional(z.string()),
  url: z.optional(z.url()),
  issuer: z.optional(z.string()),
});

export const SkillsSchema = z.object({
  name: z.string(),
  level: z.optional(z.string()),
  keywords: z.optional(z.array(z.string())),
});

export const LanguagesSchema = z.looseObject({
  language: z.string(),
  fluency: z.optional(z.string()),
});

export const ResumeSchema = z.object({
  meta: z.prefault(
    z.looseObject({
      lang: z._default(z.catch(z.enum(["en", "fr"]), "en"), "en"),
      lastModified: z._default(z.string(), () => new Date().toISOString()),
      themeConfig: z.prefault(ThemeConfigSchema, {}),
    }),
    {},
  ),
  work: z._default(z.optional(z.array(WorkSchema)), []),
  basics: BasicsSchema,
  education: z._default(z.optional(z.array(EducationSchema)), []),
  certificates: z._default(z.optional(z.array(CertificatesSchema)), []),
  skills: z._default(z.optional(z.array(SkillsSchema)), []),
  languages: z._default(z.optional(z.array(LanguagesSchema)), []),
});

export type Resume = z.infer<typeof ResumeSchema>;
export type ThemeConfig = z.infer<typeof ThemeConfigSchema>;
