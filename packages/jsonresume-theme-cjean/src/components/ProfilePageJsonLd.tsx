import { t } from "../lib/i18n.js";
import type { Resume } from "../schema.js";

function getProfilePageJsonLd(resume: Resume) {
  const currentJob = resume.work.find((job) => !job.endDate);
  const pastJobs = resume.work.filter((job) => job.endDate);

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
    inLanguage: resume.meta.lang,
    url: resume.meta.themeConfig.seo.canonical,
    dateModified: resume.meta.lastModified,
    mainEntity: {
      "@type": "Person",
      name: resume.basics.name,
      jobTitle: resume.basics.label,
      url: resume.basics.url,
      description: resume.basics.summary,
      image: resume.basics.image,
      alumniOf: [
        ...resume.education.map((edu) => ({
          "@type": "EducationalOrganization",
          name: edu.institution,
          url: edu.url,
        })),
        ...pastJobs.map((job) => ({
          "@type": "Organization",
          name: job.name,
          location: job.location,
          url: job.url,
          member: {
            "@type": "OrganizationRole",
            roleName: job.position,
          },
        })),
      ],
      worksFor: currentJob
        ? {
            "@type": "Organization",
            name: currentJob.name,
            location: currentJob.location,
            url: currentJob.url,
            member: {
              "@type": "OrganizationRole",
              roleName: currentJob.position,
            },
          }
        : undefined,
      sameAs: [
        ...new Set(resume.basics.profiles?.map((p) => p.url).filter(Boolean)),
      ],
      knowsAbout: resume.skills.flatMap((s) => s.keywords || []),
    },
  };
}

export function ProfilePageJsonLd({ resume }: { resume: Resume }) {
  return (
    <script type="application/ld+json">
      {JSON.stringify(getProfilePageJsonLd(resume))}
    </script>
  );
}
