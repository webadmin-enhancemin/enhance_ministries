# CLAUDE.md

Instructions for Claude Code when working on the Enhance Ministries website.

## Project Overview

This is a static website for Enhance Ministries, a 501(c)(3) nonprofit providing pastoral coaching and care. The site is hosted on GitHub Pages.

## Key Files

| File | Purpose |
|------|---------|
| `index.html` | Main landing page with all sections |
| `golf.html` | Annual golf fundraiser event page |
| `styles.css` | All CSS styles (single file, no preprocessor) |
| `assets/` | Images, logos, and team photos |

## Development Workflow

### Making Changes
1. Edit files locally in `S:\enhance_ministries\`
2. Test changes by reviewing code logic
3. Commit with descriptive message
4. Push to `origin main`
5. Verify deployment via curl or WebFetch

### Cache Busting
When updating CSS, increment the version parameter in both HTML files:
```html
<link rel="stylesheet" href="styles.css?v=X">
```

### Deployment Verification
```bash
# Check if changes are deployed
curl -s "https://hogtai.github.io/enhance_ministries/" | grep "search-term"

# Check CSS deployment
curl -s "https://hogtai.github.io/enhance_ministries/styles.css?v=X" | grep "css-rule"
```

## Code Patterns

### CSS Custom Properties
All colors and spacing use CSS variables defined in `:root`:
```css
--color-primary: #FF7A3D;
--color-primary-dark: #FF5100;
--spacing-md: 1.5rem;
--spacing-lg: 2rem;
```

### Carousel Pattern
Both team and testimonial carousels use the same structure:
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

JavaScript handles all carousels with a single event listener loop.

### Responsive Approach
- Mobile-first CSS with `min-width` media queries
- Breakpoints: 768px (tablet), 1024px (desktop)
- Carousels use `scroll-snap-type: x mandatory`
- Navigation buttons hidden on mobile, visible on desktop

### Section Alternating Backgrounds
Sections alternate between white and light gray:
```html
<section class="section">           <!-- White background -->
<section class="section section-alt"> <!-- Light gray background -->
```

## Common Tasks

### Adding a Team Member
1. Add photo to `assets/` folder
2. Add team-card div in the team-carousel section of `index.html`
3. If photo needs positioning adjustment, add inline style: `style="object-position: center X%;"`

### Adding a Testimonial
1. Add testimonial-card div in the testimonial-carousel section
2. Include: `.testimonial-quote`, `.testimonial-author`, `.testimonial-role`

### Updating Statistics
Statistics in "Why Enhance Ministries" section should have verifiable sources. Current sources:
- Barna Group research (2017, 2022)

### Modifying Navigation
Navigation items are in both `index.html` and `golf.html`. Update both files when changing nav structure.

The home page uses `.nav` (transparent on hero, white on scroll).
The golf page uses `.nav.nav-solid` (always white background).

## External Services

### Zeffy Integration
- Donation form: Modal popup triggered by "Give" buttons
- Golf registration: Iframe embed on golf.html
- Do not modify Zeffy URLs without verifying they still work

### Google Fonts
Font is loaded via Google Fonts CDN. The Inter font family is used throughout.

## Important Notes

1. **No build process** - This is a static site with no bundling or compilation
2. **No JavaScript frameworks** - Vanilla JS only
3. **Single CSS file** - All styles in `styles.css`
4. **GitHub Pages hosting** - Deploys automatically from `main` branch
5. **Mobile-first** - Always test mobile view when making changes

## File Locations

- Repository: `S:\enhance_ministries\`
- Remote: `https://github.com/hogtai/enhance_ministries`
- Live site: `https://hogtai.github.io/enhance_ministries/`

## Commit Message Format

Use descriptive commit messages:
```
Add [feature] to [location]

- Detail 1
- Detail 2

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

## Testing Checklist

Before confirming changes are complete:
- [ ] HTML deployed (check with curl/grep)
- [ ] CSS deployed (check with curl/grep on styles.css?v=X)
- [ ] Responsive behavior verified (check media queries)
- [ ] Navigation works on both pages
- [ ] External links/embeds functional
