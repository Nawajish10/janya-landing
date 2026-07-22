const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const output = fs.createWriteStream(path.join(__dirname, 'deployment.zip'));
const archive = archiver('zip', {
  zlib: { level: 9 } // Sets the compression level.
});

output.on('close', function() {
  console.log('Deployment archive created successfully! Total bytes: ' + archive.pointer());
  console.log('You can now upload deployment.zip to cPanel public_html.');
});

archive.on('error', function(err) {
  throw err;
});

archive.pipe(output);

// Exclude dev files and backend files since this is for cPanel frontend
archive.glob('**/*', {
  cwd: path.join(__dirname, 'appointment'),
  ignore: [
    'node_modules/**',
    'api/**', // Exclude Vercel serverless function since it's on Vercel
    '*.mjs',
    '*.md',
    '.env',
    'package.json',
    'package-lock.json',
    'test-*.js'
  ]
});

archive.finalize();
