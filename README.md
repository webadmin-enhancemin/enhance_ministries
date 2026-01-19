# Enhance Ministries Website

A modern, responsive website for Enhance Ministries - a 501(c)(3) nonprofit organization dedicated to providing coaching, consulting, and care to pastors for life-long ministry.

**Live Site:** [https://hogtai.github.io/enhance_ministries/](https://hogtai.github.io/enhance_ministries/)

## Vision & Mission

- **Vision:** Providing coaching, consulting, and care to pastors for life-long ministry
- **Mission:** Providing coaching, consulting, and care to pastors for life-long ministry.

## Pages

### Home Page (`index.html`)
- **Hero Section** - Vision statement with call-to-action buttons
- **Why Enhance Ministries** - Statistics about pastoral challenges with Barna Research citations
- **How We Help** - Three service pillars: Coaching, Consulting, and Care
- **Testimonials Carousel** - Testimonials from pastors and ministry leaders
- **Partner With Us** - Donation section with Zeffy integration modal
- **Golf Event Promotion** - Annual fundraiser highlight
- **For Pastors** - Direct outreach to pastoral audience
- **Leadership Section** - Team carousel with photos and roles
- **Contact Section** - Email form (mailto), phone, and location information

### Events Hub (`events.html`)
- Overview of all ministry events
- Links to Golf Event and Mission Trips pages
- Impact section explaining how participation supports the ministry

### Golf Event Page (`golf.html`)
- Event details and schedule for annual fundraiser
- Zeffy registration form embed
- Sponsorship opportunities with tier descriptions
- FAQ section
- Location with Google Maps link

### Mission Trips Page (`missions.html`)
- Student Mission Trip (July 6-11, 2026)
- Family Mission Trip (July 14-18, 2026)
- Jotform registration embed for student trip
- Partnership with Twin Cities ministry organizations

### Interactive Elements
- **Responsive Navigation** - Hamburger menu on mobile, full menu on desktop with Events dropdown
- **Carousels** - Touch-swipe on mobile, arrow navigation on desktop
- **Donation Modal** - Popup with embedded Zeffy donation form (available on all pages)
- **Fixed Mobile Donate Button** - Persistent donate button on mobile devices
- **Smooth Scrolling** - Anchor link navigation

## Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Flexbox, Grid, scroll-snap
- **Vanilla JavaScript** - No frameworks or dependencies
- **Google Fonts** - Inter font family
- **Zeffy** - Donation and golf registration forms
- **Jotform** - Mission trip registration

## File Structure

```
enhance_ministries/
├── index.html              # Main landing page
├── events.html             # Events hub page
├── golf.html               # Golf event page
├── missions.html           # Mission trips page
├── styles.css              # All styles (responsive, currently v=13)
├── assets/
│   ├── logo.png            # Enhance Ministries logo
│   ├── favicon.png         # Browser favicon
│   ├── matt-headshot.jpeg  # Team photos
│   ├── adrianna-frelich.jpg
│   ├── al-anderstrom.jpg
│   ├── cj-lloyd.jpg
│   ├── tait-hoglund.jpg
│   ├── community.jpg       # Section imagery
│   ├── hero-about.png
│   ├── matt-family.jpg
│   ├── student-missions-logo.png  # Mission trip branding
│   ├── mission-trip-group.jpg     # Mission trip photos
│   └── mission-trip-activity.jpg
├── README.md               # This file
└── CLAUDE.md               # Claude Code instructions & maintenance guide
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

Changes typically go live within 10-15 seconds.

### Cache Busting
The stylesheet includes a version parameter (`styles.css?v=13`) to ensure browsers load the latest CSS after updates. When updating CSS, increment the version in **all 4 HTML files**.

## External Integrations

### Zeffy (Donation Platform)
- **Donation Form:** Embedded in modal popup on all pages
- **Golf Registration:** Embedded on golf event page
- Donation URL: `https://www.zeffy.com/embed/donation-form/partner-with-us-to-see-fruitful-ministries-and-healthy-leaders`

### Jotform (Registration)
- **Student Mission Trip:** Embedded on missions page
- URL: `https://form.jotform.com/251aborgs/registrationmissiontrip2025`

### Google Fonts
- Font: Inter (weights: 400, 500, 600, 700)

### Social Media
- **Facebook:** [facebook.com/EnhanceMinistries](https://www.facebook.com/EnhanceMinistries)
- **Instagram:** [instagram.com/enhanceministries](https://www.instagram.com/enhanceministries/)

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

## Maintaining This Website

This website is designed to be maintained using **Claude Code**, Anthropic's AI coding assistant. See [CLAUDE.md](CLAUDE.md) for detailed instructions on:

- Setting up Claude Code
- Making common updates (team members, events, content)
- Best practices for effective AI-assisted maintenance
- Troubleshooting tips

**No coding experience required** - simply describe what you want to change in plain English, and Claude will make the updates for you.

## License

This website is proprietary to Enhance Ministries. All rights reserved.

## Contact

- **Email:** info@enhancemin.com
- **Phone:** (651) 503-0934
- **Location:** Woodbury, MN

---

**Enhance Ministries** is a registered 501(c)(3) nonprofit organization. EIN: 85-2672334
