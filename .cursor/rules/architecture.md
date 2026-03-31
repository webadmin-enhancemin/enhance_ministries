---
description: "Project overview, Eleventy architecture, data/layout conventions, and page template structure"
alwaysApply: true
---

## Project Overview

Enhance Ministries is a static website (501(c)(3) nonprofit) built with Eleventy and hosted on Netlify.

## Eleventy Architecture

- `src/` is the Eleventy input source.
- `_site/` is the Eleventy output target and is gitignored.
- `.eleventy.js` defines:
  - passthrough copies
  - input/output configuration
  - shortcodes
  - date filters such as `readableDate` and `dateToRFC822`

## Data Layer

Data lives in `src/_data/`:

- `site.json`: site name, URL, `cssVersion` (bump after CSS changes), donation URL
- `navigation.json`: site navigation links (edit once; updates everywhere)
- `team.json`: leadership team entries (homepage carousel + `/leadership/`)
- `testimonials.json`: testimonials (carousel on coaching + homepage)

## Layouts

- `src/_includes/layouts/base.njk`
  - Responsible for full HTML scaffolding: meta/OG tags, nav, footer, donate modal, and conditional scripts
  - Pages should not render nav/footer/modal themselves
- `src/_includes/layouts/post.njk`
  - Blog post layout
  - Chains to `base.njk`

## Conditional Script Flags

In `base.njk`, scripts are conditionally included based on page frontmatter flags. Only enable the flags a page needs:

- `hasDropdown: true` -> Mobile dropdown toggle
- `hasCarousel: true` -> Carousel navigation
- `hasContactForm: true` -> Contact form (Web3Forms)
- `hasSmoothScroll: true` -> Anchor smooth scroll
- `hasNavScroll: true` -> Navbar background on scroll

## Page Template Structure

Pages are standard Eleventy Nunjucks templates under `src/pages/` and use clean URL permalinks. Example:

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

