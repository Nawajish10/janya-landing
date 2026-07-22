# Deployment Guide

The Janya Fertility landing page is a fully static architecture utilizing ES Modules. There is no build step required.

## Prerequisites
- Static hosting provider (Netlify, Vercel, Cloudflare Pages, AWS S3/CloudFront, or a standard Apache/Nginx server).
- HTTPS is strictly required for ES Modules and secure form submissions.

## Steps to Deploy

### Option 1: Netlify / Vercel
1. Connect your Git repository.
2. Set the root directory to `appointment`.
3. Clear the "Build Command" (leave it empty).
4. Deploy.

### Option 2: Apache / Nginx
1. Upload the entire contents of the `appointment` folder to your web root (e.g., `/var/www/html/appointment`).
2. Ensure proper MIME types are configured for `.mjs` or `.js` modules.
3. Configure your server to serve `.webp` and `.avif` images with caching headers.

## Post-Deployment Checklist
- [ ] Verify SSL certificate is active.
- [ ] Run a live test lead submission to confirm the endpoints are not blocked by strict CSP or firewall rules on the new domain.
- [ ] Ensure `config.js` endpoints are pointed to Production URLs.
