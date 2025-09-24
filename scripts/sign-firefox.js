#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const apiKey = process.env.WEB_EXT_API_KEY || process.env.AMO_JWT_ISSUER;
const apiSecret = process.env.WEB_EXT_API_SECRET || process.env.AMO_JWT_SECRET;

if (!apiKey || !apiSecret) {
  console.error('\n[sign:ff] Missing Firefox signing credentials.');
  console.error(
    'Set WEB_EXT_API_KEY/WEB_EXT_API_SECRET or AMO_JWT_ISSUER/AMO_JWT_SECRET before running the script.\n'
  );
  console.error('Example:');
  console.error('  export WEB_EXT_API_KEY="<your-amo-api-key>"');
  console.error('  export WEB_EXT_API_SECRET="<your-amo-api-secret>"\n');
  process.exit(1);
}

if (!fs.existsSync(path.join(process.cwd(), 'dist'))) {
  console.error('\n[sign:ff] Expected dist/ directory to exist. Run "npm run build:ff" first.\n');
  process.exit(1);
}

let webExtBin;
try {
  webExtBin = require.resolve('web-ext/bin/web-ext');
} catch (error) {
  console.error('\n[sign:ff] Unable to locate the "web-ext" CLI.');
  console.error('Run "npm install" to install project dependencies and try again.\n');
  process.exit(1);
}

const args = [
  webExtBin,
  'sign',
  '--source-dir=dist',
  '--artifacts-dir=artifacts',
  `--api-key=${apiKey}`,
  `--api-secret=${apiSecret}`
];

const child = spawn(process.execPath, args, {
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code) => {
  process.exit(code ?? 1);
});
