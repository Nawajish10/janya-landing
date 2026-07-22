/**
 * ============================================================
 * JANYA FERTILITY — Lead Service (leadService.js)
 * Delivers leads to the secure backend for reCAPTCHA verification.
 * ============================================================
 */

import { CONFIG } from './config.js';
import { Tracking } from './tracking.js';

export const LeadService = (() => {

  /**
   * Dispatches the lead + token to the backend endpoint.
   * @param {Object} payload { token, lead }
   * @returns {Promise<boolean>} True if submission succeeds
   */
  async function submitLead(payload) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.API_TIMEOUT);

    try {
      const response = await fetch(CONFIG.BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // We throw so it can be caught in formHandler and show an error
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP Error: ${response.status}`);
      }

      Tracking.providerSuccess('Backend');
      return true;

    } catch (error) {
      clearTimeout(timeoutId);
      console.error('Backend submission failed:', error);
      Tracking.providerFailure('Backend', error.message || String(error));
      return false;
    }
  }

  return Object.freeze({
    submitLead
  });
})();
