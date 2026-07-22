# Cloudways Deployment Guide

This document outlines the standard hybrid-deployment architecture for the Janya Fertility Landing Page when utilizing Cloudways as the primary web host.

## Why a Hybrid Architecture?

This project features a highly secure, serverless Node.js backend (`api/submit-lead.js`) that validates Google reCAPTCHA v3 scores and securely communicates with Google Sheets and Supabase.
**Cloudways natively supports PHP/LAMP stacks but does not run Vercel Serverless Functions out of the box.** 

To achieve the best performance and maintain maximum security without requiring a complex Node.js setup on your server, we use a **Hybrid Deployment**:
1. **Frontend (HTML/CSS/JS):** Hosted on your Cloudways server for blazing fast speeds using Varnish Cache.
2. **Backend API (Serverless Function):** Hosted on Vercel (Free Tier) to securely process leads and hide your database keys.

---

## 1. Deploy the Backend to Vercel

1. Create a free account at [Vercel](https://vercel.com).
2. Install the Vercel CLI locally (if not using GitHub):
   ```bash
   npm i -g vercel
   ```
3. Inside the `appointment/` directory, run:
   ```bash
   vercel
   ```
4. Follow the prompts to link the project.
5. In your Vercel Project Dashboard, navigate to **Settings -> Environment Variables** and add all secrets found in your local `.env` file:
   - `RECAPTCHA_SECRET_KEY`
   - `RECAPTCHA_SCORE_THRESHOLD` (e.g., `0.7`)
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   *(Do NOT hardcode these in the codebase!)*
6. Copy your live Vercel URL (e.g., `https://janya-landing.vercel.app`).

---

## 2. Configure the Frontend for Cloudways

Before uploading the files to Cloudways, you must tell the frontend where to send the leads.

1. Open `appointment/assets/js/config.js`.
2. Locate the `BACKEND_URL` variable.
3. Update it to your live Vercel API endpoint. 
   
   **Change this:**
   ```javascript
   BACKEND_URL: '/api/submit-lead',
   ```
   **To this:**
   ```javascript
   BACKEND_URL: 'https://janya-landing.vercel.app/api/submit-lead',
   ```

---

## 3. Upload to Cloudways

1. **Prepare the Files:**
   You can run `node zip_build.js` or simply select all the files inside the `appointment/` folder and zip them (exclude `node_modules` and `.env`).

2. **Connect via SFTP:**
   - Log into your Cloudways Dashboard.
   - Select your Application and copy your **Master Credentials** or **Application Credentials** (Public IP, Username, Password).
   - Use an SFTP client like **FileZilla** or **Cyberduck**.
   - Connect to the Public IP using Port `22`.

3. **Deploy:**
   - Navigate to `applications/your_app_folder/public_html`.
   - Upload all the contents of the `appointment/` folder into `public_html`.
   - Ensure `index.html` sits directly inside `public_html`.

---

## 4. Final Verification

1. **SSL:** Ensure Let's Encrypt is enabled in your Cloudways Application settings.
2. **Caching:** Ensure Varnish caching is enabled in Cloudways for optimal Core Web Vitals.
3. **Live Test:** Go to your live URL, fill out the consultation form, and verify that:
   - The success message appears.
   - The lead appears in Google Sheets.
   - The lead appears in Supabase.
   - No errors appear in the browser console.
