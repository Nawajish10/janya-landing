/**
 * ============================================================
 * JANYA FERTILITY — Lightweight Logger (logger.js)
 * Production-ready configurable logging utility.
 * ============================================================
 */

import { CONFIG } from './config.js';

export const Logger = (() => {
  const LOG_LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    NONE: 4
  };

  function getCurrentLevel() {
    const levelStr = CONFIG.LOG_LEVEL ? CONFIG.LOG_LEVEL.toUpperCase() : 'WARN';
    return LOG_LEVELS[levelStr] !== undefined ? LOG_LEVELS[levelStr] : LOG_LEVELS.WARN;
  }

  function log(level, method, message, ...data) {
    if (getCurrentLevel() > LOG_LEVELS[level]) return;

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level}]`;

    // Only format with colors in modern browsers that support it
    if (level === 'ERROR') {
      console.error(prefix, message, ...data);
    } else if (level === 'WARN') {
      console.warn(prefix, message, ...data);
    } else if (level === 'INFO') {
      console.info(prefix, message, ...data);
    } else {
      console.debug(prefix, message, ...data);
    }
  }

  return {
    debug: (msg, ...data) => log('DEBUG', 'debug', msg, ...data),
    info: (msg, ...data) => log('INFO', 'info', msg, ...data),
    warn: (msg, ...data) => log('WARN', 'warn', msg, ...data),
    error: (msg, ...data) => log('ERROR', 'error', msg, ...data)
  };
})();
