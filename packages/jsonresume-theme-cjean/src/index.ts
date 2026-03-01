import Layout from "./components/Layout.js";
import { init } from "./lib/i18n.js";
import { getLogoFromUrl } from "./lib/image.js";
import { ResumeSchema } from "./schema.js";
import css from "./styles/tailwind.input.css?inline";

/**
 *
 * @param resumeData
 * @returns
 */
export async function render(resumeData: unknown): Promise<string> {
  const resume = ResumeSchema.parse(resumeData);

  // Initialize i18n
  init(resume.meta.lang);

  // Fetch favicons if enabled
  if (resume.meta.themeConfig.ui.showLogos) {
    await Promise.all(
      resume.work
        .filter((work) => !work.logo)
        .map(async (work) => {
          work.logo = await getLogoFromUrl(work.url);
        }),
    );
  }

  return `<!doctype html>${await Layout({ resume, css })}`;
}

export type { Resume } from "./schema.js";
