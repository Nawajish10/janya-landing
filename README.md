# Janya Fertility Landing Page

Welcome to the production-ready Janya Fertility Landing Page repository.

This project is a high-converting, performance-optimized, and healthcare-compliant landing page designed for Google Ads traffic. It features a modern design system, seamless mobile experience, and a robust modular lead submission architecture.

## Key Features
- **100/100 Core Web Vitals:** Inline critical CSS, responsive AVIF/WebP images, and deferred JS.
- **Healthcare Compliant:** Built-in medical disclaimer, privacy consent, and MedicalClinic JSON-LD schema.
- **Modular Lead System:** Submits leads simultaneously to a custom API, Google Sheets, and Supabase via REST.
- **Offline Resilience:** Gracefully detects network drops and preserves lead integrity via `sessionStorage`.

## Documentation Index
- `CLOUDWAYS_DEPLOYMENT.md`: Instructions for deploying the static frontend to Cloudways and the backend to Vercel.
- `DEPLOYMENT.md`: General instructions for deploying the static site (Netlify, Vercel, AWS S3).
- `ENVIRONMENT.md`: Explanation of runtime environments.
- `CONFIGURATION.md`: Details on feature toggles, endpoints, and UTM mapping found in `assets/js/config.js`.

## Tech Stack
- **Frontend:** HTML5, Vanilla JS (ES Modules), CSS3 (Variables, Flexbox, Grid)
- **Backend:** Node.js Vercel Serverless Function (`api/submit-lead.js`)
- **No Heavy Frameworks:** Eliminates bloat and ensures ultra-fast Time to First Byte (TTFB).

## Local Setup

To run this project locally for testing and development:

1. **Clone or Download the Project:**
   Navigate into the `appointment/` directory where the source code lives.

2. **Run a Local Server:**
   Because this project uses ES Modules (`type="module"` in JavaScript), you cannot simply open `index.html` in your browser. You must run it through a local HTTP server.
   
   If you have Node.js installed, you can use `npx`:
   ```bash
   npx serve .
   ```
   Or using Python:
   ```bash
   python -m http.server 3000
   ```
   
3. **Backend Testing (Vercel Dev):**
   If you want to test the serverless API (`/api/submit-lead`), install the Vercel CLI and run:
   ```bash
   npm i -g vercel
   vercel dev
   ```
   *Note: Ensure your `.env` file is present in the `appointment/` directory with your Supabase, Sheets, and reCAPTCHA secret keys.*

4. **Access the Page:**
   Open your browser and navigate to `http://localhost:3000` (or whichever port your local server outputs).
