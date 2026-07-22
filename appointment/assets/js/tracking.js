/**
 * ============================================================
 * JANYA FERTILITY — Tracking (tracking.js)
 * Wraps analytics calls for the lead submission process.
 * ============================================================
 */
import { CONFIG } from './config.js';
import { Logger } from './logger.js';

export const Tracking = (() => {
  const recentEvents = new Set();
  const DEDUPE_TIME = 5000; // 5 seconds

  function isDuplicate(eventName, payload) {
    const hash = `${eventName}_${payload?.form_id || ''}_${payload?.lead_id || ''}`;
    if (recentEvents.has(hash)) return true;
    
    recentEvents.add(hash);
    setTimeout(() => recentEvents.delete(hash), DEDUPE_TIME);
    return false;
  }

  function logEvent(eventName, payload = {}) {
    if (!CONFIG.TRACKING_ENABLED) return;
    
    if (isDuplicate(eventName, payload)) {
      Logger.debug(`[Tracking] Suppressed duplicate event: ${eventName}`);
      return;
    }

    // Output to console in dev mode
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === '') {
      Logger.info(`[Tracking] ${eventName}`, payload);
    }

    // Attempt to use existing JanyaAnalytics if present (from analytics.js)
    if (typeof window.JanyaAnalytics !== 'undefined' && typeof window.JanyaAnalytics.trackEvent === 'function') {
      window.JanyaAnalytics.trackEvent(eventName, payload);
    } else if (typeof window.gtag === 'function') {
      // Fallback direct to gtag if JanyaAnalytics is missing
      window.gtag('event', eventName, payload);
    }
  }

  function formStarted(formId) {
    logEvent('form_started', { form_id: formId });
  }

  function formSubmitted(formId) {
    logEvent('form_submitted', { form_id: formId });
  }

  function formSuccess(formId, leadId) {
    logEvent('form_success', { form_id: formId, lead_id: leadId });
    logEvent('generate_lead', { currency: 'INR', value: 0 }); // Standard conversion event
  }

  function providerSuccess(providerName) {
    logEvent('provider_success', { provider: providerName });
  }

  function providerFailure(providerName, errorMsg) {
    logEvent('provider_failure', { provider: providerName, error: errorMsg });
  }

  return Object.freeze({
    formStarted,
    formSubmitted,
    formSuccess,
    providerSuccess,
    providerFailure
  });
})();
