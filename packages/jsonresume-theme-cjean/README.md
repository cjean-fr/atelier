# jsonresume-theme-cjean

[![npm version](https://img.shields.io/npm/v/jsonresume-theme-cjean)](https://www.npmjs.com/package/jsonresume-theme-cjean)

A clean, professional [JSON Resume](https://jsonresume.org/) theme built with Tailwind CSS, TypeScript, and [Vincle](https://github.com/cjean-fr/vincle).

![Theme Preview](https://raw.githubusercontent.com/cjean-fr/atelier/main/packages/jsonresume-theme-cjean/assets/preview.png)

## Features

- **Responsive Design**: Looks great on mobile and desktop.
- **Print Optimized**: Automatically adjusted for high-quality PDF exports.
- **SEO Ready**: Full support for Meta tags, OpenGraph, Twitter Cards, and JSON-LD.
- **Customizable Aesthetics**: Easy branding via granular `ui` configuration and geometric patterns.
- **Multi-locale Support**: Comes with `fr` and `en`. Locales are managed in a single file (`i18n.ts`) — feel free to contribute yours!
- **Modern Tech Stack**: Built with Bun, TypeScript, and `@vincle/core` for server-rendered JSX.
- **CSS per Resume**: Tailwind utilities are generated from the rendered HTML, so optional sections only add their utilities when present.
- **CLI**: Built-in CLI to render your resume to an HTML file.

## Usage

### Installation

```bash
bun install
```

### Build

```bash
bun run build
```

### Execution (CLI)

While this theme is compatible with the official [resume-cli](https://github.com/jsonresume/resume-cli), it also comes with its own built-in CLI to render your resume to an HTML file:

#### Using npx

```bash
npx jsonresume-theme-cjean resume.json -o resume.html
```

#### Using bunx

```bash
bunx jsonresume-theme-cjean resume.json -o resume.html
```

## Configuration

### CSS generation

`render()` renders `ResumeBody` once with Vincle, scans the resulting HTML with `@tailwindcss/oxide`, and runs Tailwind's `compile()` / `build(candidates)` through `@tailwindcss/node`. `Layout` then receives the rendered body and minified CSS as properties and composes the final document, with its stylesheet in the head. The browser receives a standalone document with no Tailwind runtime.

The compiler and scanner are fresh for each resume, so classes from earlier renders do not accumulate. Base styles and custom component rules remain shared; utility classes are selected per document, including responsive, print, and floating-button variants. The resume uses a single light appearance on screen and in print.

CSS compilation runs on the server during each render. `@tailwindcss/node`, `@tailwindcss/oxide` (with its platform-specific scanner binary), and `tailwindcss` are runtime dependencies and must be installed with the theme. The Node library is built with `tsdown` in ESM and CommonJS formats. The CSS source is copied into `dist/tailwind.input.css` and read relative to the installed module; Vite is not involved.

Run `bun run test` to build and check CSS selection and CommonJS rendering.

### Resume settings

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

### Projects

The `projects` array in a JSON Resume is displayed as its own section. For example, a Vincle project entry can be added like this (replace the date and description with your own):

```json
{
  "projects": [
    {
      "name": "Vincle",
      "url": "https://github.com/cjean-fr/vincle",
      "startDate": "YYYY-MM-DD",
      "description": "A JSX renderer for HTML strings.",
      "highlights": ["TypeScript", "Server-side rendering"]
    }
  ]
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

**Note on `links`**:

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
| `canonical`    | Canonical URL                               | -                  |
| `favicon`      | Iconify identifier to use as favicon        | -                  |
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
    const es = defineThemeLocale({
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
