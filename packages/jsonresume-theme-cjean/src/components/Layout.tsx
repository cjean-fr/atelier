import { t } from "../lib/i18n.js";
import { generateTriangulation } from "../lib/trianglify.js";
import type { Resume } from "../schema.js";
import Banner from "./Banner.js";
import Education from "./Education.js";
import FloatingButton from "./FloatingButton.js";
import Footer from "./Footer.js";
import Header from "./Header.js";
import Links from "./Links.js";
import { ProfilePageJsonLd } from "./ProfilePageJsonLd.js";
import SEO from "./SEO.js";
import Skills from "./Skills.js";
import WorkExperience from "./WorkExperience.js";
import type { StandardAttributes } from "@cjean-fr/jsx-string";

interface LayoutProps extends StandardAttributes {
  resume: Resume;
  css: string;
}

export default async ({ resume, css, ...props }: LayoutProps) => {
  const { basics, work: works, education, certificates, skills, meta } = resume;
  const { ui, modest } = meta.themeConfig;

  const bgTiles = generateTriangulation({
    seed: ui.backgroundTilesSeed,
    cellSize: 60,
    variance: 0.8,
  });

  return (
    <html lang={meta.lang}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content={ui.primary} />
        {!modest && <meta name="generator" content="JSON Resume Theme CJEAN" />}

        <SEO resume={resume} />

        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --theme-primary: ${ui.primary};
                --theme-header-from: ${ui.headerFrom};
                --theme-header-to: ${ui.headerTo};
                --theme-footer-from: ${ui.footerFrom};
                --theme-footer-to: ${ui.footerTo};
              }
              ${css}
            `,
          }}
        />
      </head>
      <body
        className="bg-gray-200 text-gray-800 dark:bg-slate-950 dark:text-slate-300 print:bg-transparent print:text-sm"
        {...props}
      >
        <Header bgTiles={bgTiles} />
        <main className="relative z-10 container mx-auto max-w-5xl rounded bg-white p-4 shadow-md backdrop-blur-3xl md:p-6 dark:bg-slate-900/95 dark:text-slate-200 dark:shadow-2xl dark:ring-1 dark:ring-white/10 print:rounded-none print:shadow-none [&_a]:underline">
          <article>
            <Banner name={basics.name} label={basics.label} />

            <Links basics={basics} list={meta.themeConfig.ui.links} />

            {(basics.image || basics.summary) && (
              <div className="flex break-inside-avoid flex-wrap justify-center gap-4 sm:flex-nowrap">
                {basics.image && (
                  <div className="relative inline-block">
                    <img
                      src={basics.image}
                      alt={t("portrait_alt", { name: basics.name })}
                      width="200"
                      height="200"
                      className="relative aspect-square min-w-30 rounded-full object-cover"
                    />
                  </div>
                )}
                {basics.summary && (
                  <p className="content-center text-lg print:text-base">
                    {basics.summary}
                  </p>
                )}
              </div>
            )}

            <WorkExperience works={works} showLogos={ui.showLogos} />
            <Education education={education} certificates={certificates} />
            <Skills skills={skills} />
          </article>
        </main>
        <Footer meta={meta} bgTiles={bgTiles} />
        {ui.cta && (
          <FloatingButton
            text={ui.cta.text}
            url={ui.cta.url}
            icon={ui.cta.icon}
          />
        )}
        <ProfilePageJsonLd resume={resume} />
        <script
          dangerouslySetInnerHTML={{
            __html: `if (window.matchMedia('(prefers-color-scheme: dark)').matches) document.documentElement.classList.add('dark');`,
          }}
        />
      </body>
    </html>
  );
};
