const { existsSync, readFileSync, statSync } = require('node:fs');
const { join } = require('node:path');

const root = process.cwd();
const dist = join(root, 'packages', 'frontend', 'dist');

const requiredFiles = [
  'index.html',
  'hyper-tern-logo.png',
  'favicon.ico',
  'favicon.png',
  'favicon-32x32.png',
  'apple-touch-icon.png',
  'og-image.png',
  'logo.svg',
  'logo-white.svg',
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

for (const file of requiredFiles) {
  const path = join(dist, file);
  assert(existsSync(path), `Missing built asset: ${file}`);
  assert(statSync(path).size > 0, `Built asset is empty: ${file}`);
}

const html = readFileSync(join(dist, 'index.html'), 'utf8');
const oldBrandToken = ['mani', 'fest'].join('');
assert(html.includes('<title>Hyper-Tern</title>'), 'index.html title is not Hyper-Tern');
assert(html.includes('content="Hyper-Tern"'), 'index.html social title metadata is not Hyper-Tern');
assert(!new RegExp(oldBrandToken, 'i').test(html), 'index.html still contains the previous brand token');

for (const file of ['logo.svg', 'logo-white.svg']) {
  const svg = readFileSync(join(dist, file), 'utf8');
  assert(svg.includes('aria-label="Hyper-Tern"'), `${file} aria-label is not Hyper-Tern`);
  assert(svg.includes('/hyper-tern-logo.png'), `${file} does not reference hyper-tern-logo.png`);
  assert(!new RegExp(oldBrandToken, 'i').test(svg), `${file} still contains the previous brand token`);
}

console.log('Frontend brand assets verified.');
