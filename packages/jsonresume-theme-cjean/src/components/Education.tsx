import { t, dateFormatter } from "../lib/i18n.js";
import { type Resume } from "../schema.js";
import DateTime from "./DateTime.js";
import Section from "./Section.js";
import type { StandardAttributes } from "@cjean/jsx-string/jsx-runtime";

interface EducationProps extends StandardAttributes {
  education: Resume["education"];
  certificates: Resume["certificates"];
}

export default function Education({ education, certificates }: EducationProps) {
  const hasEducation = education && education.length > 0;
  const hasCertificates = certificates && certificates.length > 0;

  if (!hasEducation && !hasCertificates) return null;

  return (
    <Section name={t("education")} className="break-inside-avoid">
      {education?.map((edu, index) => (
        <article className="mb-4 break-inside-avoid" key={`edu-${index}`}>
          <h3 className="text-lg font-bold">
            {edu.studyType} : {edu.area}
          </h3>
          <p>
            {edu.institution} (
            {edu.startDate && (
              <DateTime date={edu.startDate}>
                {dateFormatter.format(edu.startDate, "year")}
              </DateTime>
            )}
            )
          </p>
        </article>
      ))}

      {hasEducation && hasCertificates && <br />}

      {certificates?.map((cert, index) => (
        <article className="mb-4 break-inside-avoid" key={`cert-${index}`}>
          <h3 className="text-lg font-bold">{cert.name}</h3>
          <p>
            {cert.issuer} (
            {cert.date && (
              <DateTime date={cert.date}>
                {dateFormatter.format(cert.date, "year")}
              </DateTime>
            )}
            )
          </p>
        </article>
      ))}
    </Section>
  );
}
