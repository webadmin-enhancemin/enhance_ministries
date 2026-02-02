# Cloudflare Setup Guide for Enhanced Security Headers

This guide explains how to add Cloudflare (free tier) in front of GitHub Pages to improve your Lighthouse Best Practices score by adding security headers that GitHub Pages doesn't support natively.

## Why Cloudflare?

GitHub Pages doesn't allow custom HTTP headers. Cloudflare's free tier can add these headers at the edge, improving security without changing hosting.

**Current Lighthouse Issues (77 Best Practices):**
- No Content Security Policy (CSP)
- No Cross-Origin-Opener-Policy (COOP)
- No X-Frame-Options or frame-ancestors
- HSTS missing `includeSubDomains` and `preload`
- Third-party cookies from Zeffy iframe (cannot be fixed - necessary for donations)

**Note:** Third-party cookies from Zeffy are expected and cannot be eliminated without removing the donation functionality.

## Setup Steps

### Step 1: Create Cloudflare Account

1. Go to [cloudflare.com](https://www.cloudflare.com/) and sign up (free)
2. Click "Add a Site"
3. Enter your domain (e.g., `enhancemin.com`)
4. Select the **Free** plan

### Step 2: Update DNS

Cloudflare will scan your existing DNS records. You'll need:

**For apex domain (enhancemin.com):**
```
Type: A
Name: @
Content: 185.199.108.153
Proxy status: Proxied (orange cloud)

Type: A
Name: @
Content: 185.199.109.153
Proxy status: Proxied (orange cloud)

Type: A
Name: @
Content: 185.199.110.153
Proxy status: Proxied (orange cloud)

Type: A
Name: @
Content: 185.199.111.153
Proxy status: Proxied (orange cloud)
```

**For www subdomain:**
```
Type: CNAME
Name: www
Content: hogtai.github.io
Proxy status: Proxied (orange cloud)
```

### Step 3: Update Nameservers

1. Cloudflare will provide two nameservers (e.g., `adam.ns.cloudflare.com`)
2. Go to your domain registrar (GoDaddy, Namecheap, etc.)
3. Replace the current nameservers with Cloudflare's
4. Wait for propagation (can take up to 24 hours)

### Step 4: Configure SSL/TLS

In Cloudflare Dashboard → SSL/TLS:
1. Set encryption mode to **Full**
2. Enable **Always Use HTTPS**
3. Enable **Automatic HTTPS Rewrites**

### Step 5: Add Security Headers via Transform Rules

Go to **Rules** → **Transform Rules** → **Modify Response Header**

Create a new rule:

**Rule name:** `Add Security Headers`

**When incoming requests match:** `All incoming requests`

**Then... modify response header:**

| Operation | Header name | Value |
|-----------|-------------|-------|
| Set static | `X-Frame-Options` | `SAMEORIGIN` |
| Set static | `X-Content-Type-Options` | `nosniff` |
| Set static | `Referrer-Policy` | `strict-origin-when-cross-origin` |
| Set static | `Permissions-Policy` | `geolocation=(), microphone=(), camera=()` |
| Set static | `Cross-Origin-Opener-Policy` | `same-origin-allow-popups` |

**Note:** We use `same-origin-allow-popups` for COOP instead of `same-origin` to allow the Zeffy donation modal to function properly.

### Step 6: Configure HSTS

In Cloudflare Dashboard → SSL/TLS → Edge Certificates:

1. Enable **HTTP Strict Transport Security (HSTS)**
2. Configure settings:
   - **Max Age:** 12 months (31536000 seconds)
   - **Include subdomains:** Yes
   - **Preload:** Yes
   - **No-Sniff Header:** Yes

### Step 7: Add Content Security Policy (Optional - Advanced)

A CSP can be added but requires careful configuration due to the Zeffy iframe. Create a separate Transform Rule:

**Rule name:** `Add CSP Header`

**When incoming requests match:** `All incoming requests`

**Then... modify response header:**

| Operation | Header name | Value |
|-----------|-------------|-------|
| Set static | `Content-Security-Policy` | See below |

**Recommended CSP value:**
```
default-src 'self'; script-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://www.zeffy.com https://js.stripe.com https://www.google.com https://www.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; frame-src https://www.zeffy.com https://form.jotform.com https://www.google.com; connect-src 'self' https://api.zeffy.com; base-uri 'self'; form-action 'self' https://api.web3forms.com;
```

**Warning:** CSP is complex. If the site breaks after adding CSP, remove or adjust the rule. Test thoroughly.

## Alternative: Cloudflare Workers (More Control)

For full control over headers, you can use Cloudflare Workers (free tier includes 100,000 requests/day):

1. Go to **Workers & Pages** → **Create Worker**
2. Use this code:

```javascript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const response = await fetch(request)
  const newHeaders = new Headers(response.headers)

  // Security headers
  newHeaders.set('X-Frame-Options', 'SAMEORIGIN')
  newHeaders.set('X-Content-Type-Options', 'nosniff')
  newHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  newHeaders.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
  newHeaders.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups')

  // Optional: Strict CSP (uncomment if needed)
  // newHeaders.set('Content-Security-Policy', "default-src 'self'; ...")

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  })
}
```

3. Add a route: `enhancemin.com/*` and `www.enhancemin.com/*`

## Verification

After setup, verify headers are working:

**Using curl:**
```bash
curl -I https://enhancemin.com
```

**Using online tools:**
- [securityheaders.com](https://securityheaders.com/)
- [observatory.mozilla.org](https://observatory.mozilla.org/)

**Expected Lighthouse improvement:**
- Best Practices score should increase from 77 to 90+
- Third-party cookie warnings will remain (expected - from Zeffy)

## Troubleshooting

### Site not loading after DNS change
- Wait up to 24 hours for DNS propagation
- Check Cloudflare dashboard for DNS status
- Ensure GitHub Pages custom domain is still configured

### Zeffy donation form not working
- Check COOP header is `same-origin-allow-popups` (not `same-origin`)
- Check X-Frame-Options allows the iframe
- CSP may need adjustment for `frame-src`

### SSL certificate errors
- Ensure SSL mode is set to "Full" (not "Full (Strict)")
- Wait for Cloudflare to provision certificate (usually instant)

## Costs

- **Cloudflare Free Plan:** $0/month
  - Includes: CDN, DDoS protection, SSL, Transform Rules, basic Workers
  - Limits: 3 Transform Rules (sufficient for this setup)

## Resources

- [Cloudflare Documentation](https://developers.cloudflare.com/)
- [GitHub Pages + Cloudflare](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)
- [Security Headers Explained](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers#security)
