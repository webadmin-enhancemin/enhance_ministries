# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static website for Enhance Ministries, a 501(c)(3) nonprofit providing pastoral coaching and care. Hosted on GitHub Pages with no build process.

- **Live site:** https://hogtai.github.io/enhance_ministries/
- **Repository:** https://github.com/hogtai/enhance_ministries

## Architecture

```
index.html          # Main landing page (hero, stats, services, testimonials, team, contact)
golf.html           # Annual golf fundraiser event page
styles.css          # All CSS (mobile-first, CSS custom properties)
assets/             # Images, logos, team photos
```

All JavaScript is inline at the bottom of each HTML file (no external JS files).

## Development Commands

```bash
# Cache busting: increment version in BOTH HTML files when updating CSS
<link rel="stylesheet" href="styles.css?v=X">

# Verify deployment
curl -s "https://hogtai.github.io/enhance_ministries/" | grep "search-term"
curl -s "https://hogtai.github.io/enhance_ministries/styles.css?v=X" | grep "css-rule"

# Deploy
git add . && git commit -m "message" && git push origin main
```

## Key Patterns

### CSS Custom Properties
All colors, spacing, and common values in `:root`. Key variables:
- Colors: `--color-primary` (#FF7A3D), `--color-primary-dark` (#FF5100), `--color-text`, `--color-bg-light`
- Spacing: `--spacing-xs` through `--spacing-2xl`
- Layout: `--max-width` (1200px), `--border-radius`, `--transition`

### Responsive Breakpoints
- Mobile: < 768px (single-card carousels, hamburger nav)
- Tablet: 768px+ (two-card carousels, full nav)
- Desktop: 1024px+ (multi-card carousels, carousel arrow buttons visible)

### Carousel Pattern
Both team and testimonial carousels share the same structure and JS handler:
```html
<div class="[type]-carousel-wrapper">
    <button class="carousel-btn carousel-btn-prev">&larr;</button>
    <div class="[type]-carousel">
        <div class="[type]-card">...</div>
    </div>
    <button class="carousel-btn carousel-btn-next">&rarr;</button>
    <div class="carousel-hint">Swipe to see more</div>
</div>
```

### Navigation
- `index.html`: Uses `.nav` (transparent, becomes white on scroll via JS `.scrolled` class)
- `golf.html`: Uses `.nav.nav-solid` (always white background)
- **Both files share the same nav items** - update both when changing navigation

### Donate Modal
Three triggers open the same modal (`#donate-modal`):
1. Nav "Donate" button (`.nav-donate-btn`)
2. "Give" button in donate section (`#open-donate-modal`)
3. Fixed mobile donate button (`#mobile-donate-btn`) - only visible on mobile

### Section Backgrounds
Alternate between white and light gray using `.section-alt`:
```html
<section class="section">           <!-- White -->
<section class="section section-alt"> <!-- Light gray (#F8F5F4) -->
```

## Common Tasks

### Adding a Team Member
1. Add photo to `assets/`
2. Add `team-card` div in `index.html` team-carousel
3. For photo positioning: `style="object-position: center X%;"`

### Adding a Testimonial
Add `testimonial-card` with `.testimonial-quote`, `.testimonial-author`, `.testimonial-role`

### Updating Navigation
Must update nav in **both** `index.html` and `golf.html`

## External Integrations

### Zeffy (Donation Platform)
- Donation modal: Embedded iframe in `#donate-modal`
- Golf registration: Iframe embed on `golf.html`
- Verify URLs still work before modifying

### Google Fonts
Inter font family (weights 400, 500, 600, 700)

## Deployment Notes

- GitHub Pages deploys automatically from `main` branch
- Always increment `styles.css?v=X` in both HTML files when changing CSS
- Verify deployment with curl before confirming changes complete
