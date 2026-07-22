# Deployment Checklist

Complete this checklist immediately before switching DNS or marking a deployment "Live".

## 1. Hosting & Domain
- [ ] Ensure the custom domain (e.g., `janyafertility.in`) is correctly mapped.
- [ ] Verify the SSL/TLS certificate is fully provisioned and strictly enforcing HTTPS.
- [ ] Confirm HTTP to HTTPS redirects are active.

## 2. Environment Variables & Endpoints
- [ ] Verify `assets/js/config.js` is pointed to **production** endpoints, not staging.
- [ ] Verify `LOG_LEVEL` in `config.js` is set to `WARN` or `ERROR` (Not `DEBUG`).

## 3. Crawlability
- [ ] Verify `robots.txt` exists at the root and allows crawling (`User-agent: * Allow: /`).
- [ ] Verify `sitemap.xml` exists and includes the full canonical URL.

## 4. Performance & Core Web Vitals
- [ ] Run a final Google PageSpeed Insights test against the deployed URL.
- [ ] Ensure mobile score is >90 (Expected: ~98+ due to our inlined CSS architecture).
- [ ] Confirm no 404s exist in the network tab (especially for `.webp` or `.avif` images).

## 5. Security Check
- [ ] Confirm no development API keys or tokens are hardcoded.
- [ ] Confirm the Supabase key exposed is strictly the `anon` key, and the table has Row Level Security (RLS) enabled.
