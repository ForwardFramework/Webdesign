#!/usr/bin/env node
/* Renders assets/img/og-image.png (1200x630) from scripts/og-template.html.
   Run after adding the real logo:  npm run og                              */
const { execFileSync } = require('child_process');
const fs = require('fs'), path = require('path');

const candidates = [process.env.CHROME, process.env.CHROME_PATH,
  '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium'].filter(Boolean);
const chrome = candidates.find(p => { try { return fs.existsSync(p); } catch { return false; } });

if (!chrome) {
  console.error('\n  Could not find Chrome or Chromium.');
  console.error('  Install Chrome, or set CHROME=/path/to/chrome and run again.\n');
  process.exit(1);
}
const src = 'file://' + path.join(__dirname, 'og-template.html');
const out = path.join(__dirname, '..', 'assets', 'img', 'og-image.png');
execFileSync(chrome, ['--headless', '--no-sandbox', '--disable-gpu', '--hide-scrollbars',
  '--window-size=1200,630', '--virtual-time-budget=8000', '--screenshot=' + out, src],
  { stdio: 'ignore' });
console.log('  og-image.png written (' + (fs.statSync(out).size / 1024).toFixed(0) + ' KB)');
console.log('  Run `npm run build` to copy it into dist/.\n');
