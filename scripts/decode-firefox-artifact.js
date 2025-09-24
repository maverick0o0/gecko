#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ARTIFACT_BASENAME = 'gecko-1.4.1.xpi';
const artifactsDir = path.join(__dirname, '..', 'artifacts');
const base64Path = path.join(artifactsDir, `${ARTIFACT_BASENAME}.base64`);
const outputPath = path.join(artifactsDir, ARTIFACT_BASENAME);

function exitWithError(message) {
  console.error(message);
  process.exitCode = 1;
}

if (!fs.existsSync(base64Path)) {
  exitWithError(`Missing base64 artifact: ${path.relative(process.cwd(), base64Path)}`);
  return;
}

try {
  const base64Content = fs
    .readFileSync(base64Path, 'utf8')
    .replace(/\s+/g, '');
  const buffer = Buffer.from(base64Content, 'base64');
  fs.writeFileSync(outputPath, buffer);
  console.log(`Wrote ${path.relative(process.cwd(), outputPath)} (${buffer.length} bytes).`);
  console.log('Import the file into Firefox via about:addons → Install Add-on From File…');
} catch (error) {
  exitWithError(error instanceof Error ? error.message : String(error));
}
