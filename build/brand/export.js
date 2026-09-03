#!/usr/bin/env node
/*
 * Rasterise the badge mark into every image asset the site needs.
 *
 * Run from the repository root:   node build/brand/export.js
 * Requires: playwright, and the Anton + Inter fonts installed on the machine
 * (see build/brand/README.md). Regenerate only when the mark changes.
 */
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..', '..');
const IMG = path.join(ROOT, 'site', 'assets', 'img');
const badgePy = path.join(__dirname, 'badge.py');
const FULL = execFileSync('python3', [badgePy]).toString();          // full wordmark badge
const MARK = execFileSync('python3', [badgePy, '--mark']).toString(); // TG monogram

const BLACK = '#0E0E10';

const shell = (inner, css = '') => `<!doctype html><meta charset="utf-8">
<style>*{margin:0;padding:0;box-sizing:border-box}html,body{background:transparent}${css}</style>
${inner}`;

(async () => {
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  });
  const made = [];

  async function shot(file, w, h, html, opaque) {
    const page = await browser.newPage({
      viewport: { width: w, height: h },
      deviceScaleFactor: 1,
    });
    await page.setContent(html);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(250);
    const out = path.join(IMG, file);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    await page.screenshot({ path: out, omitBackground: !opaque });
    await page.close();
    made.push(`${file}  ${w}x${h}  ${(fs.statSync(out).size / 1024).toFixed(0)}KB`);
  }

  // 1. logo.png — the MONOGRAM. This is what the site uses in the header and
  //    footer, where the mark renders at 52-62px. The full wordmark is
  //    illegible at that size, so the monogram carries small placements.
  await shot('logo.png', 1024, 896, shell(
    `<div>${MARK.replace('<svg', '<svg width="1024" height="896"')}</div>`
  ), false);

  // 2. logo-full.png — the complete badge, for anything rendered above ~120px:
  //    letterhead, yard signs, truck livery, social profile images.
  await shot('logo-full.png', 1280, 1120, shell(
    `<div>${FULL.replace('<svg', '<svg width="1280" height="1120"')}</div>`
  ), false);

  // 3. Square app icons — monogram on the brand black
  for (const [file, size, pad] of [
    ['icons/apple-touch-icon.png', 180, 14],
    ['icons/icon-192.png', 192, 15],
    ['icons/icon-512.png', 512, 40],
  ]) {
    await shot(file, size, size, shell(
      `<div class="w">${MARK.replace('<svg', '<svg class="b"')}</div>`,
      `.w{width:${size}px;height:${size}px;background:${BLACK};display:flex;
         align-items:center;justify-content:center;padding:${pad}px}
       .b{width:100%;height:auto}`
    ), true);
  }

  // 3. Social share card
  await shot('og-image.jpg', 1200, 630, shell(
    `<div class="c">
       <div class="badge">${FULL.replace('<svg', '<svg class="b"')}</div>
       <div class="t">
         <p class="eyebrow">Veteran-Owned &middot; Pittsburgh, PA</p>
         <h1>Roofing Done Right<br><span>The First Time</span></h1>
         <p class="meta">5.0 &#9733;&#9733;&#9733;&#9733;&#9733; from 23 Google reviews</p>
         <p class="phone">(412) 302-9391</p>
       </div>
     </div>`,
    `.c{width:1200px;height:630px;background:${BLACK};display:flex;align-items:center;
        gap:54px;padding:0 64px;position:relative;overflow:hidden}
     .c::after{content:"";position:absolute;inset:0;
        background:radial-gradient(720px 460px at 88% 8%,rgba(240,179,35,.20),transparent 62%)}
     .badge{flex:none;width:392px;position:relative;z-index:1}
     .b{width:100%;height:auto}
     .t{position:relative;z-index:1;font-family:Inter,sans-serif}
     .eyebrow{font-size:20px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;
        color:#F0B323;margin-bottom:18px}
     h1{font-family:Anton,sans-serif;font-size:79px;line-height:1.02;color:#fff;
        text-transform:uppercase;letter-spacing:.01em}
     h1 span{color:#F0B323}
     .meta{margin-top:24px;font-size:24px;font-weight:600;color:#CFCCC5}
     .phone{margin-top:14px;font-size:43px;font-weight:800;color:#fff;letter-spacing:.01em}`
  ), true);

  await browser.close();
  console.log('Exported brand assets:');
  made.forEach((m) => console.log('  ' + m));
})();
