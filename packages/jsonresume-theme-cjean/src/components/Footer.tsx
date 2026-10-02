import { dateFormatter, tx } from "../lib/i18n.js";
import type { Resume } from "../schema.js";
import DateTime from "./DateTime.js";
import { type JSX } from "@vincle/core";

interface FooterProps extends JSX.HTMLAttributes {
  meta: Resume["meta"];
}

export default function Footer({ meta, ...props }: FooterProps) {
  const dateStr = meta.lastModified;

  return (
    <footer
      className="resume-footer-gradient relative isolate z-0 -mt-10 h-32 content-center pt-12 pb-2 text-center text-sm text-white print:hidden"
      {...props}
    >
      <div
        className="resume-tiles absolute inset-0 -z-10 size-full"
        aria-hidden="true"
      />
      <div>
        {tx("last_modified", {
          date: (
            <DateTime date={dateStr}>
              {dateFormatter.format(dateStr, "date")}
            </DateTime>
          ),
        })}
      </div>
      <div className="mt-1 text-xs opacity-75">
        {!meta.themeConfig.modest &&
          tx("theme_credit", {
            link: (
              <a
                href="https://www.cjean.fr"
                target="_blank"
                className="underline decoration-white/30 underline-offset-2 transition-colors hover:decoration-white/80"
              >
                Christophe Jean
              </a>
            ),
          })}
      </div>
    </footer>
  );
}
