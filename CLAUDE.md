# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static website for Enhance Ministries, a 501(c)(3) nonprofit providing pastoral coaching and care. Built with **Eleventy (11ty)** static site generator and hosted on GitHub Pages.

- **Live site:** https://hogtai.github.io/enhance_ministries/
- **Repository:** https://github.com/hogtai/enhance_ministries

## Architecture

The site uses a **modular component-based architecture** with Nunjucks templates:

```
enhance_ministries/
├── .eleventy.js              # Eleventy configuration
├── package.json              # Node.js dependencies
├── .github/workflows/
│   ├── deploy.yml            # Build & deploy to GitHub Pages
│   └── seo-ping.yml          # SEO sitemap ping workflow
│
├── src/                      # Source files
│   ├── _includes/
│   │   ├── layouts/
│   │   │   └── base.njk      # Base HTML template (meta tags, nav, footer, scripts)
│   │   │
│   │   └── components/
│   │       ├── nav.njk       # Navigation (data-driven from navigation.json)
│   │       ├── footer.njk    # Footer
│   │       ├── donate-modal.njk  # Donation modal + mobile button
│   │       └── scripts/      # JavaScript components
│   │           ├── nav-toggle.njk     # Mobile hamburger menu
│   │           ├── modal.njk          # Donate modal logic
│   │           ├── dropdown.njk       # Mobile dropdown toggle
│   │           ├── carousel.njk       # Carousel navigation
│   │           ├── smooth-scroll.njk  # Anchor link smooth scroll
│   │           ├── nav-scroll.njk     # Navbar background on scroll
│   │           └── contact-form.njk   # Contact form submission
│   │
│   ├── _data/
│   │   ├── site.json         # Site config (name, URL, CSS version)
│   │   ├── navigation.json   # Nav menu structure
│   │   ├── team.json         # Leadership team members
│   │   └── testimonials.json # Testimonial quotes
│   │
│   ├── pages/                # Page templates (content only)
│   │   ├── index.njk         # Homepage
│   │   ├── coaching.njk      # Coaching for Pastors
│   │   ├── speaking_training.njk  # Speaking & Training
│   │   ├── events.njk        # Events hub
│   │   ├── golf.njk          # Golf Event
│   │   ├── missions.njk      # Mission Experiences
│   │   ├── book.njk          # Matt's Book
│   │   ├── media.njk         # Media (podcasts, messages)
│   │   └── partners.njk      # Ministry Partners
│   │
│   ├── assets/               # Images (copied to _site/)
│   ├── styles.css            # All CSS
│   ├── sitemap.xml           # SEO sitemap
│   └── robots.txt            # Crawler directives
│
└── _site/                    # Build output (auto-generated, gitignored)
```

## Development Commands

```bash
# Install dependencies (first time)
npm install

# Start development server with live reload
npm run serve

# Build site for production
npm run build

# Deploy (push to main triggers GitHub Actions)
git add . && git commit -m "message" && git push origin main
```

## Key Patterns

### Page Template Structure

Each page template only contains the **page-specific content**. The base layout automatically includes nav, footer, modal, and scripts:

```njk
---
layout: layouts/base.njk
title: Page Title
navStyle: solid              # 'solid' or omit for transparent
description: "SEO description"
keywords: "keyword1, keyword2"
canonical: "/page.html"
hasDropdown: true            # Include dropdown toggle script
hasCarousel: true            # Include carousel navigation script
hasContactForm: true         # Include contact form script
hasSmoothScroll: true        # Include smooth scroll for anchors
hasNavScroll: true           # Include navbar scroll background
permalink: /page.html
---

{# Page content goes here - no nav/footer/modal needed #}
<header class="hero">...</header>
<section class="section">...</section>
```

### Data Files

Update content by editing JSON files in `src/_data/`:

| File | Purpose |
|------|---------|
| `site.json` | Site name, URL, tagline, CSS version, donation URL |
| `navigation.json` | Menu structure (items, dropdowns, links) |
| `team.json` | Leadership team members |
| `testimonials.json` | Testimonial quotes |

### CSS Custom Properties

All colors, spacing, and common values in `:root`. Key variables:
- Colors: `--color-primary` (#FF7A3D), `--color-primary-dark` (#FF5100), `--color-text`, `--color-bg-light`
- Spacing: `--spacing-xs` through `--spacing-2xl`
- Layout: `--max-width` (1200px), `--border-radius`, `--transition`

### Responsive Breakpoints
- Mobile: < 768px (single-card carousels, hamburger nav)
- Tablet: 768px+ (two-card carousels, full nav)
- Desktop: 1024px+ (multi-card carousels, carousel arrow buttons visible)

## Common Tasks

### Updating Navigation
Edit `src/_data/navigation.json` - changes apply to all pages automatically.

### Adding a Team Member
Edit `src/_data/team.json`:
```json
{
  "name": "New Person",
  "title": "Role Title",
  "image": "photo-filename.webp",
  "bio": "Optional bio text",
  "objectPosition": "center 30%"  // Optional: for photo cropping
}
```

### Adding a Testimonial
Edit `src/_data/testimonials.json`:
```json
{
  "quote": "The testimonial text...",
  "author": "Person Name",
  "role": "Church Name, Location"
}
```

### Updating CSS
1. Edit `src/styles.css`
2. Increment `cssVersion` in `src/_data/site.json`
3. Build and deploy

### Adding a New Page
1. Create `src/pages/newpage.njk` with frontmatter
2. Add link to `src/_data/navigation.json`
3. Add to `src/sitemap.xml`
4. Build and deploy

## External Integrations

### Zeffy (Donation Platform)
- Donation modal: Embedded iframe (URL in `site.json`)
- Golf registration: Iframe embed on golf page

### Jotform (Mission Trip Registration)
- Student mission trip registration on missions page
- URL: `https://form.jotform.com/251803686050051`

### Google Fonts
Inter font family (weights 400, 500, 600, 700)

### Social Links
- Facebook: https://www.facebook.com/EnhanceMinistries
- Instagram: https://www.instagram.com/enhanceministries/

## SEO & Search Engine Indexing

### Automated SEO Features
- Meta tags, Open Graph, Twitter Cards (via base.njk template)
- JSON-LD structured data (per-page via `structuredData` block)
- `sitemap.xml` and `robots.txt` (copied during build)

### GitHub Actions Workflows
- **deploy.yml**: Builds with Eleventy, deploys to GitHub Pages on push to main
- **seo-ping.yml**: Pings search engines when content changes

## Deployment

GitHub Pages deployment is fully automated:

1. Push changes to `main` branch
2. GitHub Actions runs `npm run build`
3. The `_site/` folder is deployed to GitHub Pages
4. Site is live at https://hogtai.github.io/enhance_ministries/

## Lighthouse Best Practices & Security Headers

**Current Score:** 77/100

The site loses points due to:
1. **Third-party cookies** - From Zeffy donation iframe (expected, cannot be eliminated)
2. **Missing security headers** - GitHub Pages limitation

To improve: Add Cloudflare in front of GitHub Pages for custom headers.

---

## Benefits of Modular Architecture

| Task | Before | After |
|------|--------|-------|
| Update navigation | Edit 9 files | Edit 1 JSON file |
| Update footer | Edit 9 files | Edit 1 component |
| Bump CSS version | Edit 9 files | Edit 1 JSON file |
| Add new page | Copy ~600 lines | Create ~50 lines |
| Update donate URL | Edit 9 files | Edit 1 JSON file |
| Add team member | Edit HTML | Edit 1 JSON file |
| Add testimonial | Edit HTML | Edit 1 JSON file |

---

## Guide for New Maintainers (Using Claude Code)

### Prerequisites
1. **Claude Code** - Install: `npm install -g @anthropic-ai/claude-code`
2. **Node.js** - Required for building the site
3. **Git** - For version control

### Getting Started

```bash
cd path/to/enhance_ministries
npm install  # First time only
claude       # Start Claude Code
```

### Common Requests

| Task | Example Request |
|------|-----------------|
| Update event dates | "Change the golf event date to July 25, 2026" |
| Add team member | "Add Sarah Johnson as Marketing Director - photo is sarah-johnson.webp" |
| Update CSS | "Make the primary color more orange" |
| Add testimonial | "Add a testimonial from Pastor Mike at Community Church" |
| Fix navigation | "Add a new dropdown item for the Resources menu" |

### Important Reminders

1. **Run `npm run build`** to verify changes compile correctly
2. **Edit data files** for content changes (not page templates)
3. **Commit with descriptive messages** explaining what changed
4. **Push to main** to trigger automated deployment

### Getting Help

- **Claude Code Issues**: https://github.com/anthropics/claude-code/issues
- **Eleventy Docs**: https://www.11ty.dev/docs/
- **Website Questions**: Contact the Enhance Ministries team
