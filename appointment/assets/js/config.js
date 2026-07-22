/**
 * ============================================================
 * JANYA FERTILITY — Configuration (config.js)
 * Environment variables and endpoints for lead submission.
 * ============================================================
 */

export const CONFIG = {
  // Logging
  LOG_LEVEL: 'NONE', // 'DEBUG', 'INFO', 'WARN', 'ERROR', 'NONE'

  // Provider Toggles (Now handled by backend)
  API_ENABLED: true,
  SHEETS_ENABLED: true,
  SUPABASE_ENABLED: true,

  // Backend Verification Endpoint (Vercel Serverless Function)
  BACKEND_URL: '/api/submit-lead',

  // Google reCAPTCHA v3 Site Key
  RECAPTCHA_SITE_KEY: '6LcXll0tAAAAAHG0P3YT45GrkbFPG5XLSg1rVzBa',


  // CRM API Configuration
  // Note: Since this is a secure webhook endpoint, no Bearer token is needed! 
  // We can send directly from the frontend.
  API_URL: 'https://hypheningmedia.com/api/portal/7113e45f-468e-40e7-841c-939a5fa04f5a/leads/capture',
  API_TIMEOUT: 10000, // 10 seconds

  // Google Sheets Apps Script Web App URL
  SHEETS_URL: 'https://script.google.com/macros/s/AKfycbwCbVNBhfSU3T5WlzRCkaD_3q5HgLqpiHqGp7H3M7g8evd5Hi0v83TEfw4NYYF12mYE7Q/exec',

  // Supabase Configuration (REST API)
  SUPABASE_URL: 'https://rqevbabhqlnjktnggclo.supabase.co/rest/v1/janya_google_leads',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxZXZiYWJocWxuamt0bmdnY2xvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0MzUwMTgsImV4cCI6MjEwMDAxMTAxOH0.ZCoOtWWpLzDojUOVhliG8RX89ZYnwHjzTG23qgowJyY',
  
  // Tracking
  TRACKING_ENABLED: true,
  
  // Storage
  STORAGE_KEY: 'janya_lead_form_data'
};

/**
 * Validates the configuration on startup.
 * Missing critical values will fail gracefully by disabling the affected provider.
 */
function validateConfig() {
  if (CONFIG.API_ENABLED && !CONFIG.API_URL) {
    console.warn('[Config] API_ENABLED is true, but API_URL is missing. Disabling API.');
    CONFIG.API_ENABLED = false;
  }
  
  if (CONFIG.SHEETS_ENABLED && !CONFIG.SHEETS_URL) {
    console.warn('[Config] SHEETS_ENABLED is true, but SHEETS_URL is missing. Disabling Sheets.');
    CONFIG.SHEETS_ENABLED = false;
  }
  
  if (CONFIG.SUPABASE_ENABLED && (!CONFIG.SUPABASE_URL || !CONFIG.SUPABASE_ANON_KEY)) {
    console.warn('[Config] SUPABASE_ENABLED is true, but URL or KEY is missing. Disabling Supabase.');
    CONFIG.SUPABASE_ENABLED = false;
  }
  
  if (!CONFIG.API_ENABLED && !CONFIG.SHEETS_ENABLED && !CONFIG.SUPABASE_ENABLED) {
    console.error('[Config] CRITICAL ERROR: All lead providers are disabled or misconfigured. Form submissions will fail.');
  }
}

validateConfig();
