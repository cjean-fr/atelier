# jsonresume-theme-cjean

## 1.4.0 — 2026-10-02

A lighter CV with a consistent appearance, improved printing, and a modern rendering pipeline.

### Changed

- **Smaller assets**: Generate CSS from class attributes only, avoiding utilities accidentally detected in text or encoded images. Fetch company logos at their 48 px display size instead of 64 px.

- **Light appearance everywhere**: Use one light theme on screen and in print. Remove the dark-mode toggle, stored preference, bootstrap script, and dark-specific styles.
- **Vincle rendering**: Migrate server-rendered JSX, component types, lint rules, and translated JSX interpolation to Vincle.
- **CSS tailored to each CV**: Generate and minify Tailwind utilities from rendered HTML. Optional sections and contact buttons only contribute the styles they need; each render starts with fresh candidates.
- **Modern library build**: Replace Vite with tsdown while preserving ESM, CommonJS, TypeScript declarations, and the CLI. Ship the CSS source alongside the library.
- **Better print alignment**: Keep dates on the right without wrapping in experience, project, and education entries, while allowing long titles to wrap.
- **Consistent timelines**: Use reversed list numbering for education, matching experiences. Entries retain the order supplied in the JSON.

### Fixed

- **Private structured data**: Preserve useful ProfilePage/Person metadata and public profile links, while omitting email, telephone, birth date, and personal address.

- **Shared geometric background**: Define the SVG data URL once and reuse it for the header and footer, reducing duplicated HTML while preserving their independent gradients.

- Preserve arbitrary Tailwind selectors when HTML attributes contain escaped characters.
- Resolve Tailwind assets relative to the installed package, including CommonJS rendering from another working directory.
- Keep generated CSS in the document head and resume text correctly escaped without double escaping.

### Validation

- Add regression coverage for optional styles, independent CSS generation between resumes, print utilities, light-only output, CommonJS resolution, and document composition.

### Upgrade notes

- Requires **Node.js 22 or newer**.
- CSS compilation now runs during `render()`. The theme requires `tailwindcss`, `@tailwindcss/node`, and `@tailwindcss/oxide` at runtime, including the platform-specific scanner binary.
- Dark mode is removed. Generated HTML remains standalone, with no Tailwind runtime in the browser.

## 1.3.5

### Changed

- **Internal**: Replaced `createTranslationBuilder` by `satisfies ValidTranslations` (following `@cjean-fr/i18n-tiny` v2.0.0 API changes).

## 1.3.4

### New features

- **Dark mode toggle**: A sun/moon toggle button lets users switch
  theme interactively. Preference is persisted in localStorage and
  respects `prefers-color-scheme` on first visit. Includes a
  flash-of-wrong-theme prevention script in `<head>`.

## 1.3.3

### New features

- **Projects section**: A new optional Projects section renders the
  `projects` array from resume.json with timeline layout matching
  Work and Volunteer sections.
- **FAB behavior**: Floating Action Button now scrolls the page to the
  top/bottom with improved UX.

### Changed

- **Component refactoring**: Multiple components refactored for better
  code organization.
- **Dark mode timeline marker**: Decoupled from nested selector for
  better CSS compatibility.

### Fixed

- **Icon name**: Fixed icon name bug in FAB component.

## 1.3.2

### Changed

- **Internal**: Updated i18n to use `createTranslationBuilder` API,
  updated dependencies.

## 1.3.1

### New features

- **Gravatar**: Added support for gravatar images if no picture are provided.

## 1.3.0

### New features

- **CLI**: Added a built-in CLI to export your resume directly via `npx jsonresume-theme-cjean`.
- **Dependencies**: Removed dependency on `resume-cli` for exports.

## 1.2.1

### Minor UI fixes

- **Work Experience**: Fix layout of work experience items.

## 1.2.0

### Improvements

- refresh UI
- Update dependencies

## 1.1.6

### Improvements

- **Logo**: Better error handling for missing logo.
- **Types**: Do not export `Resume` type for improved declaration bundling.
- **FAB**: Use `scrollY` instead of deprecated `pageYOffset`.
- **resume.json**: Cover more resume.json cases.

## 1.1.5

### Bug fixes

- **Imports**: Fix package names in imports.

## 1.1.4

### Improvements

- **Section**: Add `break-after-avoid` to section title to prevent page breaks after section titles.

## 1.1.3

### Improvements

- **Types**: Export `Resume` type for improved declaration bundling.

## 1.1.1

### Performance improvements

- **Header Background**: Improve web performance by using `<img>` elements instead of CSS background images.
- **CSS**: Remove unused CSS.

## 1.1.0

### New features

- **Header Background**: Reduce background SVG size by 3x.
- **Favicon**: Added support for a favicon via the `favicon` field in the `meta.themeConfig` object.

## 1.0.0

### Initial release

- **Responsive Design**: Looks great on mobile and desktop.
- **Print Optimized**: Automatically adjusted for high-quality PDF exports.
- **SEO Ready**: Full support for Meta tags, OpenGraph, Twitter Cards, and JSON-LD.
- **Customizable Aesthetics**: Easy branding via granular `ui` configuration and geometric patterns.
- **Multi-locale Support**: Comes with `fr` and `en`. Locales are managed in a single file (`i18n.ts`) — feel free to contribute yours!
- **Modern Tech Stack**: Built with Bun, TypeScript, and functional components.
