#!/usr/bin/env node
/**
 * Renders the brand raster assets (logo, Open Graph card, app icons) from HTML
 * using the same fonts and colours as the site, so everything stays on brand.
 *
 *   node scripts/render-assets.mjs
 *
 * Requires Playwright's Chromium. This only needs re-running when the brand
 * changes — the generated PNGs are committed, so a normal build does not need
 * Playwright at all.
 */
import { chromium } from 'playwright';
import { readFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const IMG = join(ROOT, 'public', 'assets', 'img');

const INK = '#0E2029';
const GOLD = '#F6C445';

/** The site's own self-hosted fonts, inlined as data URIs so rendering never
 *  depends on network access. */
const FONT_FILES = [
  ['Inter', 'inter-latin-var.woff2', '100 900'],
  ['Oswald', 'oswald-latin-var.woff2', '200 700'],
  ['Kaushan Script', 'kaushan-script-latin.woff2', '400'],
];

async function fontFaceCss() {
  const faces = await Promise.all(
    FONT_FILES.map(async ([family, file, weight]) => {
      const data = await readFile(join(ROOT, 'public', 'assets', 'fonts', file));
      return `@font-face{font-family:'${family}';font-style:normal;font-weight:${weight};` +
        `font-display:block;src:url(data:font/woff2;base64,${data.toString('base64')}) format('woff2')}`;
    })
  );
  return `<style>${faces.join('')}</style>`;
}

const FONT_CSS = await fontFaceCss();

const shell = (body, css) => `<!doctype html><html><head><meta charset="utf-8">${FONT_CSS}
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{background:transparent}
body{font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased}
.badge{display:inline-flex;flex-direction:column;align-items:center;background:${INK};
  border:10px solid ${GOLD};border-radius:56px/38%;padding:22px 64px 30px;line-height:1}
.script{font-family:'Kaushan Script',cursive;color:#fff;font-size:150px;line-height:.92;
  transform:rotate(-3deg);padding-right:.1em;white-space:nowrap}
.word{font-family:'Oswald',sans-serif;color:${GOLD};font-size:62px;font-weight:700;
  letter-spacing:.17em;text-transform:uppercase;margin-top:6px;white-space:nowrap}
${css}
</style></head><body>${body}</body></html>`;

/* --- The wordmark, transparent background --- */
const logoHtml = shell(
  `<div id="t" style="display:inline-block;padding:26px"><div class="badge">
     <span class="script">Booth&rsquo;s</span><span class="word">Contracting</span>
   </div></div>`
);

/* --- Open Graph / social share card --- */
const ogHtml = shell(
  `<div id="t" class="og">
    <div class="og__bg"></div>
    <div class="og__inner">
      <div class="badge badge--sm"><span class="script">Booth&rsquo;s</span><span class="word">Contracting</span></div>
      <p class="tag">Concrete &middot; Excavation &middot; Landscaping</p>
      <h1>Built to Last</h1>
      <p class="sub">Driveways &middot; Patios &middot; Sidewalks &middot; Steps &middot; Pads &middot; Site Prep</p>
      <div class="bar"><span>Western Pennsylvania</span><strong>(724) 554-9032</strong></div>
    </div>
  </div>`,
  `.og{position:relative;width:1200px;height:630px;overflow:hidden;background:${INK}}
   .og__bg{position:absolute;inset:0;background:
     radial-gradient(ellipse 60% 70% at 82% 12%, rgba(246,196,69,.22), transparent 62%),
     radial-gradient(ellipse 80% 70% at 6% 95%, rgba(44,85,102,.6), transparent 60%),
     linear-gradient(155deg,#0A1920 0%,#14303C 55%,#0E2029 100%)}
   .og__inner{position:relative;height:100%;display:flex;flex-direction:column;
     justify-content:center;padding:50px 64px 150px}
   .badge--sm{align-self:flex-start;border-width:6px;border-radius:34px/38%;padding:12px 34px 16px}
   .badge--sm .script{font-size:74px}
   .badge--sm .word{font-size:30px;letter-spacing:.17em}
   .tag{font-family:'Oswald',sans-serif;color:${GOLD};font-size:24px;letter-spacing:.22em;
     text-transform:uppercase;margin-top:30px;font-weight:600}
   h1{font-family:'Kaushan Script',cursive;color:#fff;font-size:96px;font-weight:400;
     margin-top:6px;line-height:1.08;padding-bottom:6px}
   .sub{font-family:'Oswald',sans-serif;color:#C8D6DC;font-size:25px;letter-spacing:.08em;
     text-transform:uppercase;margin-top:18px;font-weight:500}
   .bar{position:absolute;left:64px;right:64px;bottom:52px;display:flex;align-items:center;
     justify-content:space-between;border-top:4px solid ${GOLD};padding-top:24px}
   .bar span{font-family:'Oswald',sans-serif;color:#9FB4BD;font-size:26px;letter-spacing:.14em;text-transform:uppercase}
   .bar strong{font-family:'Oswald',sans-serif;color:${GOLD};font-size:46px;letter-spacing:.02em}`
);

/* --- Square app icon --- */
const iconHtml = (size) =>
  shell(
    `<div id="t" class="icon"><span class="b">B</span><span class="rule"></span><span class="c">C</span></div>`,
    `.icon{width:${size}px;height:${size}px;background:${INK};display:flex;flex-direction:column;
       align-items:center;justify-content:center;gap:${size * 0.02}px;
       border-radius:${size * 0.19}px;box-shadow:inset 0 0 0 ${size * 0.045}px ${GOLD}}
     .b{font-family:'Kaushan Script',cursive;color:#fff;font-size:${size * 0.52}px;line-height:1;
       transform:rotate(-3deg)}
     .rule{width:${size * 0.4}px;height:${size * 0.035}px;background:${GOLD};border-radius:${size}px}
     .c{font-family:'Oswald',sans-serif;color:${GOLD};font-size:${size * 0.19}px;font-weight:700;
       letter-spacing:.14em;line-height:1}`
  );

async function shoot(page, html, out, { transparent = false } = {}) {
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
  const el = await page.$('#t');
  await el.screenshot({ path: out, omitBackground: transparent });
  console.log('  wrote', out.replace(ROOT + '/', ''));
}

const run = async () => {
  await mkdir(IMG, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 }, deviceScaleFactor: 2 });

  await shoot(page, logoHtml, join(IMG, 'logo.png'), { transparent: true });

  // Social cards are consumed at exactly 1200x630 — rendering at 2x only
  // inflates the file the scrapers have to download.
  const page1x = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await shoot(page1x, ogHtml, join(IMG, 'og-default.png'));
  for (const [size, name] of [[512, 'icon-512.png'], [192, 'icon-192.png'], [180, 'apple-touch-icon.png'], [64, 'icon-64.png'], [32, 'icon-32.png']]) {
    await shoot(page1x, iconHtml(size), join(IMG, name));
  }

  await browser.close();
};

await run();
console.log('Brand assets rendered.');
