// copy-pdf-worker.js
// Finds pdf.worker.* in node_modules/pdfjs-dist and copies it to public/pdf.worker.min.js
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const searchDirs = [
  path.join(root, 'node_modules', 'pdfjs-dist', 'build'),
  path.join(root, 'node_modules', 'pdfjs-dist', 'legacy', 'build'),
  path.join(root, 'node_modules', 'pdfjs-dist')
];

const out = path.join(root, 'public', 'pdf.worker.min.js');

function tryCopy() {
  for (const dir of searchDirs) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir);
    const worker = files.find(f => /^pdf\.worker(\..+)?\.js$/.test(f) || /^pdf\.worker.*\.min\.js$/.test(f));
    if (worker) {
      const src = path.join(dir, worker);
      fs.copyFileSync(src, out);
      console.log(`Copied worker from ${src} -> ${out}`);
      return true;
    }
  }
  return false;
}

if (!fs.existsSync(path.join(root, 'public'))) {
  fs.mkdirSync(path.join(root, 'public'));
}

if (!tryCopy()) {
  console.error('Could not find pdf.worker file in pdfjs-dist. Inspect node_modules/pdfjs-dist/ and copy a pdf.worker*.js file into public/pdf.worker.min.js manually.');
  process.exit(1);
}
