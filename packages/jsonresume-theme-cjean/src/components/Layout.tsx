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
import { Base, OpenGraph, Twitter, splitName } from "./SEO.js";
import Skills from "./Skills.js";
import WorkExperience from "./WorkExperience.js";
import { type StandardAttributes } from "@cjean/jsx-string";

interface LayoutProps extends StandardAttributes {
  resume: Resume;
  css: string;
}

export default async ({ resume, css, ...props }: LayoutProps) => {
  const { basics, work: works, education, certificates, skills, meta } = resume;
  const { ui, seo, modest } = meta.themeConfig;

  const bgTiles = generateTriangulation({
    seed: ui.backgroundTilesSeed,
    cellSize: 60,
    variance: 0.8,
  });

  const title =
    seo.title ||
    (basics.label ? `${basics.name} - ${basics.label}` : basics.name);
  const description = seo.description || basics.summary;
  const { firstNameSlice, lastNameSlice } = splitName(basics.name);

  return (
    <html lang={meta.lang}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content={ui.primary} />
        {!modest && <meta name="generator" content="JSON Resume Theme CJEAN" />}

        <Base
          title={title}
          description={description}
          canonical={seo.canonical}
          robots={seo.robots}
          favicon={seo.favicon}
        />
        <OpenGraph
          title={title}
          description={description}
          url={seo.canonical}
          image={seo.ogImage || basics.image}
          firstName={seo.firstName || firstNameSlice}
          lastName={seo.lastName || lastNameSlice}
        />
        <Twitter
          title={title}
          description={description}
          url={seo.canonical}
          image={seo.twitterImage || basics.image}
        />
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

            <div className="flex break-inside-avoid flex-wrap justify-center gap-4 sm:flex-nowrap">
              <div className="relative inline-block">
                <img
                  src={basics.image}
                  alt={t("portrait_alt", { name: basics.name })}
                  width="200"
                  height="200"
                  className="relative aspect-square min-w-30 rounded-full object-cover"
                />
              </div>
              <p className="text-lg print:text-base">{basics.summary}</p>
            </div>

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
