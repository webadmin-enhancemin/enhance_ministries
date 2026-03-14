# Enhance Ministries - Project To-Do List

## DNS Configuration

**Status:** Not Started
**Priority:** High
**Dependency:** Everything Else
**DNS Provider:** onestoneweb (managed by Tom Stark)

### What Tom Stark needs to do

Log into the DNS management panel at onestoneweb3.com and update these records for **enhancemin.com**:

**Option A — Recommended (if ALIAS/ANAME/flattened CNAME is supported):**

| Type | Host | Value |
|------|------|-------|
| ALIAS or ANAME | `enhancemin.com` | `apex-loadbalancer.netlify.com` |
| CNAME | `www` | `enhancemin.netlify.app` |

**Option B — Fallback (standard record types only):**

| Type | Host | Value |
|------|------|-------|
| A | `enhancemin.com` | `75.2.60.5` |
| CNAME | `www` | `enhancemin.netlify.app` |

> Option A is preferred — it gets full CDN benefits. Option B works but bypasses CDN edge routing.

### After DNS records are updated

1. Wait for propagation (up to 24 hours)
2. Check status at: https://app.netlify.com/projects/enhancemin/domain-management#production-domains
3. Netlify auto-provisions SSL once DNS is verified
4. Confirm both `enhancemin.com` and `www.enhancemin.com` load with HTTPS




### Tasks

- [ ] Contact Tom Stark to update DNS records (Option A or B above)
- [ ] Verify domain in Netlify domain management dashboard
- [ ] Confirm HTTPS working on both `enhancemin.com` and `www.enhancemin.com`

---

### Phase 4: Content Editor Training

- [ ] Create a simple 1-page guide for Matt (Blog Writer) and Adri (Blog Editor): "How to Write a Blog Post"
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

4. Go-Live Date: Point existing nameservers in onestoneweb to netlify:



**Architecture:** onestoneweb3 (DNS) → Netlify (hosting + builds + Decap CMS + Identity). Both free tier. 
---

## Notes

- Always run `npm run build` locally before pushing changes
- Test on mobile devices after any navigation changes
- Update `src/sitemap.xml` when adding/changing URLs
- Increment `cssVersion` in `site.json` after CSS changes
