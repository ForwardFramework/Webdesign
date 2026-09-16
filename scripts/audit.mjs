/**
 * Pre-deploy audit: walks every built page in a real browser and fails on
 * console errors, duplicate IDs, broken internal links, missing alt text,
 * heading-order jumps and unlabelled form controls.
 *
 *   node scripts/audit.mjs            (expects http://127.0.0.1:8099 serving dist/)
 */
import { chromium } from 'playwright';
import { readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE = process.env.AUDIT_BASE || 'http://127.0.0.1:8099';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');

async function routes(dir = DIST, prefix = '/') {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.name === 'assets') continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await routes(p, prefix + e.name + '/')));
    else if (e.name === 'index.html') out.push(prefix);
    else if (e.name.endsWith('.html')) out.push(prefix + e.name);
  }
  return out.sort();
}

const problems = [];
const note = (route, kind, detail) => problems.push({ route, kind, detail });

const browser = await chromium.launch();
const all = await routes();
const known = new Set(all.map((r) => r.replace(/\/$/, '') || '/'));

for (const route of all) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const consoleErrors = [];
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', (e) => consoleErrors.push('pageerror: ' + e.message));
  const failed = [];
  page.on('requestfailed', (r) => failed.push(r.url()));

  const res = await page.goto(BASE + route, { waitUntil: 'networkidle' });
  if (!res || res.status() >= 400) note(route, 'status', String(res && res.status()));
  consoleErrors.forEach((e) => note(route, 'console', e));
  failed.filter((u) => !u.includes('favicon')).forEach((u) => note(route, 'request-failed', u));

  const report = await page.evaluate(() => {
    const out = { ids: [], headings: [], imgsNoAlt: [], links: [], unlabelled: [], titles: 0, h1s: 0, metaDesc: '', canonical: '' };
    const seen = new Set();
    document.querySelectorAll('[id]').forEach((el) => {
      if (seen.has(el.id)) out.ids.push(el.id);
      seen.add(el.id);
    });
    let last = 0;
    document.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach((h) => {
      const lvl = Number(h.tagName[1]);
      if (last && lvl > last + 1) out.headings.push(`${h.tagName} after H${last}: ${h.textContent.trim().slice(0, 40)}`);
      last = lvl;
    });
    out.h1s = document.querySelectorAll('h1').length;
    document.querySelectorAll('img').forEach((i) => { if (!i.hasAttribute('alt')) out.imgsNoAlt.push(i.src); });
    document.querySelectorAll('a[href]').forEach((a) => {
      const href = a.getAttribute('href');
      if (href.startsWith('/') && !href.startsWith('//')) out.links.push(href.split('#')[0]);
      if (!a.textContent.trim() && !a.getAttribute('aria-label')) out.unlabelled.push('link:' + href);
    });
    document.querySelectorAll('input,select,textarea').forEach((f) => {
      if (f.type === 'hidden') return;
      const labelled = f.labels?.length || f.getAttribute('aria-label') || f.closest('label');
      if (!labelled) out.unlabelled.push('field:' + (f.name || f.id));
    });
    out.metaDesc = document.querySelector('meta[name="description"]')?.content || '';
    out.canonical = document.querySelector('link[rel="canonical"]')?.href || '';
    out.title = document.title;
    return out;
  });

  report.ids.forEach((id) => note(route, 'duplicate-id', id));
  report.headings.forEach((h) => note(route, 'heading-jump', h));
  report.imgsNoAlt.forEach((s) => note(route, 'img-no-alt', s));
  report.unlabelled.forEach((u) => note(route, 'unlabelled', u));
  if (report.h1s !== 1) note(route, 'h1-count', String(report.h1s));
  if (!report.metaDesc) note(route, 'meta', 'missing description');
  if (report.metaDesc.length > 165) note(route, 'meta', `description ${report.metaDesc.length} chars`);
  if (report.title.length > 65) note(route, 'meta', `title ${report.title.length} chars: ${report.title}`);
  if (!report.canonical) note(route, 'meta', 'missing canonical');

  [...new Set(report.links)].forEach((href) => {
    const clean = href.replace(/\/$/, '') || '/';
    if (known.has(clean)) return;
    if (['/sitemap.xml', '/robots.txt', '/llms.txt', '/favicon.ico'].includes(href)) return;
    if (href.startsWith('/assets/')) return;
    note(route, 'broken-link', href);
  });

  // Horizontal overflow: a fixed element parked off-screen still adds scroll
  // width, and a page that scrolls sideways on a phone loses conversions.
  for (const width of [360, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    const o = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth }));
    if (o.sw > o.iw + 1) note(route, 'h-overflow', `${width}px: scrollWidth ${o.sw} > ${o.iw}`);
  }
  await page.setViewportSize({ width: 1280, height: 900 });

  // Structured data must parse.
  const ld = await page.$$eval('script[type="application/ld+json"]', (ns) => ns.map((n) => n.textContent));
  ld.forEach((raw, i) => { try { JSON.parse(raw); } catch (e) { note(route, 'bad-jsonld', `#${i}: ${e.message}`); } });

  await page.close();
}
await browser.close();

console.log(`Audited ${all.length} routes.`);
if (!problems.length) { console.log('No problems found.'); process.exit(0); }
const grouped = {};
problems.forEach((p) => { (grouped[p.kind] ||= []).push(p); });
for (const [kind, list] of Object.entries(grouped)) {
  console.log(`\n${kind} (${list.length})`);
  list.slice(0, 12).forEach((p) => console.log(`  ${p.route}  ${p.detail}`));
  if (list.length > 12) console.log(`  … ${list.length - 12} more`);
}
process.exit(1);
