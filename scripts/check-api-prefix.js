const fs = require('fs');

const regex = /API_KEY_PREFIX\s*=\s*['"]([^'"]+)['"]/;

const backendSrc = fs.readFileSync(
  'packages/backend/src/common/constants/api-key.constants.ts',
  'utf8',
);
const pluginSrc = fs.readFileSync(
  'packages/shared/src/api-key.ts',
  'utf8',
);

const backendMatch = regex.exec(backendSrc);
const pluginMatch = regex.exec(pluginSrc);
const backendReexportsShared =
  /export\s+\{\s*API_KEY_PREFIX\s*\}\s+from\s+['"]hyper-tern-shared['"]/.test(backendSrc);

if ((!backendMatch && !backendReexportsShared) || !pluginMatch) {
  console.error('Could not extract API_KEY_PREFIX from one or both packages');
  process.exit(1);
}

const backendPrefix = backendReexportsShared ? pluginMatch[1] : backendMatch[1];

if (backendPrefix !== pluginMatch[1]) {
  console.error(
    `MISMATCH: backend="${backendPrefix}" plugin="${pluginMatch[1]}"`,
  );
  process.exit(1);
}

console.log(`OK: API_KEY_PREFIX="${backendPrefix}"`);
