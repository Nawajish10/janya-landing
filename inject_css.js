const fs = require('fs');
const htmlPath = 'appointment/index.html';
const cssPath = 'appointment/assets/css/style.min.css';

let html = fs.readFileSync(htmlPath, 'utf8');
let css = fs.readFileSync(cssPath, 'utf8');

// Fix relative URLs for inline injection
css = css.replace(/url\(['"]?\.\.\/images\//g, "url('assets/images/");
css = css.replace(/url\(['"]?\.\.\/fonts\//g, "url('assets/fonts/");

const regex = /<style id="critical-css">[\s\S]*?<\/style>/;
html = html.replace(regex, `<style id="critical-css">\n${css}\n</style>`);

fs.writeFileSync(htmlPath, html);
console.log('CSS Injected into index.html (with URL fixes)');
