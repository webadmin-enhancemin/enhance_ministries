# Enhance Ministries Website

A modern, responsive website for Enhance Ministries - a 501(c)(3) nonprofit organization dedicated to providing coaching, consulting, and care to pastors for life-long ministry.

**Live Site:** [https://hogtai.github.io/enhance_ministries/](https://hogtai.github.io/enhance_ministries/)

## Vision & Mission

- **Vision:** Healthy Pastors Leading Thriving Churches
- **Mission:** Providing coaching, consulting, and care to pastors for life-long ministry.

## Features

### Home Page (`index.html`)
- **Hero Section** - Vision statement with call-to-action buttons
- **Why Enhance Ministries** - Statistics about pastoral challenges with Barna Research citations
- **How We Help** - Three service pillars: Coaching, Consulting, and Care
- **Testimonials Carousel** - 6 testimonials from pastors and ministry leaders
- **Partner With Us** - Donation section with Zeffy integration modal
- **Golf Event Promotion** - Annual fundraiser highlight
- **For Pastors** - Direct outreach to pastoral audience
- **Leadership Section** - Team carousel with photos and roles
- **Contact Section** - Email, phone, and location information

### Golf Event Page (`golf.html`)
- Event details and schedule
- Zeffy registration form embed
- Sponsorship opportunities with tier descriptions
- FAQ section
- Location with Google Maps link

### Interactive Elements
- **Responsive Navigation** - Hamburger menu on mobile, full menu on desktop
- **Carousels** - Touch-swipe on mobile, arrow navigation on desktop
- **Donation Modal** - Popup with embedded Zeffy donation form
- **Smooth Scrolling** - Anchor link navigation

## Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Flexbox, Grid, scroll-snap
- **Vanilla JavaScript** - No frameworks or dependencies
- **Google Fonts** - Inter font family
- **Zeffy** - Donation and event registration forms

## File Structure

```
enhance_ministries/
├── index.html              # Main landing page
├── golf.html               # Golf event page
├── styles.css              # All styles (responsive)
├── assets/
│   ├── logo.png            # Enhance Ministries logo
│   ├── favicon.png         # Browser favicon
│   ├── matt-headshot.jpeg  # Team photo
│   ├── adrianna-frelich.jpg
│   ├── al-anderstrom.jpg
│   ├── cj-lloyd.jpg
│   ├── tait-hoglund.jpg
│   ├── community.jpg       # Section imagery
│   ├── hero-about.png
│   └── matt-family.jpg
├── README.md               # This file
└── CLAUDE.md               # Claude Code instructions
```

## Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Orange | `#FF7A3D` | Buttons, accents, links |
| Primary Dark | `#FF5100` | Hover states, gradients |
| Dark Text | `#1E1810` | Headings, body text |
| Light Text | `#6B6560` | Secondary text |
| Light Background | `#F8F5F4` | Alternate sections |
| White | `#FFFFFF` | Cards, backgrounds |

## Responsive Breakpoints

- **Mobile:** < 768px (1 card carousels, hamburger menu)
- **Tablet:** 768px - 1023px (2 card carousels)
- **Desktop:** 1024px+ (4 card team carousel, 3 card testimonial carousel, full navigation)

## Deployment

The site is deployed via **GitHub Pages** from the `main` branch.

### To Deploy Updates:
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

Changes typically go live within 1-2 minutes.

### Cache Busting
The stylesheet includes a version parameter (`styles.css?v=X`) to ensure browsers load the latest CSS after updates.

## External Integrations

### Zeffy (Donation Platform)
- **Donation Form:** Embedded in modal popup on home page
- **Golf Registration:** Embedded on golf event page
- URL: `https://www.zeffy.com/embed/donation-form/partner-with-us-to-see-fruitful-ministries-and-healthy-leaders`

### Google Fonts
- Font: Inter (weights: 400, 500, 600, 700)

## Leadership Team

1. **Matt Swigart** - Founder & Executive Director
2. **Adrianna Frelich** - Marketing Director
3. **Al Anderstrom** - Board Chair
4. **C.J. Lloyd** - Treasurer
5. **Tait Hoglund** - Board Secretary

## Statistics Sources

The "Why Enhance Ministries" section cites research from:
- Barna Group: [The State of Pastors (2017)](https://www.barna.com/research/pastors-well-being/)
- Barna Group: [Pastors Share Top Reasons They've Considered Quitting Ministry (2022)](https://www.barna.com/research/pastors-quitting-ministry/)

## License

This website is proprietary to Enhance Ministries. All rights reserved.

## Contact

- **Email:** matt@enhancemin.com
- **Phone:** (651) 503-0934
- **Location:** Woodbury, MN

---

**Enhance Ministries** is a registered 501(c)(3) nonprofit organization. EIN: 85-2672334
