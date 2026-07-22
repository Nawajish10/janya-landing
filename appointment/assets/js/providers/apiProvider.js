/**
 * ============================================================
 * JANYA FERTILITY — CRM API Provider (apiProvider.js)
 * Delivers lead payloads to the custom intermediate backend.
 * ============================================================
 */

import { CONFIG } from '../config.js';

export const ApiProvider = (() => {
  
  /**
   * Transforms the unified internal lead object into the required CRM API format
   */
  function buildPayload(lead) {
    return {
      name: lead.name,
      phone: lead.phone,
      email: lead.email || '',
      platform: lead.platform,
      source: lead.source,
      campaign_name: lead.utm_campaign || undefined,
      additional_data: {
        treatment_needed: lead.treatment,
        preferred_call_time: lead.preferred_call_time,
        device: lead.device,
        browser: lead.browser,
        language: lead.language,
        timezone: lead.timezone,
        screen_resolution: lead.screen_resolution,
        utm_source: lead.utm_source,
        utm_medium: lead.utm_medium,
        utm_term: lead.utm_term,
        utm_content: lead.utm_content,
        gclid: lead.gclid,
        fbclid: lead.fbclid,
        referrer: lead.referrer,
        landing_page: lead.landing_page
      }
    };
  }

  /**
   * Submits the lead to the API
   * @param {Object} lead The unified lead object
   * @returns {Promise<Response>} 
   */
  async function submit(lead) {
    if (!CONFIG.API_ENABLED) {
      return Promise.resolve({ skipped: true });
    }

    const payload = buildPayload(lead);
    
    // Add timeout via AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.API_TIMEOUT);

    try {
      const response = await fetch(CONFIG.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
          // Note: Bearer token is omitted here as it will be injected by the intermediate backend.
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API HTTP Error: ${response.status}`);
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
