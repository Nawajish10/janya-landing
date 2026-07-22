# Quality Assurance (QA) Checklist

Before clearing the release for production, perform the following verifications to ensure maximum conversion and zero regressions.

## 1. Cross-Device & Responsive
- [ ] **Mobile (iOS/Safari):** Verify sticky CTA is visible and does not cover the bottom footer links.
- [ ] **Mobile (Android/Chrome):** Verify smooth scrolling works without jumping.
- [ ] **Tablet:** Check iPad portrait and landscape layouts for 2-column doctor grid wrapping.
- [ ] **Desktop:** Confirm hero image scales appropriately on 4k and ultra-wide monitors.

## 2. Form & Validation Edge Cases
- [ ] **Empty Submit:** Click submit without filling fields; verify native validation (HTML5) fires.
- [ ] **Invalid Phone:** Enter `abc` in the phone field; verify it rejects non-numeric input.
- [ ] **Invalid Email:** Enter `test@` without a domain; verify browser rejects.
- [ ] **Auto-Save:** Fill half the form, reload the page; verify data is restored via `sessionStorage`.

## 3. Provider & Network Resilience
- [ ] **Success Flow:** Submit valid data; verify success toast appears and form hides.
- [ ] **Offline Mode:** Disconnect Wi-Fi/LTE, hit submit; verify offline warning appears ("You appear to be offline").
- [ ] **Provider Fallback:** Temporarily set `API_URL` to an invalid endpoint in `config.js` and submit; verify Sheets and Supabase still capture the lead successfully.

## 4. Analytics & Tracking
- [ ] Open Browser DevTools -> Console.
- [ ] Check `[Tracking] form_started` fires when typing begins.
- [ ] Check `[Tracking] form_success` and `generate_lead` fire exactly once upon successful submission.
- [ ] Double-click submit rapidly; verify duplicate events are suppressed in the console.

## 5. Accessibility & SEO
- [ ] Use a screen reader (VoiceOver/TalkBack) to navigate the form; ensure `aria-live` announces the success/error state dynamically.
- [ ] Run Google Rich Results Test; verify `Physician`, `MedicalClinic`, and `FAQPage` schemas are detected with 0 errors.
