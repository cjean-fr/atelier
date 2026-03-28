import { t } from "../lib/i18n.js";
import type { Resume } from "../schema.js";
import Period from "./Period.js";
import Section from "./Section.js";
import type { StandardAttributes } from "@cjean-fr/jsx-string";

interface EducationProps extends StandardAttributes {
  education: Resume["education"];
  certificates: Resume["certificates"];
}

export default function Education({ education, certificates }: EducationProps) {
  const hasEducation = education && education.length > 0;
  const hasCertificates = certificates && certificates.length > 0;

  if (!hasEducation && !hasCertificates) return null;

  return (
    <Section name={t("education")}>
      <ol className="timeline">
        {education?.map((edu, index) => (
          <li className="timeline-item" key={`edu-${index}`}>
            <article className="group">
              <div className="min-w-0 flex-1">
                <div className="grid grid-cols-1 gap-x-4 md:grid-cols-[1fr_auto]">
                  <div className="min-w-0">
                    <header>
                      <h3 className="truncate text-xl font-bold tracking-tight text-gray-900 md:whitespace-normal dark:text-white">
                        {edu.studyType}
                      </h3>
                    </header>

                    <div className="mt-1 text-gray-600 dark:text-slate-300">
                      {edu.url ? (
                        <a
                          href={edu.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          translate="no"
                          className="hover:text-primary font-medium text-gray-700 underline-offset-4 transition-colors hover:underline dark:text-slate-200"
                        >
                          {edu.institution}
                        </a>
                      ) : (
                        <span
                          translate="no"
                          className="font-medium text-gray-700 dark:text-slate-200"
                        >
                          {edu.institution}
                        </span>
                      )}
                      {edu.area && (
                        <span className="ml-2 text-sm text-gray-500">
                          - {edu.area}
                        </span>
                      )}
                    </div>
                  </div>

                  <Period
                    startDate={edu.startDate}
                    endDate={edu.endDate}
                    format="year"
                    className="mt-1 flex shrink-0 text-sm text-gray-500 capitalize md:mt-1.5 md:items-start md:text-right dark:text-slate-400"
                  />
                </div>
              </div>
            </article>
          </li>
        ))}

        {certificates?.map((cert, index) => (
          <li
            className="timeline-item timeline-item-secondary"
            key={`cert-${index}`}
          >
            <article className="group">
              <div className="min-w-0 flex-1">
                <div className="grid grid-cols-1 gap-x-4 md:grid-cols-[1fr_auto]">
                  <div className="min-w-0">
                    <header>
                      <h3 className="truncate text-xl font-bold tracking-tight text-gray-900 md:whitespace-normal dark:text-white">
                        {cert.name}
                      </h3>
                    </header>

                    <div className="mt-1 text-gray-600 dark:text-slate-300">
                      {cert.url ? (
                        <a
                          href={cert.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          translate="no"
                          className="hover:text-primary font-medium text-gray-700 underline-offset-4 transition-colors hover:underline dark:text-slate-200"
                        >
                          {cert.issuer}
                        </a>
                      ) : (
                        <span
                          translate="no"
                          className="font-medium text-gray-700 dark:text-slate-200"
                        >
                          {cert.issuer}
                        </span>
                      )}
                    </div>
                  </div>

                  <Period
                    endDate={cert.date}
                    format="year"
                    className="mt-1 flex shrink-0 text-sm text-gray-500 capitalize md:mt-1.5 md:items-start md:text-right dark:text-slate-400"
                  />
                </div>
              </div>
            </article>
          </li>
        ))}
      </ol>
    </Section>
  );
}
