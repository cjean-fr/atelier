import { generateTriangulation } from "../lib/trianglify.js";
import type { Resume } from "../schema.js";
import SEO from "./SEO.js";
import { raw, type RawString } from "@vincle/core";

function getPermissionsPolicy(): string {
  return [
    "camera=()",
    "microphone=()",
    "geolocation=()",
    "payment=()",
    "usb=()",
    "midi=()",
    "sync-xhr=()",
    "interest-cohort=()",
  ].join(", ");
}

interface LayoutProps {
  resume: Resume;
  css: string;
  body: RawString;
}

export default ({ resume, css, body }: LayoutProps) => {
  const { basics, meta } = resume;
  const { ui, modest } = meta.themeConfig;
  const bgTiles = generateTriangulation({
    seed: ui.backgroundTilesSeed,
    cellSize: 60,
    variance: 0.8,
  });

  return (
    <>
      {raw("<!doctype html>\n")}
      <html lang={meta.lang}>
        <head>
          <meta charSet="UTF-8" />
          <meta name="color-scheme" content="light" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta name="theme-color" content={ui.primary} />
          {!modest && (
            <meta name="generator" content="JSON Resume Theme CJEAN" />
          )}
          <meta name="referrer" content="no-referrer" />
          <meta
            name="format-detection"
            content="telephone=no, date=no, address=no, email=no, url=no"
          />
          <meta
            httpEquiv="Permissions-Policy"
            content={getPermissionsPolicy()}
          />

          <SEO resume={resume} />

          {basics.image && (
            <>
              <link rel="apple-touch-icon" href={basics.image} />
              <link
                rel="preload"
                as="image"
                href={basics.image}
                fetchPriority="high"
              />
            </>
          )}

          <style
            dangerouslySetInnerHTML={{
              __html: `
                :root {
                  --theme-background-tiles: url("${bgTiles}");
                  --theme-primary: ${ui.primary};
                  --theme-header-from: ${ui.headerFrom};
                  --theme-header-to: ${ui.headerTo};
                  --theme-footer-from: ${ui.footerFrom};
                  --theme-footer-to: ${ui.footerTo};
                }
              `,
            }}
          />
          <style id="resume-styles">{css}</style>
        </head>
        {body}
      </html>
    </>
  );
};
