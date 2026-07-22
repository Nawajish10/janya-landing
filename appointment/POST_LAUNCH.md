# Post-Launch Checklist

After the DNS has propagated and the site is officially live, perform these final validation steps.

## 1. Live Lead Verification
- [ ] Submit a test lead using the live domain (e.g., Name: `Prod Test`, Phone: `9999999999`).
- [ ] Verify the lead appears in the CRM backend.
- [ ] Verify the lead appears in the Google Sheet.
- [ ] Verify the lead appears in the Supabase Database.
- [ ] Check if UTM parameters (`utm_source=direct`) attached successfully.

## 2. Analytics & Ads Tracking
- [ ] **Google Analytics 4 (GA4):** Open GA4 DebugView and verify the `generate_lead` conversion registers.
- [ ] **Meta Pixel:** Use the Meta Pixel Helper Chrome Extension to verify the `Lead` event fires on successful submission.
- [ ] **Google Ads:** Ensure the Global Site Tag (gtag) is firing correctly using the Google Tag Assistant.
- [ ] **Microsoft Clarity:** Log into the dashboard and confirm a new session recording has been captured.

## 3. Webmaster & Indexing
- [ ] Log into Google Search Console.
- [ ] Submit the URL for indexing using the "URL Inspection" tool.
- [ ] Submit the updated `sitemap.xml` to Google Search Console.
- [ ] Repeat the indexing process for Bing Webmaster Tools.
