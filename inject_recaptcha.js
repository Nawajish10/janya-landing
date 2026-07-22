const fs = require('fs');

let html = fs.readFileSync('appointment/index.html', 'utf8');

if (!html.includes('google.com/recaptcha/api.js')) {
  const recaptchaScript = `\n  <script src="https://www.google.com/recaptcha/api.js?render=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" async defer></script>\n</head>`;
  html = html.replace('</head>', recaptchaScript);
  fs.writeFileSync('appointment/index.html', html);
  console.log('reCAPTCHA script injected into index.html');
} else {
  console.log('reCAPTCHA script already exists');
}
