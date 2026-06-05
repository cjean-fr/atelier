import { t } from "../lib/i18n.js";
import { type Resume } from "../schema.js";
import Period from "./Period.js";
import Section from "./Section.js";
import type { HTMLAttributes } from "@cjean-fr/jsx-string";

interface ProjectsProps extends HTMLAttributes {
  projects: Resume["projects"];
}

export default function Projects({ projects }: ProjectsProps) {
  if (!projects || projects.length === 0) return null;

  return (
      <Section name={t("projects")}>
        <ol className="timeline" reversed>
          {projects.map((project) => (
            <li className="timeline-item" key={project.name + project.startDate}>
              <article className="group">
                <div className="flex items-start gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="grid grid-cols-1 gap-x-4 md:grid-cols-[1fr_auto]">
                      <div className="min-w-0">
                        <header className="mt-1 text-gray-600 dark:text-slate-300">
                          <h3 className="truncate text-xl font-bold tracking-tight text-gray-900 md:whitespace-normal dark:text-white">
                          {project.url ? (
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              translate="no"
                              className="hover:text-primary font-medium text-gray-700 underline-offset-4 transition-colors hover:underline dark:text-slate-200"
                            >
                              {project.name}
                            </a>
                          ) : (
                            <span
                              translate="no"
                              className="font-medium text-gray-700 dark:text-slate-200"
                            >
                              {project.name}
                            </span>
                          )}
                          </h3>
                        </header>
                      </div>
  
                      <Period
                        startDate={project.startDate}
                        endDate={project.endDate}
                        format="month"
                        className="mt-1 flex shrink-0 text-sm text-gray-500 capitalize md:mt-1.5 md:items-start md:text-right dark:text-slate-400"
                      />
                    </div>
                  </div>
                </div>
  
                {project.description && (
                  <p className="mt-3 text-sm leading-relaxed text-pretty text-gray-600 dark:text-slate-400">
                    {project.description}
                  </p>
                )}
  
                <ul className="bullet-list">
                  {project.highlights?.map((highlight: string) => (
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