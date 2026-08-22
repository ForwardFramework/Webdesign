/**
 * Every route, rendered the way a visitor sees it: is anything invisible?
 *
 * Measures computed opacity, not the .is-visible class — content can be
 * legitimately visible without that class (JS off, watchdog fired), and the
 * class is a mechanism, not the outcome we care about.
 *
 * Requires a static server on the built site at :4402.
 */
import { chromium } from 'playwright';
const routes = JSON.parse(process.argv[2] ?? '[]');
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await b.newPage({ viewport: { width: 1280, height: 800 } });
let bad = 0;
for (const r of routes) {
  await page.goto('http://localhost:4402' + r, { waitUntil: 'load' });
  await page.waitForTimeout(350);
  const fold = await page.evaluate(() => {
    const v = [...document.querySelectorAll('.reveal')]
      .filter(e => { const b = e.getBoundingClientRect(); return b.top < innerHeight && b.bottom > 0; });
    return v.filter(e => getComputedStyle(e).opacity === '0').length;
  });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += innerHeight * 0.7) {
      window.scrollTo(0, y); await new Promise(r => setTimeout(r, 70));
    }
  });
  await page.waitForTimeout(800);
  const after = await page.evaluate(() => {
    const all = [...document.querySelectorAll('.reveal')];
    return { t: all.length, h: all.filter(e => getComputedStyle(e).opacity === '0').length };
  });
  if (fold || after.h) { bad++; console.log(`✗ ${r}  fold ${fold} hidden, after scroll ${after.h}/${after.t}`); }
}
console.log(bad ? `\n${bad} route(s) with invisible content` : `✓ ${routes.length} routes — no invisible content`);
await b.close();
process.exit(bad ? 1 : 0);
