import { getIcon } from "./Icons.js";
import type { Resume } from "../schema.js";

export default async function SEO({ resume }: { resume: Resume }) {
  const { basics, meta } = resume;
  const { seo } = meta.themeConfig;

  const title =
    seo.title ||
    (basics.label ? `${basics.name} - ${basics.label}` : basics.name);
  const description = seo.description || basics.summary;
  const { firstNameSlice, lastNameSlice } = splitName(basics.name);

  return (
    <>
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
    </>
  );
}

export function splitName(name: string) {
  const [firstName, ...rest] = name.split(" ");
  return {
    firstNameSlice: firstName,
    lastNameSlice: rest.join(" "),
  };
}

export async function Base({
  title,
  description,
  canonical,
  robots,
  favicon,
}: {
  title: string;
  description?: string;
  canonical?: string;
  robots?: string;
  favicon?: string;
}) {
  return (
    <>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <meta name="robots" content={robots || "index, follow"} />
      {canonical && <link rel="canonical" href={canonical} />}
      {favicon && (
        <link
          rel="icon"
          href={`data:image/svg+xml;base64,${btoa(
            (await getIcon(favicon)).toString(),
          )}`}
        />
      )}
    </>
  );
}

export function OpenGraph({
  title,
  description,
  url,
  image,
  firstName,
  lastName,
}: {
  title: string;
  description?: string;
  url?: string;
  image?: string;
  firstName?: string;
  lastName?: string;
}) {
  return (
    <>
      <meta property="og:type" content="profile" />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      {firstName && <meta property="profile:first_name" content={firstName} />}
      {lastName && <meta property="profile:last_name" content={lastName} />}
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}
    </>
  );
}

export function Twitter({
  title,
  description,
  url,
  image,
}: {
  title: string;
  description?: string;
  url?: string;
  image?: string;
}) {
  return (
    <>
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={title} />
      {description && (
        <meta property="twitter:description" content={description} />
      )}
      {image && <meta property="twitter:image" content={image} />}
      {url && <meta property="twitter:url" content={url} />}
    </>
  );
}
