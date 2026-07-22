/**
 * ============================================================
 * JANYA FERTILITY — UI Controller (ui.js)
 * Handles header scroll, mobile nav, accordion, toasts,
 * sticky CTA visibility, button ripple, and smooth scroll.
 * ============================================================
 */

'use strict';

const JanyaUI = (() => {

  let dom = {};
  let config = {};

  /**
   * Initialize UI module
   * @param {Object} domCache - Cached DOM elements from app.js
   * @param {Object} appConfig - App configuration from app.js
   */
  function init(domCache, appConfig) {
    dom = domCache;
    config = appConfig;

    initStickyHeader();
    initMobileNav();
    initStickyCtaBar();
    initAccordions();
    initButtonRipple();
    initSmoothScroll();
  }


  /* ──────────────────────────────────────────────────────────
     STICKY HEADER
     ────────────────────────────────────────────────────────── */

  function initStickyHeader() {
    if (!dom.header) return;

    const onScroll = () => {
      const scrolled = window.scrollY > config.scrollThreshold;
      dom.header.classList.toggle('is-scrolled', scrolled);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // set initial state
  }


  /* ──────────────────────────────────────────────────────────
     MOBILE NAVIGATION
     ────────────────────────────────────────────────────────── */

  function initMobileNav() {
    if (!dom.menuToggle || !dom.nav) return;

    dom.menuToggle.addEventListener('click', toggleNav);

    // Close nav on link click
    dom.nav.querySelectorAll('.site-nav__link').forEach(link => {
      link.addEventListener('click', () => closeNav());
    });

    // Close nav on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dom.nav.classList.contains('is-open')) {
        closeNav();
        dom.menuToggle.focus();
      }
    });

    // Close nav on outside click
    document.addEventListener('click', (e) => {
      if (
        dom.nav.classList.contains('is-open') &&
        !dom.nav.contains(e.target) &&
        !dom.menuToggle.contains(e.target)
      ) {
        closeNav();
      }
    });
  }

  function toggleNav() {
    const isOpen = dom.nav.classList.toggle('is-open');
    dom.menuToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('overflow-hidden', isOpen);
  }

  function closeNav() {
    dom.nav.classList.remove('is-open');
    dom.menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('overflow-hidden');
  }


  /* ──────────────────────────────────────────────────────────
     STICKY CTA BAR
     ────────────────────────────────────────────────────────── */

  function initStickyCtaBar() {
    if (!dom.stickyCtaBar) return;

    const onScroll = () => {
      const show = window.scrollY > config.stickyCtaThreshold;
      dom.stickyCtaBar.classList.toggle('is-visible', show);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
  }


  /* ──────────────────────────────────────────────────────────
     ACCORDIONS
     ────────────────────────────────────────────────────────── */

  function initAccordions() {
    const triggers = document.querySelectorAll('.accordion-trigger');
    if (!triggers.length) return;

    triggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.accordion-item');
        const panel = item.querySelector('.accordion-panel');
        const isExpanded = item.getAttribute('aria-expanded') === 'true';

        // Close all siblings
        const accordion = item.closest('.accordion');
        if (accordion) {
          accordion.querySelectorAll('.accordion-item').forEach(sibling => {
            if (sibling !== item) {
              collapseAccordion(sibling);
            }
          });
        }

        // Toggle current
        if (isExpanded) {
          collapseAccordion(item);
        } else {
          expandAccordion(item, panel);
        }
      });
    });
  }

  function expandAccordion(item, panel) {
    item.setAttribute('aria-expanded', 'true');
    panel.style.maxHeight = panel.scrollHeight + 'px';
    const trigger = item.querySelector('.accordion-trigger');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
  }

  function collapseAccordion(item) {
    item.setAttribute('aria-expanded', 'false');
    const panel = item.querySelector('.accordion-panel');
    if (panel) panel.style.maxHeight = '0';
    const trigger = item.querySelector('.accordion-trigger');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  }


  /* ──────────────────────────────────────────────────────────
     BUTTON RIPPLE EFFECT
     ────────────────────────────────────────────────────────── */

  function initButtonRipple() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn');
      if (!btn) return;

      // Respect reduced motion
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const ripple = document.createElement('span');
      ripple.classList.add('btn-ripple');

      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  }


  /* ──────────────────────────────────────────────────────────
     SMOOTH SCROLL
     ────────────────────────────────────────────────────────── */

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#' || targetId === '') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        const headerOffset = parseInt(
          getComputedStyle(document.documentElement)
            .getPropertyValue('--header-height'),
          10
        ) || 72;

        const offsetTop = target.getBoundingClientRect().top
          + window.scrollY
          - headerOffset
          - 20; // extra breathing room

        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth',
        });

        // Update URL without jump
        history.pushState(null, '', targetId);
      });
    });
  }


  /* ──────────────────────────────────────────────────────────
     TOAST NOTIFICATIONS
     ────────────────────────────────────────────────────────── */

  /**
   * Show a toast notification
   * @param {Object} options
   * @param {string} options.title - Toast title
   * @param {string} options.message - Toast message
   * @param {string} [options.type='info'] - Type: info, success, warning, error
   * @param {number} [options.duration=5000] - Auto-dismiss in ms (0 = manual)
   */
  function showToast({ title, message, type = 'info', duration = 5000 }) {
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');

    toast.innerHTML = `
      <div class="toast__content">
        <div class="toast__title">${escapeHtml(title)}</div>
        <div class="toast__message">${escapeHtml(message)}</div>
      </div>
      <button class="toast__close" aria-label="Dismiss notification">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    `;

    document.body.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('is-visible');
    });

    // Close handler
    const closeBtn = toast.querySelector('.toast__close');
    const dismiss = () => {
      toast.classList.remove('is-visible');
      toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    };

    closeBtn.addEventListener('click', dismiss);

    if (duration > 0) {
      setTimeout(dismiss, duration);
    }
  }

  /**
   * Escape HTML to prevent XSS in toast content
   */
  function escapeHtml(str) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return String(str).replace(/[&<>"']/g, (m) => map[m]);
  }


  // Public API
  return Object.freeze({
    init,
    showToast,
    closeNav,
  });

})();
