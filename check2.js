const fs = require('fs');
const html = fs.readFileSync('appointment/index.html', 'utf8');
const lines = html.split(/[\r\n]+/);
let found = false;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('hero/')) {
    console.log(`Line ${i+1}:`, lines[i].trim());
    found = true;
  }
}
if (!found) console.log("No hero images found in index.html!");
