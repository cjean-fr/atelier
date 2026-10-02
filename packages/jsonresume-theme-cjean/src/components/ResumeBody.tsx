import { t } from "../lib/i18n.js";
import type { Resume } from "../schema.js";
import Banner from "./Banner.js";
import Education from "./Education.js";
import FloatingButton from "./FloatingButton.js";
import Footer from "./Footer.js";
import Header from "./Header.js";
import Links from "./Links.js";
import { ProfilePageJsonLd } from "./ProfilePageJsonLd.js";
import Projects from "./Projects.js";
import Skills from "./Skills.js";
import WorkExperience from "./WorkExperience.js";
import { type JSX } from "@vincle/core";

interface ResumeBodyProps extends JSX.HTMLAttributes {
  resume: Resume;
}

export default ({ resume, ...props }: ResumeBodyProps) => {
  const {
    basics,
    work: works,
    education,
    certificates,
    skills,
    meta,
    projects,
  } = resume;
  const { ui } = meta.themeConfig;

  return (
    <body
      className="bg-gray-200 text-gray-800 print:bg-transparent print:text-sm"
      {...props}
    >
      <a
        href="#main-content"
        className="focus:text-primary focus:outline-primary sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-0 focus:z-50 focus:h-auto focus:w-auto focus:bg-white focus:p-4 focus:outline-2 focus:outline-offset-2"
      >
        {t("skip_to_content")}
      </a>

      <Header />
      <main
        id="main-content"
        className="resume-card relative z-10 container mx-auto max-w-5xl bg-white p-5 md:p-10 print:p-0 [&_a]:underline"
        tabIndex={-1}
      >
        <div>
          <Banner name={basics.name} label={basics.label} />

          <address>
            <nav aria-label={t("contact_info")}>
              <Links basics={basics} list={meta.themeConfig.ui.links} />
            </nav>
          </address>

          {(basics.image || basics.summary) && (
            <div className="resume-about flex break-inside-avoid flex-wrap items-center gap-6 sm:flex-nowrap">
              {basics.image && (
                <div className="relative inline-block">
                  <img
                    src={basics.image}
                    alt={t("portrait_alt", { name: basics.name })}
                    width="200"
                    height="200"
                    fetchPriority="high"
                    className="relative aspect-square min-w-30 rounded-2xl object-cover"
                  />
                </div>
              )}
              {basics.summary && (
                <p className="max-w-[72ch] text-lg leading-relaxed text-pretty text-gray-700 print:text-base">
                  {basics.summary}
                </p>
              )}
            </div>
          )}

          <WorkExperience works={works} showLogos={ui.showLogos} />
          <Projects projects={projects} />
          <Education education={education} certificates={certificates} />
          <Skills skills={skills} />
        </div>
      </main>
      <Footer meta={meta} />
      {ui.cta && (
        <FloatingButton
          text={ui.cta.text}
          url={ui.cta.url}
          icon={ui.cta.icon}
        />
      )}
      <ProfilePageJsonLd resume={resume} />
    </body>
  );
};
