# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static website for Enhance Ministries, a 501(c)(3) nonprofit providing pastoral coaching and care. Built with **Eleventy (11ty)** and hosted on **Netlify**.

- **Repository:** https://github.com/webadmin-enhancemin/enhance_ministries
- **Target domain:** https://enhancemin.com

## Development Commands

```bash
npm install        # First time setup
npm run serve      # Dev server with live reload (localhost:8080)
npm run build      # Production build → _site/
```

Always run `npm run build` to verify changes compile before committing.

## Architecture

Modular component-based architecture. Eleventy reads from `src/`, outputs to `_site/` (gitignored).

**Config:** `.eleventy.js` — defines passthrough copies, input/output dirs, shortcodes.

**Data layer** (`src/_data/`):
- `site.json` — site name, URL, `cssVersion` (bump after every CSS change), donation URL
- `navigation.json` — all nav links; editing this updates every page automatically
- `team.json` — leadership team members (carousel on homepage + `/leadership/`)
- `testimonials.json` — testimonial quotes (carousel on coaching + homepage)

**Base layout** (`src/_includes/layouts/base.njk`) — outputs full HTML page: meta/OG tags, nav, `{{ content | safe }}`, footer, donate modal, and conditional scripts. Pages never include nav/footer/modal themselves.

**Scripts are conditionally included** in the base layout based on frontmatter flags — only load what each page needs:

| Frontmatter flag | Script loaded |
|-----------------|---------------|
| `hasDropdown: true` | Mobile dropdown toggle |
| `hasCarousel: true` | Carousel navigation |
| `hasContactForm: true` | Contact form (Web3Forms) |
| `hasSmoothScroll: true` | Anchor smooth scroll |
| `hasNavScroll: true` | Navbar background on scroll |

## Page Template Structure

All pages use clean URL permalinks (`/page/` → `_site/page/index.html`):

```njk
---
layout: layouts/base.njk
title: Page Title
navStyle: solid              # 'solid' or omit for transparent hero nav
description: "SEO description"
keywords: "keyword1, keyword2"
canonical: "/page/"
hasDropdown: true            # Only include flags needed by this page
permalink: /page/
---

{# Page-specific HTML only — no nav/footer/modal #}
```

**Current pages** (`src/pages/`):

| File | URL | Notes |
|------|-----|-------|
| `index.njk` | `/` | Homepage with all major sections |
| `about.njk` | `/about/` | Story + pastor crisis stats |
| `services.njk` | `/services/` | Services carousel overview |
| `coaching.njk` | `/coaching/` | Coaching + free coaching sections |
| `consulting.njk` | `/consulting/` | Consulting services (split from coaching) |
| `speaking.njk` | `/speaking/` | Speaking themes + event types |
| `training.njk` | `/training/` | Interactive workshops |
| `events.njk` | `/events/` | Events hub |
| `golf.njk` | `/golf/` | Golf fundraiser + Zeffy registration iframe |
| `mission.njk` | `/mission/` | Student + Family + Win Your Jerusalem trips |
| `book.njk` | `/book/` | Matt's book |
| `media.njk` | `/media/` | Messages, podcasts, articles |
| `partners.njk` | `/partners/` | Ministry partners |
| `leadership.njk` | `/leadership/` | Team carousel |
| `contact.njk` | `/contact/` | Contact form (Web3Forms) |

**Old `.html` URL redirects** are in `src/_redirects` (Netlify rules, copied to `_site/` at build time).

## Deployment Pipeline

Push to `main` triggers GitHub Actions (`.github/workflows/deploy.yml`):

1. **Build** — `npm ci` + `npm run build` → uploads `_site/` as artifact
2. **Security scan** — `npm audit` (high+) + Trivy secret scan + Trivy vuln scan — **must pass before deploy**
3. **Deploy** — zips `_site/`, POSTs to Netlify API (`NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID` secrets)

Netlify auto-builds are **disabled** — GitHub Actions is the sole deploy trigger.

## CSS

All styles in `src/styles.css`. CSS custom properties in `:root`:
- Colors: `--color-primary` (#FF7A3D), `--color-primary-dark` (#FF5100)
- Spacing: `--spacing-xs` through `--spacing-2xl`
- Layout: `--max-width` (1200px)

Breakpoints: mobile < 768px, tablet 768px+, desktop 1024px+

**After any CSS change:** increment `cssVersion` in `src/_data/site.json` (cache busting).

## Adding a New Page

1. Create `src/pages/newpage.njk` with frontmatter (`permalink: /newpage/`)
2. Add to `src/_data/navigation.json`
3. Add to `src/sitemap.xml`
4. Use absolute internal links (e.g. `href="/coaching/"` not `href="coaching.html"`)

## External Integrations

- **Zeffy** — donation modal iframe (URL in `site.json`); golf registration iframe on `/golf/`
- **Jotform** — student mission trip registration on `/mission/`
- **Web3Forms** — contact form (access key hardcoded in contact form HTML; key: `ff5f576c-...`)
- **Google Fonts** — Inter (400/500/600/700), loaded via `<link>` in base layout
