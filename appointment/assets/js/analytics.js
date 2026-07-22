/**
 * ============================================================
 * JANYA FERTILITY — Analytics Module (analytics.js)
 * Google Ads conversion tracking, GTM dataLayer, and
 * user engagement event stubs.
 * ============================================================
 */

'use strict';

const JanyaAnalytics = (() => {

  let config = {};

  /**
   * Initialize analytics tracking
   * @param {Object} appConfig - App configuration
   */
  function init(appConfig) {
    config = appConfig;

    initCtaTracking();
    initScrollDepthTracking();
    initEngagementTracking();
  }


  /* ──────────────────────────────────────────────────────────
     GOOGLE ADS CONVERSION TRACKING
     ────────────────────────────────────────────────────────── */

  /**
   * Fire a Google Ads conversion event
   * @param {string} conversionLabel - Google Ads conversion label
   * @param {Object} [params={}] - Additional conversion parameters
   */
  function trackConversion(conversionLabel, params = {}) {
    if (typeof gtag === 'function') {
      gtag('event', 'conversion', {
        send_to: conversionLabel,
        ...params,
      });
    }
    pushDataLayer('conversion', { conversionLabel, ...params });
  }


  /* ──────────────────────────────────────────────────────────
     DATALAYER
     ────────────────────────────────────────────────────────── */

  /**
   * Push an event to the GTM dataLayer
   * @param {string} eventName
   * @param {Object} [data={}]
   */
  function pushDataLayer(eventName, data = {}) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      ...data,
      timestamp: new Date().toISOString(),
    });
  }


  /* ──────────────────────────────────────────────────────────
     CTA CLICK TRACKING
     ────────────────────────────────────────────────────────── */

  function initCtaTracking() {
    document.addEventListener('click', (e) => {
      const cta = e.target.closest('[data-track-cta]');
      if (!cta) return;

      const ctaName = cta.getAttribute('data-track-cta');
      const ctaLocation = cta.getAttribute('data-track-location') || 'unknown';

      trackEvent('cta_click', {
        cta_name: ctaName,
        cta_location: ctaLocation,
        cta_text: cta.textContent.trim(),
      });
    });
  }


  /* ──────────────────────────────────────────────────────────
     SCROLL DEPTH TRACKING
     ────────────────────────────────────────────────────────── */

  function initScrollDepthTracking() {
    const milestones = [25, 50, 75, 90, 100];
    const reached = new Set();

    const onScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;

      const percent = Math.round((window.scrollY / scrollHeight) * 100);

      milestones.forEach(milestone => {
        if (percent >= milestone && !reached.has(milestone)) {
          reached.add(milestone);
          trackEvent('scroll_depth', { depth_percent: milestone });
        }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
  }


  /* ──────────────────────────────────────────────────────────
     ENGAGEMENT TRACKING
     ────────────────────────────────────────────────────────── */

  function initEngagementTracking() {
    // Track phone link clicks
    document.addEventListener('click', (e) => {
      const phoneLink = e.target.closest('a[href^="tel:"]');
      if (phoneLink) {
        trackEvent('phone_click', {
          phone_number: phoneLink.getAttribute('href'),
        });
      }
    });

    // Track WhatsApp link clicks
    document.addEventListener('click', (e) => {
      const waLink = e.target.closest('a[href*="wa.me"], a[href*="whatsapp"]');
      if (waLink) {
        trackEvent('whatsapp_click', {
          whatsapp_url: waLink.getAttribute('href'),
        });
      }
    });

    // Track form submission attempts
    document.addEventListener('validSubmit', (e) => {
      const form = e.target;
      const formId = form.id || form.getAttribute('data-form-name') || 'unknown';
      trackEvent('form_submit', { form_id: formId });
    });
  }


  /* ──────────────────────────────────────────────────────────
     GENERIC EVENT TRACKER
     ────────────────────────────────────────────────────────── */

  /**
   * Track a generic analytics event
   * @param {string} eventName
   * @param {Object} [params={}]
   */
  function trackEvent(eventName, params = {}) {
    // Google Analytics 4
    if (typeof gtag === 'function') {
      gtag('event', eventName, params);
    }

    // GTM dataLayer
    pushDataLayer(eventName, params);
  }


  // Public API
  return Object.freeze({
    init,
    trackEvent,
    trackConversion,
    pushDataLayer,
  });

})();
