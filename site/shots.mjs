/**
 * Screenshots the pages worth eyeballing after a change, at desktop and phone
 * widths. Requires `npm run preview` on port 4321.
 *
 *   node shots.mjs ./shots
 *
 * Animations and reveal transitions are disabled first so runs are comparable.
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const OUT = process.argv[2];
mkdirSync(OUT, { recursive: true });
const B = 'http://localhost:4321';

const shots = [
  ['home',            '/',                        { full: true } ],
  ['home-hero',       '/',                        { clip: { x: 0, y: 0, width: 1440, height: 1000 } } ],
  ['reviews',         '/reviews',                 { full: true } ],
  ['roofing',         '/services/roofing',        { full: true } ],
  ['siding',          '/services/siding',         { full: true } ],
  ['hover-roofing',   '/services/roofing',        { sel: '.hover-sec' } ],
  ['hover-siding',    '/services/siding',         { sel: '.hover-sec' } ],
  ['financing',       '/financing',               { full: true } ],
  ['estimate',        '/instant-estimate',        { full: true } ],
];

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });

for (const [name, path, opt] of shots) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });
  await page.goto(B + path, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: '*,*::before,*::after{animation-duration:0s!important;transition-duration:0s!important}.reveal{opacity:1!important;transform:none!important}' });
  await page.waitForTimeout(400);
  try {
    if (opt.sel) {
      const el = await page.$(opt.sel);
      if (!el) { console.log('MISSING', opt.sel, 'on', path); await page.close(); continue; }
      await el.screenshot({ path: `${OUT}/${name}.png` });
    } else {
      await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: !!opt.full, clip: opt.clip });
    }
    console.log('✓', name);
  } catch (e) { console.log('✗', name, e.message); }
  await page.close();
}

// mobile
for (const [name, path] of [['m-home', '/'], ['m-reviews', '/reviews'], ['m-roofing', '/services/roofing']]) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  await page.goto(B + path, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: '.reveal{opacity:1!important;transform:none!important}' });
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
  console.log('✓', name);
  await page.close();
}

await browser.close();
