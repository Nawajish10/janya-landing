/**
 * ============================================================
 * JANYA FERTILITY — UTM & Metadata (utm.js)
 * Parses URL parameters, stores them, and extracts user metadata.
 * ============================================================
 */

export const UTM = (() => {
  let urlParams = null;

  function init() {
    if (!urlParams) {
      urlParams = new URLSearchParams(window.location.search);
      // Persist important params to sessionStorage so they aren't lost on navigation
      const trackableParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'];
      trackableParams.forEach(param => {
        const val = urlParams.get(param);
        if (val) {
          sessionStorage.setItem(`janya_${param}`, val);
        }
      });
    }
  }

  function getParam(param) {
    init();
    return urlParams.get(param) || sessionStorage.getItem(`janya_${param}`) || '';
  }

  function getPlatform() {
    const source = getParam('utm_source').toLowerCase();
    const referrer = document.referrer.toLowerCase();
    
    if (source.includes('facebook') || source.includes('meta') || source.includes('instagram') || getParam('fbclid')) {
      return 'Meta';
    }
    if (source.includes('google') || referrer.includes('google') || getParam('gclid')) {
      return 'Google';
    }
    if (source.includes('youtube')) {
      return 'YouTube';
    }
    return 'Other'; // Fallback as requested
  }

  function getMetadata() {
    return {
      utm_source: getParam('utm_source'),
      utm_medium: getParam('utm_medium'),
      utm_campaign: getParam('utm_campaign'),
      utm_term: getParam('utm_term'),
      utm_content: getParam('utm_content'),
      gclid: getParam('gclid'),
      fbclid: getParam('fbclid'),
      referrer: document.referrer || '',
      device: /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
      browser: navigator.userAgent,
      screen_resolution: `${window.screen.width}x${window.screen.height}`,
      language: navigator.language || '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
      landing_page: window.location.href.split('?')[0]
    };
  }

  return Object.freeze({
    getPlatform,
    getMetadata
  });
})();
