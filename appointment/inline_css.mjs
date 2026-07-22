import fs from 'fs';
import path from 'path';

const htmlPath = 'c:\\Users\\Afreen\\OneDrive\\Desktop\\janya-landing\\appointment\\index.html';
const cssPath = 'c:\\Users\\Afreen\\OneDrive\\Desktop\\janya-landing\\appointment\\assets\\css\\style.min.css';

let html = fs.readFileSync(htmlPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

// Replace the old style.css link with an inline style block
html = html.replace(
  '<link rel="stylesheet" href="assets/css/style.css">',
  `<style id="critical-css">${css}</style>`
);

fs.writeFileSync(htmlPath, html);
console.log('Inlined all CSS into index.html');
