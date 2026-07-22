/**
 * ============================================================
 * JANYA FERTILITY — Google Sheets Provider (sheetsProvider.js)
 * Delivers lead payloads to a Google Apps Script Web App.
 * ============================================================
 */

import { CONFIG } from '../config.js';

export const SheetsProvider = (() => {
  
  /**
   * Transforms the unified internal lead object into the exact parameter names expected by the Apps Script.
   */
  function buildPayload(lead) {
    return {
      fullName: lead.name || '',
      phoneNumber: lead.phone || '',
      email: lead.email || '',
      treatment: lead.treatment || '',
      preferredCallTime: lead.preferred_call_time || ''
    };
  }

  /**
   * Submits the lead to the Google Apps Script endpoint
   * @param {Object} lead The unified lead object
   * @returns {Promise<Response>} 
   */
  async function submit(lead) {
    if (!CONFIG.SHEETS_ENABLED) {
      return Promise.resolve({ skipped: true });
    }

    // Usually Apps Script requires text/plain and mode: 'no-cors' from frontend,
    // but if the Web App is configured with proper CORS, application/json works.
    // Assuming standard JSON POST with CORS enabled in Apps Script.
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.API_TIMEOUT);

    try {
      const payload = buildPayload(lead);
      const urlEncodedData = new URLSearchParams(payload).toString();

      const response = await fetch(CONFIG.SHEETS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: urlEncodedData,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Sheets HTTP Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  return Object.freeze({
    submit
  });
})();
