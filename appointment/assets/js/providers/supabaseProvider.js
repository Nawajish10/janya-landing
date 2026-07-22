/**
 * ============================================================
 * JANYA FERTILITY — Supabase Provider (supabaseProvider.js)
 * Delivers lead payloads directly to Supabase via REST API.
 * ============================================================
 */

import { CONFIG } from '../config.js';

export const SupabaseProvider = (() => {
  
  /**
   * Submits the lead to Supabase using native fetch
   * @param {Object} lead The unified lead object
   * @returns {Promise<Response>} 
   */
  async function submit(lead) {
    if (!CONFIG.SUPABASE_ENABLED) {
      return Promise.resolve({ skipped: true });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.API_TIMEOUT);

    try {
      const response = await fetch(CONFIG.SUPABASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': CONFIG.SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(lead),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Supabase HTTP Error: ${response.status}`);
      }

      // Supabase with 'Prefer: return=minimal' returns 201 with no body
      return { success: true, status: response.status };
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  return Object.freeze({
    submit
  });
})();
