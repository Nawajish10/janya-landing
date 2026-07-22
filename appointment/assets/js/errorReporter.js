/**
 * ============================================================
 * JANYA FERTILITY — Error Reporter (errorReporter.js)
 * Global error boundary to catch and log unhandled exceptions.
 * ============================================================
 */

import { Logger } from './logger.js';

export const ErrorReporter = (() => {
  let isInitialized = false;

  function init() {
    if (isInitialized) return;
    isInitialized = true;

    // Catch synchronous global errors
    window.addEventListener('error', (event) => {
      Logger.error('[ErrorReporter] Uncaught Exception:', {
        message: event.message,
        source: event.filename,
        line: event.lineno,
        col: event.colno,
        error: event.error
      });
      // Do not call event.preventDefault(), allow normal browser handling
    });

    // Catch unhandled Promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      Logger.error('[ErrorReporter] Unhandled Promise Rejection:', {
        reason: event.reason
      });
    });

    Logger.info('[ErrorReporter] Initialized');
  }

  // Auto-init
  init();

  return {
    captureException: (err, context = {}) => {
      Logger.error('[ErrorReporter] Captured Exception:', err, context);
    }
  };
})();
