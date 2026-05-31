import { t } from "../lib/i18n.js";
import type { Resume } from "../schema.js";

function getProfilePageJsonLd(resume: Resume) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: resume.basics.label
      ? t("profile_page_name", {
          name: resume.basics.name,
          label: resume.basics.label,
        })
      : resume.basics.name,
    description: resume.basics.summary,
    dateModified: resume.meta.lastModified,
    mainEntity: {
      "@type": "Person",
      name: resume.basics.name,
      birthDate: resume.basics.birthDate,
      jobTitle: resume.basics.label,
      url: resume.basics.url,
      description: resume.basics.summary,
      image: resume.basics.image,
      email: resume.basics.email,
      telephone: resume.basics.phone,
      address: {
        "@type": "PostalAddress",
        addressLocality: resume.basics.location?.city,
        addressRegion: resume.basics.location?.region,
        postalCode: resume.basics.location?.postalCode,
        addressCountry: resume.basics.location?.countryCode,
      },
      alumniOf: resume.education.map((edu) => ({
        "@type": "EducationalOrganization",
        name: edu.institution,
        url: edu.url,
      })),
      worksFor: resume.work.map((job) => {
        return {
          "@type": "Organization",
          name: job.name,
          location: job.location,
          member: {
            "@type": "OrganizationRole",
            roleName: job.position,
          },
          url: job.url,
        };
      }),
      sameAs: resume.basics.profiles?.map((p) => p.url).filter(Boolean),
      knowsAbout: resume.skills.flatMap((s) => s.keywords || []),
    },
  };
}

export function ProfilePageJsonLd({ resume }: { resume: Resume }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getProfilePageJsonLd(resume)),
      }}
    />
  );
}
