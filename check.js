const fs = require('fs');
const html = fs.readFileSync('appointment/index.html', 'utf8');
const idx = html.indexOf('<section id="home"');
if (idx !== -1) {
    console.log(html.substring(Math.max(0, idx - 100), idx + 2000));
} else {
    console.log('home section not found');
}
