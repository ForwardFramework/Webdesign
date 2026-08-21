import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const errors = [];
const page = await b.newPage({ viewport: { width: 1440, height: 1000 } });
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));

await page.goto('http://localhost:4321/instant-roof-quote', { waitUntil: 'networkidle' });

// Step 1 — try advancing with an empty address to exercise validation
await page.click('[data-panel="1"] [data-next]');
console.log('validation error shown:', JSON.stringify(await page.textContent('[data-error-for="address"]')));

await page.fill('#est-address', '1200 Library Rd, Bethel Park, PA');
await page.fill('#est-sqft', '2400');
await page.click('[data-panel="1"] [data-next]');
await page.waitForTimeout(400);
console.log('step2 visible:', await page.isVisible('[data-panel="2"]'));

await page.click('[data-panel="2"] [data-next]');
await page.waitForTimeout(400);
console.log('step3 visible:', await page.isVisible('[data-panel="3"]'));

await page.click('[data-panel="3"] [data-next]');
await page.waitForTimeout(3000);
console.log('result visible:', await page.isVisible('[data-result]'));
console.log('price:', await page.textContent('[data-price-low]'), '-', await page.textContent('[data-price-high]'));
console.log('squares:', await page.textContent('[data-price-squares]'), 'sqft:', await page.textContent('[data-price-sqft]'));
console.log('monthly:', await page.textContent('[data-price-monthly]'));
await page.screenshot({ path: '/tmp/shots/est-result.png' });

// Switch material and confirm the price re-renders live
await page.check('input[name="materialSwitch"][value="standing-seam"]');
await page.waitForTimeout(300);
console.log('standing seam:', await page.textContent('[data-price-low]'), '-', await page.textContent('[data-price-high]'));
console.log('summary:', (await page.inputValue('[data-estimate-summary]')).split('\n').join(' | '));

// Lead form validation inside the estimator
await page.click('#estimator-lead button[type="submit"]');
await page.waitForTimeout(400);
console.log('lead name error:', await page.textContent('#est-name-err'));

console.log('CONSOLE ERRORS:', errors.length ? errors : 'none');
await b.close();
