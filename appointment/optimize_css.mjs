import fs from 'fs';
import path from 'path';
import CleanCSS from 'clean-css';

const cssDir = 'c:\\Users\\Afreen\\OneDrive\\Desktop\\janya-landing\\appointment\\assets\\css';
const cssFiles = ['variables.css', 'components.css', 'style.css', 'responsive.css'];

let combinedCss = '';

// The style.css file currently has @import rules. We will read the raw files instead.
// Wait, style.css has @import url("variables.css"); etc.
// We must read them, and strip the @import lines.
for (const file of cssFiles) {
  let content = fs.readFileSync(path.join(cssDir, file), 'utf8');
  if (file === 'style.css') {
    content = content.replace(/@import url\(['"]?.*?\.css['"]?\);?/g, '');
  }
  combinedCss += content + '\n';
}

const minified = new CleanCSS().minify(combinedCss);

fs.writeFileSync(path.join(cssDir, 'style.min.css'), minified.styles);
console.log('Minified CSS saved to style.min.css');
console.log('Size:', (minified.styles.length / 1024).toFixed(2), 'KB');
