# Contact Form - Send Email to matt@enhancemin.com

## Current State

The contact form on the homepage (`src/pages/index.njk`) uses a **`mailto:` link** that opens the visitor's default email client. It does NOT actually send an email from the website itself. This is unreliable because:

- Many users don't have a desktop email client configured
- Mobile behavior is inconsistent
- The form *feels* like it submits, but it just redirects to an email app
- Currently points to `matt@enhancemin.com`, not `matt@enhancemin.com`

## Goal

When a visitor fills out the contact form and clicks "Send Message to Matt", an email should be delivered directly to **matt@enhancemin.com** without the visitor needing an email client.

## The Challenge

GitHub Pages is a **static site host** -- it cannot run server-side code (no Node.js, no PHP, no Python). To send emails, we need an external service to act as the backend.

---

## Options (Ranked by Recommendation)

### Option 1: Formspree (Recommended)

**What it is:** A form backend service. You point your form's `action` to their endpoint and they forward submissions as emails.

**Why it's best for this project:**
- Zero JavaScript changes needed (works with plain HTML `<form>`)
- Free tier: **50 submissions/month** (likely sufficient for a ministry site)
- Emails arrive in matt@enhancemin.com inbox
- Built-in spam protection (honeypot + reCAPTCHA option)
- Submission dashboard to review past messages
- No API keys exposed in client-side code

**Setup steps:**
1. Sign up at https://formspree.io (use matt@enhancemin.com)
2. Create a new form -- Formspree gives you an endpoint like `https://formspree.io/f/xyzabcde`
3. Update the `<form>` tag in `src/pages/index.njk`:
   ```html
   <form class="contact-form" id="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```
4. Update `contact-form.njk` to handle submission via `fetch()` instead of `mailto:`
5. Add a hidden `_replyto` field so Formspree sets the reply-to address
6. Deploy

**Cost:** Free (50/month) | $10/month for 1,000 submissions

**Estimated implementation time:** ~30 minutes

---

### Option 2: Web3Forms

**What it is:** Similar to Formspree but with a higher free tier.

**Why consider it:**
- Free tier: **250 submissions/month**
- Simple API key (not secret -- safe in client-side code)
- Built-in spam protection
- Custom redirect or AJAX submission
- No account required (just verify email)

**Setup steps:**
1. Go to https://web3forms.com and enter matt@enhancemin.com
2. Receive an **access key** via email
3. Add hidden input to the form: `<input type="hidden" name="access_key" value="YOUR_KEY">`
4. Set form action to `https://api.web3forms.com/submit`
5. Update JavaScript to use `fetch()` for AJAX submission
6. Deploy

**Cost:** Free (250/month) | $5/month for more

**Estimated implementation time:** ~30 minutes

---

### Option 3: FormSubmit.co

**What it is:** The simplest option -- no signup required at all.

**Why consider it:**
- Completely free, unlimited submissions
- No API keys, no accounts, no dashboards
- Just set `action="https://formsubmit.co/matt@enhancemin.com"`
- First submission triggers email verification, then it works

**Downsides:**
- Email address is visible in HTML source (can be obfuscated with their hash)
- Less control over email formatting
- No submission dashboard
- Relies on a free service with no SLA

**Setup steps:**
1. Set form action to `https://formsubmit.co/matt@enhancemin.com`
2. Add hidden fields for configuration:
   ```html
   <input type="hidden" name="_subject" value="New contact from Enhance Ministries website">
   <input type="hidden" name="_captcha" value="true">
   <input type="hidden" name="_template" value="table">
   ```
3. Matt will receive a verification email on first submission
4. Deploy

**Cost:** Free

**Estimated implementation time:** ~15 minutes

---

### Option 4: EmailJS

**What it is:** A JavaScript SDK that sends emails directly from the browser using email service providers (Gmail, Outlook, etc.).

**Why consider it:**
- Pure client-side solution (no form action change needed)
- Free tier: **200 emails/month**
- Works with Gmail, Outlook, or custom SMTP
- Template-based emails (customize what Matt receives)

**Downsides:**
- Requires connecting an email account (Gmail/Outlook) as the sending service
- Public API key in JavaScript (safe, but some devs dislike it)
- More JavaScript code changes
- Slightly more complex setup (email templates, service configuration)

**Setup steps:**
1. Sign up at https://www.emailjs.com
2. Connect an email service (e.g., Gmail)
3. Create an email template
4. Add EmailJS SDK to `base.njk`
5. Rewrite `contact-form.njk` to use EmailJS API
6. Deploy

**Cost:** Free (200/month) | $10/month for more

**Estimated implementation time:** ~45 minutes

---

## Recommendation

**Go with Option 1 (Formspree) or Option 2 (Web3Forms).**

Both are battle-tested, take about 30 minutes to implement, and are free for the volume this site will see. Web3Forms has a higher free tier (250 vs 50/month), while Formspree has a nicer dashboard and is more established.

If you want the absolute simplest setup with no account creation, Option 3 (FormSubmit.co) works but offers less control.

---

## Files That Need Changes

Regardless of which option you choose, these files will be modified:

| File | Change |
|------|--------|
| `src/pages/index.njk` | Update `<form>` tag (action, method, hidden fields) |
| `src/_includes/components/scripts/contact-form.njk` | Replace `mailto:` logic with `fetch()` AJAX submission |
| `src/_data/site.json` | Increment `cssVersion` (if any CSS changes) |

No new dependencies. No `npm install`. No server to maintain.

---

## Implementation Checklist

- [x] Choose a form service (Formspree, Web3Forms, FormSubmit, or EmailJS) — **Web3Forms chosen**
- [x] Create account / get API endpoint
- [x] Verify matt@enhancemin.com with the chosen service
- [x] Update form HTML in `src/pages/index.njk` (action, hidden fields)
- [x] Rewrite `contact-form.njk` to submit via `fetch()` with success/error handling
- [x] Add spam protection (honeypot field and/or CAPTCHA)
- [x] Test form submission locally with `npm run serve`
- [x] Test that email arrives at matt@enhancemin.com
- [ ] Test error handling (network failure, validation)
- [ ] Test mobile responsiveness of any new UI elements
- [x] Commit and push to deploy via GitHub Actions
- [ ] Verify on live site: https://hogtai.github.io/enhance_ministries/#contact
