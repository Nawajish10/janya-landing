import fs from 'fs';
import path from 'path';

const cssDir = 'c:\\Users\\Afreen\\OneDrive\\Desktop\\janya-landing\\appointment\\assets\\css';
const htmlPath = 'c:\\Users\\Afreen\\OneDrive\\Desktop\\janya-landing\\appointment\\index.html';
const cssFiles = ['variables.css', 'components.css', 'style.css', 'responsive.css'];

let combinedCss = '';

for (const file of cssFiles) {
  let content = fs.readFileSync(path.join(cssDir, file), 'utf8');
  if (file === 'style.css') {
    content = content.replace(/@import url\(['"]?.*?\.css['"]?\);?/g, '');
  }
  combinedCss += content + '\n';
}

// Simple minification: remove block comments and reduce extra whitespace
let minified = combinedCss
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\s+/g, ' ')
  .replace(/\s*([{}:;,])\s*/g, '$1')
  .trim();

fs.writeFileSync(path.join(cssDir, 'style.min.css'), minified);
console.log('Combined CSS saved to style.min.css (Size:', (minified.length / 1024).toFixed(2), 'KB)');

let html = fs.readFileSync(htmlPath, 'utf8');
html = html.replace(
  /<style id="critical-css">[\s\S]*?<\/style>/,
  `<style id="critical-css">${minified}</style>`
);

fs.writeFileSync(htmlPath, html);
console.log('Successfully updated critical-css in index.html');
