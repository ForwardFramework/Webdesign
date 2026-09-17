import { chromium } from 'playwright';
const OUT = process.argv[2] || '/tmp/shots';
const base = process.env.AUDIT_BASE || 'http://127.0.0.1:8099';
const targets = [
  ['home-desktop', '/', 1440, 1000, false],
  ['home-mobile', '/', 390, 844, false],
  ['service', '/services/concrete-driveways/', 1440, 1000, false],
  ['city', '/service-areas/butler-pa/', 1440, 1000, false],
  ['contact', '/contact/', 1440, 1200, false],
  ['services-index', '/services/', 1440, 1000, false],
  ['gallery', '/gallery/', 1440, 1000, false],
  ['faq', '/faq/', 1440, 900, false],
  ['home-full', '/', 1440, 1000, true],
];
const b = await chromium.launch();
for (const [name, path, w, h, full] of targets) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto(base + path, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate(() => document.querySelectorAll('.reveal').forEach(e => e.classList.add('is-in')));
  await p.waitForTimeout(400);
  await p.screenshot({ path: `${OUT}/${name}.png`, fullPage: full });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  if (errs.length) console.log(name, 'ERRORS', errs);
  await p.close();
}
await b.close();
console.log('shots done');
