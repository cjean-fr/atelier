import { t } from "../lib/i18n.js";
import { type Resume } from "../schema.js";
import Period from "./Period.js";
import Section from "./Section.js";
import type { JSX } from "@vincle/core";

interface ProjectsProps extends JSX.HTMLAttributes {
  projects: Resume["projects"];
}

export default function Projects({ projects }: ProjectsProps) {
  if (!projects || projects.length === 0) return null;

  return (
    <Section sectionId="projects" name={t("projects")}>
      <ol className="timeline" reversed>
        {projects.map((project) => (
          <li
            className="timeline-item"
            key={`${project.name}-${project.startDate}`}
          >
            <article className="group">
              <div className="grid grid-cols-1 items-start gap-x-4 md:grid-cols-[1fr_auto] print:grid-cols-[minmax(0,1fr)_auto]">
                <header className="mt-1 min-w-0 text-gray-600">
                  <h3 className="truncate text-xl font-bold tracking-tight text-gray-900 md:whitespace-normal print:whitespace-normal">
                    {project.url ? (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        translate="no"
                        className="hover:text-primary font-medium text-gray-700 underline-offset-4 transition-colors hover:underline"
                      >
                        {project.name}
                      </a>
                    ) : (
                      <span
                        translate="no"
                        className="font-medium text-gray-700"
                      >
                        {project.name}
                      </span>
                    )}
                  </h3>
                </header>

                <Period
                  startDate={project.startDate}
                  endDate={project.endDate}
                  format="month"
                  className="mt-1 flex shrink-0 text-sm text-gray-500 capitalize md:mt-1.5 md:text-right print:mt-1 print:justify-self-end print:text-right print:whitespace-nowrap"
                />
              </div>

              {project.description && (
                <p className="mt-3 text-sm leading-relaxed text-pretty text-gray-600">
                  {project.description}
                </p>
              )}

              {project.highlights?.length && (
                <ul className="bullet-list">
                  {project.highlights.map((highlight: string) => (
                    <li className="bullet-item" key={highlight}>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </li>
        ))}
      </ol>
    </Section>
  );
}
