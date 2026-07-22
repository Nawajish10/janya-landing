# Configuration Guide

All major logic flags and integration endpoints are centralized in `assets/js/config.js`.

## Feature Toggles
```javascript
export const CONFIG = {
  // Provider Toggles
  API_ENABLED: true,
  SHEETS_ENABLED: true,
  SUPABASE_ENABLED: true,

  // ...
};
```
If a specific backend goes offline or needs maintenance, you can simply switch its corresponding toggle to `false` without affecting the other integrations.

## Endpoints
To update where leads are sent, modify the `ENDPOINTS` object in `config.js`:
- `CRM_API`: Your internal backend proxy/webhook.
- `GOOGLE_SHEETS`: The Google Apps Script URL.
- `SUPABASE`: The Supabase REST API URL and Anon Key.

## UTM Parameters
The system automatically captures `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `gclid`, and `fbclid` directly from the URL. These are persisted in `sessionStorage` and attached to all leads submitted during the session. No configuration is required.
