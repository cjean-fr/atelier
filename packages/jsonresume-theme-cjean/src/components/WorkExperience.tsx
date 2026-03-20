import { t } from "../lib/i18n.js";
import { type Resume } from "../schema.js";
import DateTime from "./DateTime.js";
import Section from "./Section.js";
import type { StandardAttributes } from "@cjean-fr/jsx-string/jsx-runtime";

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
      <ol className="timeline" reversed>
        {works.map((work) => (
          <li className="timeline-item" key={work.name + work.startDate}>
            <article className="group">
              <div className="flex items-start gap-4">
                {showLogos && (
                  <div className="mt-1 shrink-0">
                    {work.logo ? (
                      <img
                        src={work.logo}
                        alt={work.name}
                        width="48"
                        height="48"
                        className="h-12 w-12 rounded-lg object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 font-bold text-gray-400 uppercase select-none dark:bg-slate-800 dark:text-slate-500">
                        {work.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <header className="flex flex-col gap-x-4 md:flex-row md:items-baseline md:justify-between">
                    <h3 className="truncate text-xl font-bold tracking-tight text-gray-900 md:whitespace-normal dark:text-white">
                      {work.position}
                    </h3>
                    <div className="shrink-0 text-xs font-semibold tracking-widest text-gray-500 uppercase md:text-right dark:text-slate-400">
                      <DateTime date={work.startDate} format="month" />
                      {" — "}
                      {work.endDate ? (
                        <DateTime date={work.endDate} format="month" />
                      ) : (
                        <span className="text-primary font-bold">
                          {t("present")}
                        </span>
                      )}
                    </div>
                  </header>

                  <div className="mt-1 text-gray-600 dark:text-slate-300">
                    {work.url ? (
                      <a
                        href={work.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        translate="no"
                        className="hover:text-primary font-medium text-gray-700 underline-offset-4 transition-colors hover:underline dark:text-slate-200"
                      >
                        {work.name}
                      </a>
                    ) : (
                      <span
                        translate="no"
                        className="font-medium text-gray-700 dark:text-slate-200"
                      >
                        {work.name}
                      </span>
                    )}
                    {work.description && (
                      <span className="ml-2 text-sm text-gray-400">
                        <span className="mr-1 opacity-50" aria-hidden="true">
                          ,
                        </span>
                        {work.description}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {work.summary && (
                <p className="mt-3 text-sm leading-relaxed text-pretty text-gray-600 dark:text-slate-400">
                  {work.summary}
                </p>
              )}

              <ul className="bullet-list">
                {work.highlights?.map((highlight: string) => (
                  <li className="bullet-item" key={highlight}>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </article>
          </li>
        ))}
      </ol>
    </Section>
  );
}
