---
description: "CSS conventions, custom properties, breakpoints, and cssVersion cache-busting"
alwaysApply: false
globs: ["src/styles.css", "src/_data/site.json"]
---

## CSS Conventions

- All site styling lives in `src/styles.css`.
- CSS variables are defined in `:root`.

## Custom Properties

- Colors:
  - `--color-primary`: `#FF7A3D`
  - `--color-primary-dark`: `#FF5100`
  - accessible orange `#C54500` for WCAG AA text/buttons on white
- Spacing scale:
  - `--spacing-xs` through `--spacing-2xl`
- Layout:
  - `--max-width`: `1200px`

## Breakpoints

- Mobile: `< 768px`
- Tablet: `768px+`
- Desktop: `1024px+`

## Cache Busting Requirement

After any CSS change, increment `cssVersion` in `src/_data/site.json` to invalidate cached CSS.

