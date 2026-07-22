/**
 * ============================================================
 * JANYA FERTILITY — Storage (storage.js)
 * Manages localStorage for auto-saving form data.
 * ============================================================
 */

import { CONFIG } from './config.js';

export const Storage = (() => {
  function saveForm(formData) {
    try {
      const dataStr = JSON.stringify(formData);
      localStorage.setItem(CONFIG.STORAGE_KEY, dataStr);
    } catch (e) {
      console.warn('Failed to save form data to localStorage', e);
    }
  }

  function restoreForm(formElement) {
    try {
      const dataStr = localStorage.getItem(CONFIG.STORAGE_KEY);
      if (dataStr) {
        const formData = JSON.parse(dataStr);
        Object.keys(formData).forEach(key => {
          const input = formElement.elements[key];
          if (input) {
            if (input.type === 'checkbox' || input.type === 'radio') {
              input.checked = (input.value === formData[key]);
            } else {
              input.value = formData[key];
            }
          }
        });
      }
    } catch (e) {
      console.warn('Failed to restore form data from localStorage', e);
    }
  }

  function clearForm() {
    try {
      localStorage.removeItem(CONFIG.STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear form data from localStorage', e);
    }
  }

  /**
   * Automatically bind inputs in a form to save on input events
   */
  function bindAutoSave(formElement) {
    restoreForm(formElement);
    
    formElement.addEventListener('input', () => {
      const formData = new FormData(formElement);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });
      saveForm(data);
    });
  }

  return Object.freeze({
    bindAutoSave,
    clearForm
  });
})();
