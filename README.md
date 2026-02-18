# Enhance Ministries Website

A modern, responsive website for Enhance Ministries - a 501(c)(3) nonprofit organization dedicated to Cultivating Healthy Leaders and Fruitful Ministries.

**Live Site:** [https://hogtai.github.io/enhance_ministries/](https://hogtai.github.io/enhance_ministries/)

## Tech Stack

- **Eleventy (11ty)** - Static site generator with Nunjucks templates
- **HTML5/CSS3** - Semantic markup, custom properties, Flexbox, Grid
- **Vanilla JavaScript** - No frameworks or dependencies
- **GitHub Actions** - Automated build and deployment
- **Google Fonts** - Inter font family
- **Zeffy** - Donation and event registration forms
- **Jotform** - Mission trip registration

## Project Structure

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
│   │   │   └── base.njk      # Base HTML template
│   │   └── components/
│   │       ├── nav.njk       # Navigation component
│   │       ├── footer.njk    # Footer component
│   │       ├── donate-modal.njk
│   │       └── scripts/      # JavaScript components
│   │
│   ├── _data/
│   │   ├── site.json         # Site config (name, URL, CSS version)
│   │   ├── navigation.json   # Nav menu structure
│   │   ├── team.json         # Leadership team members
│   │   └── testimonials.json # Testimonial quotes
│   │
│   ├── pages/                # Page templates
│   │   ├── index.njk         # Homepage
│   │   ├── coaching.njk      # Coaching for Pastors
│   │   ├── speaking_training.njk
│   │   ├── events.njk        # Events hub
│   │   ├── golf.njk          # Golf Event
│   │   ├── missions.njk      # Mission Experiences
│   │   ├── book.njk          # Matt's Book
│   │   ├── media.njk         # Media page
│   │   └── partners.njk      # Ministry Partners
│   │
│   ├── assets/               # Images
│   ├── styles.css            # All CSS
│   ├── sitemap.xml           # SEO sitemap
│   └── robots.txt            # Crawler directives
│
├── _site/                    # Build output (gitignored)
├── CLAUDE.md                 # Claude Code maintenance guide
└── README.md                 # This file
```

## Development

### Prerequisites
- Node.js (v18+)
- npm

### Setup
```bash
# Install dependencies
npm install

# Start development server with live reload
npm run serve

# Build for production
npm run build
```

### Deployment
Push to `main` branch triggers automated deployment via GitHub Actions:
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

The site is built with Eleventy and deployed to GitHub Pages automatically.

## Pages

| Page | Description |
|------|-------------|
| **Home** | Hero, statistics, services, testimonials, team, contact form |
| **Coaching** | Coaching & consulting services for pastors |
| **Speaking & Training** | Speaking engagement information |
| **Events** | Events hub linking to Golf and Missions |
| **Golf Event** | Annual fundraiser with Zeffy registration |
| **Mission Experiences** | Student and family mission trips |
| **Book** | Matt's Book - "What You Would Have Learned in Sunday School" |
| **Media** | Messages, podcasts, and articles |
| **Partners** | Ministry partner organizations |

## Content Updates

Content is managed through JSON data files in `src/_data/`:

| File | Content |
|------|---------|
| `site.json` | Site name, URL, tagline, CSS version |
| `navigation.json` | Menu structure and links |
| `team.json` | Leadership team members |
| `testimonials.json` | Testimonial quotes |

See [CLAUDE.md](CLAUDE.md) for detailed maintenance instructions.

## Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Orange | `#FF7A3D` | Buttons, accents, links |
| Primary Dark | `#FF5100` | Hover states, gradients |
| Dark Text | `#1E1810` | Headings, body text |
| Light Background | `#F8F5F4` | Alternate sections |

## External Integrations

- **Zeffy** - Donation forms and golf registration
- **Jotform** - Mission trip registration
- **Google Fonts** - Inter font family

## SEO

- Meta tags, Open Graph, Twitter Cards (via base template)
- JSON-LD structured data
- Automated sitemap pings via GitHub Actions

## Maintaining This Website

This website is designed to be maintained using **Claude Code**. See [CLAUDE.md](CLAUDE.md) for:

- Development commands
- How to update content via data files
- Adding pages and components
- Common maintenance tasks

## Contact

- **Email:** matt@enhancemin.com
- **Phone:** (651) 503-0934
- **Location:** Woodbury, MN

---

**Enhance Ministries** is a registered 501(c)(3) nonprofit organization. EIN: 85-2672334
