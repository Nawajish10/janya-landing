const fs = require('fs');
let html = fs.readFileSync('appointment/index.html', 'utf8');
html = html.replace(/\.\.\/images\//g, 'assets/images/');
fs.writeFileSync('appointment/index.html', html);
console.log('Fixed CSS background-image paths in index.html!');
