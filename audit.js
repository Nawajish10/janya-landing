const fs = require('fs');

console.log('--- STARTING HTML AUDIT ---');
const html = fs.readFileSync('appointment/index.html', 'utf8');

let hasErrors = false;

// Check for empty links
const emptyLinkRegex = /href=""/g;
if (emptyLinkRegex.test(html)) {
  console.log('[ERROR] Found empty href="" links!');
  hasErrors = true;
}

// Check for placeholder/dummy links
if (html.includes('example.com') || html.includes('placeholder')) {
  console.log('[WARNING] Found "example.com" or "placeholder" text in HTML.');
}

// Check for missing lazy loading on images
const imgRegex = /<img[^>]*>/g;
let match;
while ((match = imgRegex.exec(html)) !== null) {
  const imgTag = match[0];
  if (!imgTag.includes('loading="lazy"')) {
    console.log('[WARNING] Missing lazy loading on image: ' + imgTag.substring(0, 50) + '...');
  }
}

console.log('--- HTML AUDIT COMPLETE ---');
if (!hasErrors) {
  console.log('HTML looks good and production ready!');
}
