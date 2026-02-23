import { t, dateFormatter } from "../lib/i18n.js";
import { type Resume } from "../schema.js";
import DateTime from "./DateTime.js";
import Section from "./Section.js";
import type { StandardAttributes } from "@cjean/jsx-string/jsx-runtime";

interface WorkExperienceProps extends StandardAttributes {
  works: Resume["work"];
  showLogos?: boolean;
}

export default function WorkExperience({
  works,
  showLogos,
}: WorkExperienceProps) {
  if (!works || works.length === 0) return null;

  return (
    <Section name={t("work_experience")}>
      <ol
        className="relative list-none border-gray-200 md:ml-4 md:border-l-[5px] md:pl-6 dark:border-slate-700/50"
        reversed
      >
        {works.map((work) => (
          <li className="break-inside-avoid" key={work.name}>
            <div className="before:border-primary relative text-gray-500 before:absolute before:top-0 before:-left-[calc(1.5rem+2.5px)] before:hidden before:h-[19px] before:w-[19px] before:-translate-x-1/2 before:rounded-full before:border-4 before:bg-white md:before:block dark:text-slate-400 dark:before:bg-slate-900">
              <DateTime date={work.startDate}>
                {dateFormatter.format(work.startDate, "month")}
              </DateTime>
              {" — "}
              {work.endDate ? (
                <DateTime date={work.endDate}>
                  {dateFormatter.format(work.endDate, "month")}
                </DateTime>
              ) : (
                t("present")
              )}
            </div>
            <article>
              <header
                className={`grid grid-cols-[auto_1fr] ${showLogos && work.logo ? "gap-x-3" : ""}`}
              >
                {showLogos && work.logo ? (
                  <img
                    src={work.logo}
                    alt={work.name}
                    width="64"
                    height="64"
                    className="row-span-2 h-12 w-12 object-contain"
                    loading="lazy"
                  />
                ) : null}
                <h3 className="col-start-2 text-xl font-semibold">
                  {work.position}
                </h3>
                <div className="col-start-2">
                  {work.url ? (
                    <a
                      href={work.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      translate="no"
                    >
                      {work.name}
                    </a>
                  ) : (
                    <span translate="no">{work.name}</span>
                  )}
                  {work.description && (
                    <>
                      {" - "}
                      <small>{work.description}</small>
                    </>
                  )}
                </div>
              </header>
              {work.summary && <p>{work.summary}</p>}
              <ul className="m-2 mb-6 list-inside list-disc">
                {work.highlights?.map((highlight: string) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </article>
          </li>
        ))}
      </ol>
    </Section>
  );
}
