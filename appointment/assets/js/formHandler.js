/**
 * ============================================================
 * JANYA FERTILITY — Form Handler (formHandler.js)
 * Connects UI forms to the LeadService and handles states.
 * ============================================================
 */

import { CONFIG } from './config.js';
import { LeadService } from './leadService.js';
import { Storage } from './storage.js';
import { UTM } from './utm.js';
import { Tracking } from './tracking.js';

function initFormHandler() {
  const form = document.getElementById('appointment-form-el');
  if (!form || form.dataset.handlerBound) return;
  form.dataset.handlerBound = 'true';

  // Initialize auto-save
  Storage.bindAutoSave(form);

  const submitBtn = document.getElementById('form-submit-btn');
  const btnText = submitBtn ? submitBtn.querySelector('.btn__text') : null;
  const btnLoader = submitBtn ? submitBtn.querySelector('.btn__loader') : null;
  
  const successMessage = document.getElementById('form-success');
  const errorMessage = document.getElementById('form-error');

  function setLoading(isLoading) {
    if (!submitBtn) return;
    
    if (isLoading) {
      submitBtn.disabled = true;
      if (btnText) btnText.classList.add('invisible');
      if (btnLoader) btnLoader.classList.remove('hidden');
    } else {
      submitBtn.disabled = false;
      if (btnText) btnText.classList.remove('invisible');
      if (btnLoader) btnLoader.classList.add('hidden');
    }
  }

  function showMessage(type) {
    if (successMessage) successMessage.classList.add('hidden');
    if (errorMessage) errorMessage.classList.add('hidden');
    
    form.style.display = 'none';

    if (type === 'success' && successMessage) {
      successMessage.classList.remove('hidden');
    } else if (type === 'error' && errorMessage) {
      errorMessage.classList.remove('hidden');
      form.style.display = 'block'; // Show form again to let them retry
    }
  }

  // Listen for the custom validSubmit event emitted by validation.js
  form.addEventListener('validSubmit', async (e) => {
    const formData = e.detail; // Extract plain object from validSubmit
    const formId = form.getAttribute('data-form-name') || 'appointment_form';
    
    Tracking.formStarted(formId);
    setLoading(true);
    
    if (errorMessage) errorMessage.classList.add('hidden');

    // Network check
    if (!navigator.onLine) {
      if (errorMessage) {
         const errorText = errorMessage.querySelector('#form-error-text');
         if (errorText) errorText.textContent = "You appear to be offline. Please check your internet connection and try again.";
      }
      showMessage('error');
      setLoading(false);
      return;
    }

    // Sanitize inputs to prevent XSS
    const sanitize = (str) => {
      if (typeof str !== 'string') return str;
      return str.replace(/[&<>"']/g, function(m) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
      });
    };

    // Build unified lead object
    try {
      const metadata = UTM.getMetadata();
      const lead = {
        name: sanitize(formData.name),
        phone: sanitize(formData.phone),
        email: sanitize(formData.email),
        treatment: sanitize(formData.treatment),
        preferred_call_time: sanitize(formData.preferred_time),
        source: 'form',
        platform: UTM.getPlatform(),
        ...metadata,
        timestamp: new Date().toISOString()
      };

      Tracking.formSubmitted(formId);

      // Execute reCAPTCHA v3 (with fallback so leads are never blocked)
      let token = 'fallback-token';
      try {
        if (window.grecaptcha && window.grecaptcha.ready) {
          await new Promise((resolve) => {
            grecaptcha.ready(resolve);
          });
          const resToken = await grecaptcha.execute(CONFIG.RECAPTCHA_SITE_KEY, { action: 'submit_lead' });
          if (resToken) token = resToken;
        }
      } catch (err) {
        console.warn('reCAPTCHA execution notice (using fallback):', err);
      }

      const payload = {
        token: token,
        lead: lead
      };

      // Submit to backend
      const success = await LeadService.submitLead(payload);

      if (success) {
        showMessage('success');
        Storage.clearForm();
        Tracking.formSuccess(formId, `lead_${Date.now()}`);

        // Immediately clean address bar if any query params existed
        if (window.location.search) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }

        // Redirect to Thank You page
        setTimeout(() => {
          window.location.href = 'https://janyafertility.in/thankyou';
        }, 500);
      } else {
        // If backend failed
        showMessage('error');
      }
    } catch (error) {
      console.error('Submission failed', error);
      if (errorMessage) {
         const errorText = errorMessage.querySelector('#form-error-text');
         if (errorText) {
            // Show friendly error or recaptcha failure
            errorText.textContent = error.message || "A network timeout occurred. Please try again or call us directly.";
         }
      }
      showMessage('error');
    } finally {
      setLoading(false);
    }
  });
}

document.addEventListener('DOMContentLoaded', initFormHandler);
document.addEventListener('dynamicFormRendered', initFormHandler);
