/**
 * ============================================================
 * JANYA FERTILITY — Form Validation (validation.js)
 * Lightweight, accessible client-side form validation.
 * ============================================================
 */

'use strict';

const JanyaValidation = (() => {

  /** Validation rules registry */
  const RULES = {
    required: {
      test: (value) => value.trim().length > 0,
      message: 'This field is required.',
    },
    name: {
      test: (value) => /^[a-zA-Z\s'.,-]{2,60}$/.test(value.trim()),
      message: 'Please enter a valid name (2–60 characters).',
    },
    email: {
      test: (value) => {
        const val = value.trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val)) return false;
        
        // Basic fake/disposable blocklist
        const blockedDomains = ['test.com', 'example.com', 'abc.com', '123.com', 'mailinator.com', 'yopmail.com', 'tempmail.com', 'guerrillamail.com'];
        const domain = val.split('@')[1];
        if (blockedDomains.includes(domain)) return false;
        
        return true;
      },
      message: 'Please enter a valid, active email address.',
    },
    phone: {
      test: (value) => /^[+]?[\d\s()-]{7,15}$/.test(value.trim()),
      message: 'Please enter a valid phone number.',
    },
    indianPhone: {
      test: (value) => {
        const val = value.replace(/[\s()-]/g, '');
        // Strictly exact 10 digits starting with 6-9
        if (!/^[6-9]\d{9}$/.test(val)) return false;
        
        // Block repeating numbers (e.g. 9999999999, 8888888888)
        if (/^(\d)\1{9}$/.test(val)) return false;
        
        // Block sequential numbers (e.g. 1234567890, 0987654321)
        const sequentialAsc = '01234567890';
        const sequentialDesc = '09876543210';
        if (sequentialAsc.includes(val) || sequentialDesc.includes(val)) return false;
        
        return true;
      },
      message: 'Please enter a valid 10-digit mobile number.',
    },
    minLength: {
      test: (value, param) => value.trim().length >= parseInt(param, 10),
      message: (param) => `Must be at least ${param} characters.`,
    },
    maxLength: {
      test: (value, param) => value.trim().length <= parseInt(param, 10),
      message: (param) => `Must be no more than ${param} characters.`,
    },
    checked: {
      test: (_value, _param, element) => element.checked,
      message: 'This field must be checked.',
    },
  };


  /**
   * Initialize validation on all forms with [data-validate]
   */
  function init() {
    const forms = document.querySelectorAll('form[data-validate]');
    forms.forEach(form => attachValidation(form));
  }

  /**
   * Attach validation to a single form
   */
  function attachValidation(form) {
    // Real-time validation on blur
    const inputs = form.querySelectorAll('[data-rules]');
    inputs.forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('is-error')) {
          validateField(input);
        }
      });
    });

    // Prevent submission if invalid
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const isValid = validateForm(form);
      if (isValid) {
        // Dispatch custom event for the form handler to pick up
        form.dispatchEvent(new CustomEvent('validSubmit', {
          detail: getFormData(form),
          bubbles: true,
        }));
      }
    });
  }


  /**
   * Validate an individual field
   * @param {HTMLElement} input
   * @returns {boolean}
   */
  function validateField(input) {
    const rulesStr = input.getAttribute('data-rules');
    if (!rulesStr) return true;

    const rules = rulesStr.split('|');
    const value = input.value;
    let errorMsg = '';

    for (const ruleStr of rules) {
      const [ruleName, param] = ruleStr.split(':');
      const rule = RULES[ruleName];

      if (!rule) {
        console.warn(`[JanyaValidation] Unknown rule: "${ruleName}"`);
        continue;
      }

      if (!rule.test(value, param, input)) {
        errorMsg = typeof rule.message === 'function'
          ? rule.message(param)
          : rule.message;
        break;
      }
    }

    setFieldError(input, errorMsg);
    return !errorMsg;
  }


  /**
   * Validate all fields in a form
   * @param {HTMLFormElement} form
   * @returns {boolean}
   */
  function validateForm(form) {
    const inputs = form.querySelectorAll('[data-rules]');
    let isValid = true;
    let firstError = null;

    inputs.forEach(input => {
      const fieldValid = validateField(input);
      if (!fieldValid && isValid) {
        isValid = false;
        firstError = input;
      }
    });

    // Focus the first error field
    if (firstError) {
      firstError.focus();
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return isValid;
  }


  /**
   * Show / clear error state on a field
   */
  function setFieldError(input, message) {
    const group = input.closest('.form-group');
    if (!group) return;

    let errorEl = group.querySelector('.form-error');

    if (message) {
      input.classList.add('is-error');
      input.setAttribute('aria-invalid', 'true');

      if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.className = 'form-error';
        errorEl.setAttribute('role', 'alert');
        const inputId = input.id || `input-${Math.random().toString(36).slice(2, 8)}`;
        input.id = inputId;
        errorEl.id = `${inputId}-error`;
        input.setAttribute('aria-describedby', errorEl.id);
        group.appendChild(errorEl);
      }

      errorEl.textContent = message;
    } else {
      input.classList.remove('is-error');
      input.removeAttribute('aria-invalid');
      if (errorEl) {
        errorEl.remove();
        input.removeAttribute('aria-describedby');
      }
    }
  }


  /**
   * Collect form data as an object
   */
  function getFormData(form) {
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    return data;
  }


  /**
   * Add a custom validation rule
   */
  function addRule(name, testFn, message) {
    RULES[name] = { test: testFn, message };
  }


  // Public API
  return Object.freeze({
    init,
    validateField,
    validateForm,
    addRule,
  });

})();
