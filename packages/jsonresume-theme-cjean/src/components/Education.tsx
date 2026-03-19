import { t, dateFormatter } from "../lib/i18n.js";
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
      <div className="space-y-6 md:ml-4 md:border-l-2 md:border-gray-100 md:pl-8 dark:md:border-slate-800">
        {education?.map((edu, index) => (
          <article
            className="group md:before:border-primary relative break-inside-avoid md:before:absolute md:before:top-1.5 md:before:-left-[33px] md:before:h-4 md:before:w-4 md:before:-translate-x-1/2 md:before:rounded-full md:before:border-[3px] md:before:bg-white md:before:content-[''] dark:md:before:bg-slate-900"
            key={`edu-${index}`}
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {edu.studyType}
              <span
                className="mx-2 text-gray-300 dark:text-gray-700"
                aria-hidden="true"
              >
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
                  {" ("}
                  <DateTime date={edu.startDate}>
                    {dateFormatter.format(edu.startDate, "year")}
                  </DateTime>
                  {edu.endDate && (
                    <>
                      {" "}
                      —{" "}
                      <DateTime date={edu.endDate}>
                        {dateFormatter.format(edu.endDate, "year")}
                      </DateTime>
                    </>
                  )}
                  {")"}
                </span>
              )}
            </div>
          </article>
        ))}

        {certificates?.map((cert, index) => (
          <article
            className="group relative break-inside-avoid md:before:absolute md:before:top-1.5 md:before:-left-[33px] md:before:h-4 md:before:w-4 md:before:-translate-x-1/2 md:before:rounded-full md:before:border-[3px] md:before:border-gray-200 md:before:bg-white md:before:content-[''] dark:md:before:border-slate-800 dark:md:before:bg-slate-900"
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
                  <DateTime date={cert.date}>
                    ({dateFormatter.format(cert.date, "year")})
                  </DateTime>
                </span>
              )}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
