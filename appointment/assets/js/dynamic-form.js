class DynamicForm {
  constructor(config, containerSelector) {
    this.config = config;
    this.container = document.querySelector(containerSelector);
    if (this.container) {
      this.render();
    }
  }

  render() {
    let html = `
      <div class="hero-form card" id="appointment-form">
        <div class="hero-form__header">
          <h2 class="hero-form__title">${this.config.title || 'Book Your Free Consultation'}</h2>
          <p class="hero-form__subtitle">${this.config.subtitle || 'Fill in your details and our team will reach out within 30 minutes'}</p>
        </div>
        
        <form class="hero-form__body" id="${this.config.id || 'appointment-form-el'}" 
              ${Object.entries(this.config.attributes || {}).map(([k, v]) => `${k}="${v}"`).join(' ')}>
    `;

    // Render Fields
    if (this.config.fields) {
      this.config.fields.forEach(field => {
        html += this.renderField(field);
      });
    }

    // Render Submit Button
    if (this.config.submitButton) {
      html += `
        <button type="submit" class="btn btn-primary w-full btn-lg" id="form-submit-btn">
          ${this.config.submitButton.iconHTML || ''}
          <span class="btn__text">${this.config.submitButton.text}</span>
          <span class="btn__loader spinner spinner--sm hidden" aria-hidden="true"></span>
        </button>
      `;
    }

    // Render Privacy Text
    if (this.config.privacyTextHTML) {
      html += `
        <p class="hero-form__privacy">
          ${this.config.privacyTextHTML}
        </p>
      `;
    }

    html += `</form>`;

    // Render States (Success/Error)
    if (this.config.successStateHTML) {
      html += this.config.successStateHTML;
    }
    if (this.config.errorStateHTML) {
      html += this.config.errorStateHTML;
    }

    html += `</div>`;
    this.container.innerHTML = html;

    // Dispatch event to allow validation scripts to attach
    document.dispatchEvent(new CustomEvent('dynamicFormRendered', { detail: { formId: this.config.id } }));
  }

  renderField(field) {
    let fieldHtml = `<div class="form-group">`;

    if (field.type === 'checkbox') {
      fieldHtml += `
        <label class="form-check">
          <input type="checkbox" name="${field.name}" value="${field.value || 'yes'}" 
                 ${field.rules ? `data-rules="${field.rules}"` : ''} 
                 ${field.required ? 'required' : ''}>
          <span class="form-check__label">${field.labelHTML || field.label}</span>
        </label>
      `;
    } else {
      const isOptional = !field.required;
      fieldHtml += `<label for="${field.id}" class="form-label ${field.required ? 'form-label--required' : ''}">
        ${field.label} ${isOptional && field.type !== 'checkbox' ? '<span class="text-muted text-caption">(Optional)</span>' : ''}
      </label>`;

      if (field.type === 'select') {
        fieldHtml += `<select id="${field.id}" name="${field.name}" class="form-select" 
                              ${field.rules ? `data-rules="${field.rules}"` : ''}>`;
        if (field.options) {
          field.options.forEach(opt => {
            fieldHtml += `<option value="${opt.value}" 
                                  ${opt.disabled ? 'disabled' : ''} 
                                  ${opt.selected ? 'selected' : ''}>${opt.label}</option>`;
          });
        }
        fieldHtml += `</select>`;
      } else {
        fieldHtml += `<input type="${field.type}" id="${field.id}" name="${field.name}" class="form-input" 
                             placeholder="${field.placeholder || ''}" 
                             ${field.rules ? `data-rules="${field.rules}"` : ''} 
                             ${field.autocomplete ? `autocomplete="${field.autocomplete}"` : ''}
                             ${field.maxlength ? `maxlength="${field.maxlength}"` : ''}>`;
      }
    }

    fieldHtml += `</div>`;
    return fieldHtml;
  }
}

// Default Configuration for Hero Form
const heroFormConfig = {
  id: "appointment-form-el",
  title: "Book Your Free Consultation",
  subtitle: "Fill in your details and our team will reach out within 30 minutes",
  attributes: {
    "data-validate": "true",
    "data-form-name": "hero-appointment",
    "novalidate": "true"
  },
  fields: [
    { type: "text", name: "name", id: "form-name", label: "Full Name", placeholder: "Enter your full name", required: true, rules: "required|name", autocomplete: "name" },
    { type: "tel", name: "phone", id: "form-phone", label: "Phone Number", placeholder: "Enter 10-digit mobile number", required: true, rules: "required|indianPhone", autocomplete: "tel", maxlength: "10" },
    { type: "email", name: "email", id: "form-email", label: "Email", placeholder: "Enter your email address", required: false, rules: "email", autocomplete: "email" },
    {
      type: "select", name: "treatment", id: "form-treatment", label: "Treatment Interested In", required: true, rules: "required",
      options: [
        { value: "", label: "Select a treatment", disabled: true, selected: true },
        { value: "ivf", label: "IVF Treatment" },
        { value: "iui", label: "IUI Treatment" },
        { value: "icsi", label: "ICSI" },
        { value: "egg-freezing", label: "Egg Freezing" },
        { value: "male-infertility", label: "Male Infertility" },
        { value: "female-infertility", label: "Female Infertility" },
        { value: "fertility-assessment", label: "Fertility Assessment" },
        { value: "not-sure", label: "Not Sure / Need Guidance" }
      ]
    },
    {
      type: "select", name: "preferred_time", id: "form-time", label: "Preferred Call Time", required: true, rules: "required",
      options: [
        { value: "", label: "Select preferred time", disabled: true, selected: true },
        { value: "morning", label: "Morning (9 AM – 12 PM)" },
        { value: "afternoon", label: "Afternoon (12 PM – 3 PM)" },
        { value: "evening", label: "Evening (3 PM – 6 PM)" },
        { value: "anytime", label: "Any Time" }
      ]
    },
    {
      type: "checkbox", name: "consent", id: "form-consent", value: "yes", labelHTML: 'I agree to the <a href="https://janyafertility.in/privacy-policy/" target="_blank" rel="noopener">Privacy Policy</a> and consent to being contacted.', required: true, rules: "checked"
    }
  ],
  submitButton: {
    text: "Book Free Consultation",
    iconHTML: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" style="margin-right: 8px;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>'
  },
  privacyTextHTML: '<span style="font-size: 10px; color: #9ca3af; display: block; text-align: center;">This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy" target="_blank" rel="noopener" style="color: inherit; text-decoration: underline;">Privacy Policy</a> and <a href="https://policies.google.com/terms" target="_blank" rel="noopener" style="color: inherit; text-decoration: underline;">Terms of Service</a> apply.</span>',
  successStateHTML: `
    <div class="hero-form__success state-message state-message--success hidden" id="form-success" aria-live="polite">
      <div class="state-message__icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <h3 class="state-message__title">Thank You!</h3>
      <p class="state-message__description">Your appointment request has been received. Our team will contact you within 30 minutes.</p>
    </div>
  `,
  errorStateHTML: `
    <div class="hero-form__error state-message state-message--error hidden" id="form-error" aria-live="polite">
      <div class="state-message__icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
      </div>
      <h3 class="state-message__title" id="form-error-title">Something Went Wrong</h3>
      <p class="state-message__description" id="form-error-text">Please try again or call us directly for immediate assistance.</p>
    </div>
  `
};

document.addEventListener('DOMContentLoaded', () => {
  new DynamicForm(heroFormConfig, '#dynamic-hero-form-container');
});
