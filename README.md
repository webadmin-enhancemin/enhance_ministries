# Enhance Ministries Website

A modern, responsive website for Enhance Ministries — a 501(c)(3) nonprofit dedicated to Cultivating Healthy Leaders and Fruitful Ministries.

**Live Site:** [https://enhancemin.com](https://enhancemin.com)
**Repository:** [github.com/webadmin-enhancemin/enhance_ministries](https://github.com/webadmin-enhancemin/enhance_ministries)

## Tech Stack

- **Eleventy (11ty)** — Static site generator with Nunjucks templates
- **Netlify** — Hosting, Identity (auth), and Git Gateway
- **Decap CMS** — Web-based content editor at `/admin/`
- **GitHub Actions** — Automated build, security scan, and deploy pipeline
- **HTML5/CSS3** — Semantic markup, custom properties, Flexbox, Grid
- **Vanilla JavaScript** — No frameworks
- **Google Fonts** — Inter font family
- **Zeffy** — Donation and event registration forms
- **Jotform** — Mission trip registration
- **Web3Forms** — Contact form backend

## Project Structure

```
enhance_ministries/
├── .eleventy.js              # Eleventy config (filters, passthroughs, shortcodes)
├── package.json
├── .github/workflows/
│   └── deploy.yml            # Build → security scan → deploy to Netlify
│
├── src/
│   ├── _includes/
│   │   ├── layouts/
│   │   │   ├── base.njk      # Base HTML template (meta, nav, footer, scripts)
│   │   │   └── post.njk      # Blog post layout (chains to base.njk)
│   │   └── components/       # nav, footer, donate-modal, scripts
│   │
│   ├── _data/
│   │   ├── site.json         # Site name, URL, cssVersion, donation URL
│   │   ├── navigation.json   # Nav menu structure (edit to add/remove links)
│   │   ├── team.json         # Leadership team members
│   │   └── testimonials.json # Testimonial quotes
│   │
│   ├── pages/                # Page templates (Nunjucks)
│   ├── blog/                 # Blog posts (Markdown) — managed via Decap CMS
│   │   └── blog.11tydata.js  # Sets layout + tag for all posts
│   ├── admin/
│   │   ├── index.html        # Decap CMS entry point
│   │   └── config.yml        # CMS collections and field definitions
│   │
│   ├── assets/               # Images and static files
│   ├── styles.css            # All CSS
│   ├── feed.njk              # RSS feed → /feed.xml
│   ├── sitemap.xml
│   └── robots.txt
│
└── _site/                    # Build output (gitignored)
```

## Development

```bash
npm install        # First-time setup
npm run serve      # Dev server at localhost:8080 with live reload
npm run build      # Production build → _site/
```

Always run `npm run build` before committing to verify everything compiles.

## Deployment

Push to `main` triggers the GitHub Actions pipeline:

1. **Build** — `npm ci` + `npm run build`
2. **Security scan** — `npm audit` + Trivy (secrets + vulnerabilities) — must pass
3. **Deploy** — zips `_site/`, uploads to Netlify via API

Netlify auto-builds are **disabled** — GitHub Actions is the only deploy trigger. Required GitHub secrets: `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`.

## Pages

| URL | File | Description |
|-----|------|-------------|
| `/` | `pages/index.njk` | Homepage |
| `/about/` | `pages/about.njk` | Story + pastor crisis stats |
| `/services/` | `pages/services.njk` | Services overview |
| `/coaching/` | `pages/coaching.njk` | Coaching for pastors |
| `/consulting/` | `pages/consulting.njk` | Consulting for ministries |
| `/speaking/` | `pages/speaking.njk` | Speaking themes + event types |
| `/training/` | `pages/training.njk` | Interactive workshops |
| `/events/` | `pages/events.njk` | Events hub |
| `/golf/` | `pages/golf.njk` | Golf fundraiser + Zeffy registration |
| `/mission/` | `pages/mission.njk` | Student + Family + Win Your Jerusalem trips |
| `/resources/` | `pages/resources.njk` | Blog, Matt's book, media, and ministry partners |
| `/leadership/` | `pages/leadership.njk` | Team carousel |
| `/contact/` | `pages/contact.njk` | Contact form (sole form submission point on the site) |
| `/blog/post-slug/` | `blog/*.md` | Individual blog posts |
| `/admin/` | `admin/index.html` | Decap CMS editor (login required) |
| `/feed.xml` | `feed.njk` | RSS feed |

> **Note:** The old `/blog/`, `/book/`, `/media/`, and `/partners/` URLs redirect to `/resources/` via `src/_redirects`.

## Blog & CMS

Blog posts are Markdown files in `src/blog/`. They are written and published through the Decap CMS web editor — no code knowledge needed.

### Accessing the Admin Panel

1. Go to `https://enhancemin.com/admin/`
2. Click **"Login with Netlify Identity"**
3. Enter your invited email and password

### Adding a Blog User

Admin users are managed through **Netlify Identity** (separate from your Netlify account login):

1. Log in to [app.netlify.com](https://app.netlify.com)
2. Select the Enhance Ministries site
3. Go to **Identity** tab → **Invite users**
4. Enter the user's email address
5. They'll receive an email to set a password — after that they can log in at `/admin/`

Free tier supports up to **5 Identity users**.

### How Publishing Works

When a post is saved/published in the CMS:
1. Decap CMS commits the Markdown file to `src/blog/` in GitHub
2. The commit triggers the GitHub Actions pipeline
3. Eleventy rebuilds the site and Netlify deploys it (typically 2–3 minutes)

### Blog Post Fields

| Field | Description |
|-------|-------------|
| Title | Post headline |
| Publish Date | Date displayed on card and post |
| Author | Defaults to "Matt Swigart" |
| Category | Coaching / Ministry Life / Missions / Devotional / Leadership |
| Description | 1–2 sentence summary — shown on listing card and used for SEO |
| Featured Image | Optional image (stored in `src/assets/blog/`) |
| Body | Full post content (Markdown WYSIWYG editor) |

### Netlify Dashboard Configuration

| Setting | Location | Value |
|---------|----------|-------|
| Identity | Site Settings → Identity | Enabled |
| Git Gateway | Identity → Services → Git Gateway | Enabled |
| Branch | `admin/config.yml` → `backend.branch` | `main` |

## Section Badge Labels (`event-badge`)

Throughout the site, small orange pill/chip labels appear above certain section headings. These are `<span class="event-badge">` elements — purely decorative, not interactive.

**Use a badge only when it adds information the heading alone doesn't convey:**
- Dates or timeframes: `"July 19-25, 2026"`, `"Summer 2026"`
- Event type: `"Annual Fundraiser"`, `"Interactive Training"`
- Audience context: `"For Your Next Event"`, `"Church & Nonprofit"`
- Content type framing: `"Latest Insights"`, `"In the News"`, `"Featured Appearances"`
- Blog post category tags on cards (these are content taxonomy, not decorative)

**Do not use a badge to restate the heading.** For example, `"Our Story"` above *About Enhance Ministries*, or `"Get in Touch"` above *Connect with Matt*, adds nothing and has been intentionally removed. Vague marketing phrases like `"Personalized Support"` or `"Versatile Speaker"` should also be avoided.

## Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Orange | `#FF7A3D` | Buttons, accents, links |
| Primary Dark | `#FF5100` | Hover states, gradients |
| Accessible Orange | `#C54500` | WCAG AA compliant — used for text/buttons on white |
| Dark Text | `#1E1810` | Headings, body text |
| Light Background | `#F8F5F4` | Alternate sections |

**After any CSS change:** increment `cssVersion` in `src/_data/site.json` for cache busting.

## External Integrations

| Service | Purpose | Config location |
|---------|---------|-----------------|
| Netlify Identity | CMS login / user auth | Netlify dashboard → Identity |
| Decap CMS | Blog editor at `/admin/` | `src/admin/config.yml` |
| Zeffy | Donation modal + golf registration | URL in `src/_data/site.json` |
| Jotform | Mission trip registration | Iframe on `/mission/` |
| Web3Forms | Contact form | Access key in `src/pages/contact.njk` |
| Google Fonts | Inter typeface | `<link>` in `base.njk` |

## Contact

- **Email:** matt@enhancemin.com
- **Phone:** (651) 503-0934
- **Location:** Woodbury, MN

---

**Enhance Ministries** is a registered 501(c)(3) nonprofit. EIN: 85-2672334

See [CLAUDE.md](CLAUDE.md) for developer/AI maintenance instructions.
