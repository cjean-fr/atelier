import { dateFormatter, tx } from "../lib/i18n.js";
import type { Resume } from "../schema.js";
import DateTime from "./DateTime.js";
import type { StandardAttributes } from "@cjean-fr/jsx-string";

interface FooterProps extends StandardAttributes {
  meta: Resume["meta"];
  bgTiles: string;
}

export default function Footer({ meta, bgTiles, ...props }: FooterProps) {
  const dateStr = meta.lastModified;

  return (
    <footer
      className="bg-angled-gradient from-footer-from to-footer-to relative isolate z-0 -mt-10 h-32 content-center pt-12 pb-2 text-center text-sm text-white dark:opacity-90 dark:contrast-125 dark:saturate-50 print:hidden"
      {...props}
    >
      <img
        src={bgTiles}
        alt=""
        loading="lazy"
        className="absolute inset-0 -z-10 size-full object-cover object-center"
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
