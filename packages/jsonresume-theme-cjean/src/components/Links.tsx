import { t } from "../lib/i18n.js";
import type { Resume } from "../schema.js";
import { getIcon } from "./Icons.js";
import type { StandardAttributes } from "@cjean-fr/jsx-string";

function buildMapsUri(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function getProfileIcon(network: string) {
  try {
    return getIcon(`tabler:brand-${network.toLowerCase()}`);
  } catch (e) {
    return getIcon("tabler:link");
  }
}

const BasicsItem = ({ children, ...props }: StandardAttributes) => (
  <li className="inline-flex items-center gap-x-1" {...props}>
    {children}
  </li>
);

export default function Links({
  basics,
  list = ["phone", "email", "location", "profiles"],
}: {
  basics: Resume["basics"];
  list: Resume["meta"]["themeConfig"]["ui"]["links"];
}) {
  const { phone, email, location, profiles = [] } = basics;
  const displayedProfiles = new Set<string>();

  const renderLink = (link: string) => {
    const key = link.toLowerCase();

    if (key === "phone" && phone) {
      return (
        <BasicsItem key="phone">
          {getIcon("tabler:phone")}
          <a href={`tel:${encodeURIComponent(phone)}`} title={t("phone_call")}>
            {phone}
          </a>
        </BasicsItem>
      );
    }

    if (key === "email" && email) {
      return (
        <BasicsItem key="email">
          {getIcon("tabler:mail")}
          <a href={`mailto:${email}`} title={t("email_send")}>
            {email}
          </a>
        </BasicsItem>
      );
    }

    if (key === "location" && location) {
      return (
        <BasicsItem key="location">
          {getIcon("tabler:map-pin")}
          <a
            href={buildMapsUri(
              `${location.city}, ${location.region}, ${location.postalCode || ""}, ${location.countryCode}`,
            )}
            title={t("show_address")}
            target="_blank"
            rel="noopener noreferrer"
            referrerPolicy="no-referrer"
          >
            {location.city}, {location.countryCode}
          </a>
        </BasicsItem>
      );
    }

    if (key === "profiles") {
      return profiles
        .filter((p) => !displayedProfiles.has(p.network.toLowerCase()))
        .map((profile) => {
          displayedProfiles.add(profile.network.toLowerCase());
          return (
            <BasicsItem key={profile.network}>
              {getProfileIcon(profile.network)}
              <a
                href={profile.url}
                rel="me noopener noreferrer"
                title={profile.username}
                target="_blank"
                referrerPolicy="no-referrer"
              >
                {profile.network}
              </a>
            </BasicsItem>
          );
        });
    }

    // specific network
    const profile = profiles.find((p) => p.network.toLowerCase() === key);
    if (profile && !displayedProfiles.has(key)) {
      displayedProfiles.add(key);
      return (
        <BasicsItem key={profile.network}>
          {getProfileIcon(profile.network)}
          <a
            href={profile.url}
            rel="me noopener noreferrer"
            title={profile.username}
            target="_blank"
            referrerPolicy="no-referrer"
          >
            {profile.network}
          </a>
        </BasicsItem>
      );
    }

    return null;
  };

  return (
    <ul
      className="my-3 inline-flex flex-wrap gap-x-[2ch] gap-y-2"
      aria-label={t("contact_info")}
    >
      {list.map(renderLink)}
    </ul>
  );
}
