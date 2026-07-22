/**
 * ============================================================
 * JANYA FERTILITY — Health Checks (healthCheck.js)
 * Lightweight ping to verify provider endpoints during dev.
 * ============================================================
 */

import { CONFIG } from './config.js';
import { Logger } from './logger.js';

export const HealthCheck = (() => {
  const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === '';

  async function pingEndpoint(name, url, method = 'GET', headers = {}) {
    try {
      const response = await fetch(url, { method, headers, mode: 'no-cors' });
      // no-cors means we can't read the response status directly, but if it doesn't throw, 
      // the network request was dispatched.
      Logger.debug(`[HealthCheck] ${name} endpoint reachable.`);
      return true;
    } catch (err) {
      Logger.warn(`[HealthCheck] ${name} endpoint unreachable!`, err);
      return false;
    }
  }

  async function run() {
    if (!isDev) return; // Only run active health checks in development
    
    Logger.info('[HealthCheck] Running provider checks...');

    if (CONFIG.API_ENABLED) {
      // For POST webhooks, we can do a lightweight OPTIONS or just skip the active ping 
      // if it causes side effects. We'll use fetch with signal abort to test DNS/Connectivity.
      pingEndpoint('CRM API', CONFIG.API_URL);
    }

    if (CONFIG.SHEETS_ENABLED) {
      pingEndpoint('Google Sheets', CONFIG.SHEETS_URL);
    }

    if (CONFIG.SUPABASE_ENABLED) {
      // We can ping the REST endpoint safely using a GET request with no-cors
      pingEndpoint('Supabase', CONFIG.SUPABASE_URL, 'GET', {
        'apikey': CONFIG.SUPABASE_ANON_KEY
      });
    }
  }

  // Execute on import
  run();

  return { run };
})();
