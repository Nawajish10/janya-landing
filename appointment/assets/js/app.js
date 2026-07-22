/**
 * ============================================================
 * JANYA FERTILITY — Main Application Controller (app.js)
 * Initializes all modules and manages application lifecycle.
 * ============================================================
 */

'use strict';

const JanyaApp = (() => {

  /**
   * Application configuration
   */
  const CONFIG = Object.freeze({
    scrollThreshold: 50,
    stickyCtaThreshold: 600,
    intersectionThreshold: 0.15,
    intersectionRootMargin: '0px 0px -60px 0px',
    debounceDelay: 100,
    phoneNumber: '+91XXXXXXXXXX',      // Replace with actual
    whatsappNumber: '91XXXXXXXXXX',    // Replace with actual
    whatsappMessage: 'Hi, I would like to book an appointment at Janya Fertility.',
    clinicName: 'Janya Fertility',
    appointmentUrl: '#appointment-form',
  });

  /**
   * DOM Cache — populated on init
   */
  let dom = {};

  /**
   * Cache frequently accessed DOM elements
   */
  function cacheDom() {
    dom = {
      header: document.getElementById('site-header'),
      nav: document.getElementById('site-nav'),
      menuToggle: document.getElementById('menu-toggle'),
      stickyCtaBar: document.getElementById('sticky-cta'),
      main: document.getElementById('main-content'),
      animElements: document.querySelectorAll('[data-anim]'),
    };
  }

  /**
   * Initialize all application modules
   */
  function init() {
    cacheDom();

    // Core UI behaviors
    if (typeof JanyaUI !== 'undefined') {
      JanyaUI.init(dom, CONFIG);
    }

    // Form validation
    if (typeof JanyaValidation !== 'undefined') {
      JanyaValidation.init();
    }

    // Analytics tracking
    if (typeof JanyaAnalytics !== 'undefined') {
      JanyaAnalytics.init(CONFIG);
    }

    // Intersection Observer for scroll animations
    initScrollAnimations();

    // Log initialization
    if (isDev()) {

    }
  }

  /**
   * Set up Intersection Observer for scroll-triggered animations
   */
  function initScrollAnimations() {
    if (!dom.animElements.length) return;

    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      dom.animElements.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: CONFIG.intersectionThreshold,
        rootMargin: CONFIG.intersectionRootMargin,
      }
    );

    dom.animElements.forEach(el => observer.observe(el));
  }

  /**
   * Check if running in development mode
   */
  function isDev() {
    return window.location.hostname === 'localhost'
      || window.location.hostname === '127.0.0.1'
      || window.location.hostname === '';
  }

  /**
   * Utility: Debounce function calls
   */
  function debounce(fn, delay = CONFIG.debounceDelay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  /**
   * Utility: Throttle function calls
   */
  function throttle(fn, limit = 16) {
    let inThrottle = false;
    return (...args) => {
      if (!inThrottle) {
        fn.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  // ── Boot ────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Public API
  return Object.freeze({
    CONFIG,
    debounce,
    throttle,
  });

})();
