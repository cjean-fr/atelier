import { t } from "../lib/i18n.js";
import type { Resume } from "../schema.js";
import DateTime from "./DateTime.js";
import Section from "./Section.js";
import type { StandardAttributes } from "@cjean-fr/jsx-string/jsx-runtime";

interface EducationProps extends StandardAttributes {
  education: Resume["education"];
  certificates: Resume["certificates"];
}

export default function Education({ education, certificates }: EducationProps) {
  const hasEducation = education && education.length > 0;
  const hasCertificates = certificates && certificates.length > 0;

  if (!hasEducation && !hasCertificates) return null;

  return (
    <Section name={t("education")} className="md:mt-4">
      <div className="timeline">
        {education?.map((edu, index) => (
          <article className="timeline-item group" key={`edu-${index}`}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {edu.studyType}
              <span className="mx-1 opacity-50" aria-hidden="true">
                •
              </span>
              <span className="font-medium text-gray-600 dark:text-slate-400">
                {edu.area}
              </span>
            </h3>
            <div className="flex flex-col gap-x-3 text-sm font-medium text-gray-500 md:flex-row md:items-center dark:text-slate-500">
              <span className="text-gray-700 dark:text-slate-300">
                {edu.institution}
              </span>
              {edu.startDate && (
                <span className="italic">
                  (
                  <DateTime date={edu.startDate} format="year" />
                  {edu.endDate && (
                    <>
                      {" — "}
                      <DateTime date={edu.endDate} format="year" />
                    </>
                  )}
                  )
                </span>
              )}
            </div>
          </article>
        ))}

        {certificates?.map((cert, index) => (
          <article
            className="timeline-item timeline-item-secondary group"
            key={`cert-${index}`}
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {cert.name}
            </h3>
            <div className="flex flex-col gap-x-3 text-sm font-medium text-gray-500 md:flex-row md:items-center dark:text-slate-500">
              <span className="text-gray-700 dark:text-slate-300">
                {cert.issuer}
              </span>
              {cert.date && (
                <span className="italic">
                  {" ("}
                  <DateTime date={cert.date} format="year" />
                  {")"}
                </span>
              )}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
