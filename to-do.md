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

## 2. Clean URLs (Remove .html Extensions)

**Status:** Not Started
**Priority:** High
**Dependency:** Complete after DNS is working

### URL Mapping

| Current URL | Target URL | Action Needed |
|-------------|------------|---------------|
| `/` | `/` | ✅ No change |
| `/#contact` | `/contact` | Create new page from index section |
| `/events.html` | `/events` | Change permalink |
| `/golf.html` | `/golf` | Change permalink |
| `/missions.html` | `/mission` | Rename file + change permalink |
| `/#board` | `/leadership` | Create new page from index section |
| `/#story` | `/about` | Create new page from index section |
| `/#services` | `/services` | Create new page from index section |
| `/coaching.html` | `/coaching` | Change permalink |
| `/coaching.html#consulting` | `/consulting` | Create new page from coaching section |
| `/speaking_training.html` | `/speaking` | Split page, rename |
| `/speaking_training.html#workshops` | `/training` | Split page, link to workshops section |
| `/book.html` | `/book` | Change permalink |
| `/media.html` | `/media` | Change permalink |
| `/partners.html` | `/partners` | Change permalink |

### Tasks

- [ ] Update all existing page permalinks from `/page.html` to `/page/` (trailing slash)
- [ ] Create new pages:
  - [ ] `src/pages/contact.njk` - Extract from index.njk #contact section
  - [ ] `src/pages/about.njk` - Extract from index.njk #story section
  - [ ] `src/pages/leadership.njk` - Extract from index.njk #board section
  - [ ] `src/pages/services.njk` - Extract from index.njk #services section
  - [ ] `src/pages/consulting.njk` - Extract from coaching.njk #consulting section
  - [ ] `src/pages/speaking.njk` - Split from speaking_training.njk (top half)
  - [ ] `src/pages/training.njk` - Split from speaking_training.njk (workshops section)
- [ ] Rename `missions.njk` to `mission.njk` and update permalink
- [ ] Delete `speaking_training.njk` after splitting
- [ ] Update `src/_data/navigation.json` with new URLs
- [ ] Update `src/sitemap.xml` with new URLs
- [ ] Update any internal links in page content
- [ ] Set up redirects for old URLs (via Cloudflare Page Rules or `_redirects` file)
- [ ] Test all navigation links work correctly

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

## 4. Mobile Navigation UX Fix

**Status:** Not Started
**Priority:** Medium
**Issue:** When clicking dropdown menus (Services, Events, Resources) on mobile, the parent menu item shifts left instead of staying centered

### Current Behavior

- Mobile menu opens
- User taps "Services >"
- "Services" shifts left, submenu appears indented below
- Feels disorienting/unpolished

### Desired Behavior

- Parent menu item stays centered
- Submenu appears smoothly below, also centered or clearly nested
- No jarring shift in layout

### Technical Details

**Problem location:** `src/styles.css` lines 1631-1646

```css
/* Current code causing issue */
@media (max-width: 767px) {
    .nav-dropdown .dropdown-menu {
        position: static;
        box-shadow: none;
        background: transparent;
        padding-left: var(--spacing-md);  /* This causes left shift */
        display: none;
    }
}
```

### Tasks

- [ ] Redesign mobile dropdown interaction (choose approach):
  - Option A: Accordion style - parent stays put, children slide down below
  - Option B: Slide-over panel - children slide in from right
  - Option C: Full-width dropdown - children appear in centered list below
- [ ] Update CSS in `src/styles.css`
- [ ] Update JavaScript in `src/_includes/components/scripts/dropdown.njk` if needed
- [ ] Test on multiple mobile devices/screen sizes
- [ ] Verify desktop dropdown behavior unchanged

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
| **Decap CMS** (formerly Netlify CMS) | Git-based, works with Eleventy, good UI | Requires identity provider setup | Free |
| **TinaCMS** | Visual editing, Git-backed, modern | More complex setup, newer | Free tier available |
| **CloudCannon** | Excellent Eleventy support, easy setup | Paid only | $45/mo+ |
| **Forestry.io** | Simple UI | Deprecated, merged into Tina | N/A |
| **Contentful** | Powerful, API-based | Requires code changes, overkill | Free tier available |

### Tasks (When Ready to Implement)

- [ ] Choose CMS solution based on budget and needs
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

## Implementation Order

**Recommended sequence:**

1. **Cloudflare + DNS** (items 1 & 3) - Do together since Cloudflare becomes DNS provider
2. **Clean URLs** (item 2) - Major code change, do after DNS is stable
3. **Mobile Nav Fix** (item 4) - CSS-only change, can be done anytime
4. **Admin Panel** (item 5) - Larger project, plan separately

---

## Notes

- Always run `npm run build` locally before pushing changes
- Test on mobile devices after any navigation changes
- Update `src/sitemap.xml` when adding/changing URLs
- Increment `cssVersion` in `site.json` after CSS changes
