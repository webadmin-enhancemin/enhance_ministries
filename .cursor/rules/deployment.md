---
description: "GitHub Actions deploy pipeline and Netlify configuration"
alwaysApply: false
---

## Deployment Pipeline (GitHub Actions)

Pushing to `main` triggers `/.github/workflows/deploy.yml`:

1. **Build**: `npm ci` + `npm run build` → uploads `_site/` as an artifact
2. **Security scan**: `npm audit` (high+) + Trivy secret scan + Trivy vuln scan — must pass before deploy
3. **Deploy**: zips `_site/` and POSTs to the Netlify API using `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID`

## Netlify Configuration

- Netlify auto-builds are disabled.
- GitHub Actions is the sole deploy trigger (Netlify build on push is not used).

