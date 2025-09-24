#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ARTIFACT_BASENAME = 'gecko-1.4.1.xpi';
const artifactsDir = path.join(__dirname, '..', 'artifacts');
const BASE64_EXTENSIONS = ['.txt', '.base64'];
const base64Path = BASE64_EXTENSIONS.map((ext) =>
  path.join(artifactsDir, `${ARTIFACT_BASENAME}${ext}`)
).find((candidate) => fs.existsSync(candidate));
const outputPath = path.join(artifactsDir, ARTIFACT_BASENAME);

function exitWithError(message) {
  console.error(message);
  process.exitCode = 1;
}

if (!base64Path) {
  const expected = BASE64_EXTENSIONS.map((ext) =>
    path.relative(process.cwd(), path.join(artifactsDir, `${ARTIFACT_BASENAME}${ext}`))
  ).join(', ');
  exitWithError(`Missing encoded artifact. Expected one of: ${expected}`);
  return;
}

try {
  console.log(
    `Decoding ${path.relative(process.cwd(), base64Path)} → ${path.relative(process.cwd(), outputPath)}...`
  );
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
