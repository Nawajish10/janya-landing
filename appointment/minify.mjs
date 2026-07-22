import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cssFiles = [
  'assets/css/variables.css',
  'assets/css/components.css',
  'assets/css/style.css',
  'assets/css/responsive.css'
];

let concatenatedCss = '';

for (const file of cssFiles) {
  concatenatedCss += fs.readFileSync(path.join(__dirname, file), 'utf-8') + '\n';
}

// Basic minification: remove comments and extra whitespace
let minifiedCss = concatenatedCss
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\s+/g, ' ')
  .replace(/\s*([\{\}\:\;\,\>])\s*/g, '$1')
  .trim();

fs.writeFileSync(path.join(__dirname, 'assets/css/style.min.css'), minifiedCss);

let indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');

if (indexHtml.includes('<style id="critical-css">')) {
  indexHtml = indexHtml.replace(
    /<style id="critical-css">[\s\S]*?<\/style>/,
    `<style id="critical-css">\n${minifiedCss}\n</style>`
  );
} else {
  const regex = /<link rel="stylesheet" href="assets\/css\/variables\.css"><link rel="stylesheet" href="assets\/css\/components\.css"><link rel="stylesheet" href="assets\/css\/style\.css"><link rel="stylesheet" href="assets\/css\/responsive\.css">/;
  indexHtml = indexHtml.replace(regex, `<style id="critical-css">\n${minifiedCss}\n</style>`);
}

fs.writeFileSync(path.join(__dirname, 'index.html'), indexHtml);

console.log('CSS Minified and Inlined Successfully!');
