# jsonresume-theme-cjean

A clean, professional [JSON Resume](https://jsonresume.org/) theme built with Tailwind CSS and TypeScript.

## Features

- **Responsive Design**: Looks great on mobile and desktop.
- **Print Optimized**: Automatically adjusted for high-quality PDF exports.
- **SEO Ready**: Full support for Meta tags, OpenGraph, Twitter Cards, and JSON-LD.
- **Customizable Aesthetics**: Easy branding via granular `ui` configuration and geometric patterns.
- **Multi-locale Support**: Comes with `fr` and `en`. Locales are managed in a single file (`i18n.ts`) — feel free to contribute yours!
- **Modern Tech Stack**: Built with Bun, TypeScript, and functional components.

## Usage

### Installation

```bash
bun install
```

### Build

```bash
bun run build
```

### Resume Commands

To export your resume to an HTML file:

```bash
bun run resume:export
```

To live preview your resume (auto-reloads on changes):

```bash
bun run resume:serve
```

## Configuration

You can customize the theme by adding a `meta` object to your `resume.json`.

```json
{
  "meta": {
    "theme": "cjean",
    "lang": "fr",
    "lastModified": "2026-02-06",
    "themeConfig": {
      "ui": {
        "primary": "#c80044",
        "headerFrom": "#0271bf",
        "headerTo": "#c80044",
        "footerFrom": "#0271bf",
        "footerTo": "#003d68",
        "backgroundTilesSeed": 188
      },
      "seo": {
        "title": "CV de Jean Dupont",
        "description": "Développeur Fullstack expérimenté",
        "robots": "index, follow"
      },
      "modest": false
    }
  },
  "basics": { ... }
}
```

### themeConfig Options

#### UI Options (`ui`)

| Option                | Description                                                                  | Default                                      |
| :-------------------- | :--------------------------------------------------------------------------- | :------------------------------------------- |
| `primary`             | Primary theme color                                                          | `#255b8f`                                    |
| `headerFrom`          | Gradient start color for header                                              | `#ccc074`                                    |
| `headerTo`            | Gradient end color for header                                                | `#4971af`                                    |
| `footerFrom`          | Gradient start color for footer                                              | `#463932`                                    |
| `footerTo`            | Gradient end color for footer                                                | `#7fbdbc`                                    |
| `backgroundTilesSeed` | Seed for the geometric background patterns                                   | `1`                                          |
| `links`               | Order and choice of contact links (phone, email, ...)                        | `["phone", "email", "location", "profiles"]` |
| `showLogos`           | Show work experiences logos taken from `work.logo or from `work.url` favicon | true                                         |
| `cta`                 | Add a Floating Action Button on the bottom right                             | -                                            |
| `cta.text`            | The button text                                                              | -                                            |
| `cta.url`             | The button target url                                                        | -                                            |
| `cta.icon`            | The button icon                                                              | -                                            |

**Note on `contactLinks`**:

- The order in the array determines the order of appearance.
- **Special keywords**: `phone`, `email`, `location`, `profiles`
- **`profiles` keyword**: A "catch-all" that renders all social networks not explicitly mentioned.
- **Specific networks**: You can use the name of a network (e.g., `"LinkedIn"`, `"GitHub"`) to place it exactly where you want.
- _Example_: `["LinkedIn", "email", "location"]` will show only these three, in that order.
- _Example_: `["phone", "profiles", "email"]` will show the phone, then ALL social profiles, then the email.

**Icons & Social Networks**:
The theme uses [Iconify](https://icon-sets.iconify.design/) to dynamically fetch icons.

- **Social Networks**: Icons for profiles are automatically prefixed with `tabler:brand-`. For example, a network named `LinkedIn` will search for `tabler:brand-linkedin`.
- **Custom Icons**: For the `cta.icon`, you must provide the full Iconify identifier (e.g., `mdi:email`, `tabler:message-circle`).
- **Search Icons**: You can browse thousands of available icons on the [Iconify Explorer](https://icon-sets.iconify.design/).

#### SEO Options (`seo`)

| Option         | Description                                 | Default            |
| :------------- | :------------------------------------------ | :----------------- |
| `title`        | Meta title (overrides default name - label) | -                  |
| `description`  | Meta description (overrides basics.summary) | -                  |
| `canonical`    | Canonical URL                               | `basics.url`       |
| `ogImage`      | Open Graph image URL                        | `basics.image`     |
| `twitterImage` | Twitter card image URL                      | `basics.image`     |
| `robots`       | Robots meta tag content                     | `index, follow`    |
| `firstName`    | SEO explicit first name                     | (parsed from name) |
| `lastName`     | SEO explicit last name                      | (parsed from name) |

#### Other Options

| Option   | Description                                           | Default |
| :------- | :---------------------------------------------------- | :------ |
| `modest` | Minimal branding (removes theme credit and generator) | `false` |

### Meta Options (root)

| Option         | Description                         | Default |
| :------------- | :---------------------------------- | :------ |
| `lang`         | Locale of the resume (`en` or `fr`) | `en`    |
| `lastModified` | Last modification date (ISO format) | (now)   |

## Adding New Locales

To add a new locale (e.g., Spanish `es`):

1.  Open `src/lib/i18n.ts`.
2.  Add the new translations to the `fr` or `en` model to stay in sync with the `ThemeSpec`.
3.  Define the new locale resource:
    ```typescript
    const es = defineTranslations<ThemeSpec>()({
      work_experience: "Experiencia laboral",
      // ... copy and translate all keys
    });
    ```
4.  Add it to the `resources` object:
    ```typescript
    const resources = {
      en,
      fr,
      es,
    };
    ```

## License

MIT © Christophe Jean

---

<p align="center">Made with ❤️ in Paris</p>
