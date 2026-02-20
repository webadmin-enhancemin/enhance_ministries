# Enhance Ministries - Project To-Do List

## 1. DNS Configuration

**Status:** Not Started
**Priority:** High
**Dependency:** Should be done alongside Cloudflare (item 3)

### Tasks

- [ ] Create `CNAME` file in repo root containing `enhancemin.com`
- [ ] In DNS provider (or Cloudflare), add A records for apex domain:
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`
- [ ] Add CNAME record: `www` → `hogtai.github.io`
- [ ] In GitHub repo Settings → Pages → Custom domain: enter `enhancemin.com`
- [ ] Update `.eleventy.js`: Remove `pathPrefix: "/enhance_ministries/"` line
- [ ] Update `src/_data/site.json`: Change `url` to `https://enhancemin.com`
- [ ] Verify HTTPS is working after propagation (24-48 hours)

---

## ~~2. Clean URLs (Remove .html Extensions)~~ ✅ COMPLETED

**Status:** Completed
**Completed:** February 2026

### Solution Implemented

All pages migrated to clean URL directory structure (`/page/` → `_site/page/index.html`):

| Old URL | New URL |
|---------|---------|
| `/` | `/` (unchanged) |
| `/#contact` | `/contact/` |
| `/events.html` | `/events/` |
| `/golf.html` | `/golf/` |
| `/missions.html` | `/mission/` |
| `/#board` | `/leadership/` |
| `/#story` | `/about/` |
| `/#services` | `/services/` |
| `/coaching.html` | `/coaching/` |
| `/coaching.html#consulting` | `/consulting/` |
| `/speaking_training.html` | `/speaking/` |
| `/speaking_training.html#workshops` | `/training/` |
| `/book.html` | `/book/` |
| `/media.html` | `/media/` |
| `/partners.html` | `/partners/` |

- Updated all existing page permalinks and canonical URLs
- Created 7 new standalone pages (contact, about, leadership, services, consulting, speaking, training)
- Renamed `missions.njk` → `mission.njk`
- Deleted `speaking_training.njk` (split into speaking.njk + training.njk)
- Updated `navigation.json` with new clean URLs
- Updated `sitemap.xml` with new URLs and `enhancemin.com` domain
- Updated all internal links across all pages
- Created `src/_redirects` for Netlify redirect rules (old .html → clean URLs)
- Added `_redirects` passthrough copy to `.eleventy.js`

---

## 3. Cloudflare Integration

**Status:** Not Started
**Priority:** High
**Reason:** GitHub Pages doesn't support custom security headers. Current Lighthouse Best Practices score: 77/100

### Benefits

- Security headers (CSP, X-Frame-Options, etc.) → Improves Lighthouse score to 90+
- Free CDN → Faster global load times
- Free SSL/TLS → Works with custom domain
- DDoS protection → Handles traffic spikes
- Analytics → Visitor data without extra scripts
- Caching → Reduces origin load

### Tasks

- [ ] Create Cloudflare account at [cloudflare.com](https://cloudflare.com) (free tier)
- [ ] Add domain `enhancemin.com` to Cloudflare
- [ ] Update nameservers at domain registrar to Cloudflare's nameservers
- [ ] Wait for nameserver propagation (24-48 hours)
- [ ] Configure DNS records in Cloudflare:
  - [ ] A records for apex domain (see item 1)
  - [ ] CNAME for www subdomain
  - [ ] Enable orange cloud (proxy) for all records
- [ ] Configure SSL/TLS:
  - [ ] Set encryption mode to "Full (strict)"
  - [ ] Enable "Always Use HTTPS"
  - [ ] Enable "Automatic HTTPS Rewrites"
- [ ] Add security headers via Transform Rules (Rules → Transform Rules → Modify Response Header):
  - [ ] `Content-Security-Policy`: `default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; frame-src https://www.zeffy.com https://form.jotform.com;`
  - [ ] `X-Content-Type-Options`: `nosniff`
  - [ ] `X-Frame-Options`: `SAMEORIGIN`
  - [ ] `Referrer-Policy`: `strict-origin-when-cross-origin`
  - [ ] `Permissions-Policy`: `geolocation=(), microphone=(), camera=()`
- [ ] Configure caching:
  - [ ] Page Rule: `enhancemin.com/*` → Cache Level: Standard
  - [ ] Browser Cache TTL: 4 hours (or as needed)
- [ ] Set up Page Rules for redirects (old .html URLs to clean URLs)
- [ ] Test site loads correctly through Cloudflare
- [ ] Run Lighthouse audit to verify improved score

### Notes

- Zeffy iframe will still trigger third-party cookie warnings (unavoidable)
- Expected Lighthouse Best Practices score after setup: 90+/100

---

## ~~4. Mobile Navigation UX Fix~~ ✅ COMPLETED

**Status:** Completed
**Completed:** February 2026

### Solution Implemented

Fixed in `src/styles.css` using Option C (full-width centered dropdown):

- Removed `padding-left: var(--spacing-md)` that caused the left shift
- Added `width: 100%` and `text-align: center` to `.nav-dropdown`
- Changed to `padding: 0` on `.dropdown-menu`
- Parent menu items now stay centered when expanded

---

## 5. Admin Panel for Content Editors

**Status:** Future Enhancement
**Priority:** Low
**Purpose:** Allow marketing team to update content without coding

### Editable Content (Should Be Unlocked)

- Team members (add/remove/edit in `team.json`)
- Testimonials (add/remove/edit in `testimonials.json`)
- Event dates and details
- Photos/images
- Marketing copy on pages
- Navigation menu items

### Protected Content (Should Be Locked)

- Page layouts and structure
- CSS/styling
- JavaScript functionality
- Site configuration
- Build process

### CMS Options to Evaluate

| Solution | Pros | Cons | Cost |
|----------|------|------|------|
| **Decap CMS** (formerly Netlify CMS) | Git-based, works with Eleventy, good UI | Requires identity

### Tasks (When Ready to Implement)

- [X] Choose CMS solution based on budget and needs (Netlify is what we want to use)
- [ ] Set up authentication (GitHub OAuth, Netlify Identity, etc.)
- [ ] Define content models/schemas for:
  - [ ] Team members
  - [ ] Testimonials
  - [ ] Events
  - [ ] Navigation items
- [ ] Create admin UI configuration
- [ ] Set up preview functionality
- [ ] Document admin panel usage for marketing team
- [ ] Train marketing team on usage
- [ ] Set up backup/rollback procedures

---

## 6. Blog Integration (Decap CMS + Netlify)

**Status:** Not Started
**Priority:** Medium
**Purpose:** Allow Matt to write and publish blog posts through a simple web-based editor
**Note:** Decap CMS also satisfies item 5 (Admin Panel) — once set up, the same admin interface can manage blog posts, team members, testimonials, and other content.

### Strategy: Decap CMS on Netlify (Free)

**Why this approach:**
- Free (Netlify free tier + Decap CMS is open source)
- Visual editor at `enhancemin.com/admin` — no code knowledge needed
- Blog posts written in a simple WYSIWYG editor (similar to Word)
- Content saved directly to GitHub as Markdown files
- Integrates natively with current Eleventy setup
- One system, one login

### Phase 1: Migrate Hosting to Netlify

- [x] Create Netlify account at [netlify.com](https://netlify.com) (free tier)
- [x] Connect GitHub repo (`webadmin-enhancemin/enhance_ministries`) to Netlify
- [x] Configure build settings:
  - Build command: `npm run build`
  - Publish directory: `_site`
- [x] Verify site builds and deploys correctly on Netlify
- [x] Remove `pathPrefix: "/enhance_ministries/"` from `.eleventy.js`
- [x] Update GitHub Actions workflow: build → security scan → deploy via Netlify API (true gate)
- [x] Fix npm vulnerabilities: markdown-it (moderate) + minimatch (high via overrides)
- [x] Stop Netlify auto-builds (GitHub Actions is sole deploy trigger)
- [ ] Configure custom domain (`enhancemin.com`) on Netlify
- [ ] Update DNS to point to Netlify (replaces GitHub Pages)
- [ ] Enable HTTPS (automatic via Netlify)
- [x] Disable GitHub Pages auto-deployment

### Phase 2: Set Up Decap CMS

- [ ] Install Decap CMS: create `src/admin/index.html` and `src/admin/config.yml`
- [ ] Enable Netlify Identity (free tier — up to 5 admin users)
- [ ] Configure Netlify Identity widget for login
- [ ] Define blog post collection in `config.yml`:
  - Title, date, author, featured image, body
  - Categories/tags (e.g., Coaching, Ministry Life, Missions, Devotional)
- [ ] Set up editorial workflow (draft → review → publish) if desired
- [ ] Test login and post creation at `/admin`

### Phase 3: Build Blog in Eleventy

- [ ] Create `src/blog/` directory for Markdown blog posts
- [ ] Create `src/_includes/layouts/post.njk` template for individual posts
- [ ] Create `src/pages/blog.njk` — blog listing page with post cards
- [ ] Add pagination to blog listing if needed
- [ ] Style blog pages to match existing site design
- [ ] Add blog to `src/_data/navigation.json`
- [ ] Add blog pages to `src/sitemap.xml`
- [ ] Add RSS feed (`feed.xml`) for blog syndication

### Phase 4: Content Editor Training

- [ ] Create a simple 1-page guide for Matt: "How to Write a Blog Post"
- [ ] Walk through: logging in, creating a post, adding images, publishing
- [ ] Test with Matt to ensure he can publish independently
- [ ] Document how to manage other content (team, testimonials) via Decap CMS

### Considerations

- **Netlify free tier** includes: 100GB bandwidth/mo, 300 build minutes/mo, Netlify Identity (5 users) — more than sufficient
- **Images:** Blog images can be uploaded through Decap CMS and stored in `src/assets/blog/`
- **SEO:** Each blog post gets its own URL, meta tags, and structured data — all good for search rankings
- **Newsletter integration:** Can add email signup later (Mailchimp, ConvertKit, or Buttondown free tier)
- **Relation to item 5:** Once Decap CMS is set up for the blog, extending it to manage team members, testimonials, and other JSON data is straightforward

---

## Implementation Order

**Recommended sequence:**

1. ~~**Contact Form** (item 7)~~ — Completed: Web3Forms integration, validation, spam prevention
2. ~~**Mobile Nav Fix** (item 4)~~ — Completed: Full-width centered dropdown
3. **Cloudflare + DNS** (items 1 & 3) - Set up Cloudflare as DNS provider + security headers + CDN
4. **Netlify Migration** (item 6, Phase 1) - Move hosting from GitHub Pages to Netlify
5. **Clean URLs** (item 2) - Major code change, do after hosting is stable on Netlify
6. **Blog + CMS** (item 6, Phases 2-4) - Add Decap CMS + blog on Netlify
7. **Admin Panel** (item 5) - Extend Decap CMS to manage existing content (team, testimonials, etc.)

**Architecture:** Cloudflare (DNS + CDN + security headers + DDoS protection) → Netlify (hosting + builds + Decap CMS + Identity). Both free tier. Cloudflare proxies traffic to Netlify, adding security headers and edge caching that Netlify's free tier doesn't include.

---

## Notes

- Always run `npm run build` locally before pushing changes
- Test on mobile devices after any navigation changes
- Update `src/sitemap.xml` when adding/changing URLs
- Increment `cssVersion` in `site.json` after CSS changes
