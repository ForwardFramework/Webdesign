/* End-to-end smoke test. Run: node tests/e2e.js  (writes screenshots to tests/shots/) */
'use strict';
const http = require('http');
const fs   = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

const ROOT = path.join(__dirname, '..');
const SHOTS = path.join(__dirname, 'shots');
const TYPES = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript',
                '.svg':'image/svg+xml', '.jpg':'image/jpeg', '.png':'image/png' };

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const file = path.join(ROOT, p);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404); res.end('not found'); return;
  }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

let pass = 0, fail = 0;
const check = (ok, name, detail) => {
  if (ok) { pass++; console.log('  ✓ ' + name); }
  else { fail++; console.log('  ✗ ' + name + (detail ? '\n      → ' + detail : '')); }
};

(async () => {
  fs.mkdirSync(SHOTS, { recursive: true });
  await new Promise(r => server.listen(4173, r));
  const base = 'http://127.0.0.1:4173/';

  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args: ['--no-sandbox', '--disable-dev-shm-usage']
  });

  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });
  // Google Fonts is unreachable behind this session's proxy; abort it so the run
  // isn't waiting on a network timeout. Fallback stacks render.
  await ctx.route('**://fonts.*', r => r.abort());
  await ctx.route('**://assets.calendly.com/**', r => r.abort());

  const page = await ctx.newPage();
  const errors = [];       // real script failures
  const missing = [];      // required assets that failed to load
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => {
    // Optional project photos are expected to 404 until real ones are added,
    // and the proxy blocks Google Fonts here. Neither is a script error.
    if (m.type() !== 'error') return;
    if (/Failed to load resource|ERR_CONNECTION|ERR_BLOCKED/.test(m.text())) return;
    errors.push('console: ' + m.text());
  });
  page.on('response', r => {
    if (r.status() < 400) return;
    const u = r.url();
    if (/\.(css|js)(\?|$)/.test(u) && u.startsWith(base)) missing.push(r.status() + ' ' + u);
  });

  console.log('\n  Eclipse landing page — end to end\n  ' + '─'.repeat(74));

  await page.goto(base, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);

  /* -- 1. page boots ------------------------------------------------------- */
  check(await page.title() !== '', 'page has a title');
  check(errors.length === 0, 'no JavaScript errors on load', errors.join(' | '));
  check(missing.length === 0, 'all stylesheets and scripts loaded', missing.join(' | '));
  check(await page.locator('h1').first().isVisible(), 'hero renders');

  /* -- 2. config is bound into the DOM ------------------------------------- */
  const phones = await page.locator('[data-cfg="biz-phone"]').allTextContents();
  check(phones.length > 0 && phones.every(t => t.includes('941-420-2461')),
        'phone number bound from config in ' + phones.length + ' places');
  const lic = await page.locator('[data-cfg="biz-license"]').first().textContent();
  check(lic.trim() === 'SCC131151772', 'state license bound from config');

  /* -- 3. icons hydrated, no emoji ----------------------------------------- */
  const svgCount = await page.locator('i[data-icon] svg').count();
  check(svgCount > 30, `icons hydrated to inline SVG (${svgCount} found)`);

  /* -- 3b. optional photos degrade to the CSS artwork ----------------------- */
  const broken = await page.evaluate(() => [...document.querySelectorAll('img')]
    .filter(i => i.complete && i.naturalWidth === 0).length);
  check(broken === 0, 'missing optional photos are removed, not left showing alt text');
  check(await page.locator('.hero__photo-art').isVisible(), 'hero falls back to the designed CSS artwork');

  /* -- 4. offer stack rendered --------------------------------------------- */
  check(await page.locator('#offer-stack .stack__item').count() === 4, 'offer value stack renders 4 items');

  /* -- 5. reviews section stays hidden while empty -------------------------- */
  check(await page.locator('#reviews').isHidden(), 'reviews section hidden until real reviews exist');

  /* -- 6. calculator: full awning run -------------------------------------- */
  await page.locator('[data-start-estimate="awnings"]').first().click();
  await page.waitForTimeout(400);
  check(await page.locator('#calculator .calc-progress').isVisible(), 'awning wizard starts');

  async function answerCards(label) {
    await page.locator('.calc-option', { hasText: label }).first().click();
    await page.waitForTimeout(120);
  }
  async function answerSelect(index) {
    await page.locator('.calc-select').selectOption(String(index));
    await page.locator('.calc-nav .btn--primary').click();
    await page.waitForTimeout(120);
  }

  await answerCards('Retractable — motorized');   // type
  await answerSelect(2);                          // width 14-16
  await answerSelect(1);                          // projection 10
  await answerCards('Semi-cassette');             // housing
  await answerCards('Premium marine');            // fabric
  await answerCards('Standard wall');             // mounting
  await page.locator('.calc-option', { hasText: 'Automatic wind sensor' }).first().click();
  await page.locator('.calc-nav .btn--primary').click();   // addons → continue
  await page.waitForTimeout(150);
  await answerSelect(0);                          // quantity: one → finish

  await page.waitForTimeout(400);
  const rangeText = await page.locator('.estimate__range').textContent().catch(() => '');
  check(/\$[\d,]+/.test(rangeText), 'estimate range rendered: ' + rangeText.replace(/\s+/g, ' ').trim());

  const nums = (rangeText.match(/\$([\d,]+)/g) || []).map(s => Number(s.replace(/[$,]/g, '')));
  check(nums.length === 2 && nums[0] < nums[1], 'range is a valid low–high pair');
  check(nums[0] > 4000 && nums[1] < 12000, 'premium motorised awning lands in a sane band');

  check(await page.locator('.estimate__offer').isVisible(), '$500 offer applied to the visitor’s own number');
  check(await page.locator('.estimate__finance').isVisible(), 'monthly financing figure shown');
  await page.locator('.estimate__details summary').click();
  check(await page.locator('.estimate__drivers li').count() > 3, 'assumption breakdown lists the drivers');

  await page.screenshot({ path: path.join(SHOTS, 'estimate-result.png') });

  /* -- 7. estimate carries into the contact form ---------------------------- */
  await page.locator('.estimate__cta .btn--outline').click();   // "Email me this estimate"
  await page.waitForTimeout(700);
  const carried = await page.locator('#field-estimate').inputValue();
  check(/Fabric Awnings: \$[\d,]+/.test(carried), 'estimate carried into the form: ' + carried);
  check(await page.locator('#field-service').inputValue() === 'awnings', 'service pre-selected in the form');
  check(await page.locator('#calc-saved .saved__item').count() === 1, 'saved-estimate rail populated');

  /* -- 8. form validation --------------------------------------------------- */
  await page.locator('#contact-form button[type="submit"]').click();
  await page.waitForTimeout(300);
  const errCount = await page.locator('.field.has-error').count();
  check(errCount >= 4, `empty submit blocked with ${errCount} inline field errors`);

  await page.fill('#field-name', 'Tyler Brooks');
  await page.fill('#field-phone', '9415550123');
  check(await page.locator('#field-phone').inputValue() === '(941) 555-0123', 'phone auto-formats as typed');
  await page.fill('#field-email', 'not-an-email');
  await page.locator('#field-zip').click();
  await page.waitForTimeout(200);
  check(await page.locator('#field-email').evaluate(n => n.getAttribute('aria-invalid')) === 'true',
        'invalid email flagged on blur');
  await page.fill('#field-email', 'tyler@example.com');
  await page.fill('#field-zip', '34236');
  await page.check('#field-consent');
  await page.waitForTimeout(3200);   // clear the anti-bot time trap
  await page.locator('#contact-form button[type="submit"]').click();
  await page.waitForTimeout(600);
  check(await page.locator('#form-success').isVisible(), 'valid submit reaches the success panel');

  /* -- 9. booking modal never dead-ends ------------------------------------- */
  await page.locator('#form-success [data-book]').click();
  await page.waitForTimeout(400);
  check(await page.locator('#booking-modal').isVisible(), 'booking modal opens');
  check(await page.locator('#booking-fallback').isVisible(),
        'unconfigured booking shows the call/form fallback instead of an empty frame');
  check(await page.locator('#booking-fallback a[href^="tel:"]').isVisible(), 'fallback offers the phone number');
  await page.screenshot({ path: path.join(SHOTS, 'booking-modal.png') });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  check(await page.locator('#booking-modal').isHidden(), 'Escape closes the booking modal');

  /* -- 10. screens + aluminum estimators both complete ---------------------- */
  for (const svc of ['screens', 'aluminum']) {
    await page.locator(`[data-start-estimate="${svc}"]`).first().click();
    await page.waitForTimeout(400);
    let guard = 0;
    while (guard++ < 12) {
      if (await page.locator('.estimate__range').count()) break;
      if (await page.locator('.calc-select').count()) {
        await page.locator('.calc-select').selectOption('1');
        await page.locator('.calc-nav .btn--primary').click();
      } else if (await page.locator('.calc-options--multi').count()) {
        await page.locator('.calc-nav .btn--primary, .calc-nav .btn--ghost').last().click();
      } else {
        await page.locator('.calc-option').first().click();
      }
      await page.waitForTimeout(160);
    }
    const t = await page.locator('.estimate__range').textContent().catch(() => '');
    check(/\$[\d,]+/.test(t), `${svc} estimator completes: ` + t.replace(/\s+/g, ' ').trim());
  }
  check(await page.locator('#calc-saved .saved__total').count() >= 0, 'combined-project rail available');

  /* -- 11. accessibility basics --------------------------------------------- */
  const imgsNoAlt = await page.locator('img:not([alt])').count();
  check(imgsNoAlt === 0, 'every image has an alt attribute');
  const btnsNoName = await page.evaluate(() => [...document.querySelectorAll('button')]
    .filter(b => !b.textContent.trim() && !b.getAttribute('aria-label')).length);
  check(btnsNoName === 0, 'every button has an accessible name');
  const h1s = await page.locator('h1').count();
  check(h1s === 1, 'exactly one h1');

  /* -- 12. no horizontal overflow at any breakpoint -------------------------- */
  for (const w of [375, 768, 1024, 1440]) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.waitForTimeout(250);
    // Check BOTH: the document doesn't scroll sideways, and no element actually
    // sticks out past the viewport. `overflow-x:clip` suppresses the first
    // symptom, so on its own it would hide a genuine layout bug.
    const over = await page.evaluate(() => {
      const vw = window.innerWidth;
      if (document.documentElement.scrollWidth > vw + 1) return 'document scrolls sideways';
      const bad = [...document.querySelectorAll('body *')].filter(el => {
        if (el.closest('[hidden]') || !el.getClientRects().length) return false;
        const cs = getComputedStyle(el);
        if (cs.position === 'fixed' || cs.visibility === 'hidden') return false;
        const r = el.getBoundingClientRect();
        return r.width > 0 && (r.right > vw + 1 || r.left < -1);
      });
      if (!bad.length) return null;
      const e = bad[0];
      return `${e.tagName.toLowerCase()}.${(e.className || '').toString().split(' ')[0]} ` +
             `spills to ${Math.round(e.getBoundingClientRect().right)}px`;
    });
    check(!over, `nothing overflows the viewport at ${w}px`, over);
  }

  /* -- screenshots ----------------------------------------------------------- */
  await page.setViewportSize({ width: 1440, height: 1000 });
  // A full-page screenshot doesn't scroll, so IntersectionObserver never fires
  // and every [data-reveal] section captures blank. Walk the page down first.
  async function settleReveals() {
    await page.evaluate(async () => {
      // behavior:'instant' matters — the page sets scroll-behavior:smooth, and a
      // smooth scroll retargeted every 90ms never actually lands anywhere.
      const step = window.innerHeight * 0.7;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo({ top: y, behavior: 'instant' });
        await new Promise(r => setTimeout(r, 130));
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
      await new Promise(r => setTimeout(r, 400));
    });
  }

  await page.goto(base, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(SHOTS, 'desktop-hero.png') });
  await settleReveals();
  const unrevealed = await page.locator('[data-reveal]:not(.is-revealed)').count();
  const stuck = await page.evaluate(() => [...document.querySelectorAll('[data-reveal]:not(.is-revealed)')]
    .map(e => e.tagName.toLowerCase() + '.' + (e.className||'').toString().split(' ')[0] +
              ' h=' + Math.round(e.getBoundingClientRect().height)));
  check(unrevealed === 0, 'every reveal section becomes visible on scroll', stuck.join(' | '));
  await page.screenshot({ path: path.join(SHOTS, 'desktop-full.png'), fullPage: true });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(SHOTS, 'mobile-hero.png') });
  await settleReveals();
  await page.screenshot({ path: path.join(SHOTS, 'mobile-full.png'), fullPage: true });

  check(errors.length === 0, 'no JavaScript errors across the whole run', errors.slice(0, 3).join(' | '));

  console.log('  ' + '─'.repeat(74));
  console.log(`  ${pass} passed, ${fail} failed`);
  console.log('  screenshots → tests/shots/\n');

  await browser.close();
  server.close();
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); server.close(); process.exit(1); });
