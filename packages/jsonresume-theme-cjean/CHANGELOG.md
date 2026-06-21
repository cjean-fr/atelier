# jsonresume-theme-cjean

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
