import Layout from "./components/Layout.js";
import ResumeBody from "./components/ResumeBody.js";
import { init } from "./lib/i18n.js";
import { getLogoFromUrl, getPictureFromEmail } from "./lib/image.js";
import { compileStyles } from "./lib/styles.js";
import { ResumeSchema } from "./schema.js";
import { raw, renderToString } from "@vincle/core";

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

  // Fetch gravatar if no image are provided
  if (!resume.basics.image && resume.basics.email) {
    resume.basics.image = await getPictureFromEmail(resume.basics.email);
  }

  const body = await renderToString(<ResumeBody resume={resume} />);
  const css = await compileStyles(body);

  return renderToString(<Layout resume={resume} css={css} body={raw(body)} />);
}
