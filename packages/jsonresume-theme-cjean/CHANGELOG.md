# jsonresume-theme-cjean

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
