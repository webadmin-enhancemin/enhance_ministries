# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static website for Enhance Ministries, a 501(c)(3) nonprofit providing pastoral coaching and care. Hosted on GitHub Pages with no build process.

- **Live site:** https://hogtai.github.io/enhance_ministries/
- **Repository:** https://github.com/hogtai/enhance_ministries

## Architecture

```
index.html          # Main landing page (hero, stats, services, testimonials, team, contact)
events.html         # Events hub page (links to golf and missions)
golf.html           # Annual golf fundraiser event page
missions.html       # Mission Experiences page (student and family trips)
styles.css          # All CSS (mobile-first, CSS custom properties) - currently v=15
assets/             # Images, logos, team photos, mission trip images
sitemap.xml         # XML sitemap for search engines
robots.txt          # Crawler directives for search engines and AI bots
.github/workflows/  # GitHub Actions (SEO ping workflow)
```

All JavaScript is inline at the bottom of each HTML file (no external JS files).

## Development Commands

```bash
# Cache busting: increment version in ALL 4 HTML files when updating CSS
<link rel="stylesheet" href="styles.css?v=17">

# Verify deployment
curl -s "https://hogtai.github.io/enhance_ministries/" | grep "search-term"
curl -s "https://hogtai.github.io/enhance_ministries/styles.css?v=17" | grep "css-rule"

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
- `events.html`, `golf.html`, `missions.html`: Use `.nav.nav-solid` (always white background)
- **All 4 files share the same nav items** - update all when changing navigation
- Events dropdown contains links to Golf Event and Mission Trips

### Donate Modal
Present on all pages. Three triggers open the same modal (`#donate-modal`):
1. Nav "Donate" button (`.nav-donate-btn`)
2. CTA section button (varies by page)
3. Fixed mobile donate button (`#mobile-donate-btn`) - only visible on mobile

### Contact Form (index.html only)
Uses `mailto:` link approach (no backend required):
- Auto-fills email subject with name and interest area
- Opens user's default email client
- Fallback message shown if email client doesn't open

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
Must update nav in **all 4 HTML files**: `index.html`, `events.html`, `golf.html`, `missions.html`

### Updating CSS
1. Make changes in `styles.css`
2. Increment version parameter in all 4 HTML files: `styles.css?v=17`
3. Commit, push, and verify deployment

## External Integrations

### Zeffy (Donation Platform)
- Donation modal: Embedded iframe in `#donate-modal` (all pages)
- Golf registration: Iframe embed on `golf.html`
- URL: `https://www.zeffy.com/embed/donation-form/partner-with-us-to-see-fruitful-ministries-and-healthy-leaders`

### Jotform (Mission Trip Registration)
- Student mission trip registration: Embedded on `missions.html`
- URL: `https://form.jotform.com/251aborgs/registrationmissiontrip2025`

### Google Fonts
Inter font family (weights 400, 500, 600, 700)

### Social Links
- Facebook: https://www.facebook.com/EnhanceMinistries
- Instagram: https://www.instagram.com/enhanceministries/
- (LinkedIn removed - not maintained)

## SEO & Search Engine Indexing

### Automated SEO Features
The site has comprehensive SEO optimization built in:

**On-Page SEO (all HTML pages):**
- Meta description, keywords, author, robots directives
- Canonical URLs (prevents duplicate content)
- Open Graph meta tags (Facebook/social sharing)
- Twitter Card meta tags
- JSON-LD structured data (Organization, Event schemas)

**Crawling & Indexing:**
- `sitemap.xml` - Lists all pages with priorities and update frequencies
- `robots.txt` - Allows all search engines and AI crawlers (GPTBot, Claude-Web, PerplexityBot, etc.)

**GitHub Actions Workflow (`.github/workflows/seo-ping.yml`):**
- Automatically pings Google, Bing, Yandex when content changes
- Runs weekly on Sundays at 6 AM UTC
- Auto-updates sitemap lastmod dates
- Can be triggered manually from GitHub Actions tab

### Manual SEO Setup Required (One-Time)

**WAIT:** If you plan to switch to a custom domain (e.g., `enhancemin.com`), complete the domain migration FIRST before doing these manual SEO steps. See "Custom Domain Migration" section below.

1. **Google Search Console** (https://search.google.com/search-console)
   - Add property for your final domain
   - Verify ownership (HTML file or DNS)
   - Submit sitemap URL

2. **Bing Webmaster Tools** (https://www.bing.com/webmasters)
   - Add site for your final domain
   - Verify ownership
   - Submit sitemap URL

3. **Optional - Google Analytics**
   - Create GA4 property at https://analytics.google.com
   - Add tracking code to all HTML pages (in `<head>`)

### Custom Domain Migration (enhancemin.com)

When ready to switch from `hogtai.github.io/enhance_ministries/` to `enhancemin.com`:

**Step 1: Configure DNS**
- Add CNAME record: `www` → `hogtai.github.io`
- For apex domain: Add A records pointing to GitHub Pages IPs (see GitHub docs)

**Step 2: Configure GitHub Pages**
- Go to repository Settings → Pages
- Under "Custom domain", enter `enhancemin.com`
- Enable "Enforce HTTPS"

**Step 3: Update All URLs in Code**
Update these files to replace `hogtai.github.io/enhance_ministries/` with `enhancemin.com/`:

1. **All 4 HTML files** (`index.html`, `events.html`, `golf.html`, `missions.html`):
   - Canonical URLs (`<link rel="canonical">`)
   - Open Graph URLs (`og:url`, `og:image`)
   - Twitter URLs (`twitter:url`, `twitter:image`)
   - JSON-LD structured data URLs

2. **sitemap.xml**: Update all `<loc>` URLs

3. **robots.txt**: Update sitemap URL

4. **.github/workflows/seo-ping.yml**: Update sitemap URLs in ping commands

**Step 4: Complete Manual SEO Setup**
Now complete the Google Search Console and Bing Webmaster Tools setup using `enhancemin.com`

### Updating SEO When Adding Pages
When adding a new page:
1. Add SEO meta tags (copy pattern from existing pages)
2. Add JSON-LD structured data if applicable
3. Add the page to `sitemap.xml`
4. Commit and push - the workflow will ping search engines automatically

## Deployment Notes

- GitHub Pages deploys automatically from `main` branch (typically 10-15 seconds)
- Always increment `styles.css?v=X` in **all 4 HTML files** when changing CSS
- Verify deployment with curl before confirming changes complete

---

## Guide for New Maintainers (Using Claude Code)

This website can be easily maintained using Claude Code, Anthropic's AI coding assistant. Here's how to get started:

### Prerequisites
1. **Claude Subscription** - Get a Claude Pro or Team subscription at [claude.ai](https://claude.ai)
2. **Claude Code** - Install Claude Code CLI: `npm install -g @anthropic-ai/claude-code`
3. **Git** - Have Git installed and configured
4. **Repository Access** - Clone or have access to this repository

### Getting Started

1. **Open the project folder** in your terminal:
   ```bash
   cd path/to/enhance_ministries
   ```

2. **Start Claude Code**:
   ```bash
   claude
   ```

3. **Ask Claude to make changes** in plain English. Examples:
   - "Update the golf event date to August 15, 2026"
   - "Add a new team member named John Smith with photo john-smith.jpg"
   - "Change the primary color from orange to blue"
   - "Add a new testimonial from Pastor Jane Doe"

### Tips for Effective Requests

1. **Be specific**: Instead of "fix the header", say "make the navigation sticky on scroll"

2. **Reference locations**: "In the contact section of index.html, change the phone number to..."

3. **Ask for validation**: Always request Claude to verify changes are deployed before confirming completion

4. **Request commits**: Say "commit and push this change" when you're happy with the result

### Common Maintenance Tasks

| Task | Example Request |
|------|-----------------|
| Update event dates | "Change the golf event date to July 25, 2026 on all relevant pages" |
| Add team member | "Add Sarah Johnson as a new board member with title 'Board Advisor' - her photo is sarah-johnson.jpg in assets" |
| Update contact info | "Change the contact email to newcontact@enhancemin.com" |
| Change button text | "Change 'Support the Mission' button to 'Give Now' on the home page" |
| Add testimonial | "Add a new testimonial: 'Enhance Ministries changed my life...' - Pastor Mike, Community Church" |
| Update statistics | "Update the pastoral burnout statistic to 45% with source Barna 2025" |
| Fix broken link | "The Facebook link is broken, update it to the correct URL" |

### Important Reminders

1. **CSS Changes**: When Claude updates `styles.css`, ensure it also increments the version in all 4 HTML files

2. **Navigation**: Any nav changes must be applied to all 4 pages

3. **Testing**: Ask Claude to verify deployment using curl commands before confirming

4. **Commits**: Request descriptive commit messages explaining what changed

5. **Backup**: The git history serves as your backup - you can always revert if needed

### Example Session

```
You: Add a new event called "Winter Retreat" to the events page

Claude: I'll add a Winter Retreat event card to events.html. Let me read the
current file structure first...
[Claude reads events.html, makes changes, commits, pushes, and verifies deployment]

You: Great! Now update the date to February 15-17, 2026

Claude: I'll update the Winter Retreat dates...
[Claude makes the change and verifies]
```

### Getting Help

- **Claude Code Issues**: https://github.com/anthropics/claude-code/issues
- **Website Questions**: Contact the Enhance Ministries team
- **Git Problems**: Claude can help troubleshoot git issues too - just describe the error
