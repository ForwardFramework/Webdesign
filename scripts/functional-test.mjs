/** Drives the real UI: form validation, phone formatting, mobile nav, promo dismissal. */
import { chromium } from 'playwright';
const BASE = 'http://127.0.0.1:8099';
const results = [];
const check = (name, pass, extra = '') => { results.push([pass, name, extra]); };

const browser = await chromium.launch();

/* ---- Lead form validation ---- */
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });

  // Empty submit must be blocked and must not navigate.
  await page.click('#form-hero button[type="submit"]');
  await page.waitForTimeout(250);
  check('empty submit stays on page', new URL(page.url()).pathname === '/');
  check('empty submit flags required fields',
    await page.locator('#form-hero .field--error').count() >= 3);
  check('status message shown',
    (await page.locator('#form-hero .form-status').textContent()).includes('highlighted'));

  // Phone auto-formats.
  await page.fill('#hero-phone', '7245549032');
  check('phone formats to (724) 554-9032', (await page.inputValue('#hero-phone')) === '(724) 554-9032');

  // Bad phone rejected.
  await page.fill('#hero-phone', '724554');
  await page.locator('#hero-name').click();
  await page.waitForTimeout(150);
  check('short phone rejected', await page.locator('#hero-phone').evaluate((e) => e.getAttribute('aria-invalid') === 'true'));

  // Bad ZIP rejected, good ZIP accepted.
  await page.fill('#hero-zip', '123');
  await page.locator('#hero-name').click();
  await page.waitForTimeout(150);
  check('short zip rejected', await page.locator('#hero-zip').evaluate((e) => e.getAttribute('aria-invalid') === 'true'));

  // Valid submission posts to /thank-you/ with the right payload.
  await page.fill('#hero-name', 'Test Homeowner');
  await page.fill('#hero-phone', '7245549032');
  await page.fill('#hero-zip', '16001');
  await page.selectOption('#hero-service', 'concrete-driveways');
  const post = page.waitForRequest((r) => r.method() === 'POST', { timeout: 5000 }).catch(() => null);
  await page.click('#form-hero button[type="submit"]');
  const req = await post;
  check('valid submit POSTs', !!req, req ? req.url() : 'no POST');
  if (req) {
    const body = req.postData() || '';
    check('payload carries form-name', body.includes('form-name=quote-fast'));
    check('payload carries attribution', /attribution=[^&]+/.test(body));
    check('payload carries source page', /submitted_from=[^&]+/.test(body));
    check('payload carries the service', body.includes('service=concrete-driveways'));
  }
  await page.close();
}

/* ---- Service page prefills the dropdown ---- */
{
  const page = await browser.newPage();
  await page.goto(BASE + '/services/concrete-patios/', { waitUntil: 'networkidle' });
  check('service page prefills its own service',
    (await page.inputValue('#concrete-patios-service')) === 'concrete-patios');
  await page.close();
}

/* ---- UTM attribution survives a page hop ---- */
{
  const page = await browser.newPage();
  await page.goto(BASE + '/?utm_source=facebook&utm_campaign=fall_openings', { waitUntil: 'networkidle' });
  await page.goto(BASE + '/contact/', { waitUntil: 'networkidle' });
  await page.fill('#contact-name', 'Second Page');
  await page.fill('#contact-phone', '7245549032');
  await page.fill('#contact-address', '1 Main St, Butler PA');
  await page.selectOption('#contact-service', 'concrete-pads');
  const post = page.waitForRequest((r) => r.method() === 'POST', { timeout: 5000 }).catch(() => null);
  await page.click('#form-contact button[type="submit"]');
  const req = await post;
  const body = req ? decodeURIComponent(req.postData() || '') : '';
  check('utm persists across pages', body.includes('utm_source=facebook'), body.slice(0, 160));
  await page.close();
}

/* ---- Mobile nav + sticky call bar ---- */
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  check('call bar visible on mobile', await page.locator('.callbar__call').isVisible());
  check('nav hidden before toggle', !(await page.locator('#primary-nav').evaluate((n) => n.classList.contains('is-open'))));
  await page.click('#nav-toggle');
  await page.waitForTimeout(350);
  check('nav opens', await page.locator('#primary-nav').evaluate((n) => n.classList.contains('is-open')));
  check('toggle reports expanded', (await page.getAttribute('#nav-toggle', 'aria-expanded')) === 'true');
  check('nav CTA visible in drawer', await page.locator('.nav__cta').isVisible());
  await page.keyboard.press('Escape');
  await page.waitForTimeout(350);
  check('escape closes nav', !(await page.locator('#primary-nav').evaluate((n) => n.classList.contains('is-open'))));

  // Promo dismissal persists.
  await page.click('#promo-close');
  check('promo dismisses', await page.locator('#promo-bar').isHidden());
  await page.reload({ waitUntil: 'networkidle' });
  check('promo stays dismissed after reload', await page.locator('#promo-bar').isHidden());
  await page.close();
}

/* ---- Works with JavaScript off ---- */
{
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(BASE + '/contact/', { waitUntil: 'load' });
  check('form still present without JS', await page.locator('#form-contact').count() === 1);
  check('form still posts to thank-you without JS',
    (await page.getAttribute('#form-contact', 'action')) === '/thank-you/');
  check('nav links readable without JS', (await page.locator('#primary-nav a').count()) > 5);
  await ctx.close();
}

await browser.close();

const failed = results.filter(([ok]) => !ok);
results.forEach(([ok, name, extra]) => console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra && !ok ? '  → ' + extra : ''}`));
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
